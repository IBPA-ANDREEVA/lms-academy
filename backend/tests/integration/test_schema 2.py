"""PostgreSQL invariants, retained evidence and transactional development plumbing."""

from collections.abc import Iterator
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime, timedelta
from threading import Event
from uuid import UUID, uuid4

import pytest
from conftest import new_database
from sqlalchemy import Connection, Engine, inspect, select, text
from sqlalchemy.dialects.postgresql.base import PGInspector
from sqlalchemy.engine import URL
from sqlalchemy.exc import IntegrityError
from sqlalchemy.pool import QueuePool
from test_migrations import alembic

from app.db.config import database_engine
from app.db.metadata import migration_metadata
from app.db.recovery import revision
from app.db.session import ApplicationDatabase, ApplicationDatabaseSettings

pytestmark = pytest.mark.integration
NOW = datetime(2026, 11, 6, tzinfo=UTC)
TABLES = migration_metadata().tables


@pytest.fixture(scope="module")
def migrated(postgres_admin_url: URL) -> Iterator[Engine]:
    with new_database(postgres_admin_url) as url:
        alembic(url, "upgrade", "head")
        engine = database_engine(url)
        try:
            yield engine
        finally:
            engine.dispose()


@pytest.fixture
def db(migrated: Engine) -> Iterator[Connection]:
    with migrated.connect() as connection:
        transaction = connection.begin()
        try:
            yield connection
        finally:
            transaction.rollback()


def insert(db: Connection, table: str, **values: object) -> UUID:
    record_id = uuid4()
    db.execute(TABLES[table].insert().values(id=record_id, **values))
    return record_id


def user(db: Connection, **values: object) -> UUID:
    return insert(db, "users", email=f"{uuid4().hex}@example.invalid", **values)


def course(db: Connection) -> tuple[UUID, UUID, UUID]:
    course_id = insert(db, "courses", title="Синтетический курс", type="course")
    module = insert(db, "modules", course_id=course_id, title="Раздел", position=0)
    lesson = insert(
        db, "lessons", module_id=module, course_id=course_id, title="Урок", position=0
    )
    return course_id, module, lesson


def enrollment(db: Connection, course_id: UUID, learner: UUID) -> UUID:
    return insert(
        db,
        "enrollments",
        course_id=course_id,
        user_id=learner,
        granted_by=learner,
        grant_reason="Synthetic structural test, not authorization",
        granted_at=NOW,
        status="granted",
    )


def order(db: Connection) -> UUID:
    return insert(db, "orders", subtotal_cents=100, total_cents=100, status="draft")


def line(db: Connection, order_id: UUID, **product: object) -> UUID:
    return insert(
        db,
        "order_items",
        order_id=order_id,
        title_snapshot="Synthetic item",
        price_cents=100,
        total_cents=100,
        **product,
    )


def reject(db: Connection, sqlstate: str, table: str, **values: object) -> None:
    with pytest.raises(IntegrityError) as error, db.begin_nested():
        insert(db, table, **values)
    assert getattr(error.value.orig, "sqlstate", None) == sqlstate


def test_identity_defaults_multiple_users_and_case_insensitive_keys(
    db: Connection,
) -> None:
    first = insert(db, "users", email="Student@Example.invalid", referral_code="MyCode")
    second = user(db)
    assert first != second
    row = db.execute(
        text("SELECT roles, status, email_verified_at FROM users WHERE id=:id"),
        {"id": first},
    ).one()
    assert db.scalar(
        select(TABLES["users"].c.roles).where(TABLES["users"].c.id == first)
    ) == ["student"]
    assert row.status == "active"
    assert row.email_verified_at is None
    reject(db, "23505", "users", email="student@example.invalid")
    reject(db, "23505", "users", email="other@example.invalid", referral_code="mycode")
    user(db, roles=["admin", "student", "trainer", "manager"])
    user(db, roles=[])
    user(db, referral_code=None)


@pytest.mark.parametrize(
    "roles", [None, [None], ["student", None], ["student", "student"]]
)
def test_invalid_role_arrays(db: Connection, roles: object) -> None:
    reject(
        db,
        "23502" if roles is None else "23514",
        "users",
        email="invalid@example.invalid",
        roles=roles,
    )


def test_unknown_role_and_multidimensional_role_arrays(db: Connection) -> None:
    from sqlalchemy.exc import DBAPIError

    for expression in [
        "ARRAY['guest']::user_role[]",
        "ARRAY[['student'],['admin']]::user_role[]",
    ]:
        with pytest.raises(DBAPIError), db.begin_nested():
            db.execute(
                text(
                    f"INSERT INTO users (id,email,roles) VALUES (:id,'invalid@example.invalid',{expression})"
                ),
                {"id": uuid4()},
            )


def test_order_line_exclusive_product_and_amounts(db: Connection) -> None:
    c, _, _ = course(db)
    p = insert(db, "packages", title="Synthetic later package", price_cents=200)
    o = order(db)
    for product in [{}, {"course_id": c, "package_id": p}]:
        reject(
            db,
            "23514",
            "order_items",
            order_id=o,
            title_snapshot="x",
            price_cents=1,
            total_cents=1,
            **product,
        )
    line(db, o, course_id=c)
    line(db, o, package_id=p)
    reject(
        db,
        "23503",
        "order_items",
        order_id=o,
        course_id=uuid4(),
        title_snapshot="x",
        price_cents=1,
        total_cents=1,
    )
    reject(db, "23514", "orders", subtotal_cents=-1, total_cents=0, status="draft")
    reject(
        db,
        "23514",
        "orders",
        subtotal_cents=0,
        total_cents=0,
        status="draft",
        currency="EUR",
    )


def test_provider_events_and_provider_scoped_payments(db: Connection) -> None:
    o = order(db)
    payment = insert(
        db,
        "payments",
        order_id=o,
        status="pending",
        amount_cents=100,
        provider_payment_id="pi_synthetic",
    )
    insert(
        db,
        "payments",
        order_id=o,
        status="pending",
        amount_cents=100,
        provider="second_synthetic_provider",
        provider_payment_id="pi_synthetic",
    )
    reject(
        db,
        "23505",
        "payments",
        order_id=o,
        status="pending",
        amount_cents=100,
        provider_payment_id="pi_synthetic",
    )
    values = dict(
        provider_event_id="evt_synthetic_text",
        payment_id=payment,
        event_type="unrestricted.new.provider.event",
        status="pending",
    )
    db.execute(TABLES["payment_events"].insert().values(**values))
    with pytest.raises(IntegrityError) as error, db.begin_nested():
        db.execute(TABLES["payment_events"].insert().values(**values))
    assert getattr(error.value.orig, "sqlstate", None) == "23505"


def test_refunds_cannot_cross_orders(db: Connection) -> None:
    c, _, _ = course(db)
    o1, o2 = order(db), order(db)
    p1 = insert(db, "payments", order_id=o1, status="paid", amount_cents=100)
    i1, i2 = line(db, o1, course_id=c), line(db, o2, course_id=c)
    base = dict(
        payment_id=p1,
        amount_cents=100,
        status="pending",
        request_key="synthetic-refund",
    )
    reject(db, "23503", "refunds", order_id=o2, **base)
    reject(db, "23503", "refunds", order_id=o1, order_item_id=i2, **base)
    insert(db, "refunds", order_id=o1, order_item_id=i1, **base)
    reject(db, "23505", "refunds", order_id=o1, **base)


def test_enrollment_source_provenance_dedup_and_unstarted_clocks(
    db: Connection,
) -> None:
    learner = user(db)
    c1, _, _ = course(db)
    c2, _, _ = course(db)
    package = insert(db, "packages", title="Synthetic package", price_cents=100)
    item = line(db, order(db), package_id=package)
    e = insert(
        db,
        "enrollments",
        user_id=learner,
        course_id=c1,
        order_item_id=item,
        status="granted",
    )
    insert(
        db,
        "enrollments",
        user_id=learner,
        course_id=c2,
        order_item_id=item,
        status="granted",
    )
    reject(
        db,
        "23505",
        "enrollments",
        user_id=learner,
        course_id=c1,
        order_item_id=item,
        status="granted",
    )
    reject(db, "23514", "enrollments", user_id=learner, course_id=c1, status="granted")
    enrollment(db, c1, learner)
    enrollment(db, c1, learner)  # Repeat ownership remains open; not globally unique.
    row = db.execute(
        text(
            "SELECT activated_at, access_expires_at, support_expires_at FROM enrollments WHERE id=:id"
        ),
        {"id": e},
    ).one()
    assert tuple(row) == (None, None, None)
    with pytest.raises(IntegrityError), db.begin_nested():
        db.execute(
            text("UPDATE enrollments SET access_expires_at=now() WHERE id=:id"),
            {"id": e},
        )


def test_progress_and_assignment_course_consistency(db: Connection) -> None:
    c1, m1, l1 = course(db)
    c2, _, l2 = course(db)
    e = enrollment(db, c1, user(db))
    reject(
        db, "23503", "lessons", module_id=m1, course_id=c2, title="Wrong", position=1
    )
    reject(db, "23503", "lesson_progress", enrollment_id=e, lesson_id=l2, course_id=c1)
    reject(db, "23503", "lesson_progress", enrollment_id=e, lesson_id=l2, course_id=c2)
    insert(db, "lesson_progress", enrollment_id=e, lesson_id=l1, course_id=c1)
    reject(db, "23505", "lesson_progress", enrollment_id=e, lesson_id=l1, course_id=c1)
    reject(db, "23503", "assignments", lesson_id=l1, course_id=c2, title="Wrong")


def test_attempt_order_predecessor_context_and_sla(db: Connection) -> None:
    c, _, lesson = course(db)
    learner = user(db)
    e1, e2 = enrollment(db, c, learner), enrollment(db, c, learner)
    a1 = insert(db, "assignments", lesson_id=lesson, course_id=c, title="Homework")
    a2 = insert(
        db, "assignments", lesson_id=lesson, course_id=c, title="Other homework"
    )
    base = dict(assignment_id=a1, enrollment_id=e1, course_id=c, status="pending")
    s1 = insert(db, "submissions", attempt=1, **base)
    reject(db, "23505", "submissions", attempt=1, **base)
    reject(db, "23514", "submissions", attempt=0, **base)
    reject(db, "23514", "submissions", attempt=2, **base)
    reject(
        db,
        "23514",
        "submissions",
        attempt=2,
        previous_submission_id=s1,
        previous_attempt=2,
        **base,
    )
    for overridden in [{"assignment_id": a2}, {"enrollment_id": e2}]:
        reject(
            db,
            "23503",
            "submissions",
            attempt=2,
            previous_submission_id=s1,
            previous_attempt=1,
            **(base | overridden),
        )
    reject(
        db,
        "23514",
        "submissions",
        attempt=2,
        previous_submission_id=s1,
        previous_attempt=1,
        submitted_at=NOW,
        **base,
    )
    insert(
        db,
        "submissions",
        attempt=2,
        previous_submission_id=s1,
        previous_attempt=1,
        submitted_at=NOW,
        review_due_at=NOW + timedelta(days=4),
        curator_timezone="America/Los_Angeles",
        assigned_curator_id=learner,
        **base,
    )
    c2, _, _ = course(db)
    e3 = enrollment(db, c2, learner)
    reject(db, "23503", "submissions", attempt=1, **(base | {"enrollment_id": e3}))


def test_review_attachment_and_media_retention(db: Connection) -> None:
    c, _, lesson = course(db)
    learner = user(db)
    e = enrollment(db, c, learner)
    a = insert(
        db,
        "assignments",
        course_id=c,
        lesson_id=lesson,
        title="Homework",
        attachments={"definition_only": "synthetic"},
    )
    s = insert(
        db,
        "submissions",
        assignment_id=a,
        enrollment_id=e,
        course_id=c,
        attempt=1,
        status="pending",
    )
    insert(
        db,
        "submission_attachments",
        submission_id=s,
        storage_key="synthetic/original",
        derived_key="synthetic/derived",
        preview_key="synthetic/preview",
        processing_status="failed",
        file_size_bytes=1_000_000_000,
    )
    reject(
        db,
        "23514",
        "submission_attachments",
        submission_id=s,
        storage_key="too-big",
        processing_status="pending",
        file_size_bytes=1_000_000_001,
    )
    for decision in ["pending", "revision_request"]:
        insert(
            db,
            "submission_reviews",
            submission_id=s,
            reviewer_id=learner,
            decision=decision,
            content="Retained feedback",
        )
    published = insert(
        db,
        "lesson_media",
        lesson_id=lesson,
        locale="ru",
        version=1,
        storage_key="synthetic/video-original",
        processed_key="synthetic/hls-v1",
        processing_status="ready",
        published_at=NOW,
        published_by=learner,
    )
    insert(
        db,
        "lesson_media",
        lesson_id=lesson,
        locale="ru",
        version=2,
        storage_key="synthetic/video-v2",
        processing_status="failed",
    )
    db.execute(text("UPDATE enrollments SET status='revoked' WHERE id=:id"), {"id": e})
    assert (
        db.scalar(
            text("SELECT count(*) FROM submission_reviews WHERE submission_id=:id"),
            {"id": s},
        )
        == 2
    )
    assert (
        db.scalar(
            text("SELECT processed_key FROM lesson_media WHERE id=:id"),
            {"id": published},
        )
        == "synthetic/hls-v1"
    )
    for table, record in [
        ("users", learner),
        ("courses", c),
        ("lessons", lesson),
        ("enrollments", e),
        ("assignments", a),
        ("submissions", s),
    ]:
        with pytest.raises(IntegrityError) as error, db.begin_nested():
            db.execute(TABLES[table].delete().where(TABLES[table].c.id == record))
        assert getattr(error.value.orig, "sqlstate", None) == "23001"


def test_certificate_context_and_multiple_languages_not_globally_unique(
    db: Connection,
) -> None:
    c, _, _ = course(db)
    learner, other = user(db), user(db)
    e = enrollment(db, c, learner)
    request = insert(db, "certificate_requests", enrollment_id=e, status="pending")
    template = insert(
        db,
        "certificate_templates",
        name="Synthetic only",
        locale="ru",
        version=1,
        template_key="synthetic/template",
    )
    base = dict(
        request_id=request,
        enrollment_id=e,
        template_id=template,
        issued_to=learner,
        issued_by=other,
        student_name="Synthetic",
        course_title="Synthetic",
        locale="ru",
        issuer_identity="TEST ONLY",
        pdf_key="synthetic/certificate",
        issued_at=NOW,
    )
    insert(db, "certificates", certificate_number="SYNTHETIC-1", **base)
    insert(db, "certificates", certificate_number="SYNTHETIC-2", **base)
    reject(db, "23505", "certificates", certificate_number="SYNTHETIC-1", **base)
    reject(
        db,
        "23503",
        "certificates",
        certificate_number="SYNTHETIC-3",
        **(base | {"issued_to": other}),
    )
    reject(
        db,
        "23503",
        "certificates",
        certificate_number="SYNTHETIC-3",
        **(base | {"locale": "en"}),
    )
    other_enrollment = enrollment(db, c, learner)
    reject(
        db,
        "23503",
        "certificates",
        certificate_number="SYNTHETIC-3",
        **(base | {"enrollment_id": other_enrollment}),
    )


def test_notification_business_identity_and_message_orthogonal_state(
    db: Connection,
) -> None:
    recipient = user(db)
    base = dict(
        user_id=recipient,
        event_key="synthetic:submission:1:reminder:24",
        type="sla_reminder",
        channel="email",
        title="Test",
        content="Synthetic",
    )
    insert(db, "notifications", deduplication_key="stable-business-key", **base)
    reject(
        db,
        "23505",
        "notifications",
        deduplication_key="random-key-cannot-bypass-event",
        **base,
    )
    insert(
        db, "notifications", deduplication_key="web-key", **(base | {"channel": "web"})
    )
    c, _, _ = course(db)
    e = enrollment(db, c, recipient)
    insert(
        db,
        "course_messages",
        enrollment_id=e,
        sent_by=recipient,
        content="Synthetic",
        status="sent",
        read_at=NOW,
        edited_at=NOW,
    )
    reject(
        db,
        "23514",
        "course_messages",
        enrollment_id=e,
        sent_by=recipient,
        status="edited",
    )
    reject(
        db,
        "23514",
        "student_requests",
        enrollment_id=e,
        requested_by=recipient,
        type="externalRefund",
        status="pending",
    )


def test_database_supported_duplicate_races(migrated: Engine) -> None:
    event_id = "evt_concurrent_" + uuid4().hex
    ready = Event()

    def competing() -> str:
        with migrated.connect() as connection:
            ready.set()
            try:
                with connection.begin():
                    connection.execute(
                        text(
                            "INSERT INTO payment_events (provider_event_id,event_type,status) VALUES (:id,'synthetic','pending')"
                        ),
                        {"id": event_id},
                    )
                return "unexpected-success"
            except IntegrityError as exc:
                return str(getattr(exc.orig, "sqlstate", None))

    with migrated.connect() as first, ThreadPoolExecutor(max_workers=1) as executor:
        tx = first.begin()
        first.execute(
            text(
                "INSERT INTO payment_events (provider_event_id,event_type,status) VALUES (:id,'synthetic','pending')"
            ),
            {"id": event_id},
        )
        future = executor.submit(competing)
        assert ready.wait(5)
        tx.commit()
        assert future.result(timeout=10) == "23505"


def test_explicit_units_of_work_commit_rollback_close_and_timeouts(
    migrated: Engine,
) -> None:
    database = ApplicationDatabase(ApplicationDatabaseSettings(migrated.url))
    first, second = uuid4(), uuid4()
    try:
        with database.unit_of_work() as session:
            session.execute(
                TABLES["users"]
                .insert()
                .values(id=first, email=f"{first}@example.invalid")
            )
            assert session.scalar(text("SHOW TimeZone")) == "UTC"
            assert session.scalar(text("SHOW statement_timeout")) == "30s"
            assert session.scalar(text("SHOW lock_timeout")) == "5s"
        with pytest.raises(RuntimeError, match="synthetic failure"):
            with database.unit_of_work() as session:
                session.execute(
                    TABLES["users"]
                    .insert()
                    .values(id=second, email=f"{second}@example.invalid")
                )
                raise RuntimeError("synthetic failure")
        with migrated.connect() as connection:
            assert (
                connection.scalar(
                    select(TABLES["users"].c.id).where(TABLES["users"].c.id == first)
                )
                == first
            )
            assert (
                connection.scalar(
                    select(TABLES["users"].c.id).where(TABLES["users"].c.id == second)
                )
                is None
            )
        assert isinstance(database.engine.pool, QueuePool)
        assert database.engine.pool.checkedout() == 0
    finally:
        database.dispose()


def test_empty_downgrade_reupgrade_and_populated_refusal(
    disposable_database: URL,
) -> None:
    alembic(disposable_database, "upgrade", "head")
    alembic(disposable_database, "downgrade", "5c9789a48cba")
    engine = database_engine(disposable_database)
    try:
        assert inspect(engine).get_table_names() == ["alembic_version"]
        inspector = inspect(engine)
        assert isinstance(inspector, PGInspector)
        assert inspector.get_enums() == []
        alembic(disposable_database, "upgrade", "head")
        with engine.begin() as connection:
            user(connection)
        result = alembic(
            disposable_database, "downgrade", "5c9789a48cba", success=False
        )
        assert result.returncode != 0
        assert revision(disposable_database) == "20261109_01"
        with engine.connect() as connection:
            assert connection.scalar(text("SELECT count(*) FROM users")) == 1
    finally:
        engine.dispose()


def test_supported_prior_revision_preserves_real_domain_rows(
    disposable_database: URL,
) -> None:
    alembic(disposable_database, "upgrade", "20261106_01")
    engine = database_engine(disposable_database)
    try:
        with engine.begin() as connection:
            learner = user(connection)
            o = order(connection)
            p = insert(
                connection,
                "payments",
                order_id=o,
                amount_cents=100,
                status="pending",
                provider_payment_id="pi_preserved",
            )
        alembic(disposable_database, "upgrade", "head")
        alembic(disposable_database, "upgrade", "head")
        with engine.connect() as connection:
            assert (
                connection.scalar(
                    text("SELECT id FROM users WHERE id=:id"), {"id": learner}
                )
                == learner
            )
            assert (
                connection.scalar(
                    text("SELECT amount_cents FROM payments WHERE id=:id"), {"id": p}
                )
                == 100
            )
        alembic(disposable_database, "check")
    finally:
        engine.dispose()


def test_snapshot_detects_check_enum_default_and_model_drift(db: Connection) -> None:
    from scripts.check_schema import verify

    verify(db)
    for sql in [
        "ALTER TABLE payments DROP CONSTRAINT ck_payments_amount_nonnegative",
        "ALTER TABLE notifications ALTER COLUMN attempt_count SET DEFAULT 2",
        "ALTER TYPE user_role ADD VALUE 'synthetic_unapproved_role'",
    ]:
        with db.begin_nested() as savepoint:
            db.execute(text(sql))
            with pytest.raises(RuntimeError, match="SCHEMA_"):
                verify(db)
            savepoint.rollback()
    verify(db)

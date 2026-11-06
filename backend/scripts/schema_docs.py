"""Derive physical DBML and free Graphviz diagrams from explicitly registered models."""

import argparse
import hashlib
import html
import json
import re
import subprocess
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND))

from alembic.config import Config  # noqa: E402
from alembic.script import ScriptDirectory  # noqa: E402
from sqlalchemy import (  # noqa: E402
    CheckConstraint,
    Column,
    DefaultClause,
    Enum,
    Index,
    Table,
    UniqueConstraint,
    create_mock_engine,
)
from sqlalchemy.dialects.postgresql import ARRAY  # noqa: E402
from sqlalchemy.types import TypeEngine  # noqa: E402

from app.db.base import Base  # noqa: E402
from app.db.metadata import migration_metadata  # noqa: E402

OUT = BACKEND.parent / "docs/architecture/database"
PALETTE = {
    "identity": "#3B82F6",
    "catalog": "#9B5DE5",
    "commerce": "#E39B33",
    "learning": "#16A085",
    "assignments": "#DF6489",
    "certificates": "#6478E5",
    "notifications": "#667588",
}
LATER = {"packages", "package_courses", "course_messages"}
DIALECT = create_mock_engine(
    "postgresql+psycopg://", lambda *_args, **_kwargs: None
).dialect


def with_proposals(physical: str) -> str:
    """Keep deferred source structures visible without calling them migrated."""
    source = (OUT / "lms-schema.proposed.dbml").read_text()
    result = physical.replace(
        "LMS_Academy_Physical {", "LMS_Academy_Physical_And_Proposals {"
    )
    result += "\n// PROPOSED ONLY: the following four tables are NOT migrated.\n"
    for name in ["promo_type", "commission_accrual_status", "payout_status"]:
        match = re.search(rf"^Enum {name} \{{\n.*?^\}}", source, re.M | re.S)
        assert match is not None
        result += match[0] + "\n\n"
    pending = {
        "promocodes": "OQ-034/035",
        "commission_accruals": "OQ-058–064",
        "payouts": "OQ-062/064",
        "notification_templates": "OQ-069",
    }
    for name, questions in pending.items():
        match = re.search(
            rf"^Table {name} \[[^\n]*\] \{{\n.*?^\}}", source, re.M | re.S
        )
        assert match is not None
        result += (
            match[0].replace(
                "note: '", f"note: 'DEFERRED / NOT MIGRATED; {questions}. ", 1
            )
            + "\n\n"
        )
    result += "TableGroup Deferred_Commerce [color: #E39B33] {\n  promocodes\n  commission_accruals\n  payouts\n}\n"
    result += "TableGroup Deferred_Notifications [color: #667588] {\n  notification_templates\n}\n"
    return result


def rendered_manifest() -> str:
    entries = {}
    for name in ["lms-schema.svg", "lms-overview.svg", "lms-overview.png"]:
        source = OUT / (name.rsplit(".", 1)[0] + ".dot")
        entries[name] = {
            "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            "artifact_sha256": hashlib.sha256((OUT / name).read_bytes()).hexdigest(),
        }
    return json.dumps(entries, sort_keys=True, indent=2) + "\n"


def quote(value: str) -> str:
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") + "'"


def type_name(column_type: TypeEngine[object]) -> str:
    if isinstance(column_type, ARRAY):
        return type_name(column_type.item_type) + "[]"
    value = str(column_type.compile(dialect=DIALECT)).lower()
    return value.replace("timestamp with time zone", "timestamptz")


def index_expression(index: Index) -> str:
    expressions = []
    for expr in index.expressions:
        if isinstance(expr, str):
            expressions.append(expr)
        elif isinstance(expr, Column):
            expressions.append(str(expr.name))
        else:
            sql = str(
                expr.compile(dialect=DIALECT, compile_kwargs={"include_table": False})
            )
            expressions.append(f"`{sql}`")
    return "(" + ", ".join(expressions) + ")"


def dbml_table(table: Table, owner: str) -> str:
    phase = (
        "LATER groundwork only" if table.name in LATER else "MVP structural groundwork"
    )
    lines = [
        f"Table {table.name} [headercolor: {PALETTE[owner]}, note: {quote(owner.title() + '; ' + phase + '; migrated structure, no feature service')}] {{"
    ]
    for column in table.columns:
        settings = []
        if not column.nullable:
            settings.append("not null")
        if column.primary_key and len(table.primary_key.columns) == 1:
            settings.append("pk")
        if isinstance(column.server_default, DefaultClause):
            settings.append(f"default: `{column.server_default.arg}`")
        suffix = " [" + ", ".join(settings) + "]" if settings else ""
        lines.append(f"  {column.name} {type_name(column.type)}{suffix}")
    checks = sorted(
        (c for c in table.constraints if isinstance(c, CheckConstraint)),
        key=lambda c: str(c.name),
    )
    if checks:
        lines.append("  checks {")
        lines.extend(f"    `{c.sqltext}` [name: {quote(str(c.name))}]" for c in checks)
        lines.append("  }")
    indexes = []
    if len(table.primary_key.columns) > 1:
        indexes.append(
            "    (" + ", ".join(c.name for c in table.primary_key.columns) + ") [pk]"
        )
    for constraint in sorted(
        (c for c in table.constraints if isinstance(c, UniqueConstraint)),
        key=lambda c: str(c.name),
    ):
        indexes.append(
            "    ("
            + ", ".join(c.name for c in constraint.columns)
            + f") [unique, name: {quote(str(constraint.name))}]"
        )
    for index in sorted(table.indexes, key=lambda i: str(i.name)):
        settings = (["unique"] if index.unique else []) + [
            f"name: {quote(str(index.name))}"
        ]
        indexes.append(f"    {index_expression(index)} [{', '.join(settings)}]")
    if indexes:
        lines.extend(["  indexes {", *indexes, "  }"])
    lines.append("}")
    return "\n".join(lines)


def artifacts() -> dict[str, str]:
    metadata = migration_metadata()
    head = ScriptDirectory.from_config(
        Config(str(BACKEND / "alembic.ini"))
    ).get_current_head()
    owners = {}
    for mapper in Base.registry.mappers:
        table = mapper.local_table
        assert isinstance(table, Table)
        owners[table.name] = mapper.class_.__module__.split(".")[2]
    enums = {}
    for table in metadata.sorted_tables:
        for column in table.columns:
            typ = (
                column.type.item_type if isinstance(column.type, ARRAY) else column.type
            )
            if isinstance(typ, Enum):
                enums[str(typ.name)] = typ.enums
    dbml = [
        f"// GENERATED by backend/scripts/schema_docs.py; Alembic head {head}.",
        f"// {len(metadata.tables)} implemented tables. Deferred proposals: see lms-schema.proposed.dbml and schema-contract.md.",
        "Project LMS_Academy_Physical {\n  database_type: 'PostgreSQL'\n  Note: 'Physical structure only. No delivered business workflows. See schema-contract.md.'\n}",
    ]
    for name, values in sorted(enums.items()):
        dbml.append(
            "Enum "
            + name
            + " {\n"
            + "\n".join("  " + (json.dumps(v) if v.isdigit() else v) for v in values)
            + "\n}"
        )
    for owner in PALETTE:
        for name in sorted(n for n, o in owners.items() if o == owner):
            dbml.append(dbml_table(metadata.tables[name], owner))
    full = [
        "digraph LMS {",
        'graph [rankdir=LR, bgcolor="white", nodesep=0.25, ranksep=1.2, compound=true, label="LMS Academy — physical schema | head '
        + str(head)
        + ' | no feature workflows", labelloc=t, fontsize=22];',
        'node [shape=plain, fontname="Helvetica"];',
        'edge [color="#A8ADB5", arrowsize=0.6, fontsize=9, fontname="Helvetica"];',
    ]
    overview = [
        "digraph LMS_Overview {",
        f'graph [rankdir=LR, bgcolor="white", label="LMS Academy — {len(PALETTE)} owners / {len(metadata.tables)} physical tables | head '
        + str(head)
        + '", labelloc=t, fontsize=22, pad=0.4, nodesep=0.45, ranksep=0.9];',
        'node [shape=plain, fontname="Helvetica"];',
        'edge [color="#64748B", arrowsize=0.7];',
    ]
    for owner, color in PALETTE.items():
        names = sorted(n for n, o in owners.items() if o == owner)
        dbml.append(
            f"TableGroup {owner.title()} [color: {color}] {{\n"
            + "\n".join("  " + n for n in names)
            + "\n}"
        )
        full.append(
            f'subgraph cluster_{owner} {{ label="{owner.title()}"; color="{color}"; fontname="Helvetica";'
        )
        rows = []
        for name in names:
            table = metadata.tables[name]
            title = name + (" [later]" if name in LATER else "")
            rows.append(f'<TR><TD ALIGN="LEFT">{title}</TD></TR>')
            cells = [
                f'<TR><TD COLSPAN="2" BGCOLOR="{color}"><FONT COLOR="white"><B>{title}</B></FONT></TD></TR>'
            ]
            for c in table.columns:
                marker = "PK " if c.primary_key else ("FK " if c.foreign_keys else "")
                cells.append(
                    f'<TR><TD ALIGN="LEFT">{marker}{c.name}</TD><TD ALIGN="LEFT">{html.escape(type_name(c.type))}{" ?" if c.nullable else ""}</TD></TR>'
                )
            full.append(
                name
                + ' [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="5">'
                + "".join(cells)
                + "</TABLE>>];"
            )
        full.append("}")
        overview.append(
            owner
            + ' [label=<<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="7"><TR><TD PORT="header" BGCOLOR="'
            + color
            + '"><FONT COLOR="white"><B>'
            + owner.title()
            + "</B></FONT></TD></TR>"
            + "".join(rows)
            + "</TABLE>>];"
        )
    edges = set()
    for table in metadata.sorted_tables:
        for fk in sorted(table.foreign_key_constraints, key=lambda c: str(c.name)):
            local = ", ".join(c.name for c in fk.columns)
            remote = ", ".join(e.column.name for e in fk.elements)
            parent = fk.referred_table.name
            symbol = "-" if table.name == "profiles" else ">"
            dbml.append(
                f"Ref {fk.name}: {table.name}.({local}) {symbol} {parent}.({remote}) [delete: restrict]"
            )
            label = "1 : 0..1" if table.name == "profiles" else "N : 1"
            full.append(
                f'{table.name} -> {parent} [label="{label}", tooltip={json.dumps(local + " -> " + remote)}];'
            )
            if owners[table.name] != owners[parent]:
                edges.add((owners[table.name], owners[parent]))
    for child, parent in sorted(edges):
        overview.append(f"{child}:header:e -> {parent}:header:w;")
    legend = "Color = sole owner; arrow = foreign-key reference. [later] = structural groundwork only.\nDeferred: promocodes, commission_accruals, payouts, notification_templates.\nOpen policies: schema-contract.md. PK/FK = keys; ? = nullable."
    overview.append(
        'legend [shape=box, color="#CBD5E1", fontsize=11, label='
        + json.dumps(legend)
        + "];"
    )
    full.append("}")
    overview.append("}")
    physical = "\n\n".join(dbml) + "\n"
    return {
        "lms-schema.dbml": physical,
        "lms-schema.with-proposals.dbml": with_proposals(physical),
        "lms-schema.dot": "\n".join(full) + "\n",
        "lms-overview.dot": "\n".join(overview) + "\n",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--render", action="store_true")
    args = parser.parse_args()
    stale = []
    for name, value in artifacts().items():
        path = OUT / name
        if args.check:
            if not path.exists() or path.read_text() != value:
                stale.append(name)
        else:
            path.write_text(value)
    if stale:
        raise SystemExit("Stale schema documentation: " + ", ".join(stale))
    if args.check:
        manifest = OUT / "rendered-artifacts.json"
        if not manifest.exists() or manifest.read_text() != rendered_manifest():
            raise SystemExit(
                "Stale rendered schema artifacts; run --render and review."
            )
    if args.render:
        for stem in ["lms-schema", "lms-overview"]:
            subprocess.run(
                [
                    "dot",
                    "-Tsvg",
                    str(OUT / (stem + ".dot")),
                    "-o",
                    str(OUT / (stem + ".svg")),
                ],
                check=True,
            )
        subprocess.run(
            [
                "dot",
                "-Tpng",
                "-Gdpi=120",
                str(OUT / "lms-overview.dot"),
                "-o",
                str(OUT / "lms-overview.png"),
            ],
            check=True,
        )
        (OUT / "rendered-artifacts.json").write_text(rendered_manifest())
    print(
        "Physical schema documentation matches registered models."
        if args.check
        else "Generated physical DBML and Graphviz sources."
    )


if __name__ == "__main__":
    main()

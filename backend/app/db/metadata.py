"""Migration composition root; register explicit domain model imports here."""

from sqlalchemy import MetaData

from app.db.base import Base


def migration_metadata() -> MetaData:
<<<<<<< Updated upstream
    # Add explicit imports of implemented app.modules.<owner>.models here.
    # Do not discover arbitrary files or suppress import failures: missing models
    # can otherwise make autogeneration propose accidental table drops.
=======
    # Composition root only: domains must not import each other's private models.
    # Explicit registration prevents missing mappings from proposing table drops.
    from app.modules.assignments import models as assignments
    from app.modules.catalog import models as catalog
    from app.modules.certificates import models as certificates
    from app.modules.commerce import models as commerce
    from app.modules.identity import auth_models as identity_auth
    from app.modules.identity import models as identity
    from app.modules.learning import models as learning
    from app.modules.notifications import models as notifications

    _ = (
        assignments,
        catalog,
        certificates,
        commerce,
        identity,
        identity_auth,
        learning,
        notifications,
    )
>>>>>>> Stashed changes
    return Base.metadata

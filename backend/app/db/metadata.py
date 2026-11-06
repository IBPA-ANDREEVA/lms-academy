"""Migration composition root; register explicit domain model imports here."""

from sqlalchemy import MetaData

from app.db.base import Base


def migration_metadata() -> MetaData:
    # Add explicit imports of implemented app.modules.<owner>.models here.
    # Do not discover arbitrary files or suppress import failures: missing models
    # can otherwise make autogeneration propose accidental table drops.
    return Base.metadata

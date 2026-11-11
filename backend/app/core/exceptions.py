class ApplicationError(Exception):
  """Base class for expected application errors."""
  pass

class NotFoundEror(ApplicationError):
  pass

class ConflictEror(ApplicationError):
  pass

class VerificationEror(ApplicationError):
  pass

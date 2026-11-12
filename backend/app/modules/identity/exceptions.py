from app.core.exceptions import ConflictEror, NotFoundEror, VerificationEror


class EmailAlreadyRegistered(ConflictEror):
  pass


class UserNotFound(NotFoundEror):
  pass


# Token:
class TokenError(VerificationEror):
  pass


class TokenInvalid(TokenError):
  pass


class TokenExpired(TokenError):
  pass


class TokenAlreadyUsed(TokenError):
  pass


class TokenRevoked(TokenError):
  pass

#Verification:
class ResendError(VerificationEror):
  pass

class ResendWasSentEarlier(ResendError):
  pass

#Auth:
class AuthenticationError(VerificationEror):
  pass

class InvalidCredentials(AuthenticationError):
  pass

class AccountBlocked(AuthenticationError):
  pass

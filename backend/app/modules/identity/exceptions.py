from app.core.exceptions import ConflictEror, NotFoundEror, VerificationEror


class EmailAlreadyRegistered(ConflictEror):
    pass


class UserNotFound(NotFoundEror):
    pass


class UserHasLinkedRecords(VerificationEror):
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


class ResendError(VerificationEror):
    pass


class ResendWasSentEarlier(ResendError):
    pass

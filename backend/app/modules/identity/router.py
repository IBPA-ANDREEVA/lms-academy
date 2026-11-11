
from typing import cast

from fastapi import APIRouter, HTTPException, Request, status

from app.db.session import ApplicationDatabase
from app.modules.identity.schemas import (
    RegisterRequest,
    BaseResponse,
    VerifyEmailRequest,
    ResendVerificationRequest,
)
from app.modules.identity.services.registrations import register_student
from app.modules.identity.services.verfication import verify_email, resend_verification
from app.modules.identity.exceptions import (
  EmailAlreadyRegistered,
  TokenError,
  TokenAlreadyUsed,
  TokenExpired,
  TokenInvalid,
  ResendWasSentEarlier,
  ResendError
)

router = APIRouter(
    prefix="/auth",
    tags=["Identity"],
)


@router.get("/ping", operation_id="identityPing")
def ping() -> dict[str, str]:
    return {"message": "Identity router connected"}


@router.post(
    "/register",
    response_model=BaseResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="identityRegister",
)
def register(
    body: RegisterRequest,
    request: Request,
) -> BaseResponse:
    db = cast(
        ApplicationDatabase,
        request.app.state.database,
    )

    try:
        register_student(
            db=db,
            email=str(body.email),
            password=body.password,
        )
    except EmailAlreadyRegistered:
        raise HTTPException(
            status_code=409,
            detail="This email is already registered, try log in.",
        ) from None

    return BaseResponse(
        message=(
            "Test account created. "
            "Email verification token created."
        )
    )

@router.post(
    "/verify-email",
    response_model=BaseResponse,
    status_code=status.HTTP_200_OK,
    operation_id="identityVerifyEmail",
)
def verify_email_route(
    body: VerifyEmailRequest,
    request: Request,
) -> BaseResponse:

    db = cast(
        ApplicationDatabase,
        request.app.state.database
    )
    try:
      with db.unit_of_work() as session:
        verify_email(session, body.token)

    except TokenInvalid:
       raise HTTPException(
        status_code=400,
        detail="Provided token is invalid",
      ) 
    
    except TokenExpired:
       raise HTTPException(
        status_code=400,
        detail="Provided token is expired",
      ) 
    
    except TokenAlreadyUsed:
       raise HTTPException(
        status_code=400,
        detail="Provided token has been used",
      ) 

    except TokenError as exc:
      raise HTTPException(
        status_code=400,
        detail="Provided token is expired or invalid",
      ) from exc

    return BaseResponse(
        message=(
            "Test verification successed. "
        )
    )

@router.post(
   "/resend_verify_email",
   response_model=BaseResponse,
   status_code=status.HTTP_201_CREATED,
   operation_id="IdentityResendVerificaiton",
)
def resend_verification_route(
   body: ResendVerificationRequest,
   request: Request
) -> BaseResponse:
  db = cast(
      ApplicationDatabase,
      request.app.state.database
  )
  
  try:
    with db.unit_of_work() as session:
      resend_verification(session, body.email)

  except ResendWasSentEarlier:
    raise HTTPException(
      status_code=400,
      detail="The resend api has a cooldown of 60s",
    ) 
  
  except ResendError as exc:
    raise HTTPException(
      status_code=400,
      detail="There was an eror while resending verification",
    ) from exc
  
  return BaseResponse(
    message="Succesfull resend of verification"
  )

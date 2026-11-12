// Generated from backend/openapi/identity.json. Do not edit.
export const identityConstraints = {
  "RegisterRequest": {
    "email": {
      "max": 255
    },
    "first_name": {
      "min": 2,
      "max": 100
    },
    "last_name": {
      "min": 2,
      "max": 100
    },
    "password": {
      "min": 8,
      "max": 255
    }
  },
  "LoginRequest": {
    "email": {
      "max": 255
    },
    "password": {
      "min": 8,
      "max": 1024
    }
  },
  "ResetPasswordRequest": {
    "password": {
      "min": 8,
      "max": 255
    },
    "token": {
      "min": 1,
      "max": 256
    }
  },
  "VerifyEmailRequest": {
    "token": {
      "min": 1,
      "max": 256
    }
  }
} as const;

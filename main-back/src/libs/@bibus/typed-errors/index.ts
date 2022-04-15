import { ERRORS, PermissionDeniedError } from "libs/typed-errors";

const BIBUS_JWT_TOKEN_SESSION_EXPIRED = {
  type: "jwt_token_session_expired",
  message: "Session expired please relogin",
};

const BIBUS_Get_User_Query_Not_Found_Error = {
  type: "Get_User_Query_Not_Found_Error",
  message: "",
};

export const BIBUS_ERRORS = {
  ...ERRORS,
  BIBUS_JWT_TOKEN_SESSION_EXPIRED,
  BIBUS_Get_User_Query_Not_Found_Error,
};

export class JwtTokenSessionExpired extends PermissionDeniedError {
  constructor() {
    super(
      BIBUS_ERRORS.BIBUS_JWT_TOKEN_SESSION_EXPIRED.message,
      BIBUS_ERRORS.BIBUS_JWT_TOKEN_SESSION_EXPIRED.type
    );
  }
}

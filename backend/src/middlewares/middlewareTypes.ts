import { USR_NOT_EXISTS } from "src/endpoints/auth/authTypes";
import { ErrorResponse } from "src/helperTypes";

export const BAD_ACCESS_TOKEN = 'Bad access token';
export const INT_USR_VALIDATION_ERROR = 'Internal user validation error';
export type ProtectedRouteErrorResponse = ErrorResponse<typeof BAD_ACCESS_TOKEN | typeof USR_NOT_EXISTS | typeof INT_USR_VALIDATION_ERROR>
export const DataSource = {
  NoContent: "NoContent",
  BadRequest: "BadRequest",
  Forbidden: "Forbidden",
  Unauthorised: "Unauthorised",
  NotFound: "NotFound",
  InternalServerError: "InternalServerError",
  ConnectTimeout: "ConnectTimeout",
  Cancel: "Cancel",
  ReceiveTimeout: "ReceiveTimeout",
  SendTimeout: "SendTimeout",
  CacheError: "CacheError",
  NoInternetConnection: "NoInternetConnection",
  DefaultError: "DefaultError",
  CorsError: "CorsError", // ***
  PreflightFailed: "PreflightFailed", // (OPTIONS request failed)
} as const;

export type DataSource = (typeof DataSource)[keyof typeof DataSource];

// ---- Response Codes ----
export const ResponseCode = {
  noContent: 204,
  badRequest: 400,
  forbidden: 403,
  unauthorised: 401,
  notFound: 404,
  internalServerError: 500,
  connectTimeout: -1,
  cancel: -2,
  receiveTimeout: -3,
  sendTimeout: -4,
  cacheError: -5,
  noInternetConnection: -6,
  defaultError: -7,
  corsError: -8, // ***
  preflightFailed: -9, // ***
} as const;

// ---- Response Messages ----
export const ResponseMessage = {
  noContent: "No content available.",
  badRequest: "Bad request. Please check your input.",
  forbidden: "Access forbidden.",
  unauthorised: "Unauthorised. Please login again.",
  notFound: "Resource not found.",
  internalServerError: "Internal server error. Try again later.",
  connectTimeout: "Connection timed out.",
  cancel: "Request cancelled.",
  receiveTimeout: "Receive timeout occurred.",
  sendTimeout: "Send timeout occurred.",
  cacheError: "Cache error occurred.",
  noInternetConnection: "No internet connection.",
  defaultError: "An unexpected error occurred.",
  corsError: "CORS policy error. The request was blocked by the browser.", // ***
  preflightFailed: "CORS preflight request failed.", // ***
} as const;

// ---- ApiErrorModel ----
export interface ApiErrorModel {
  code: number;
  message: string;
}

// ---- getFailure ----
export function getFailure(source: DataSource): ApiErrorModel {
  switch (source) {
    case DataSource.NoContent:
      return {
        code: ResponseCode.noContent,
        message: ResponseMessage.noContent,
      };
    case DataSource.BadRequest:
      return {
        code: ResponseCode.badRequest,
        message: ResponseMessage.badRequest,
      };
    case DataSource.Forbidden:
      return {
        code: ResponseCode.forbidden,
        message: ResponseMessage.forbidden,
      };
    case DataSource.Unauthorised:
      return {
        code: ResponseCode.unauthorised,
        message: ResponseMessage.unauthorised,
      };
    case DataSource.NotFound:
      return { code: ResponseCode.notFound, message: ResponseMessage.notFound };
    case DataSource.InternalServerError:
      return {
        code: ResponseCode.internalServerError,
        message: ResponseMessage.internalServerError,
      };
    case DataSource.ConnectTimeout:
      return {
        code: ResponseCode.connectTimeout,
        message: ResponseMessage.connectTimeout,
      };
    case DataSource.Cancel:
      return { code: ResponseCode.cancel, message: ResponseMessage.cancel };
    case DataSource.ReceiveTimeout:
      return {
        code: ResponseCode.receiveTimeout,
        message: ResponseMessage.receiveTimeout,
      };
    case DataSource.SendTimeout:
      return {
        code: ResponseCode.sendTimeout,
        message: ResponseMessage.sendTimeout,
      };
    case DataSource.CacheError:
      return {
        code: ResponseCode.cacheError,
        message: ResponseMessage.cacheError,
      };
    case DataSource.NoInternetConnection:
      return {
        code: ResponseCode.noInternetConnection,
        message: ResponseMessage.noInternetConnection,
      };
    case DataSource.CorsError:
      return {
        code: ResponseCode.corsError,
        message: ResponseMessage.corsError,
      }; // ✅
    case DataSource.PreflightFailed:
      return {
        code: ResponseCode.preflightFailed,
        message: ResponseMessage.preflightFailed,
      }; // ✅
    case DataSource.DefaultError:
    default:
      return {
        code: ResponseCode.defaultError,
        message: ResponseMessage.defaultError,
      };
  }
}

// ---- User Friendly Message ----
export function getUserFriendlyMessage(errorModel: ApiErrorModel): string {
  switch (errorModel.code) {
    case ResponseCode.badRequest:
      return "Please check your login credentials and try again.";
    case ResponseCode.unauthorised:
      return "Invalid email or password. Please try again.";
    case ResponseCode.forbidden:
      return "Access denied. Please contact support if this continues.";
    case ResponseCode.notFound:
      return "Service not available. Please try again later.";
    case ResponseCode.internalServerError:
      return "Server error. Please try again in a few minutes.";
    case ResponseCode.noInternetConnection:
      return "No internet connection. Please check your network and try again.";
    case ResponseCode.connectTimeout:
    case ResponseCode.receiveTimeout:
      return "Connection timeout. Please check your internet and try again.";
    case ResponseCode.corsError:
      return "The server didn’t allow this request. Please check CORS settings or contact support."; // ***
    case ResponseCode.preflightFailed:
      return "The browser blocked this request due to a failed CORS preflight check."; // ***
    default:
      return (
        errorModel.message || "An unexpected error occurred. Please try again."
      );
  }
}

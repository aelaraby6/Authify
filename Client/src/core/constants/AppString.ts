export class ApiConstants {
  static BASE_URL: string = "http://localhost:3000/api/auth";
}

export class ApiErrors {
  static badRequestError: string = "badRequestError";
  static noContent: string = "noContent";
  static forbiddenError: string = "forbiddenError";
  static unauthorizedError: string = "unauthorizedError";
  static notFoundError: string = "notFoundError";
  static conflictError: string = "conflictError";
  static internalServerError: string = "internalServerError";
  static unknownError: string = "unknownError";
  static timeoutError: string = "timeoutError";
  static defaultError: string = "defaultError";
  static cacheError: string = "cacheError";
  static noInternetError: string = "noInternetError";
  static loadingMessage: string = "loading_message";
  static retryAgainMessage: string = "retry_again_message";
  static ok: string = "Ok";
}

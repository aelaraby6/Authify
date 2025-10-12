import axios, { AxiosError } from "axios";
import {
  DataSource,
  getFailure,
  ResponseCode,
} from "@/core/api/network/DataSource";
import type { ApiErrorModel } from "@/core/api/network/DataSource";

export class ErrorHandler {
  apiErrorModel: ApiErrorModel;
  static handleAxiosError: any;

  constructor(error: unknown) {
    if (axios.isAxiosError(error)) {
      this.apiErrorModel = this.handleAxiosError(error);
    } else {
      this.apiErrorModel = getFailure(DataSource.DefaultError);
    }
  }

  private handleAxiosError(error: AxiosError): ApiErrorModel {
    // Timeout or connection aborted
    if (error.code === AxiosError.ECONNABORTED) {
      return getFailure(DataSource.ConnectTimeout);
    }

    // Network timeout by message
    if (error.message?.toLowerCase().includes("timeout")) {
      return getFailure(DataSource.ReceiveTimeout);
    }

    // Cancelled request
    if (error.code === "ERR_CANCELED") {
      return getFailure(DataSource.Cancel);
    }

    // No internet / DNS / Network error
    if (!error.response) {
      return getFailure(DataSource.NoInternetConnection);
    }

    // HTTP status based handling
    switch (error.response.status) {
      case 400:
        return getFailure(DataSource.BadRequest);
      case 401:
        return getFailure(DataSource.Unauthorised);
      case 403:
        return getFailure(DataSource.Forbidden);
      case 404:
        return getFailure(DataSource.NotFound);
      case 500:
        return getFailure(DataSource.InternalServerError);
    }

    // Try parse backend error (if it returns structured JSON)
    try {
      const data = error.response.data;
      if (data && typeof data === "object") {
        const errorData = data as { message?: string; error?: string };
        return {
          code: error.response.status ?? ResponseCode.defaultError,
          message:
            errorData.message ||
            errorData.error ||
            error.response.statusText ||
            "Server error",
        };
      }
    } catch {
      return getFailure(DataSource.DefaultError);
    }

    // Default fallback
    return getFailure(DataSource.DefaultError);
  }

  static handle(error: unknown): ApiErrorModel {
    if (axios.isAxiosError(error)) {
      return this.handleAxiosError(error);
    }
    return getFailure(DataSource.DefaultError);
  }
}

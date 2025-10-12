import axios, { AxiosError } from "axios";
import {
  DataSource,
  getFailure,
  ResponseCode,
} from "@/core/api/network/DataSource";
import type { ApiErrorModel } from "@/core/api/network/DataSource";

export class ErrorHandler {
  apiErrorModel: ApiErrorModel;

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

    // 🔥 CORS-related errors
    if (
      !error.response &&
      (error.message.includes("Network Error") ||
        error.message.toLowerCase().includes("cors") ||
        error.message.toLowerCase().includes("blocked"))
    ) {
      // If it's a failed preflight (OPTIONS) request
      if (error.config?.method?.toLowerCase() === "options") {
        return getFailure(DataSource.PreflightFailed);
      }
      // General CORS block
      return getFailure(DataSource.CorsError);
    }

    // No internet / DNS / Network error (without CORS)
    if (!error.response) {
      return getFailure(DataSource.NoInternetConnection);
    }

    // HTTP status-based handling
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

    // Try to parse backend error (if structured JSON)
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
    const handler = new ErrorHandler(error);
    const errorModel = handler.apiErrorModel;

    // Log error details to console for debugging
    console.group("🚨 API Error Handled");
    console.error("Status Code:", errorModel.code);
    console.error("Message:", errorModel.message);

    // Log original error details if it's an axios error
    if (axios.isAxiosError(error)) {
      console.error("URL:", error.config?.url);
      console.error("Method:", error.config?.method?.toUpperCase());
      console.error("Response Status:", error.response?.status);
      console.error("Response Data:", error.response?.data);
      console.error("Request Data:", error.config?.data);
    } else {
      console.error("Original Error:", error);
    }

    console.groupEnd();

    return errorModel;
  }
}

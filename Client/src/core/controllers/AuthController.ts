import type {
  AuthResponse,
  ForgetPasswordResponse,
  StatusResponse,
} from "@/core/models/AuthModel";
import { AuthService } from "../services/Auth.service";

type RequestStatus = "idle" | "loading" | "success" | "error";

export class AuthController {
  private loading = false;
  private error: string | null = null;
  private status: RequestStatus = "idle";
  private message: string | null = null;
  private data: AuthResponse["data"] | null = null;

  setLoading(state: boolean) {
    this.loading = state;
  }
  getLoading() {
    return this.loading;
  }

  setError(err: string | null) {
    this.error = err;
  }
  getError() {
    return this.error;
  }

  setStatus(status: RequestStatus) {
    this.status = status;
  }
  getStatus() {
    return this.status;
  }

  setMessage(msg: string | null) {
    this.message = msg;
  }
  getMessage() {
    return this.message;
  }

  setData(data: AuthResponse["data"] | null) {
    this.data = data;
  }
  getData() {
    return this.data;
  }

  get isAuthenticated(): boolean {
    return !!this.data;
  }

  async handleLogin(
    email: string,
    password: string
  ): Promise<AuthResponse | null> {
    this.setLoading(true);
    this.setError(null);
    this.setStatus("loading");

    try {
      const response = await AuthService.login(email, password);
      this.setData(response.data);
      this.setStatus("success");
      this.setMessage("Login successful");
      return response;
    } catch (err: any) {
      this.setError(err.message || "Login failed");
      this.setStatus("error");
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async handleRegister(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse | null> {
    this.setLoading(true);
    this.setError(null);
    this.setStatus("loading");

    try {
      const response = await AuthService.register(name, email, password);
      this.setData(response.data);
      this.setStatus("success");
      this.setMessage("Registration successful");
      return response;
    } catch (err: any) {
      this.setError(err.message || "Registration failed");
      this.setStatus("error");
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async handleForgetPassword(
    email: string
  ): Promise<ForgetPasswordResponse | null> {
    this.setLoading(true);
    this.setError(null);
    this.setStatus("loading");

    try {
      const response = await AuthService.forgetPassword(email);
      this.setStatus("success");
      this.setMessage("Password reset link sent");
      return response;
    } catch (err: any) {
      this.setError(err.message || "Request failed");
      this.setStatus("error");
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async getUserProfile(): Promise<StatusResponse | null> {
    this.setLoading(true);
    this.setError(null);
    this.setStatus("loading");

    try {
      const response = await AuthService.getUserProfile();
      this.setData(response.data);
      this.setStatus("success");
      return response;
    } catch (err: any) {
      this.setError(err.message || "Failed to load profile");
      this.setStatus("error");
      return null;
    } finally {
      this.setLoading(false);
    }
  }
}

import { AuthRepository } from "@/core/repository/AuthRepository";
import {
  AuthResponse,
  ForgetPasswordResponse,
  StatusResponse,
} from "../models/AuthModel";

const repo = new AuthRepository();

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const result = await repo.register({ name, email, password });
    return result;
  }
  static async login(email: string, password: string): Promise<AuthResponse> {
    const result = await repo.login({ email, password });
    return result;
  }
  static async forgetPassword(email: string): Promise<ForgetPasswordResponse> {
    const result = await repo.forgetPassword({ email });
    return result;
  }

  static async getUserProfile(): Promise<StatusResponse> {
    return repo.getStatus();
  }
}
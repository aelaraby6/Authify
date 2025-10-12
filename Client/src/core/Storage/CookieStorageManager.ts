import calculateExpiryDate from "../utils/date.utils";
import StorageBase from "./StorageBase";

interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export default class CookieStorageManager extends StorageBase {
  set(key: string, value: any, options: CookieOptions = {}): void {
    const days = options.days ?? 7;
    const expires = calculateExpiryDate(days);

    let cookieStr = `${key}=${encodeURIComponent(
      this.serialize(value)
    )}; expires=${expires};`;

    cookieStr += ` path=${options.path ?? "/"};`;
    if (options.domain) cookieStr += ` domain=${options.domain};`;
    if (options.secure) cookieStr += ` secure;`;
    if (options.sameSite) cookieStr += ` samesite=${options.sameSite};`;

    document.cookie = cookieStr;
  }

  get<T>(key: string): T | null {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, val] = cookie.split("=");
      if (name === key) {
        return this.deserialize<T>(decodeURIComponent(val));
      }
    }
    return null;
  }

  remove(key: string): void {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  clear(): void {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name] = cookie.split("=");
      this.remove(name);
    }
  }
}

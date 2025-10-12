import CookieStorageManager from "./CookieStorageManager";
import LocalStorageManager from "./LocalStorageManager";
import SessionStorageManager from "./SessionStorageManager";
import StorageBase from "./StorageBase";

type StorageType = "local" | "session" | "cookie";

export class StorageFactory {
  static create(type: StorageType): StorageBase {
    switch (type) {
      case "local":
        return new LocalStorageManager();
      case "session":
        return new SessionStorageManager();
      case "cookie":
        return new CookieStorageManager();
      default:
        throw new Error("Invalid storage type");
    }
  }
}

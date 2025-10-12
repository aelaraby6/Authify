import StorageBase from "./StorageBase";

export default class SessionStorageManager extends StorageBase {
  set(key: string, value: any): void {
    sessionStorage.setItem(key, this.serialize(value));
  }

  get<T>(key: string): T | null {
    const data = sessionStorage.getItem(key);
    return this.deserialize<T>(data);
  }

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}

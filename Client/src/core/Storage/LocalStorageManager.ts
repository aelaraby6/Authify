import StorageBase from "./StorageBase";

export default class LocalStorageManager extends StorageBase {
  set(key: string, value: any): void {
    localStorage.setItem(key, this.serialize(value));
  }

  get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return this.deserialize<T>(data);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

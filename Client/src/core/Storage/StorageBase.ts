export default abstract class StorageBase {
  abstract set(key: string, value: any): void;
  abstract get<T>(key: string): T | null;
  abstract remove(key: string): void;
  abstract clear(): void;

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  protected serialize(value: any): string {
    return JSON.stringify(value);
  }

  protected deserialize<T>(value: string | null): T | null {
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  // encoding => (ex : tokens)
  protected encode(value: string): string {
    return btoa(value);
  }

  protected decode(value: string): string {
    return atob(value);
  }
}

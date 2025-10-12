import { useState } from "react";

export function useAsync<T>(asyncFunction: (...args: any[]) => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, data };
}

"use client";

import { useState, useEffect, useCallback } from "react";

export default function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>(null!);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const revalidate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [{ data, loading, error }, { revalidate }] as const;
}

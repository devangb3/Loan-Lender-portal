import { useCallback, useEffect, useState } from "react";

export function useAsyncResource(loader, initialData) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await loader();
      setData(next);
      return next;
    } catch {
      // Error feedback is handled globally by the API client interceptor.
      return null;
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, setData, loading, refresh };
}

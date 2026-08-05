"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * AdminProvider — hosts the TanStack Query client for the admin portal. Every
 * admin page fetches through hooks in lib/admin/hooks.ts (useQuery) and mutates
 * through the mutation hooks there (useMutation, with optimistic updates). Data
 * lives in Neon; a browser refresh re-fetches and persists.
 */
export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // 30s — admin data doesn't churn every second
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

"use client";

import React, { useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: Readonly<ThemeProviderProps>) {
  const [mounted, setMounted] = useState(false);

  // Ensure that component is only rendered after mounting on client
  // This prevents hydration mismatch when accessing browser APIs
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shifts
    return <>{children}</>;
  }

  return <>{children}</>;
}

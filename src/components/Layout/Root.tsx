"use client";

import React from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col py-4 md:py-10 items-center h-screen min-w-screen dark:bg-black/90">
      {children}
    </div>
  );
}

export default RootLayout;

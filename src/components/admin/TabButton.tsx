"use client";

import React from "react";
import { AdminTabs } from "@/types/admin";

interface TabButtonProps {
  setTabState: (tab: AdminTabs) => void;
  tab: AdminTabs;
}

function TabButton({ setTabState, tab }: TabButtonProps) {
  return (
    <div className="flex gap-4 items-center">
      <button
        className={`p-2 text-sm rounded-md transition-all ${
          tab === AdminTabs.SHORT_LINKS
            ? "bg-purple-600/20 text-purple-700 dark:text-purple-300"
            : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        onClick={() => setTabState(AdminTabs.SHORT_LINKS)}
      >
        Shortlinks
      </button>
      <button
        className={`p-2 text-sm rounded-md transition-all ${
          tab === AdminTabs.DOMAINS
            ? "bg-purple-600/20 text-purple-700 dark:text-purple-300"
            : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        onClick={() => setTabState(AdminTabs.DOMAINS)}
      >
        Domains
      </button>
    </div>
  );
}

export default TabButton;

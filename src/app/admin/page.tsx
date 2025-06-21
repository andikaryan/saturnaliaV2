"use client";

import React, { useState } from "react";
import AdminContainer from "@/components/admin";
import TabButton from "@/components/admin/TabButton";
import { AdminTabs } from "@/types/admin";
import Image from "next/image";

function AdminPage() {
  const [tabState, setTabState] = useState(AdminTabs.SHORT_LINKS);

  return (
    <div className="dark:text-white flex flex-col items-center w-full">
      <div className="flex justify-center items-center gap-4">
        <div className="p-2 bg-white rounded-full">
          <Image
            src="/next.svg"
            className="dark:invert"
            alt="Saturnalia"
            width={40}
            height={40}
          />
        </div>
        <h1 className="flex gap-1 self-center font-semibold text-lg">
          <span className="text-purple-500">Saturnalia</span>
          <span className="dark:text-white">Dashboard</span>
        </h1>
      </div>
      <div className="flex justify-between items-center mt-5 w-full md:w-1/2">
        <a
          className="p-2 flex gap-2 justify-center items-center hover:bg-white hover:text-black rounded-md transition-all group"
          href="https://github.com/yourusername/saturnalia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="group-hover:text-black transition-all">GitHub</span>
        </a>
        <TabButton setTabState={setTabState} tab={tabState} />
      </div>

      <AdminContainer tab={tabState} />
    </div>
  );
}

export default AdminPage;

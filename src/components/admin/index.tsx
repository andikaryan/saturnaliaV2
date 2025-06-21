"use client";

import React from "react";
import { AdminTabs } from "@/types/admin";
import ShortlinksContainer from "./ShortlinksContainer";
import DomainsContainer from "./DomainsContainer";

function AdminContainer({ tab }: { tab: AdminTabs }) {
  if (tab === AdminTabs.DOMAINS) {
    return <DomainsContainer />;
  }

  if (tab === AdminTabs.SHORT_LINKS) {
    return <ShortlinksContainer />;
  }
  
  return null;
}

export default AdminContainer;

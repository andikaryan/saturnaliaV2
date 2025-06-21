"use client";

import React, { createContext } from "react";
import AdminMenu from "./ShortLink";
import Button from "@/components/UI/Button";
import { Shortlink } from "@/types/shortlink.types";
import useFetch from "@/hooks/useFetch";
import { IDomain } from "@/types/domain.types";

export const AdminContext = createContext({
  data: [],
  domains: [],
  revalidate: () => undefined,
  revalidateDomains: () => undefined,
} as {
  data: Shortlink[];
  domains: IDomain[];
  revalidate: () => any;
  revalidateDomains: () => any;
});

function ShortlinksContainer() {
  const [{ data, loading }, { revalidate }] = useFetch<Shortlink>(`/api/db`);
  const [
    { data: domains, loading: domainLoading },
    { revalidate: revalidateDomains },
  ] = useFetch<IDomain>("/api/domain");

  const createShortlink = async () => {
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shortlink: crypto.randomUUID().substring(0, 8),
          longlink: "https://example.com",
          domain_id: null,
        }),
      });
      
      revalidate();
    } catch (error) {
      console.error("Error creating shortlink:", error);
    }
  };

  if (loading || domainLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <AdminContext.Provider
        value={{
          data: data || [],
          revalidate,
          domains: domains || [],
          revalidateDomains,
        }}
      >
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md mt-4 w-full md:w-1/2 shadow-md">
          <div className="flex justify-between items-center gap-4">
            <input
              className="input w-full text-xs md:text-base h-8 md:h-full dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600"
              type="text"
              placeholder="Search for a shortlink"
            />
            <Button
              className="bg-purple-600 w-full self-center h-10 font-semibold hover:bg-purple-700 rounded-md text-white px-4"
              onClick={createShortlink}
              loader
              data-testid="create-shortlink"
            >
              + Create Shortlink
            </Button>
          </div>
          <div className="border border-black/10 dark:border-white/10 mt-4" />
          <AdminMenu />
        </div>
      </AdminContext.Provider>
    </React.Fragment>
  );
}

export default ShortlinksContainer;

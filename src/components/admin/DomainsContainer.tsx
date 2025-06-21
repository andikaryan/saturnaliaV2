"use client";

import React from "react";
import Button from "@/components/UI/Button";
import useFetch from "@/hooks/useFetch";
import { IDomain } from "@/types/domain.types";

function DomainsContainer() {
  const [{ data, loading }, { revalidate }] = useFetch<IDomain>("/api/domain");

  const createDomain = async () => {
    try {
      const domain = prompt("Enter a domain name (e.g., example.com):");
      
      if (!domain) return;
      
      await fetch('/api/domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
        }),
      });
      
      revalidate();
    } catch (error) {
      console.error("Error creating domain:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md mt-4 w-full md:w-1/2 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Domains</h2>
        <Button
          className="bg-purple-600 self-center h-10 font-semibold hover:bg-purple-700 rounded-md text-white px-4"
          onClick={createDomain}
          loader
        >
          + Add Domain
        </Button>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        {data?.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No domains added yet
          </div>
        ) : (
          <div className="space-y-2">
            {data?.map((domain) => (
              <div 
                key={domain.id} 
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="font-medium">{domain.domain}</span>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => {
                      const newDomain = prompt("Edit domain name:", domain.domain);
                      if (newDomain && newDomain !== domain.domain) {
                        fetch('/api/domain', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            domain: newDomain,
                            id: domain.id,
                          }),
                        }).then(() => revalidate());
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this domain?")) {
                        fetch(`/api/domain?id=${domain.id}`, {
                          method: 'DELETE',
                        }).then(() => revalidate());
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DomainsContainer;

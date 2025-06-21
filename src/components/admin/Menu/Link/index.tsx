"use client";

import React, { useContext, useState } from "react";
import { Shortlink } from "@/types/shortlink.types";
import { AdminContext } from "../../ShortlinksContainer";
import { useElementPosition } from "@/hooks/useElementPosition";

function LinkCard({ item }: { item: Shortlink }) {
  const [position, ref] = useElementPosition();
  const { revalidate, domains } = useContext(AdminContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(item);

  const host = domains.find(d => d.id === item.domain_id) || { domain: window?.location?.origin || "localhost:3000" };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${host.domain}/${item.shortlink}`);
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const deleteLink = async () => {
    if (confirm('Are you sure you want to delete this shortlink?')) {
      try {
        await fetch(`/api/db?id=${item.id}`, {
          method: 'DELETE',
        });
        revalidate();
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      setIsEditing(false);
      revalidate();
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short URL</label>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">{host.domain}/</span>
              <input
                className="flex-1 border rounded-md px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                value={formData.shortlink}
                onChange={e => setFormData({...formData, shortlink: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Long URL</label>
            <textarea
              className="border rounded-md px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
              value={formData.longlink}
              rows={3}
              onChange={e => setFormData({...formData, longlink: e.target.value})}
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-purple-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer hover:-translate-y-0.5"
      ref={ref as any}
    >
      <div className="flex flex-col w-full">
        <div className="flex gap-2 items-center">
          <div className="text-md w-full text-ellipsis overflow-hidden break-all">
            <a href={`/${item.shortlink}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <div className="text-xs text-purple-600 opacity-80 font-semibold">
                {host.domain}
              </div>
              <div className="flex items-center">
                <span className="text-sm">/</span>
                <span className="ml-1 font-medium">{item.shortlink}</span>
              </div>
            </a>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <a
            href={item.longlink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline truncate block max-w-full overflow-hidden"
            style={{ maxWidth: '20ch' }}
          >
            {item.longlink}
          </a>
        </div>
      </div>
      
      <div className="flex gap-2 ml-4">
        <button
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={() => setIsEditing(true)}
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50"
          onClick={deleteLink}
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default LinkCard;

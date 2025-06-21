"use client";

import { useState, useEffect } from "react";


export default function ShortUrlForm() {
  // Initialize state with undefined to ensure they start as controlled
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Prevent hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      
      // Validate URL format
      let validUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        validUrl = `https://${url}`;
      }
      
      // Generate a random short ID
      const shortId = Math.random().toString(36).substring(2, 8);
      
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shortlink: shortId,
          longlink: validUrl,
          domain_id: null, // Using null for default domain
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to create short URL");
      }
        const result = await response.json();      if (result.success) {
        // We know we're mounted here since the form can only be submitted client-side
        const baseUrl = window.location.origin;
        const shortUrl = `${baseUrl}/${shortId}`;
        console.log(`Created short URL: ${shortUrl} for ${validUrl}`);
        setShortUrl(shortUrl);
      } else {
        throw new Error("Failed to create short URL");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };  if (!mounted) {
    // Return a null placeholder to prevent hydration mismatch
    return null;
  }

  return (
    <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter your long URL
          </label>
          <input
            type="text"
            id="url"
            value={url || ""}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url-that-needs-shortening"
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            "Shorten URL"
          )}
        </button>
      </form>
      
      {shortUrl && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Your shortened URL:
          </div>
          <div className="flex flex-col sm:flex-row gap-3">            <input
              type="text"
              readOnly
              value={shortUrl || ""}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shortUrl);
                alert("URL copied to clipboard!");
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

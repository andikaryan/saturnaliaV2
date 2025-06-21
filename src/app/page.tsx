import ShortUrlForm from "@/components/ShortUrlForm";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-center">Saturnalia URL Shortener</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Create short, memorable links in seconds</p>
        </div>
        
        <div className="w-full max-w-3xl">
          <ClientOnly
            fallback={
              <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center items-center h-52">
                <div className="animate-pulse text-center">
                  <div className="h-6 w-36 bg-gray-300 dark:bg-gray-600 rounded mb-4 mx-auto"></div>
                  <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
                  <div className="h-10 w-28 bg-purple-500 rounded mx-auto"></div>
                </div>
              </div>
            }
          >
            <ShortUrlForm />
          </ClientOnly>
        </div>
      </main>
    </div>
  );
}

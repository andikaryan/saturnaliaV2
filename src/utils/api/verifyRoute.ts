import { NextRequest } from "next/server";

// Middleware for route verification - can be expanded in the future for authentication
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function verifyRoute(request: NextRequest) {
  // In a real app, you would verify token/session here
  return true;
}

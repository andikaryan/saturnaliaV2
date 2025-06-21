import { NextRequest } from "next/server";

// Middleware for route verification - can be expanded in the future for authentication
export default async function verifyRoute(_request: NextRequest) {
  // In a real app, you would verify token/session here
  return true;
}

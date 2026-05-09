import { handlers } from "@/server/auth";
import type { NextRequest } from "next/server";

async function handleRequest(req: NextRequest, handler: (req: NextRequest) => Promise<Response>) {
  try {
    return await handler(req);
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string };
    const isInvalidCheck =
      e?.name === "InvalidCheck" ||
      String(e?.message || "").includes("pkceCodeVerifier");
    if (isInvalidCheck) {
      const headers = new Headers();
      headers.append(
        "Set-Cookie",
        "next-auth.pkceCodeVerifier=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
      );
      headers.append(
        "Set-Cookie",
        "next-auth.csrf-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
      );
      headers.set("Location", "/api/auth/signin");
      return new Response(null, { status: 302, headers });
    }
    throw err;
  }
}

export const GET = (req: NextRequest) => handleRequest(req, handlers.GET);
export const POST = (req: NextRequest) => handleRequest(req, handlers.POST);

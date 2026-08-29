import { cookies } from "next/headers";
import { getIronSession, type IronSession } from "iron-session";
import { getSessionOptions, type SessionData } from "@/lib/session-config";

export type { SessionData };

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), getSessionOptions());
}

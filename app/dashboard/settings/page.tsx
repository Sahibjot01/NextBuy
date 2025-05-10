import { auth } from "@/server/auth";
import SettingsCard from "./settings-card";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) return null;

  return <SettingsCard session={session} />;
}

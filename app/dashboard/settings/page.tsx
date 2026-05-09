import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import SettingsCard from "./settings-card";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return <SettingsCard session={session} />;
}

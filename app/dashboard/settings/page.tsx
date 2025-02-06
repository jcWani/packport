import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import SettingsCard from "./settings-card";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Settings() {
  const session = await auth();

  if (!session) redirect("/");

  return <SettingsCard session={session} />;
}

export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSubscribers } from "@/features/newsletter/queries";
import { getNewsletterConfig } from "@/lib/settings";
import { NewsletterManager } from "@/components/admin/newsletter-manager";

export default async function AdminNewsletterPage() {
  const session = await auth();
  if (!session) redirect("/connexion");

  const [rows, config] = await Promise.all([
    getSubscribers(),
    getNewsletterConfig(),
  ]);
  return <NewsletterManager rows={rows} welcomeCode={config.welcomeCode} />;
}

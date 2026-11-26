export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getReviewsForAdmin } from "@/features/reviews/queries";
import { ReviewManager } from "@/components/admin/review-manager";

export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session) redirect("/connexion");

  const rows = await getReviewsForAdmin();
  return <ReviewManager rows={rows} />;
}

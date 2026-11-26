// Requêtes avis clients — lecture publique (approuvés) et admin (tous).

import { db } from "@/lib/db";
import { productReviews, products } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { toIso } from "@/lib/dates";

export interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface AdminReview extends Review {
  approved: boolean;
  productName: string | null;
}

export async function getApprovedReviews(
  productId: string
): Promise<Review[]> {
  try {
    const rows = await db
      .select()
      .from(productReviews)
      .where(
        and(
          eq(productReviews.productId, productId),
          eq(productReviews.approved, true)
        )
      )
      .orderBy(desc(productReviews.createdAt));
    return rows.map((r) => ({
      id: r.id,
      productId: r.productId,
      name: r.name,
      rating: r.rating,
      text: r.text,
      createdAt: toIso(r.createdAt),
    }));
  } catch {
    return [];
  }
}

export async function getReviewsForAdmin(): Promise<AdminReview[]> {
  try {
    const rows = await db
      .select({
        id: productReviews.id,
        productId: productReviews.productId,
        productName: products.name,
        name: productReviews.name,
        rating: productReviews.rating,
        text: productReviews.text,
        approved: productReviews.approved,
        createdAt: productReviews.createdAt,
      })
      .from(productReviews)
      .leftJoin(products, eq(productReviews.productId, products.id))
      .orderBy(desc(productReviews.createdAt));
    return rows.map((r) => ({
      ...r,
      productName: r.productName ?? null,
      createdAt: toIso(r.createdAt),
    }));
  } catch {
    return [];
  }
}

export function reviewStats(reviews: Review[]) {
  const count = reviews.length;
  const average = count
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
    : 0;
  return { count, average };
}

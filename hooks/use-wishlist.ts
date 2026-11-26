"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  toggleWishlist,
  removeWishlistItem,
  clearWishlist,
  selectWishlistCount,
  type WishlistItem,
} from "@/features/wishlist/wishlistSlice";

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((s: RootState) => s.wishlist.items);
  const count = useSelector(selectWishlistCount);

  const ids = new Set(items.map((i) => i.productId));

  return {
    items,
    count,
    isWishlisted: (productId: string) => ids.has(productId),
    toggle: (item: WishlistItem) => dispatch(toggleWishlist(item)),
    remove: (productId: string) => dispatch(removeWishlistItem(productId)),
    clear: () => dispatch(clearWishlist()),
  };
}

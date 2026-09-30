"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  addItem,
  removeItem,
  updateQuantity,
  toggleCart,
  clearCart,
  selectCartTotal,
  selectCartCount,
} from "@/features/cart/cartSlice";
import type { CartItem } from "@/types";

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((s: RootState) => s.cart.items);
  const isOpen = useSelector((s: RootState) => s.cart.isOpen);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  return {
    items,
    isOpen,
    total,
    count,
    addItem: (item: CartItem) => dispatch(addItem(item)),
    removeItem: (productId: string) => dispatch(removeItem(productId)),
    updateQuantity: (productId: string, quantity: number) =>
      dispatch(updateQuantity({ productId, quantity })),
    toggleCart: (open?: boolean) => dispatch(toggleCart(open)),
    clearCart: () => dispatch(clearCart()),
  };
}

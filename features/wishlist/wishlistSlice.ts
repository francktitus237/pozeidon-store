import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  promoPrice?: number;
  image?: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const idx = state.items.findIndex(
        (i) => i.productId === action.payload.productId
      );
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    removeWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (i) => i.productId !== action.payload
      );
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlist, removeWishlistItem, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.items.length;

export default wishlistSlice.reducer;

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/features/cart/cartSlice";
import wishlistReducer from "@/features/wishlist/wishlistSlice";

// Persistance locale : panier + favoris survivent au rechargement de page.
const STORAGE_KEY = "pozeidon-store";

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
});

type Persisted = Partial<ReturnType<typeof rootReducer>>;

function loadPersisted(): Persisted | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as Persisted;
  } catch {
    return undefined;
  }
}

export function makeStore() {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadPersisted(),
  });

  store.subscribe(() => {
    try {
      const { cart, wishlist } = store.getState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist }));
    } catch {
      // localStorage indisponible (mode privé, quota) — on ignore.
    }
  });

  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

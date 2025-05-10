import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Variant = {
  variantId: number;
  quantity: number;
};

export type CartItem = {
  name: string;
  image: string;
  id: number;
  variant: Variant;
  price: number;
};

export type CartState = {
  cart: CartItem[];
  checkoutProgress: "cart-page" | "payment-page" | "confirmation-page";
  setCheckoutProgress: (
    progress: "cart-page" | "payment-page" | "confirmation-page"
  ) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      setCartOpen: (val) => set(() => ({ cartOpen: val })),
      checkoutProgress: "cart-page",
      clearCart: () => set(() => ({ cart: [] })),
      setCheckoutProgress: (value) =>
        set((state) => ({
          checkoutProgress: value,
        })),
      addToCart: (item: CartItem) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.variant.variantId === item.variant.variantId
          );
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.variant.variantId === item.variant.variantId) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity + item.variant.quantity,
                  },
                };
              }
              return cartItem;
            });
            return { cart: updatedCart };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  variant: {
                    variantId: item.variant.variantId,
                    quantity: item.variant.quantity,
                  },
                },
              ],
            };
          }
        }),
      removeFromCart: (item: CartItem) =>
        set((state) => {
          const updatedCart = state.cart.map((cartItem) => {
            if (cartItem.variant.variantId === item.variant.variantId) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              };
            }
            return cartItem;
          });
          return {
            cart: updatedCart.filter(
              (cartItem) => cartItem.variant.quantity > 0
            ),
          };
        }),
    }),
    { name: "cart-storage" }
  )
);

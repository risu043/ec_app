import {Cart} from "@/types";
import {createContext} from "react";

export const CartContext = createContext<{
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
}>({
  cart: {},
  setCart: () => {
    // do nothing
  },
});

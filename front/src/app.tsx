import {Suspense, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Loading} from "@/components/loading";
import {router} from "@/routes";
import {CartContext} from "@/providers/cart";
import {Cart} from "@/types";

const queryClient = new QueryClient();

export function App(): JSX.Element {
  const storedCart = JSON.parse(localStorage.getItem("cart") || "{}");
  const [cart, setCart] = useState<Cart>(storedCart);
  return (
    <ErrorBoundary fallback={<div>error occurred</div>}>
      <Suspense fallback={<Loading />}>
        <QueryClientProvider client={queryClient}>
          <CartContext.Provider value={{cart, setCart}}>
            <RouterProvider router={router} />
          </CartContext.Provider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

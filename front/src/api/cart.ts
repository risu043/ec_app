import {throwResponseError} from "@/lib/error";
import {Cart, ProductWithDetails} from "@/types";

export const cartProducts = async (
  productIds: number[],
): Promise<ProductWithDetails[]> => {
  const baseUrl = "/api/products";
  const params = new URLSearchParams();

  if (productIds) {
    params.append("productIds", productIds.join(","));
  }

  const url = `${baseUrl}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};

export const cartOrder = async (cart: Cart): Promise<{orderId: number}> => {
  const url = "/api/orders";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      Object.entries(cart).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity,
      })),
    ),
  });
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};

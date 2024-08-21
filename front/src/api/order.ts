import {throwResponseError} from "@/lib/error";
import {Order} from "@/types";

export const getOrder = async (orderId: string | undefined): Promise<Order> => {
  const url = `/api/orders/${orderId}`;

  const res = await fetch(url);
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};

export const getAllOrder = async (): Promise<Order[]> => {
  const url = "/api/orders";

  const res = await fetch(url);
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};

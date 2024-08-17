import {throwResponseError} from "@/lib/error";
import {ProductWithDetails} from "@/types";

export const searchProducts = async ({
  page,
  filter,
}: {
  page?: number;
  filter?: string;
}): Promise<{
  products: ProductWithDetails[];
  hitCount: number;
}> => {
  const baseUrl = "/api/products/search";
  let url = baseUrl;

  const params = new URLSearchParams();

  if (filter) {
    params.append("filter", filter);
  }

  if (page) {
    params.append("page", page.toString());
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    await throwResponseError(res);
  }
  return await res.json();
};

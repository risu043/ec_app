import {useSuspenseQuery} from "@tanstack/react-query";
import {getOrder} from "@/api/order";

export function OrderList({orderId}: {orderId: string | undefined}) {
  const {data: orders} = useSuspenseQuery({
    queryKey: ["orders", {id: orderId}],
    queryFn: () => getOrder(orderId),
  });

  function formatDate(dateString: string | null): string {
    if (!dateString) return "Not Ordered";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}/${month}/${day}`;
  }

  const formattedDate = orders.createdAt
    ? formatDate(orders.createdAt)
    : "Not Ordered";

  const totalPrice = orders.orderDetails.reduce(
    (sum, product) => sum + product.price,
    0,
  );

  const totalQuantity = orders.orderDetails.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  return (
    <div className="border p-4">
      <div className="text-xl">
        <p data-test="order-date">Order date: {formattedDate}</p>
        <p data-test="order-total-price">Total price: {totalPrice} coins</p>
        <p data-test="order-total-quantity">Total quantity: {totalQuantity}</p>
      </div>
      <ul data-test={`order-item-${orders.id}`}>
        {orders.orderDetails.map(order => {
          return (
            <li
              key={order.id}
              data-test="order-detail-item"
              className="grid grid-cols-[200px_minmax(300px,_1fr)] gap-4 my-8 shadow-md"
            >
              <img
                src={`/image/${order.product.imageName.replace(/\s+/g, "_")}`}
                data-test="order-detail-image"
              />
              <div className="mt-4">
                <p
                  data-test="order-detail-name"
                  className="text-2xl font-semibold"
                >
                  {order.product.name}
                </p>
                <p data-test="order-detail-price">price: {order.price} coins</p>
                <p data-test="order-detail-quantity">
                  quantity: {order.quantity}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

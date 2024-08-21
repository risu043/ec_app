import {Order} from "@/types";

export function OrderAllList({orders, year}: {year: string; orders: Order[]}) {
  const targetYear = year;

  const selectedOrder = orders.filter(order =>
    order.createdAt.includes(targetYear),
  );

  function formatDate(dateString: string | null): string {
    if (!dateString) return "Not Ordered";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}/${month}/${day}`;
  }
  if (selectedOrder.length === 0) {
    return <p data-test="no-orders-message">No orders found</p>;
  }

  return (
    <ul data-test="order-list">
      {selectedOrder.map(order => {
        const formattedDate = order.createdAt
          ? formatDate(order.createdAt)
          : "Not Ordered";

        const totalPrice = order.orderDetails.reduce(
          (sum, product) => sum + product.price,
          0,
        );

        const totalQuantity = order.orderDetails.reduce(
          (sum, product) => sum + product.quantity,
          0,
        );

        return (
          <li
            key={order.id}
            data-test={`order-item-${order.id}`}
            className="border p-4 mb-8"
          >
            <div>
              <p data-test="order-date">Order date: {formattedDate}</p>
              <p data-test="order-total-price">
                Total price: {totalPrice} coins
              </p>
              <p data-test="order-total-quantity">
                Total quantity: {totalQuantity}
              </p>
            </div>
            <ul>
              {order.orderDetails.map(orderDetail => {
                return (
                  <li
                    data-test="order-detail-item"
                    key={orderDetail.id}
                    className="grid grid-cols-[200px_minmax(300px,_1fr)] gap-4 my-8 shadow-md"
                  >
                    <img
                      src={`/image/${orderDetail.product.imageName.replace(/\s+/g, "_")}`}
                      data-test="order-detail-image"
                    />
                    <div className="mt-4">
                      <p
                        data-test="order-detail-name"
                        className="text-2xl font-semibold"
                      >
                        {orderDetail.product.name}
                      </p>
                      <p data-test="order-detail-price">
                        price: {orderDetail.price} coins
                      </p>
                      <p data-test="order-detail-quantity">
                        quantity: {orderDetail.quantity}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

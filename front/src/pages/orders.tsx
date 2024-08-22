import {useState, Suspense} from "react";
import {OrderAllList} from "@/components/order_all_lists";
import {useSuspenseQuery} from "@tanstack/react-query";
import {getAllOrder} from "@/api/order";

export function OrdersPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <OrdersPanel />
    </Suspense>
  );
}

export function OrdersPanel(): JSX.Element {
  const {data: orders} = useSuspenseQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrder(),
  });
  const thisYear = new Date().getFullYear();
  const [targetYear, setTargetYear] = useState<number>(thisYear);
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(thisYear - i);
  }
  const handleSelect: React.ChangeEventHandler<HTMLSelectElement> = e => {
    e.preventDefault();
    setTargetYear(Number(e.target.value));
  };
  return (
    <>
      <div className="mb-12">
        <label htmlFor="year">orders placed in</label>
        <select
          id="year"
          value={targetYear}
          onChange={handleSelect}
          className="border"
          data-test="year-selector"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <OrderAllList orders={orders} year={targetYear} />
    </>
  );
}
// import {Suspense, useState} from "react";
// import {useSuspenseQuery} from "@tanstack/react-query";
// import {getAllOrder} from "@/api/order";
// import {Loading} from "@/components/loading";
// import {Order} from "@/types";

// export function OrdersPage(): JSX.Element {
//   return (
//     <Suspense fallback={<Loading />}>
//       <OrdersPanel />
//     </Suspense>
//   );
// }

// export function OrdersPanel(): JSX.Element {
//   const {data: orders} = useSuspenseQuery({
//     queryKey: ["orders"],
//     queryFn: () => getAllOrder(),
//   });

//   const thisYear = new Date().getFullYear();
//   const [targetYear, setTargetYear] = useState<number>(thisYear);
//   const years = [];
//   for (let i = 0; i < 5; i++) {
//     years.push(thisYear - i);
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       <div>
//         <label htmlFor="year">orders placed in</label>
//         <select
//           id="year"
//           value={targetYear}
//           onChange={event => setTargetYear(parseInt(event.target.value))}
//           className="border"
//           data-test="year-selector"
//         >
//           {years.map(year => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>
//       </div>

//       <OrderList orders={orders} year={targetYear} />
//     </div>
//   );
// }

// function OrderList({
//   orders,
//   year,
// }: {
//   orders: Order[];
//   year: number;
// }): JSX.Element {
//   const filteredOrders = orders.filter(
//     order => new Date(order.createdAt).getFullYear() === year,
//   );

//   if (filteredOrders.length === 0) {
//     return <div data-test="no-orders-message">No orders found</div>;
//   }

//   return (
//     <ul className="flex flex-col gap-y-8" data-test="order-list">
//       {filteredOrders.map(order => (
//         <li
//           className="p-4 border flex flex-col gap-4"
//           key={order.id}
//           data-test={`order-item-${order.id}`}
//         >
//           <OrderSummary order={order} />
//           <OrderDetailList order={order} />
//         </li>
//       ))}
//     </ul>
//   );
// }

// export function OrderSummary({order}: {order: Order}): JSX.Element {
//   const totalPrice = order.orderDetails.reduce(
//     (a, b) => a + b.price * b.quantity,
//     0,
//   );
//   const totalQuantity = order.orderDetails.reduce((a, b) => a + b.quantity, 0);
//   const orderDate = new Date(order.createdAt);

//   return (
//     <ul className="flex flex-col gap-1">
//       <li data-test="order-date">
//         Order date: {orderDate.getFullYear()}/{orderDate.getMonth() + 1}/
//         {orderDate.getDate()}
//       </li>
//       <li data-test="order-total-price">Total price: {totalPrice} coins</li>
//       <li data-test="order-total-quantity">Total quantity: {totalQuantity}</li>
//     </ul>
//   );
// }

// export function OrderDetailList({order}: {order: Order}): JSX.Element {
//   return (
//     <ul className="flex flex-col gap-4">
//       {order.orderDetails.map(({id, product, price, quantity}) => (
//         <li
//           key={id}
//           className="flex flex-row gap-4"
//           data-test={`order-detail-item`}
//         >
//           <img
//             src={`/image/${product.imageName}`}
//             className="h-32"
//             data-test="order-detail-image"
//           />
//           <div className="flex flex-col justify-center">
//             <div className="font-bold text-lg" data-test="order-detail-name">
//               {product.name}
//             </div>
//             <div data-test="order-detail-price">price: {price} coins</div>
//             <div data-test="order-detail-quantity">quantity: {quantity}</div>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }

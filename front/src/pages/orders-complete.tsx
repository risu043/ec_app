import {useParams} from "react-router-dom";
import {Suspense} from "react";
import {OrderList} from "@/components/order_lists";

export function OrdersCompletePage(): JSX.Element {
  const {orderId} = useParams<{orderId: string}>();
  console.log("orderId:", orderId);
  return (
    <>
      <Suspense
        fallback={
          <div className="loading" data-test="suspense">
            Loading...
          </div>
        }
      >
        <p
          data-test="order-complete-message"
          className="text-2xl font-medium mb-4"
        >
          Thank you for your order!
        </p>
        <OrderList orderId={orderId} />
      </Suspense>
    </>
  );
}

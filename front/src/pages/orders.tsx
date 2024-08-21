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
  const [targetYear, setTargetYear] = useState<string>("2024");
  const handleSelect: React.ChangeEventHandler<HTMLSelectElement> = e => {
    e.preventDefault();
    setTargetYear(e.target.value);
  };
  return (
    <>
      <div className="mb-12">
        <select
          data-test="year-selector"
          onChange={handleSelect}
          className="border py-2 px-4"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
      </div>
      <OrderAllList orders={orders} year={targetYear} />
    </>
  );
}

import {Suspense, useContext} from "react";
import {CartContext} from "@/providers/cart";
import {Link, Navigate, Outlet} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {logout} from "@/api/auth";
import {useCurrentUser} from "@/hooks/current_user";
import {User} from "@/types";

export function RequireAuth(): JSX.Element {
  const {currentUser} = useCurrentUser();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header currentUser={currentUser} />
      <Suspense>
        <div className="p-8 container mx-auto">
          <Outlet />
        </div>
      </Suspense>
    </>
  );
}

function Header({currentUser}: {currentUser: User}): JSX.Element {
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      location.href = "/login";
    },
  });

  const {cart} = useContext(CartContext);
  const totalQuantity = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-row p-4 justify-between items-center bg-violet-600">
      <Link className="text-2xl text-white" to="/">
        EC APP
      </Link>
      <div className="flex flex-row gap-6 items-baseline">
        <div className="flex flex-row gap-2 items-baseline">
          <span className="text-white">hi!</span>
          <span className="text-white text-2xl">{currentUser.name}</span>
        </div>
        <button className="text-white" onClick={() => mutation.mutate()}>
          Logout
        </button>
        <Link
          data-test="link-to-orders"
          className="text-xl text-white"
          to="/orders"
        >
          Orders
        </Link>
        <Link
          data-test="link-to-cart"
          className="text-xl text-white"
          to="/cart"
        >
          Cart {totalQuantity}
        </Link>
      </div>
    </div>
  );
}

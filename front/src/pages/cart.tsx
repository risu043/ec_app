import {useState, useContext} from "react";
import {CartContext} from "@/providers/cart";
import {Suspense} from "react";
import {CartList} from "@/components/cart_lists";
import {cartOrder} from "@/api/cart";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {ValidationError} from "@/lib/error";

export function CartPage(): JSX.Element {
  const {cart, setCart} = useContext(CartContext);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  console.log(errors);
  const mutation = useMutation({
    mutationFn: cartOrder,
    onSuccess: response => {
      const {orderId} = response;
      navigate(`/orders/${orderId}/complete`);
      setCart([]);
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        setErrors(error.errors);
      } else {
        console.error(error);
        setErrors(["Unexpected error occurred"]);
      }
    },
  });

  const handleButtonClick = async () => {
    mutation.mutate(cart);
  };

  if (errors.length > 0) {
    return (
      <div className="error-screen" data-test="error-screen">
        {errors.map((error, index) => (
          <p key={index} className="text-rose-600 bg-rose-100 px-8 py-4">
            {error}
          </p>
        ))}
      </div>
    );
  }

  const productIds = Object.keys(cart).map(Number);

  if (Object.keys(cart).length === 0) {
    return <p data-test="cart-empty-message">Cart is empty</p>;
  }

  return (
    <>
      <Suspense
        fallback={
          <div className="loading" data-test="suspense">
            Loading...
          </div>
        }
      >
        <CartList productIds={productIds} />
        <button
          onClick={handleButtonClick}
          data-test="order-button"
          className="text-white bg-orange-400 px-8 py-4 rounded-xl"
        >
          Order
        </button>
      </Suspense>
    </>
  );
}

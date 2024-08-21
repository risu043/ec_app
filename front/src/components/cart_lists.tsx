import React from "react";
import {useSuspenseQuery} from "@tanstack/react-query";
import {cartProducts} from "@/api/cart";
import {useContext, useEffect} from "react";
import {CartContext} from "@/providers/cart";

export function CartList({productIds}: {productIds: number[]}) {
  const {data: products} = useSuspenseQuery({
    queryKey: ["products", {ids: productIds}],
    queryFn: () => cartProducts(productIds),
  });

  const {cart} = useContext(CartContext);
  const totalQuantity = Object.values(cart).reduce((a, b) => a + b, 0);

  const totalPrice = products.reduce(
    (sum, product) => sum + (cart[product.id] || 0) * product.price,
    0,
  );

  if (!products) {
    return <p>No products found.</p>;
  }

  return (
    <>
      <div data-test="cart-summary">
        <p data-test="total-price">Total price: {totalPrice} coins</p>
        <p data-test="total-quantity">Total quantity: {totalQuantity}</p>
      </div>
      <ul data-test="product-list">
        {products.map(product => {
          function formatDate(dateString: string | null): string {
            if (!dateString) return "Not Ordered";

            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            return `${year}/${month}/${day}`;
          }

          const formattedDate = product.lastOrderedAt
            ? formatDate(product.lastOrderedAt)
            : "Not Ordered";

          return (
            <li
              key={product.id}
              data-test={`product-item-${product.id}`}
              className="grid grid-cols-[200px_minmax(300px,_1fr)_100px] gap-4 my-8 shadow-md"
            >
              <img
                src={`/image/${product.name.replace(/\s+/g, "_")}.png`}
                data-test="product-image"
              />
              <div className="mt-4">
                <p data-test="product-last-ordered-at">
                  last order: {formattedDate}
                </p>
                <p data-test="product-name">{product.name}</p>
                <p data-test="product-price">{product.price} coins</p>
              </div>
              <div className="mt-4">
                <QuantityInput productId={product.id} />
                <p data-test="product-stock-quantity">
                  stock: {product.quantity}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function QuantityInput({productId}: {productId: number}): JSX.Element {
  const {cart, setCart} = useContext(CartContext);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setCart(prev => {
      const newQuantity = Number(event.target.value);
      if (newQuantity <= 0) {
        const {[productId]: _, ...rest} = prev;
        return rest;
      }
      return {...prev, [productId]: newQuantity};
    });
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  return (
    <>
      <input
        type="text"
        onChange={handleQuantityChange}
        data-test="product-quantity-input"
        value={cart[productId] || ""}
        className="border w-16"
      />
    </>
  );
}

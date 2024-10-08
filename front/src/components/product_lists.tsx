import {useSuspenseQuery} from "@tanstack/react-query";
import {searchProducts} from "@/api/search";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {CartContext} from "@/providers/cart";

export function ProductList({page, filter}: {page: number; filter: string}) {
  const {
    data: {products, hitCount},
  } = useSuspenseQuery({
    queryKey: ["products", page, filter],
    queryFn: () => searchProducts({page, filter}),
  });

  return (
    <>
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
                <QuantityInput
                  data-test="product-quantity-input"
                  productId={product.id}
                />
                <p data-test="product-stock-quantity">
                  stock: {product.quantity}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <Pagination page={page} filter={filter} hitCount={hitCount} />
    </>
  );
}

function Pagination({
  page,
  filter,
  hitCount,
}: {
  page: number;
  filter: string;
  hitCount: number;
}): JSX.Element {
  const isLast = hitCount <= page * 10;
  const navigate = useNavigate();

  const handlePrevPageClick = (): void => {
    if (filter === "") {
      navigate(`/?page=${page - 1}`);
      return;
    }
    navigate(`/?page=${page - 1}&filter=${filter}`);
  };

  const handleNextPageClick = (): void => {
    if (filter === "") {
      navigate(`/?page=${page + 1}`);
      return;
    }
    navigate(`/?page=${page + 1}&filter=${filter}`);
  };

  return (
    <div>
      <button
        onClick={handlePrevPageClick}
        disabled={page === 1}
        data-test="prev-button"
      >
        Prev
      </button>
      <span data-test="current-page">{page}</span>
      <button
        onClick={handleNextPageClick}
        disabled={isLast}
        data-test="next-button"
      >
        Next
      </button>
    </div>
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

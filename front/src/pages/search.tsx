import {useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ErrorBoundary} from "react-error-boundary";
import {Suspense} from "react";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {ProductList} from "@/components/product_lists";

export function SearchPage(): JSX.Element {
  const queryClient = new QueryClient();

  const [searchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";
  const currentPage = Number(searchParams.get("page") || "1");

  const [query, setQuery] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };
  const navigate = useNavigate();
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      navigate(`/?filter=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            onChange={handleInputChange}
            value={query}
            placeholder="search product..."
            className="bg-violet-100 p-4"
            data-test="search-input"
          />
          <input
            type="submit"
            value="submit"
            data-test="search-button"
            className="bg-violet-500 p-4"
          />
        </form>
        <ErrorBoundary
          fallback={
            <div className="error" data-test="error">
              something went wrong
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="loading" data-test="suspense">
                Loading...
              </div>
            }
          >
            <ProductList filter={currentFilter} page={currentPage} />
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    </div>
  );
}

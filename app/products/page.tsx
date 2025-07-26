import { getProducts, ProductSortKeys } from "@/lib/shopify/getProducts";
import { getShopifyClient } from "@/lib/shopify/getShopifyClient";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilterSheet } from "./FilterSheet"; // Import the new client component

interface ProductsPageProps {
  searchParams: {
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: ProductSortKeys;
    order?: "asc" | "desc";
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const client = getShopifyClient();
  const { q, minPrice, maxPrice, sort, order } = searchParams;

  const filters = {
    query: q,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  };

  const sortKey = sort || ProductSortKeys.CREATED_AT;
  const reverse = order === "desc";

  const data = await getProducts(client, 24, filters, sortKey, reverse);

  const areFiltersApplied = Object.keys(searchParams).length > 0;

  return (
    // Responsive padding applied here
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Our Products
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Discover our curated collection. Use the filters to find exactly what you're looking for.
        </p>
      </header>

      <div className="mb-8">
        <FilterSheet />
        {areFiltersApplied && (
          <Button variant="ghost" asChild>
            <Link href="/products">Clear Filters</Link>
          </Button>
        )}
      </div>

      {data?.products.edges.length > 0 ? (
        // Responsive grid for mobile and desktop
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.products.edges.map(({ node: product }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800">No Products Found</h2>
          <p className="mt-2 text-gray-500">
            Your search and filter combination yielded no results.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Clear All Filters</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

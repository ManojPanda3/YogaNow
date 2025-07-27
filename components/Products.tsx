import { getShopifyClient } from "@/lib/shopify/getShopifyClient";
import { notFound } from "next/navigation";
import { FetchedProducts, getProducts } from "@/lib/shopify/getProducts";
import ProductCard from "@/components/ProductCard";

export const Products = async () => {
  const client = getShopifyClient();
  let products: FetchedProducts | undefined | null = undefined;

  if (client) {
    products = await getProducts(client);
    if (!products) {
      return notFound();
    }
  } else {
    // Handle the case where the client isn't available
    return notFound();
  }

  return (
    <section className="w-full bg-background py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          Featured Collection
        </h2>

        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Explore our hand-picked selection of high-quality yoga gear designed
          to elevate your practice.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {products?.products?.edges?.map(({ node: product }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;

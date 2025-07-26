import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';
import { getShopifyClient } from "@/lib/shopify/getShopifyClient";
import { notFound } from "next/navigation";
import { FetchedProducts, getProducts } from "@/lib/shopify/getProducts";

export const Products = async () => {
  const client = getShopifyClient();
  let products: FetchedProducts | undefined | null = undefined;

  if (client) {
    products = await getProducts(client);
    if (!products) {
      return notFound();
    }
  } else {
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
          {products?.products?.edges?.map(({ node: product }) => {
            if (product.featuredImage === null) return
            return (<div key={product.id} className="flex">
              <Card className="flex flex-col w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 py-0 gap-0">
                <Link href={`/products/${product.handle}`} className="group block">
                  <CardHeader className="p-0">
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                      />
                    </div>
                  </CardHeader>
                </Link>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <Link href={`/products/${product.handle}`} className="block flex-grow hover:underline">
                    <h3 className="text-lg font-semibold leading-tight">{product.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-400 pt-1 leading-tight">{product.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex w-full items-center justify-between">
                  <p className="text-xl font-bold text-primary">
                    ${product.priceRange.minVariantPrice.amount}
                  </p>
                  <Button size="icon" variant="outline">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">Add to Cart</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;

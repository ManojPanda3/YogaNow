import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/shopify/getProduct";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.featuredImage || product.images?.edges[0]?.node;

  return (
    <Card className="flex flex-col w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group gap-0">
      <Link href={`/products/${product.handle}`} className="block">
        <CardHeader className="p-0">
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-muted">
                <span className="text-sm text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link
          href={`/products/${product.handle}`}
          className="block flex-grow hover:underline"
        >
          <h3 className="text-base font-semibold leading-tight">
            {product.title}
          </h3>
        </Link>
        {
          product.description.trim() && (

            <p className="text-sm text-muted-foreground pt-1 leading-tight">
              {product.description}
            </p>
          )
        }
      </CardContent>
      <CardFooter className="p-4 pt-0 flex w-full items-center justify-between">
        <p className="text-lg font-bold text-primary">
          {product.variants?.edges[0]?.node.price.amount ? (
            `${product.variants.edges[0].node.price.amount}`
          ) : product.priceRange ? (
            `${product.priceRange.minVariantPrice.amount}`
          ) : (
            'Price not available'
          )}
        </p>
        <Link className="" href={`/products/${product.handle}`}>
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Add to Cart</span>
        </Link>
      </CardFooter>
    </Card>
  );
}

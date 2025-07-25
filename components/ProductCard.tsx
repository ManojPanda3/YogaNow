import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// This would typically be defined in your types file
export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    url: string;
    altText?: string;
  };
  images: {
    edges: {
      node: {
        url: string;
        altText?: string;
      };
    }[];
  };
};

const StarRating = ({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(
            "transition-colors",
            rating > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
};

export const ProductCard = ({ product }: { product: Product }) => {
  const image = product.featuredImage || product.images?.edges[0]?.node;

  return (
    <div className="flex">
      <Card className="flex flex-col w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 py-0 gap-0">
        <Link href={`/products/${product.handle}`} className="group block">
          <CardHeader className="p-0">
            <div className="relative aspect-square w-full overflow-hidden">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.altText || product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <span className="text-sm text-gray-500">No Image</span>
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
            <h3 className="text-lg font-semibold leading-tight">
              {product.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-400 pt-1 leading-tight">
            {product.description}
          </p>
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
  );
};

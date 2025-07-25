"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/shopify/getProduct";
import { ProductPurchaseForm } from "@/components/ProductPurchaseForm";
import { ProductCard } from "@/components/ProductCard";

// Define a type for the image object for cleaner state management
type ProductImage = {
  url: string;
  altText: string | null;
};

export function ProductView({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) {
  // State to manage the currently displayed main image
  const [selectedImage, setSelectedImage] = React.useState<ProductImage | null>(
    product.featuredImage || product.images?.edges[0]?.node || null
  );

  const reviews = product.reviews?.edges.map(edge => ({
    id: edge.node.id,
    author: edge.node.author?.name || "Anonymous",
    rating: edge.node.rating,
    content: edge.node.content,
  })) ?? [];


  // Callback to update the image when a variant is selected in the form
  const handleVariantChange = React.useCallback((variant: Product['variants']['edges'][0]['node']) => {
    if (variant.image) {
      setSelectedImage(variant.image);
    }
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={16} className="mx-1" />
        <Link href="/products" className="hover:text-primary">Products</Link>
        <ChevronRight size={16} className="mx-1" />
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full relative overflow-hidden rounded-lg shadow-lg bg-gray-100">
            {selectedImage ? (
              <Image
                src={selectedImage.url}
                alt={selectedImage.altText || product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-sm text-gray-500">No Image Available</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-5 gap-4">
            {product?.images?.edges?.map(({ node: image }, index) => (
              <button
                key={image.url}
                className={cn(
                  "aspect-square w-full relative overflow-hidden rounded-md border-2 transition-all",
                  selectedImage?.url === image.url
                    ? "border-primary ring-2 ring-primary"
                    : "border-transparent hover:border-muted-foreground"
                )}
                onClick={() => setSelectedImage(image)}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase text-primary mb-2">
            {product.vendor}
          </p>

          <ProductPurchaseForm product={product} onVariantChange={handleVariantChange} />

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Product Details</h2>
            <div
              className="prose prose-sm text-muted-foreground max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
      </div>

      {/* <ReviewsSection reviews={reviews} /> */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct as any} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

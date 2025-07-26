"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { ProductPurchaseForm } from "@/components/ProductPurchaseForm";
import type { Product } from "@/lib/shopify/getProduct";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

interface ProductViewProps {
  product: Product;
  relatedProducts: Product[];
}
const FPS: number = 36;

type VariantNode = Product['variants']['edges'][0]['node'];
export default function ProductView({ product, relatedProducts }: ProductViewProps) {
  const [selectedImage, setSelectedImage] = useState(product.featuredImage);
  const zoom_lock = useRef<boolean>(false)
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom_lock.current) return
    if (!imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    imageContainerRef.current.style.setProperty('--zoom-x', `${x}%`);
    imageContainerRef.current.style.setProperty('--zoom-y', `${y}%`);
    zoom_lock.current = true
    setTimeout(() => {
      zoom_lock.current = false;
    }, 1000 / FPS);
  };

  const handleVariantChange = (variant: VariantNode) => {
    if (variant.image) {
      setSelectedImage(variant.image);
    }
  };

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Image gallery */}
          <div className="flex flex-col gap-4 group">
            <div
              ref={imageContainerRef}
              className="aspect-square w-full relative overflow-hidden rounded-lg shadow-lg bg-muted cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => imageContainerRef.current?.classList.add('zoomed')}
              onMouseLeave={() => imageContainerRef.current?.classList.remove('zoomed')}
            >
              <Image
                src={selectedImage.url}
                alt={selectedImage.altText || product.title}
                fill
                priority
                className="object-cover transition-transform duration-300 ease-in-out"
                sizes="(max-width: 1024px) 90vw, 45vw"
                style={{ transformOrigin: 'var(--zoom-x) var(--zoom-y)' }}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.edges.map(({ node: image }, index) => (
                <button
                  key={image.url}
                  className={cn(
                    "aspect-square w-full relative overflow-hidden rounded-md border-2 transition-all",
                    selectedImage.url === image.url
                      ? "border-primary ring-2 ring-primary-focus"
                      : "border-border hover:border-primary"
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

          {/* Product info */}
          <div className="lg:sticky top-24 self-start space-y-6">
            <ProductPurchaseForm product={product} onVariantChange={handleVariantChange} />
            {product.descriptionHtml.trim() && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                  <AccordionTrigger>Product Description</AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* <AccordionItem value="shipping"> */}
                {/*   <AccordionTrigger>Shipping & Returns</AccordionTrigger> */}
                {/*   <AccordionContent> */}
                {/*     <p className="text-muted-foreground"> */}
                {/*       Free shipping on orders over $50. Returns accepted within 30 days of purchase. */}
                {/*     </p> */}
                {/*   </AccordionContent> */}
                {/* </AccordionItem> */}
              </Accordion>)
            }
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="py-16 lg:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

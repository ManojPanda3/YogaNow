"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Product } from "@/lib/shopify/getProduct";
import { cn } from "@/lib/utils";

// Define the variant node type for clarity
type VariantNode = Product['variants']['edges'][0]['node'];

interface ProductFormProps {
  product: Product;
  onVariantChange: (variant: VariantNode) => void;
}

export function ProductPurchaseForm({ product, onVariantChange }: ProductFormProps) {
  // Initialize with the first available variant, or the first variant if none are available
  const initialVariant = product.variants.edges.find(edge => edge.node.availableForSale)?.node || product.variants.edges[0]?.node;
  const [selectedVariant, setSelectedVariant] = React.useState<VariantNode | undefined>(initialVariant);

  // Use an effect to inform the parent component of a variant change
  React.useEffect(() => {
    if (selectedVariant) {
      onVariantChange(selectedVariant);
    }
  }, [selectedVariant, onVariantChange]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    console.log("Adding to cart:", {
      variantId: selectedVariant.id,
      quantity: 1,
    });
    alert(`Added ${product.title} (${selectedVariant.title}) to cart!`);
  };

  // Group variants by their options for a better UI (e.g., Color, Size)
  const options = product.options.map(option => ({
    ...option,
    values: Array.from(new Set(product.variants.edges.map(edge => {
      return edge.node.selectedOptions.find(opt => opt.name === option.name)!.value;
    })))
  }));


  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>

      <div className="flex items-baseline space-x-2">
        <p className="text-2xl font-bold">
          ${selectedVariant?.price?.amount}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {selectedVariant?.price?.currencyCode}
          </span>
        </p>
      </div>
      <p className={cn("text-sm font-semibold", selectedVariant?.availableForSale ? "text-green-600" : "text-destructive")}>
        {selectedVariant?.availableForSale ? "In Stock" : "Out of Stock"}
      </p>

      {/* Render options dynamically */}
      {product.variants.edges.length > 1 && options.map(option => (
        <div key={option.id}>
          <Label className="text-base font-medium">{option.name}:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* This is a simplified variant selector. A more complex one would handle multi-option products. */}
            {product.variants.edges.map(({ node: variant }) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={cn(
                  "relative rounded-md border-2 p-2 text-sm transition-all duration-200 ease-in-out flex items-center gap-2",
                  {
                    "border-primary ring-2 ring-primary": selectedVariant?.id === variant.id,
                    "border-muted hover:border-muted-foreground": selectedVariant?.id !== variant.id,
                    "opacity-50 cursor-not-allowed": !variant.availableForSale,
                  }
                )}
                disabled={!variant.availableForSale}
                aria-label={`Select ${variant.title}`}
              >
                {variant.title !== 'Default Title' ? variant.title : 'Default'}
                {!variant.availableForSale && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md text-white text-xs font-bold">
                    Sold Out
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="text-sm text-muted-foreground mt-2">
        Selected: <span className="font-semibold">{selectedVariant?.title?.trim()?.toLowerCase() !== "default title" ? selectedVariant?.title : product.title}</span>
      </p>

      <Button
        type="button"
        size="lg"
        className="w-full mt-4"
        onClick={handleAddToCart}
        disabled={!selectedVariant || !selectedVariant.availableForSale}
      >
        Add to Cart
      </Button>
    </div>
  );
}

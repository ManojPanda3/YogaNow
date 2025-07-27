"use client";

import * as React from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext"; // Ensure this path is correct
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react"; // Added Loader2 for loading states

interface CartSliderProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CartSlider({ isOpen, onOpenChange }: CartSliderProps) {
  // 1. Destructure the CORRECT values from the new context
  const {
    cart,              // The entire cart object from Shopify, or null
    cartItems,         // A convenient array of line items (cart.lines.edges.node)
    cartItemCount,
    isLoading,         // A boolean to know when an API call is in progress
    updateCartQuantity,// The updated function name
    removeFromCart,
  } = useCart();

  // 2. Get the subtotal and checkout URL directly from the Shopify cart object
  // This is more accurate than calculating on the client
  const subtotal = cart?.estimatedCost?.totalAmount;
  const checkoutUrl = cart?.checkoutUrl;

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  const renderContent = () => {
    // 3. Handle the initial loading state
    if (isLoading && !cart) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    // 4. Handle the empty cart state
    if (!cartItems || cartItems.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
        </div>
      );
    }

    // 5. Render the cart using the 'cartItems' array and the new data structure
    return (
      <>
        <div className="flex-1 overflow-y-auto px-6">
          <ul className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <Image
                    src={item.merchandise.image.url}
                    alt={item.merchandise.image.altText || item.merchandise.product.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.merchandise.product.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {/* Display variant title if it's not the default one */}
                    {item.merchandise.title !== "Default Title" ? item.merchandise.title : ""}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      // Use the correct update function
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      // Disable buttons during API calls
                      disabled={isLoading}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-semibold">
                    ${parseFloat(item.estimatedCost.totalAmount.amount).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t px-6 pt-4">
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            {subtotal && (
              <span>
                {subtotal.currencyCode} ${parseFloat(subtotal.amount).toFixed(2)}
              </span>
            )}
          </div>
          <Button
            className="w-full mt-4"
            onClick={handleCheckout}
            disabled={isLoading || !checkoutUrl}
          >
            {isLoading && !cart ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Proceed to Checkout
          </Button>
        </div>
      </>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Cart ({cartItemCount})</SheetTitle>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}

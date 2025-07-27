"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

// This interface should match the structure of a cart line item from your Shopify API
interface CartLineItem {
  id: string; // This is the line ID, e.g., "gid://shopify/CartLine/..."
  quantity: number;
  merchandise: {
    id: string; // This is the variant ID, e.g., "gid://shopify/ProductVariant/..."
    title: string;
    image: {
      url: string;
      altText: string | null;
    };
    product: {
      title: string;
      handle: string;
    };
  };
  estimatedCost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

// Interface for the entire cart object returned from your API
interface Cart {
  id: string;
  lines: {
    edges: { node: CartLineItem }[];
  };
  estimatedCost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface CartContextType {
  cart: Cart | null;
  cartItems: CartLineItem[];
  cartItemCount: number;
  isLoading: boolean;
  addToCart: (merchandiseId: string, quantity: number) => Promise<void>;
  updateCartQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the cart on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cart");
        if (!response.ok) throw new Error("Failed to fetch cart");
        const cartData = await response.json();
        setCart(cartData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Function to add an item to the cart
  const addToCart = async (merchandiseId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchandiseId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error(error);
      // Here you could add user-facing error notifications
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update item quantity
  const updateCartQuantity = async (lineId: string, quantity: number) => {
    if (quantity === 0) {
      await removeFromCart(lineId);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to update cart");
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (lineId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineId }),
      });
      if (!response.ok) throw new Error("Failed to remove from cart");
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized values to prevent unnecessary re-renders
  const cartItems = useMemo(() => cart?.lines.edges.map(edge => edge.node) ?? [], [cart]);
  const cartItemCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartItemCount,
        isLoading,
        addToCart,
        updateCartQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

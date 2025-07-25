// src/lib/product-data.ts

// This structure mimics a simplified version of the Shopify Storefront API's product object.
export interface Product {
  id: string;
  handle: string; // This will be used as the URL slug
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
        selectedOptions: {
          name: string;
          value: string;
        }[];
      };
    }[];
  };
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    handle: "eco-flow-yoga-mat",
    title: "Eco-Flow Yoga Mat",
    vendor: "YogaNow",
    description: "Our signature Eco-Flow mat provides the perfect balance of grip and cushion. Made from sustainably sourced, non-slip natural rubber, it's designed to support you through every flow. 100% biodegradable and eco-friendly.",
    descriptionHtml:
      "<p>Our signature Eco-Flow mat provides the perfect balance of grip and cushion. Made from <strong>sustainably sourced, non-slip natural rubber</strong>, it's designed to support you through every flow.</p><p>100% biodegradable and eco-friendly.</p>",
    images: {
      edges: [
        { node: { url: "https://images.unsplash.com/photo-1591291621226-c56a555f2427?q=80&w=1200", altText: "Eco-Flow Yoga Mat in teal" } },
        { node: { url: "https://images.unsplash.com/photo-1599447462858-a7b525154308?q=80&w=1200", altText: "Close up of the mat texture" } },
        { node: { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200", altText: "Woman using the mat" } },
      ],
    },
    options: [
      { id: "1", name: "Color", values: ["Teal", "Lavender", "Charcoal"] },
    ],
    variants: {
      edges: [
        { node: { id: "v1", title: "Teal", availableForSale: true, price: { amount: "79.99", currencyCode: "USD" }, selectedOptions: [{ name: "Color", value: "Teal" }] } },
        { node: { id: "v2", title: "Lavender", availableForSale: true, price: { amount: "79.99", currencyCode: "USD" }, selectedOptions: [{ name: "Color", value: "Lavender" }] } },
        { node: { id: "v3", title: "Charcoal", availableForSale: false, price: { amount: "79.99", currencyCode: "USD" }, selectedOptions: [{ name: "Color", value: "Charcoal" }] } },
      ],
    },
  },
  // You can add other products here...
];

// Function to fetch a single product by its handle (URL slug)
export async function fetchProductByHandle(id: string): Promise<Product | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return PRODUCTS.find((product) => product.id == id);
}

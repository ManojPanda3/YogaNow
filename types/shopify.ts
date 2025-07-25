// types/shopify.ts

export interface ShopifyImage {
  url: string;
  altText?: string;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  image: ShopifyImage;
  price: ShopifyPrice;
  selectedOptions: ShopifySelectedOption[];
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  descriptionHtml: string;
  description: string;
  featuredImage?: ShopifyImage;
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
  options: ShopifyProductOption[];
  variants: {
    edges: { node: ShopifyVariant }[];
  };
  images: {
    edges: { node: ShopifyImage }[];
  };
}

export interface ShopifyReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
}

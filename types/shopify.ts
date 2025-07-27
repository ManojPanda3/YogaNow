export interface Product {
  id: string;
  handle: string;
  vendor?: string;
  title: string;
  descriptionHtml?: string;
  description: string;
  tags?: string[];
  seo?: {
    title: string;
    description: string;
  };
  featuredImage?: {
    url: string;
    altText: string;
  };
  images?: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
  options?: {
    id: string;
    name: string;
    values: string[];
  }[];
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode?: string;
    };
    maxVariantPrice?: {
      amount: string;
    };
  };
  variants?: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale?: boolean;
        image?: {
          url: string;
          altText: string;
        };
        price: {
          amount: string;
          currencyCode?: string;
        };
        selectedOptions?: {
          name: string;
          value: string;
        }[];
      };
    }[];
  };
  reviewsMetafield?: {
    value: string; // The metafield value will be a JSON string
  } | null;
}
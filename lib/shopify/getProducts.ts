import { gql, GraphQLClient } from "graphql-request";

interface Product {
  node: {
    id: string;
    description: string;
    title: string;
    handle: string;
    priceRange: {
      minVariantPrice: { amount: string };
      maxVariantPrice: { amount: string };
    };
    featuredImage: { altText: string; url: string };
    variants: {
      edges: {
        node: {
          price: {
            amount: string;
          };
        };
      }[];
    };
  };
}

export interface FetchedProducts {
  products: {
    edges: Product[];
  };
}

export interface ProductFilter {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
}

export enum ProductSortKeys {
  TITLE = "TITLE",
  PRICE = "PRICE",
  CREATED_AT = "CREATED_AT",
}

export async function getProducts(
  client: GraphQLClient,
  max_product: number = 10,
  filter: ProductFilter = {},
  sortKey: ProductSortKeys = ProductSortKeys.CREATED_AT,
  reverse: boolean = false
): Promise<FetchedProducts | undefined | null> {
  const { query, minPrice, maxPrice } = filter;

  let gqlQuery = "";
  if (query) {
    gqlQuery += `title:*${query}*`;
  }
  if (minPrice !== undefined) {
    gqlQuery += ` variants.price:>=${minPrice}`;
  }
  if (maxPrice !== undefined) {
    gqlQuery += ` variants.price:<=${maxPrice}`;
  }

  const getFilteredProductsQuery = gql`
    query getProducts(
      $first: Int!,
      $query: String,
      $sortKey: ProductSortKeys,
      $reverse: Boolean
    ) {
      products(
        first: $first,
        query: $query,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
              }
              maxVariantPrice {
                amount
              }
            }
            featuredImage {
              altText
              url
            }
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const variables = {
      first: max_product,
      query: gqlQuery,
      sortKey: sortKey,
      reverse: reverse,
    };
    const data = await client.request(getFilteredProductsQuery, variables);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products.");
  }
}

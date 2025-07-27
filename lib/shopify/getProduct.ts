import { gql, GraphQLClient } from "graphql-request";
import { Product } from "@/types/shopify";

export async function getProductByHandle(
  client: GraphQLClient,
  handle: string
): Promise<Product | null> {
  const productQuery = gql`
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        vendor
        descriptionHtml
        description
        tags
        seo {
          title
          description
        }
        featuredImage {
          url
          altText
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        options {
          id
          name
          values
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale
              image {
                url
                altText
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
        # CORRECTED PART: Fetch the metafield for reviews.
        # IMPORTANT: Replace "spr" and "reviews" if your app uses a different namespace/key.
        reviewsMetafield: metafield(namespace: "spr", key: "reviews") {
          value
        }
      }
    }
  `;

  try {
    const data = await client.request<{ product: Product }>(productQuery, { handle });
    return data?.product ?? null;
  } catch (error) {
    console.error("Error fetching product by handle:", error);
    // Returning null is better than throwing here for the page to handle it gracefully
    return null;
  }
}

export async function getProductRecommendations(client: GraphQLClient, productId: string): Promise<Product[]> {
  const getProductRecommendationsQuery = gql`
    query getProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
        id
        handle
        title
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
      }
    }
  `;

  try {
    const response = await client.request<{ productRecommendations: Product[] }>(
      getProductRecommendationsQuery,
      {
        productId,
      }
    );

    return response.productRecommendations || [];
  } catch (error) {
    console.error("Error fetching product recommendations:", error);
    return [];
  }
}

interface RelatedProductsGQLResponse {
  product: {
    collections: {
      edges: {
        node: {
          products: {
            edges: {
              node: Product;
            }[];
          };
        };
      }[];
    };
  };
}

export async function getRelatedProducts(
  client: GraphQLClient,
  productId: string
): Promise<Product[]> {
  const getRelatedProductsQuery = gql`
    query getRelatedProducts($id: ID!) {
      product(id: $id) {
        collections(first: 1) {
          edges {
            node {
              products(first: 5, sortKey: RELEVANCE) {
                edges {
                  node {
                    id
                    handle
                    title
                    description
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    featuredImage {
                      url
                      altText
                    }
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
    const response = await client.request<RelatedProductsGQLResponse>(
      getRelatedProductsQuery,
      {
        id: productId,
      }
    );

    const collections = response.product?.collections?.edges;

    if (!collections || collections.length === 0) {
      console.log("Product is not in any collections, cannot fetch related products.");
      return [];
    }

    const relatedProducts = collections[0].node.products.edges
      .map((edge: { node: Product }) => edge.node)
      .filter(Boolean);

    return relatedProducts.filter((product: Product) => product.id !== productId).slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

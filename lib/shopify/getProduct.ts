import { gql, GraphQLClient } from "graphql-request";

export interface Product {
  id: string;
  handle: string;
  vendor: string;
  title: string;
  descriptionHtml: string;
  description: string;
  tags: string[];
  seo: {
    title: string;
    description: string;
  };
  featuredImage: {
    url: string;
    altText: string;
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        image: {
          url: string;
          altText: string;
        };
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
  // This is the new field for fetching reviews from a metafield
  reviewsMetafield: {
    value: string; // The metafield value will be a JSON string
  } | null;
}

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
      .map((edge) => edge.node)
      .filter(Boolean);

    return relatedProducts.filter((product) => product.id !== productId).slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

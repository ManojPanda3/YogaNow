import { gql, GraphQLClient } from "graphql-request";

interface CartQueryResponse {
  cart: {
    id: string;
    createdAt: string;
    updatedAt: string;
    lines: {
      edges: {
        node: {
          id: string;
          quantity: number;
          merchandise: {
            id: string;
            title: string;
            image: {
              url: string;
              altText: string;
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
        };
      }[];
    };
    estimatedCost: {
      totalAmount: {
        amount: string;
        currencyCode: string;
      };
    };
    checkoutUrl: string;
  };
}

interface ProductQueryResponse {
  product: {
    id: string;
    handle: string;
    title: string;
    description: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    featuredImage: {
      url: string;
      altText: string;
    };
    variants: {
      edges: {
        node: {
          id: string;
        };
      }[];
    };
  };
}

export const getProduct = async (
  client: GraphQLClient,
  id: string
) => {
  const productQuery = gql`
    query getProduct($id: ID!) {
      product(id: $id) {
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
        variants(first: 10) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

  const variables = {
    id,
  };
  try {
    const data: ProductQueryResponse = await client.request(productQuery, variables);
    return data.product;
  } catch (error) {
    throw new Error(error as string);
  }

};

export interface CartCreateResponse {
  cartCreate: {
    cart: {
      id: string;
    };
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export async function addToCart(
  client: GraphQLClient,
  itemId: string,
  quantity: number): Promise<CartCreateResponse> {

  const createCartMutation = gql`
  mutation createCart($cartInput: CartInput) {
    cartCreate(input: $cartInput) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;
  const variables = {
    cartInput: {
      lines: [
        {
          quantity: quantity,
          merchandiseId: itemId,
        },
      ],
    },
  };
  try {
    return await client.request(createCartMutation, variables);
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function updateCart(client: GraphQLClient, cartId: string, itemId: string, quantity: number) {
  const updateCartMutation = gql`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const variables = {
    cartId: cartId,
    lines: [
      {
        quantity: quantity,
        merchandiseId: itemId,
      },
    ]
  };
  try {
    return await client.request(updateCartMutation, variables);
  } catch (error) {
    throw new Error(error as string);
  }
}

/**
 * @description Retrieves a cart with detailed line item information for a cart slider.
 */
export async function retrieveCart(client: GraphQLClient, cartId: string) {
  const cartQuery = gql`
    query cartQuery($cartId: ID!) {
      cart(id: $cartId) {
        id
        createdAt
        updatedAt
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                    altText
                  }
                  product {
                    title
                    handle
                  }
                }
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;
  const variables = {
    cartId,
  };
  try {
    const data = await client.request<CartQueryResponse>(cartQuery, variables);
    return data?.cart;
  } catch (error) {
    throw new Error(error as string);
  }
}

/**
 * @description Removes a line item from the cart.
 */
export async function removeFromCart(client: GraphQLClient, cartId: string, lineId: string) {
  const removeFromCartMutation = gql`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const variables = {
    cartId: cartId,
    lineIds: [lineId]
  };
  try {
    return await client.request(removeFromCartMutation, variables);
  } catch (error) {
    throw new Error(error as string);
  }
}

/**
 * @description Updates the quantity of a specific line item in the cart.
 */
export async function updateCartLines(client: GraphQLClient, cartId: string, lineId: string, quantity: number) {
  const updateCartLinesMutation = gql`
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const variables = {
    cartId: cartId,
    lines: [
      {
        id: lineId,
        quantity: quantity
      }
    ]
  };
  try {
    return await client.request(updateCartLinesMutation, variables);
  } catch (error) {
    throw new Error(error as string);
  }
}


export const getCheckoutUrl = async (client: GraphQLClient, cartId: string) => {
  const getCheckoutUrlQuery = gql`
    query checkoutURL($cartId: ID!) {
      cart(id: $cartId) {
        checkoutUrl
      }
    }
  `;
  const variables = {
    cartId: cartId,
  };
  try {
    return await client.request(getCheckoutUrlQuery, variables);
  } catch (error) {
    throw new Error(error as string);
  }
};

import { gql, GraphQLClient } from "graphql-request";

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
    const data = await client.request(productQuery, variables);
    return data.product;
  } catch (error) {
    throw new Error(error);
  }

};

export async function addToCart(
  client: GraphQLClient,
  itemId: string,
  quantity: number) {

  const createCartMutation = gql`
  mutation createCart($cartInput: CartInput) {
    cartCreate(input: $cartInput) {
      cart {
        id
      }
    }
  }
`;
  const variables = {
    cartInput: {
      lines: [
        {
          quantity: parseInt(quantity),
          merchandiseId: itemId,
        },
      ],
    },
  };
  try {
    return await client.request(createCartMutation, variables);
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateCart(client: GraphQLClient, cartId: string, itemId: string, quantity: string | number) {
  const updateCartMutation = gql`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
      }
    }
  `;
  const variables = {
    cartId: cartId,
    lines: [
      {
        quantity: (typeof quantity === "string" ? parseInt(quantity) : quantity),
        merchandiseId: itemId,
      },
    ]
  };
  try {
    return await client.request(updateCartMutation, variables);
  } catch (error) {
    throw new Error(error);
  }
}

export async function retrieveCart(client: GraphQLClient, cartId: string) {
  const cartQuery = gql`
    query cartQuery($cartId: ID!) {
      cart(id: $cartId) {
        id
        createdAt
        updatedAt

        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
          }
        }
      }
    }
  `;
  const variables = {
    cartId,
  };
  try {
    const data = await client.request(cartQuery, variables);
    return data?.cart;
  } catch (error) {
    throw new Error(error);
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
    throw new Error(error);
  }
};

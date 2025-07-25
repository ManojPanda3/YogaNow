import { GraphQLClient } from "graphql-request";

let graphQLClient: GraphQLClient | null = null;

export function getShopifyClient(): GraphQLClient | null {
  if (graphQLClient === null) {
    const storefrontAccessToken: string | undefined = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const endpoint: string | undefined = process.env.SHOPIFY_SHOP_URL;
    if (storefrontAccessToken === undefined || endpoint === undefined) throw new Error("Accesstoken and endpoint is required in .env file")

    try {
      graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        },
      });
    } catch (error) {
      console.error("Error while initiating shopify client, ", error)
    }
  }
  return graphQLClient
}

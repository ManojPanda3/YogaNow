import { notFound } from "next/navigation";
import { getProductByHandle, getProductRecommendations } from "@/lib/shopify/getProduct";
import { getShopifyClient } from "@/lib/shopify/getShopifyClient";
import ProductView from "./ProductView";
import type { Metadata } from "next";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { GraphQLClient } from "graphql-request";

// Define a reusable type for the page's props
type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const client = getShopifyClient();
  const handle = (await params).handle
  if (!client) {
    throw new Error("Shopify client not initialized");
  }
  const product = await getProductByHandle(client, handle);

  if (!product) {
    return notFound();
  }

  const { url, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags?.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
        images: [
          {
            url,
            width: 1200,
            height: 630,
            alt,
          },
        ],
      }
      : null,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const client = getShopifyClient() as GraphQLClient;
  const { handle } = await params;
  const product = await getProductByHandle(client, handle);

  if (!product) {
    return notFound();
  }

  const relatedProducts = await getProductRecommendations(client, product.id);

  return <ProductView product={product} relatedProducts={relatedProducts} />;
}

// /app/products/[handle]/page.tsx

import { notFound } from "next/navigation";
import { getShopifyClient } from "@/lib/shopify/getShopifyClient";
import { getProductByHandle, getRelatedProducts } from "@/lib/shopify/getProduct";
import { ProductView } from "./ProductView";
import { Metadata } from "next";

interface ProductPageProps {
  params: {
    handle: string;
  };
}

// SEO: Dynamically generate metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const client = getShopifyClient();
  if (!client) return {};

  const product = await getProductByHandle(client, params.handle);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  // The description is stripped of HTML for metadata purposes
  const cleanDescription = product.description.replace(/(<([^>]+)>)/gi, "").slice(0, 160);

  return {
    title: `${product.title} | My Yoga Store`,
    description: cleanDescription,
    openGraph: {
      title: product.title,
      description: cleanDescription,
      images: [
        {
          url: product.featuredImage?.url,
          width: 800,
          height: 600,
          alt: product.featuredImage?.altText || product.title,
        },
      ],
      // THIS IS THE CORRECTED LINE:
      type: 'article',
    },
  };
}


// The Page Component itself (Server Component)
export default async function ProductPage({ params }: ProductPageProps) {
  const client = getShopifyClient();
  if (!client) {
    notFound();
  }

  const product = await getProductByHandle(client, params.handle);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(client, product.id);

  return (
    <ProductView product={product} relatedProducts={relatedProducts} />
  );
}

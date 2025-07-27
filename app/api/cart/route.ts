import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  retrieveCart,
  addToCart,
  removeFromCart,
  updateCartLines,
  updateCart,
} from '@/lib/shopify/cart'; // Adjust this path to your Shopify functions
import { PrismaClient } from '@/lib/generated/prisma/client';
import { getShopifyClient } from '@/lib/shopify/getShopifyClient';
import { GraphQLClient } from 'graphql-request';

const prisma = new PrismaClient()
const shopifyClient = getShopifyClient() as GraphQLClient
const CART_ID_COOKIE = 'cartId';

const getUserId = (request: NextRequest): string | null => {
  return request.headers.get('X-current-user-id');
};

async function getCartId(request: NextRequest): Promise<string | null> {
  const userId = getUserId(request);
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cartId: true },
    });
    return user?.cartId ?? null;
  }
  return cookies().get(CART_ID_COOKIE)?.value ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const cartId = await getCartId(request);
    if (!cartId) {
      return NextResponse.json(null);
    }
    const cart = await retrieveCart(shopifyClient, cartId);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Failed to retrieve cart:', error);
    return NextResponse.json({ message: "Failed to retrieve cart", error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  let cartId = await getCartId(request);

  try {
    const { merchandiseId, quantity } = await request.json();
    if (!merchandiseId || !quantity) {
      return NextResponse.json({ message: "Missing merchandiseId or quantity" }, { status: 400 });
    }

    // This will hold the final response so we can attach a cookie to it if needed.
    let response: NextResponse;

    if (!cartId) {
      // 1. Correctly call 'createCart' to make a new cart.
      const cartData = await addToCart(shopifyClient, merchandiseId, quantity);
      console.log("Cart created Successfully ")
      console.log(cartData)
      const newCartId = cartData.cartCreate.cart.id;
      cartId = newCartId;

      const cart = await retrieveCart(shopifyClient, cartId);
      response = NextResponse.json(cart);

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { cartId: newCartId },
        });
      } else {
        response.cookies.set(CART_ID_COOKIE, newCartId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      }
      return response;

    } else {
      await updateCart(shopifyClient, cartId, merchandiseId, quantity);
    }

    const cart = await retrieveCart(shopifyClient, cartId);
    return NextResponse.json(cart);

  } catch (error) {
    console.error('Failed to add to cart:', error);
    return NextResponse.json({ message: "Failed to add item to cart", error: (error as Error).message }, { status: 500 });
  }
}
export async function PUT(request: NextRequest) {
  const cartId = await getCartId(request);
  if (!cartId) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  try {
    const { lineId, quantity } = await request.json();
    if (!lineId || quantity === undefined) {
      return NextResponse.json({ message: "Missing lineId or quantity" }, { status: 400 });
    }
    await updateCartLines(shopifyClient, cartId, lineId, quantity);
    const cart = await retrieveCart(shopifyClient, cartId);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Failed to update cart:', error);
    return NextResponse.json({ message: "Failed to update cart", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const cartId = await getCartId(request);
  if (!cartId) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  try {
    const { lineId } = await request.json();
    if (!lineId) {
      return NextResponse.json({ message: "Missing lineId" }, { status: 400 });
    }
    await removeFromCart(shopifyClient, cartId, lineId);
    const cart = await retrieveCart(shopifyClient, cartId);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    return NextResponse.json({ message: "Failed to remove from cart", error: (error as Error).message }, { status: 500 });
  }
}

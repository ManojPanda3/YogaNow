import { PrismaClient } from '@/lib/generated/prisma/client';
import { addToCart, retrieveCart, updateCart } from '@/lib/shopify/cart';
import { getShopifyClient } from '@/lib/shopify/getShopifyClient';
import { GraphQLClient } from 'graphql-request';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const client = getShopifyClient() as GraphQLClient
const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {

    const header = await headers()
    const userId = header.get('X-current-user-id');
    let cartId = req.nextUrl.searchParams.get('cartId');

    if (userId && !cartId) {
      const user = await prisma.user.findFirst({ where: { id: userId }, select: { cartId: true } });
      if (user?.cartId) cartId = user.cartId;
    }

    if (!cartId) {
      return NextResponse.json({ message: 'CartId is required', success: false }, { status: 400, statusText: 'Bad Request' });
    }
    const cart = await retrieveCart(client, cartId)
    console.log(cart)
    return NextResponse.json({ message: 'Successfully fetched cart', cart, success: true }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ message: 'Unable to fetch cart', success: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity, name, price, image } = body;
    const header = await headers();
    const userId = header.get('X-current-user-id');

    if (!productId || !quantity) {
      return NextResponse.json({ message: 'Product ID and quantity are required', success: false }, { status: 400, statusText: 'Bad Request' });
    }

    let cart;
    let cartIdToUse: string | null = null;

    if (userId) {
      const user = await prisma.user.findFirst({ where: { id: userId }, select: { cartId: true } });
      if (user?.cartId) {
        cartIdToUse = user.cartId;
      }
    }

    if (cartIdToUse) {
      // If cartId exists, update the existing cart
      cart = await updateCart(client, cartIdToUse, productId, quantity);
    } else {
      // Otherwise, create a new cart
      cart = await addToCart(client, productId, quantity);
      if (userId && cart?.id) {
        await prisma.user.update({
          where: { id: userId },
          data: { cartId: cart.id },
        });
      }
    }

    console.log('Added to cart:', cart);
    return NextResponse.json({ message: 'Successfully added to cart', cart, success: true }, { status: 200 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ message: 'Unable to add to cart', success: false }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartId: reqCartId, productId, quantity } = body;
    const header = await headers();
    const userId = header.get('X-current-user-id');

    let cart;
    let actualCartId = reqCartId; // Use cartId from request body by default

    if (!productId || quantity === undefined) {
      return NextResponse.json({ message: 'Product ID and quantity are required' }, { status: 400 });
    }

    // Determine the actual cartId to use
    if (userId) {
      const user = await prisma.user.findFirst({ where: { id: userId }, select: { cartId: true } });
      if (user?.cartId) {
        actualCartId = user.cartId; // Prioritize user's stored cartId if logged in
      }
    }

    if (!actualCartId) {
      return NextResponse.json({ message: 'Cart ID is required' }, { status: 400 });
    }

    if (quantity === 0) {
      // Remove item from cart
      const currentCart = await retrieveCart(client, actualCartId);
      const lineToRemove = currentCart?.lines?.edges.find((edge: any) => edge.node.merchandise.id === productId);

      if (lineToRemove) {
        cart = await removeFromCart(client, actualCartId, [lineToRemove.node.id]);
      } else {
        return NextResponse.json({ message: 'Item not found in cart to remove' }, { status: 404 });
      }
    } else {
      // Update item quantity or add new item
      cart = await updateCart(client, actualCartId, productId, quantity);
    }

    console.log('Updated cart:', cart);
    return NextResponse.json({ message: 'Successfully updated cart', cart }, { status: 200 });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ message: 'Unable to update cart' }, { status: 500 });
  }
}

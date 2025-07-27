// @/lib/auth.ts

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? 'your-refresh-token-secret';
const access_secret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
const refresh_secret = new TextEncoder().encode(REFRESH_TOKEN_SECRET);

// Helper type for your payload
interface UserJWTPayload extends JWTPayload {
  id: string;
}

export const generateAccessToken = async (user: { id: string }): Promise<string> => {
  return await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // Or a shorter time like '15m'
    .sign(access_secret);
};

export const generateRefreshToken = async (user: { id: string }): Promise<string> => {
  return await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(refresh_secret);
};

// This function will now throw an error if verification fails
export const verifyAccessToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify<UserJWTPayload>(token, access_secret);
    return payload;
  } catch (error) {
    console.error("Error verifying access token:", error.message);
    throw new Error("Access token is invalid."); // Re-throw for the middleware to catch
  }
};

// This function will now throw an error if verification fails
export const verifyRefreshToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify<UserJWTPayload>(token, refresh_secret);
    return payload;
  } catch (error) {
    console.error("Error verifying refresh token:", error.message);
    throw new Error("Refresh token is invalid."); // Re-throw for the middleware to catch
  }
};

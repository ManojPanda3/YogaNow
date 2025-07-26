import { SignJWT, jwtVerify } from 'jose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? 'your-refresh-token-secret';
const access_secret = new TextEncoder().encode(ACCESS_TOKEN_SECRET)
const refresh_secret = new TextEncoder().encode(REFRESH_TOKEN_SECRET)

export const generateAccessToken = async (user: { id: string, email: string }): Promise<string | null> => {
  try {
    return await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(access_secret)
  } catch (error) {
    console.error("Error while generating Access token: ", error.message)
    return null
  }
};

export const generateRefreshToken = async (user: { id: string, email: string, }): Promise<string | null> => {
  try {
    return await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(refresh_secret)
  } catch (error) {
    console.error("Error while generating Refresh token: ", error.message)
    return null
  }
};

export const verifyAccessToken = async (token: string) => {
  try {
    const payload = await jwtVerify(token, access_secret);
    return payload
  } catch (error) {
    console.error("Error verifying access token: ", error.message)
    return null;
  }
};

export const verifyRefreshToken = async (token: string) => {
  try {
    const payload = await jwtVerify(token, refresh_secret);
    return payload
  } catch (error) {
    console.error("Error verifying refresh token: ", error.message)
    return null;
  }
};


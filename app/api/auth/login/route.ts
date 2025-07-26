import { generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!prisma) throw new Error("Unable to initiate database")

    const body = await request.json()
    if (!(body.email && body.password)) {
      return NextResponse.json({ message: "Email and password is required", status: 400, success: false }, { status: 400, statusText: 'Bad Request' })
    }
    const exisiting_user = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })
    if (!exisiting_user) return NextResponse.json({ message: "User already exisit", status: 400, success: false }, { status: 400, statusText: 'Bad Request' })
    const [password, salt] = exisiting_user.encrypted_password.split('|')
    const isSame: boolean = await bcrypt.compare(password, exisiting_user.encrypted_password)
    if (!isSame) return NextResponse.json({ message: 'invalid user details', status: 400, success: false }, { status: 400 })

    const refresh_token = await generateRefreshToken({ id: exisiting_user.id, email: exisiting_user.email, });
    const access_token = await generateAccessToken({ id: exisiting_user.id, email: exisiting_user.email, });

    const response = NextResponse.json({ access_token, success: true, status: 200 }, { status: 200, statusText: 'Success' })
    response.cookies.set('refresh_token', refresh_token as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    response.cookies.set("access_token", access_token, { httpOnly: true, path: "/" });
  } catch (error) {
    return NextResponse.json({ message: error.message, success: false }, { status: 500 })
  }
}


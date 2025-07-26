import { PrismaClient } from "@/lib/generated/prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { randomBytes } from 'node:crypto'

const prisma = new PrismaClient();
export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!(body.email && body.password)) {
      return NextResponse.json({ message: "Email and password is required", status: 400, success: false }, { status: 400, statusText: 'Bad Request' })
    }
    const exisiting_user = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })
    console.log(exisiting_user)
    if (exisiting_user !== null) return NextResponse.json({ message: "User already exist", status: 400, success: false }, { status: 400, statusText: 'Bad Request' })
    const encrypted_password = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        email: body.email,
        encrypted_password
      }
    })
    if (!user) throw new Error("Error while creating user.")

    return NextResponse.json({ user: user, success: true, status: 200 }, { status: 200, statusText: 'Success' })
  } catch (error) {
    return NextResponse.json({ message: error.message, success: false }, { status: 500 })
  }
}



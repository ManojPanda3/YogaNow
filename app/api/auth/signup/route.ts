import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { randomBytes } from 'node:crypto'

export async function POST(request: Request) {
  try {
    if (!prisma) throw new Error("Unable to initiate database")

    const body = await request.json()
    if (!(body.email && body.password)) {
      return NextResponse.json({ message: "Email and password is required", status: 400, success: false }, { status: 400, statusText: 'Bad Request' })
    }
    const exisiting_user = prisma.user.findFirst({
      where: {
        email: body.email
      }
    })
    if (exisiting_user !== null) return NextResponse.json({ message: "User already exist", status: 400, success: false }, { status: 400, statusText: 'Bad Request' })
    const salt = randomBytes(21).toString('hex');
    const encrypted_password = ((await bcrypt.hash(body.password, salt)) + '|' + salt);

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



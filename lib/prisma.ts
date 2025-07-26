import { PrismaClient } from "./generated/prisma/client"
export const prisma: null | PrismaClient = (window.document ? null : new PrismaClient())

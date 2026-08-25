import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL || 'postgresql://postgres:postgres@localhost:5432/tagad_db?schema=public';
}

const prisma = new PrismaClient();

export default prisma;

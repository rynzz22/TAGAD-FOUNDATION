import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

let isDbAvailable = false;
let connectionTested = false;

// If DATABASE_URL is not set or points to localhost/placeholder without a real server, track state
const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
const isPlaceholderUrl = !dbUrl || dbUrl.includes('[YOUR-PROJECT-REF]') || dbUrl.includes('localhost:5432');

if (!process.env.DATABASE_URL && dbUrl) {
  process.env.DATABASE_URL = dbUrl;
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

/**
 * Checks if the PostgreSQL database is reachable and ready for queries.
 */
export async function testDatabaseConnection(): Promise<boolean> {
  if (connectionTested) {
    return isDbAvailable;
  }
  
  if (isPlaceholderUrl) {
    isDbAvailable = false;
    connectionTested = true;
    return false;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbAvailable = true;
  } catch {
    isDbAvailable = false;
  } finally {
    connectionTested = true;
  }
  return isDbAvailable;
}

export function isDatabaseConnected(): boolean {
  return isDbAvailable;
}

// Initial test in background
if (!isPlaceholderUrl) {
  testDatabaseConnection().catch(() => {
    isDbAvailable = false;
  });
} else {
  connectionTested = true;
  isDbAvailable = false;
}

export default prisma;


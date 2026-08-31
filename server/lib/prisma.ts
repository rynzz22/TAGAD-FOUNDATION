import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

let isDbAvailable = false;
let connectionTested = false;

// If DATABASE_URL is not set or points to localhost/placeholder without a real server, track state
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL || 'postgresql://postgres:postgres@localhost:5432/tagad?schema=public';
}
const dbUrl = process.env.DATABASE_URL || '';
const isPlaceholderUrl =
  !dbUrl ||
  dbUrl.includes('[YOUR-PROJECT-REF]') ||
  dbUrl.includes('localhost:5432') ||
  dbUrl.includes('placeholder') ||
  dbUrl.includes('dummy');

// Instantiate PrismaClient with clean logging to prevent unformatted stdout/stderr clutter
const prisma = new PrismaClient({
  log: [],
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
    // Attempt lightweight query with timeout protection
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
    ]);
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

export function setDatabaseConnected(connected: boolean): void {
  isDbAvailable = connected;
  connectionTested = true;
}

// Initial test in background
if (!isPlaceholderUrl) {
  testDatabaseConnection().catch(() => {
    isDbAvailable = false;
    connectionTested = true;
  });
} else {
  connectionTested = true;
  isDbAvailable = false;
}

export default prisma;



import { PrismaClient } from './prisma/generated/client/client.ts';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';

async function main() {
  process.env.DATABASE_URL = "file:./dev.db";
  try {
    const dbPath = path.join(process.cwd(), 'dev.db');
    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
    
    console.log('Adapter created');
    
    const prisma = new PrismaClient({ adapter });
    
    console.log('PrismaClient created');
    
    const count = await prisma.ticket.count();
    
    console.log('Count:', count);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

main();

import { PrismaClient } from './prisma/generated/client/client.ts';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';

async function main() {
  const dbPath = path.join(process.cwd(), 'dev.db');
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  const prisma = new PrismaClient({ adapter });
  
  const tickets = await prisma.ticket.findMany();
  console.log(tickets);
}

main();

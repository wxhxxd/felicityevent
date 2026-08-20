const { PrismaClient } = require('./prisma/generated/client/client.js');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');
const path = require('path');

async function main() {
  try {
    const dbPath = path.join(process.cwd(), 'dev.db');
    const sqlite = new Database(dbPath);
    const adapter = new PrismaBetterSqlite3(sqlite);
    
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

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

try {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });
  console.log('Works!', typeof prisma);
} catch (e) {
  console.log('Failed:', e.message);
}

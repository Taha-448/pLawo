const { PrismaClient } = require('@prisma/client');
try {
  const prisma = new PrismaClient({});
  console.log("Works!");
} catch(e) {
  console.log("Error:", e.message);
}

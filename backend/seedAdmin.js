const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function run() {
  const salt = await bcrypt.genSalt(10);
  const h = await bcrypt.hash('password123', salt);
  
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@demo.com',
      name: 'System Admin',
      password: h,
      role: 'ADMIN'
    }
  });

  console.log('Admin user seeded securely.');
}

run().catch(console.error).finally(()=> prisma.$disconnect());

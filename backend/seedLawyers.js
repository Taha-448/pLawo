const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const mockLawyers = [
  {
    email: 'lawyer1@demo.com',
    name: 'Dr. Ayesha Khan',
    password: 'password123',
    profile: {
      specialization: 'Family Law',
      city: 'Lahore',
      bio: 'Dr. Ayesha Khan is a distinguished family law expert with over 12 years of experience handling complex divorce, custody, and inheritance cases. She is known for her compassionate approach and excellent track record.',
      fees: 5000,
      isVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'
    }
  },
  {
    email: 'lawyer2@demo.com',
    name: 'Barrister Ahmed Malik',
    password: 'password123',
    profile: {
      specialization: 'Corporate Law',
      city: 'Karachi',
      bio: 'Barrister Ahmed Malik specializes in corporate mergers, acquisitions, and commercial disputes. His clients include leading Pakistani corporations and multinational enterprises.',
      fees: 8000,
      isVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
    }
  },
  {
    email: 'lawyer3@demo.com',
    name: 'Advocate Zainab Hussain',
    password: 'password123',
    profile: {
      specialization: 'Criminal Law',
      city: 'Islamabad',
      bio: 'Advocate Zainab Hussain is a fierce courtroom advocate with extensive experience in criminal defense and white-collar crime cases. She has successfully defended numerous high-profile clients.',
      fees: 6000,
      isVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400'
    }
  },
  {
    email: 'lawyer4@demo.com',
    name: 'Syed Muhammad Ali',
    password: 'password123',
    profile: {
      specialization: 'Property Law',
      city: 'Lahore',
      bio: 'Syed Muhammad Ali is a leading expert in property disputes, land acquisition, and real estate transactions. His meticulous approach ensures favorable outcomes for his clients.',
      fees: 7000,
      isVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    }
  },
  {
    email: 'lawyer5@demo.com',
    name: 'Advocate Farah Noor',
    password: 'password123',
    profile: {
      specialization: 'Human Rights Law',
      city: 'Karachi',
      bio: 'Advocate Farah Noor is passionate about social justice and has dedicated her career to defending the rights of marginalized communities and fighting discrimination.',
      fees: 4500,
      isVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'
    }
  },
  {
    email: 'lawyer6@demo.com',
    name: 'Barrister Hassan Raza',
    password: 'password123',
    profile: {
      specialization: 'Tax Law',
      city: 'Islamabad',
      bio: 'Barrister Hassan Raza provides expert counsel on tax planning, compliance, and disputes with tax authorities. He represents both individuals and corporations.',
      fees: 7500,
      isVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'
    }
  }
];

async function main() {
  console.log('Seeding database with photos...');
  for (const lawyerData of mockLawyers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: lawyerData.email }
    });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(lawyerData.password, salt);

      const user = await prisma.user.create({
        data: {
          name: lawyerData.name,
          email: lawyerData.email,
          password: hashedPassword,
          role: 'LAWYER',
          lawyerProfile: {
            create: {
              specialization: lawyerData.profile.specialization,
              city: lawyerData.profile.city,
              bio: lawyerData.profile.bio,
              fees: lawyerData.profile.fees,
              isVerified: lawyerData.profile.isVerified,
              profilePhoto: lawyerData.profile.profilePhoto
            }
          }
        }
      });
      console.log(`Created lawyer: ${user.name}`);
    } else {
      console.log(`Lawyer ${lawyerData.email} already exists, updating their profile photo...`);
      await prisma.user.update({
        where: { email: lawyerData.email },
        data: {
          lawyerProfile: {
            update: { 
              isVerified: true,
              profilePhoto: lawyerData.profile.profilePhoto
            }
          }
        }
      });
    }
  }
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

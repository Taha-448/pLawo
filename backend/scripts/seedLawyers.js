const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');

const lawyers = [
  {
    name: 'Advocate Ahmed Khan',
    email: 'ahmed.khan@plawo.com',
    specialization: 'Criminal Law',
    city: 'Islamabad',
    bio: 'Senior advocate with over 15 years of experience in high-court criminal litigation and bail matters.',
    fees: 5000,
    years_of_experience: 15,
    education: 'LL.B from Punjab University, LL.M from University of London',
    office_address: 'F-7 Markaz, Blue Area, Islamabad',
    is_verified: true,
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  },
  {
    name: 'Sarah Malik',
    email: 'sarah.malik@plawo.com',
    specialization: 'Family Law',
    city: 'Lahore',
    bio: 'Dedicated family lawyer specializing in divorce, child custody, and inheritance disputes.',
    fees: 3500,
    years_of_experience: 8,
    education: 'LL.B (Hons) from LUMS',
    office_address: 'Gulberg III, Near Liberty Market, Lahore',
    is_verified: true,
    profile_photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
  },
  {
    name: 'Zain Ul Abidin',
    email: 'zain.law@plawo.com',
    specialization: 'Corporate Law',
    city: 'Karachi',
    bio: 'Expert in company registration, SECP compliance, and contractual disputes for startups and SMEs.',
    fees: 8000,
    years_of_experience: 12,
    education: 'LL.B from Karachi University, Barrister-at-Law (Lincoln\'s Inn)',
    office_address: 'I.I. Chundrigar Road, Karachi',
    is_verified: true,
    profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  },
  {
    name: 'Fatima Sheikh',
    email: 'fatima.s@plawo.com',
    specialization: 'Property Law',
    city: 'Rawalpindi',
    bio: 'Specialist in land acquisition, transfer of property, and LDA/RDA related legal complexities.',
    fees: 4500,
    years_of_experience: 10,
    education: 'LL.B from Quaid-e-Azam University',
    office_address: 'Bahria Town Phase 7, Rawalpindi',
    is_verified: true,
    profile_photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
  },
  {
    name: 'Bilal Siddiqui',
    email: 'bilal.s@plawo.com',
    specialization: 'Tax Law',
    city: 'Peshawar',
    bio: 'FBR specialist handling income tax filings, audits, and sales tax appeals for businesses.',
    fees: 6000,
    years_of_experience: 7,
    education: 'LL.B from Peshawar University',
    office_address: 'University Road, Peshawar',
    is_verified: true,
    profile_photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
  }
];

const seedLawyers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Cleanup existing dummy lawyers to avoid duplicates
    console.log('Cleaning up existing dummy lawyers...');
    const dummyEmails = lawyers.map(l => l.email);
    const usersToDelete = await User.find({ email: { $in: dummyEmails } });
    const userIdsToDelete = usersToDelete.map(u => u._id);
    
    await LawyerProfile.deleteMany({ user_id: { $in: userIdsToDelete } });
    await User.deleteMany({ email: { $in: dummyEmails } });

    for (const lawyerData of lawyers) {
      // 1. Create User
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Lawyer123!', salt);

      const user = await User.create({
        name: lawyerData.name,
        email: lawyerData.email,
        password: hashedPassword,
        role: 'LAWYER',
      });

      // 2. Create Lawyer Profile
      await LawyerProfile.create({
        user_id: user._id,
        specialization: lawyerData.specialization,
        city: lawyerData.city,
        bio: lawyerData.bio,
        fees: lawyerData.fees,
        years_of_experience: lawyerData.years_of_experience,
        education: lawyerData.education,
        office_address: lawyerData.office_address,
        is_verified: lawyerData.is_verified,
        profile_photo: lawyerData.profile_photo,
        rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
      });


      console.log(`✅ Seeded: ${lawyerData.name}`);
    }

    console.log('\nAll lawyers seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding lawyers:', error);
    process.exit(1);
  }
};

seedLawyers();

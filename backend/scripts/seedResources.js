const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Resource = require('../models/Resource');

const seedResources = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for resource seeding...');

    // Clear existing
    await Resource.deleteMany({});

    const resources = [
      {
        title: 'Understanding Property Rights in Pakistan',
        category: 'Property Law',
        description: 'A comprehensive guide to buying, selling, and inheriting property under Pakistani law.',
        content: 'Full content here...',
        author: 'Advocate Taha'
      },
      {
        title: 'Family Law: Marriage and Divorce Acts',
        category: 'Family Law',
        description: 'An overview of the Muslim Family Laws Ordinance and its implications on domestic life.',
        content: 'Full content here...',
        author: 'Legal Expert Ali'
      },
      {
        title: 'Corporate Compliance for New Startups',
        category: 'Corporate Law',
        description: 'How to register your business with SECP and maintain legal standing in Pakistan.',
        content: 'Full content here...',
        author: 'pLawo Corporate Team'
      }
    ];

    await Resource.insertMany(resources);
    console.log('✅ Legal Resources seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding resources:', error);
    process.exit(1);
  }
};

seedResources();

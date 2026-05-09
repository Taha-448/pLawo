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
        content: `Property law in Pakistan is primarily governed by the Transfer of Property Act, 1882 and the Registration Act, 1908. Understanding these laws is crucial for anyone engaging in real estate transactions.

Key Aspects:
1. Sale Deed (Bayan): The most common method of transferring property. It must be registered with the Sub-Registrar to be legally binding.
2. Inheritance: Succession is governed by personal laws (Shariah for Muslims), which dictate fixed shares for heirs.
3. Verification: Always verify the "Fard" from the Patwari or the Land Record Management Information System (LRMIS) before purchasing.
4. Taxes: Be aware of Gain Tax, Stamp Duty, and Town Tax applicable at the time of transfer.`,
        author: 'Advocate Taha'
      },
      {
        title: 'Family Law: Marriage and Divorce Acts',
        category: 'Family Law',
        description: 'An overview of the Muslim Family Laws Ordinance and its implications on domestic life.',
        content: `Family matters in Pakistan are governed by the Muslim Family Laws Ordinance (MFLO), 1961. This law provides the framework for marriage registration, polygamy, and dissolution of marriage.

Important Provisions:
1. Nikahnama: The mandatory legal document for marriage registration. Every section should be filled carefully, especially the right of divorce (Talaq-e-Tafweez).
2. Khula: A woman's right to seek divorce through the court.
3. Maintenance: The husband is legally bound to provide maintenance to his wife and children during the marriage and during the Iddat period after divorce.
4. Guardianship: Governed by the Guardians and Wards Act, 1890, focusing on the welfare of the minor.`,
        author: 'Legal Expert Ali'
      },
      {
        title: 'Corporate Compliance for New Startups',
        category: 'Corporate Law',
        description: 'How to register your business with SECP and maintain legal standing in Pakistan.',
        content: `Registering a company in Pakistan is done through the Securities and Exchange Commission of Pakistan (SECP) under the Companies Act, 2017.

Steps for Startups:
1. Name Reservation: Ensure your business name is unique and not prohibited.
2. Incorporation: File the Memorandum and Articles of Association.
3. NTN Registration: Obtain your National Tax Number from the FBR.
4. Annual Compliance: File Form A and Form 29 annually to update the SECP on director changes and shareholding.
5. Intellectual Property: Protect your brand by registering trademarks with the IPO Pakistan.`,
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

const { PrismaClient } = require('@prisma/client');
const { getLegalCategory } = require('../services/aiService');

const prisma = new PrismaClient();

const smartSearch = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Problem description is required.' });
  }

  try {
    // 1. Ask Gemini to classify the problem
    const aiResult = await getLegalCategory(description);
    const category = aiResult.category;

    // 3. Query the database for Verified Lawyers with this specialization
    // If it's "Other", we'll just fetch all lawyers or general practitioners
    const matchingLawyers = await prisma.user.findMany({
      where: {
        role: 'LAWYER',
        lawyerProfile: {
          isVerified: true,
          specialization: {
            contains: (category === "Other" || !category) ? "" : category
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        lawyerProfile: true 
      }
    });

    res.status(200).json({
      aiAssignedCategory: aiResult.category,
      aiAnalysis: aiResult.analysis,
      aiApplicableLaws: aiResult.applicableLaws,
      lawyers: matchingLawyers
    });
    
  } catch (error) {
    console.error('Smart search error:', error);
    res.status(500).json({ message: 'Failed to complete smart search due to server error.' });
  }
};

module.exports = {
  smartSearch
};

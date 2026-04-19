const { supabase } = require('../config/supabase');
const { getLegalCategory } = require('../services/aiService');

const smartSearch = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Problem description is required.' });
  }

  try {
    // 1. Ask AI to classify the problem
    const aiResult = await getLegalCategory(description);
    const category = aiResult.category;

    // 2. Query Supabase for Verified Lawyers with this specialization
    let query = supabase
      .from('User')
      .select('id, name, email, lawyerProfile:LawyerProfile!inner(*)')
      .eq('role', 'LAWYER')
      .eq('LawyerProfile.isVerified', true);

    if (category && category !== "Other") {
      query = query.ilike('LawyerProfile.specialization', `%${category}%`);
    }

    const { data: matchingLawyers, error } = await query;

    if (error) throw error;

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

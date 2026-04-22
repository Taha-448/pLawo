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

    // 2. Query Supabase for Verified Lawyers
    const keywords = aiResult.searchKeywords || [];
    
    let query = supabase
      .from('users')
      .select('id, name, email, lawyer_profile:lawyer_profiles!inner(*)')
      .eq('role', 'LAWYER')
      .eq('lawyer_profiles.is_verified', true);

    if (category && category !== "Other") {
      const orConditions = [
        `specialization.ilike.%${category}%`,
        `bio.ilike.%${category}%`
      ];
      
      keywords.forEach(kw => {
        orConditions.push(`specialization.ilike.%${kw}%`);
        orConditions.push(`bio.ilike.%${kw}%`);
      });

      query = query.or(orConditions.join(','), { foreignTable: 'lawyer_profiles' });
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

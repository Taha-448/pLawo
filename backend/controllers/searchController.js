const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');
const { getLegalCategory } = require('../services/aiService');

// ─────────────────────────────────────────────────────────────────────────────
// smartSearch
// Uses AI to classify the user's legal issue and then performs a fuzzy search
// across verified lawyer profiles using Mongoose regex.
// ─────────────────────────────────────────────────────────────────────────────
const smartSearch = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Problem description is required.' });
  }

  try {
    // 1. Ask AI to classify the problem and provide keywords
    const aiResult = await getLegalCategory(description);
    const category = aiResult.category;
    const keywords = aiResult.searchKeywords || [];

    // 2. Build the MongoDB Query
    let profileQuery = { is_verified: true };

    if (category && category !== "Other") {
      // Create a list of regex patterns for the category and all keywords
      const searchPatterns = [category, ...keywords].map(term => new RegExp(term, 'i'));

      // Search in both 'specialization' and 'bio' fields
      profileQuery.$or = [
        { specialization: { $in: searchPatterns } },
        { bio: { $in: searchPatterns } }
      ];
    }

    // 3. Execute Query and Populate User Info
    const matchingProfiles = await LawyerProfile.find(profileQuery)
      .populate('user_id', 'name email');

    // 4. Format the response for the frontend
    const lawyers = matchingProfiles.map(profile => ({
      id: profile.user_id._id,
      name: profile.user_id.name,
      email: profile.user_id.email,
      lawyer_profile: profile
    }));

    res.status(200).json({
      aiAssignedCategory: aiResult.category,
      aiAnalysis: aiResult.analysis,
      aiApplicableLaws: aiResult.applicableLaws,
      lawyers: lawyers
    });
    
  } catch (error) {
    console.error('Smart search error:', error);
    res.status(500).json({ message: 'Failed to complete smart search due to server error.' });
  }
};

module.exports = {
  smartSearch
};

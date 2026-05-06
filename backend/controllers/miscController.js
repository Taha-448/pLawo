const Resource = require('../models/Resource');
const Message = require('../models/Message');

// ─────────────────────────────────────────────────────────────────────────────
// getResources
// Fetches all dynamic legal guides and news.
// ─────────────────────────────────────────────────────────────────────────────
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// submitMessage
// Saves contact form submissions to the database.
// ─────────────────────────────────────────────────────────────────────────────
const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const newMessage = await Message.create({ name, email, subject, message });
    res.status(201).json({ message: 'Your message has been sent successfully!', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting message' });
  }
};

module.exports = {
  getResources,
  submitMessage
};

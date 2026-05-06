const Availability = require('../models/Availability');

// ─────────────────────────────────────────────────────────────────────────────
// setAvailability
// Deletes a lawyer's old schedule and replaces it with a new one.
// Expects an array of slots: { day_of_week, start_time, end_time }
// ─────────────────────────────────────────────────────────────────────────────
const setAvailability = async (req, res) => {
  try {
    const lawyerId = req.user.userId;
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: 'Availability must be an array' });
    }

    // 1. Delete existing availability for this lawyer
    await Availability.deleteMany({ lawyer_id: lawyerId });

    // 2. Prepare and Insert new availability
    const availabilityToInsert = availability.map(slot => ({
      lawyer_id: lawyerId,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time
    }));

    const data = await Availability.insertMany(availabilityToInsert);

    res.status(200).json({ message: 'Availability updated successfully', data });
  } catch (error) {
    console.error('Error setting availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getLawyerAvailability
// Returns the weekly schedule for a specific lawyer, sorted by day and time.
// ─────────────────────────────────────────────────────────────────────────────
const getLawyerAvailability = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    const availability = await Availability.find({ lawyer_id: lawyerId })
      .sort({ day_of_week: 1, start_time: 1 });

    res.status(200).json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  setAvailability,
  getLawyerAvailability
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLawyers = async (req, res) => {
  try {
    const lawyers = await prisma.user.findMany({
      where: {
        role: 'LAWYER',
        lawyerProfile: {
          isVerified: true,
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        lawyerProfile: true,
      }
    });
    res.status(200).json(lawyers);
  } catch (error) {
    console.error('Error fetching lawyers', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLawyerById = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = parseInt(id);

    const lawyer = await prisma.user.findFirst({
      where: {
        id: lawyerId,
        role: 'LAWYER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        lawyerProfile: true,
        reviewsAsLawyer: {
          include: {
            client: { select: { name: true } }
          }
        }
      }
    });

    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }
    
    res.status(200).json(lawyer);
  } catch (error) {
    console.error('Error fetching lawyer by ID', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLawyerProfile = async (req, res) => {
  try {
    const { specialization, city, bio, fees } = req.body;
    const userId = req.user.userId;

    const updatedProfile = await prisma.lawyerProfile.update({
      where: { userId: userId },
      data: {
        specialization,
        city,
        bio,
        fees: parseFloat(fees) || 0.00
      }
    });

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating lawyer profile', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getLawyers,
  getLawyerById,
  updateLawyerProfile
};

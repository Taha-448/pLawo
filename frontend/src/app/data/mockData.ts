// Mock data store for the pLawo platform

export interface Lawyer {
  id: string;
  fullName: string;
  specialization: string;
  city: string;
  yearsOfExperience: number;
  consultationFee: number;
  rating: number;
  verified: boolean;
  barLicenseNumber: string;
  education: string;
  bio: string;
  profilePhoto: string;
  availability: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  lawyerId: string;
  clientName: string;
  lawyerName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  legalIssue?: string;
  review?: {
    rating: number;
    comment: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'client' | 'lawyer' | 'admin';
  name: string;
}

// Mock lawyers data
export const mockLawyers: Lawyer[] = [
  {
    id: 'L001',
    fullName: 'Dr. Ayesha Khan',
    specialization: 'Family Law',
    city: 'Lahore',
    yearsOfExperience: 12,
    consultationFee: 5000,
    rating: 4.9,
    verified: true,
    barLicenseNumber: 'LHR-2012-4567',
    education: 'LLB from Punjab University, LLM from Oxford University',
    bio: 'Dr. Ayesha Khan is a distinguished family law expert with over 12 years of experience handling complex divorce, custody, and inheritance cases. She is known for her compassionate approach and excellent track record.',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    availability: ['2026-04-10 10:00', '2026-04-10 14:00', '2026-04-11 11:00', '2026-04-12 15:00'],
  },
  {
    id: 'L002',
    fullName: 'Barrister Ahmed Malik',
    specialization: 'Corporate Law',
    city: 'Karachi',
    yearsOfExperience: 15,
    consultationFee: 8000,
    rating: 4.8,
    verified: true,
    barLicenseNumber: 'KHI-2009-2341',
    education: 'LLB from Karachi University, Bar-at-Law from Lincoln\'s Inn',
    bio: 'Barrister Ahmed Malik specializes in corporate mergers, acquisitions, and commercial disputes. His clients include leading Pakistani corporations and multinational enterprises.',
    profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    availability: ['2026-04-09 09:00', '2026-04-10 16:00', '2026-04-11 10:00', '2026-04-14 14:00'],
  },
  {
    id: 'L003',
    fullName: 'Advocate Zainab Hussain',
    specialization: 'Criminal Law',
    city: 'Islamabad',
    yearsOfExperience: 10,
    consultationFee: 6000,
    rating: 4.7,
    verified: true,
    barLicenseNumber: 'ISB-2014-7890',
    education: 'LLB from Quaid-e-Azam University, LLM in Criminal Justice',
    bio: 'Advocate Zainab Hussain is a fierce courtroom advocate with extensive experience in criminal defense and white-collar crime cases. She has successfully defended numerous high-profile clients.',
    profilePhoto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    availability: ['2026-04-10 13:00', '2026-04-11 09:00', '2026-04-12 11:00', '2026-04-15 15:00'],
  },
  {
    id: 'L004',
    fullName: 'Syed Muhammad Ali',
    specialization: 'Property Law',
    city: 'Lahore',
    yearsOfExperience: 18,
    consultationFee: 7000,
    rating: 4.9,
    verified: true,
    barLicenseNumber: 'LHR-2006-1234',
    education: 'LLB from Government College University, Specialized in Property Rights',
    bio: 'Syed Muhammad Ali is a leading expert in property disputes, land acquisition, and real estate transactions. His meticulous approach ensures favorable outcomes for his clients.',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    availability: ['2026-04-09 10:00', '2026-04-10 11:00', '2026-04-13 14:00', '2026-04-14 16:00'],
  },
  {
    id: 'L005',
    fullName: 'Advocate Farah Noor',
    specialization: 'Human Rights Law',
    city: 'Karachi',
    yearsOfExperience: 8,
    consultationFee: 4500,
    rating: 4.6,
    verified: true,
    barLicenseNumber: 'KHI-2016-5678',
    education: 'LLB from IBA Karachi, Human Rights Certificate from UN',
    bio: 'Advocate Farah Noor is passionate about social justice and has dedicated her career to defending the rights of marginalized communities and fighting discrimination.',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    availability: ['2026-04-10 10:00', '2026-04-11 14:00', '2026-04-12 09:00', '2026-04-13 15:00'],
  },
  {
    id: 'L006',
    fullName: 'Barrister Hassan Raza',
    specialization: 'Tax Law',
    city: 'Islamabad',
    yearsOfExperience: 14,
    consultationFee: 7500,
    rating: 4.8,
    verified: true,
    barLicenseNumber: 'ISB-2010-9012',
    education: 'LLB from LUMS, LLM in Tax Law from LSE',
    bio: 'Barrister Hassan Raza provides expert counsel on tax planning, compliance, and disputes with tax authorities. He represents both individuals and corporations.',
    profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    availability: ['2026-04-09 14:00', '2026-04-10 15:00', '2026-04-11 10:00', '2026-04-14 11:00'],
  },
];

// Mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'A001',
    clientId: 'C001',
    lawyerId: 'L001',
    clientName: 'Sarah Ahmed',
    lawyerName: 'Dr. Ayesha Khan',
    date: '2026-04-15',
    time: '10:00 AM',
    status: 'confirmed',
    legalIssue: 'Custody dispute case',
  },
  {
    id: 'A002',
    clientId: 'C001',
    lawyerId: 'L002',
    clientName: 'Sarah Ahmed',
    lawyerName: 'Barrister Ahmed Malik',
    date: '2026-03-20',
    time: '2:00 PM',
    status: 'completed',
    legalIssue: 'Contract review for business',
    review: {
      rating: 5,
      comment: 'Excellent service and very professional. Highly recommended!',
    },
  },
  {
    id: 'A003',
    clientId: 'C002',
    lawyerId: 'L001',
    clientName: 'Ali Hassan',
    lawyerName: 'Dr. Ayesha Khan',
    date: '2026-04-08',
    time: '11:00 AM',
    status: 'pending',
    legalIssue: 'Divorce consultation',
  },
];

// Mock user (for demo purposes)
export let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

// Mock pending lawyer verification
export const mockPendingLawyers = [
  {
    id: 'L007',
    fullName: 'Advocate Bilal Siddiqui',
    email: 'bilal.siddiqui@email.com',
    specialization: 'Labor Law',
    city: 'Lahore',
    barLicenseNumber: 'LHR-2018-3456',
    licenseDocument: 'bar-license-bilal.pdf',
    submittedDate: '2026-04-02',
  },
  {
    id: 'L008',
    fullName: 'Advocate Mariam Khan',
    email: 'mariam.khan@email.com',
    specialization: 'Intellectual Property',
    city: 'Islamabad',
    barLicenseNumber: 'ISB-2019-7654',
    licenseDocument: 'bar-license-mariam.pdf',
    submittedDate: '2026-04-03',
  },
];

// Analytics mock data
export const mockAnalytics = {
  totalAppointments: 156,
  activeClients: 89,
  activeLawyers: 6,
  pendingVerifications: 2,
  monthlyAppointments: [
    { month: 'Oct', count: 12 },
    { month: 'Nov', count: 18 },
    { month: 'Dec', count: 25 },
    { month: 'Jan', count: 32 },
    { month: 'Feb', count: 28 },
    { month: 'Mar', count: 41 },
  ],
  specializationDistribution: [
    { name: 'Family Law', value: 35 },
    { name: 'Corporate Law', value: 28 },
    { name: 'Criminal Law', value: 20 },
    { name: 'Property Law', value: 17 },
  ],
};

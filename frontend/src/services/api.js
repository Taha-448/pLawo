import { supabase } from '../config/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = async (isMultipart = false) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const searchApi = {
  smartSearch: async (description) => {
    const response = await fetch(`${API_URL}/search/smart`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ description }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Network response was not ok');
    }
    return response.json();
  },
};

export const authApi = {
  // Now only handles backend syncing/profile completion
  completeLawyerProfile: async (formData) => {
    const response = await fetch(`${API_URL}/auth/register-lawyer`, {
      method: 'POST',
      headers: await getAuthHeaders(true),
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to complete lawyer profile');
    }
    return response.json();
  }
};

export const lawyerApi = {
  getLawyers: async () => {
    const response = await fetch(`${API_URL}/lawyers`, { headers: await getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch lawyers');
    return response.json();
  },
  getLawyerById: async (id) => {
    const response = await fetch(`${API_URL}/lawyers/${id}`, { headers: await getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch lawyer profile');
    return response.json();
  },
  updateLawyerProfile: async (formData) => {
    const response = await fetch(`${API_URL}/lawyers/profile`, {
      method: 'PUT',
      headers: await getAuthHeaders(true),
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update profile');
    }
    return response.json();
  }
};

export const appointmentApi = {
  create: async (data) => {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to book appointment');
    }
    return response.json();
  },
  getMyAppointments: async () => {
    const response = await fetch(`${API_URL}/appointments`, { headers: await getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },
  getBookedSlots: async (lawyerId) => {
    const response = await fetch(`${API_URL}/appointments/lawyer/${lawyerId}`);
    if (!response.ok) throw new Error('Failed to fetch booked slots');
    return response.json();
  },
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
  }
};

export const adminApi = {
  getDashboard: async (timeRange = '6months') => {
    const response = await fetch(`${API_URL}/admin/dashboard?timeRange=${timeRange}`, { headers: await getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },
  verifyLawyer: async (id) => {
    const response = await fetch(`${API_URL}/admin/verify/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to verify lawyer');
    return response.json();
  },
  getLicenseUrl: async (lawyerId) => {
    const response = await fetch(`${API_URL}/admin/license/${lawyerId}`, {
      headers: await getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch license URL');
    return response.json();
  }
};

export const availabilityApi = {
  getLawyerAvailability: async (lawyerId) => {
    const response = await fetch(`${API_URL}/availability/${lawyerId}`);
    if (!response.ok) throw new Error('Failed to fetch availability');
    return response.json();
  },
  setAvailability: async (availability) => {
    const response = await fetch(`${API_URL}/availability`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ availability }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update availability');
    }
    return response.json();
  }
};

export const reviewApi = {
  create: async (data) => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit review');
    }
    return response.json();
  },
  getLawyerReviews: async (lawyerId) => {
    const response = await fetch(`${API_URL}/reviews/lawyer/${lawyerId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  }
};

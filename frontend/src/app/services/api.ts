const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const searchApi = {
  smartSearch: async (description: string) => {
    const response = await fetch(`${API_URL}/search/smart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  login: async (credentials: any) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },
  registerClient: async (data: any) => {
    const response = await fetch(`${API_URL}/auth/register-client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },
  registerLawyer: async (data: any) => {
    // If data is FormData, don't set Content-Type (browser will set it with boundary)
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_URL}/auth/register-lawyer`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(err.message || 'Registration failed');
    }
    return response.json();
  }
};

export const lawyerApi = {
  getLawyers: async () => {
    const response = await fetch(`${API_URL}/lawyers`, { headers: getAuthHeaders() });
    return response.json();
  },
  getLawyerById: async (id: string | number) => {
    const response = await fetch(`${API_URL}/lawyers/${id}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch lawyer');
    return response.json();
  },
  updateProfile: async (data: any) => {
    const response = await fetch(`${API_URL}/lawyers/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }
};

export const appointmentApi = {
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to book appointment');
    return response.json();
  },
  getMyAppointments: async () => {
    const response = await fetch(`${API_URL}/appointments`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },
  updateStatus: async (id: string | number, status: string) => {
    const response = await fetch(`${API_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
  }
};

export const adminApi = {
  getDashboard: async (timeRange: string = '6months') => {
    const response = await fetch(`${API_URL}/admin/dashboard?timeRange=${timeRange}`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },
  verifyLawyer: async (id: string | number) => {
    const response = await fetch(`${API_URL}/admin/verify/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to verify lawyer');
    return response.json();
  }
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/vault_api';

export const api = {
  // Exchange Conference SN6 Merchandise API
  async getExchangeConferenceSN6Merchandise(eventId = null) {
    // Only fetch SN6 merchandise for the SN6 event
    if (eventId && eventId !== 'f47ac10b-58cc-4372-a567-0e02b2c3d479') {
      return { results: [], count: 0 };
    }
    
    const response = await fetch(`${API_BASE_URL}exchange-sn6-merchandise/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Exchange Conference SN6 merchandise data');
    }
    
    return response.json();
  }
};

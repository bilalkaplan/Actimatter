import api from './api';

const registrationService = {
  registerToEvent: async (eventId) => {
    const response = await api.post(`/registrations/event/${eventId}`);
    return response.data;
  },
  updateRegistrationStatus: async (registrationId, status) => {
    const response = await api.put(`/registrations/${registrationId}/status`, { status });
    return response.data;
  },
  getMyRegistrations: async () => {
    const response = await api.get('/registrations/my');
    return response.data;
  },
  getRegistrationsByEventId: async (eventId) => {
    const response = await api.get(`/registrations/event/${eventId}/list`);
    return response.data;
  }
};

export default registrationService;

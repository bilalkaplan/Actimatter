import api from './api';

const registrationService = {
  registerToEvent: async (eventId) => {
    const response = await api.post(`/registrations/event/${eventId}`);
    return response.data;
  },
  updateRegistrationStatus: async (registrationId, status) => {
    const response = await api.put(`/registrations/${registrationId}/status`, { status });
    return response.data;
  }
};

export default registrationService;

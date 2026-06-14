package com.actimatter.backend.service;

import com.actimatter.backend.model.Registration;
import com.actimatter.backend.model.RegistrationStatus;

/**
 * Service interface for managing event registrations.
 * Provides methods for applying to events and updating registration statuses.
 */
public interface RegistrationService {
    
    /**
     * Registers a user to an event.
     * @param eventId The ID of the event.
     * @param userId The ID of the user registering.
     * @return The created registration instance.
     */
    Registration registerToEvent(Long eventId, Long userId);

    /**
     * Updates the status of an existing registration (e.g., APPROVE, REJECT).
     * @param registrationId The ID of the registration.
     * @param newStatus The new status to be set.
     * @return The updated registration instance.
     */
    Registration updateRegistrationStatus(Long registrationId, RegistrationStatus newStatus);

    /**
     * Gets all registrations for a specific user.
     * @param userId The ID of the user.
     * @return List of registrations.
     */
    java.util.List<Registration> getMyRegistrations(Long userId);

    /**
     * Gets all registrations for a specific event.
     * @param eventId The ID of the event.
     * @return List of registrations.
     */
    java.util.List<Registration> getRegistrationsByEventId(Long eventId);
}

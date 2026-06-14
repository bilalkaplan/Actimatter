package com.actimatter.backend.service;

import com.actimatter.backend.model.Event;
import com.actimatter.backend.model.Registration;
import com.actimatter.backend.model.RegistrationStatus;
import com.actimatter.backend.model.User;
import com.actimatter.backend.repository.EventRepository;
import com.actimatter.backend.repository.RegistrationRepository;
import com.actimatter.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementation of the {@link RegistrationService}.
 * Handles business logic for event registrations and capacity checks.
 */
@Service
public class RegistrationServiceImpl implements RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Registration registerToEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (event.getCapacity() != null) {
            long currentApprovedCount = registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.APPROVED);
            if (currentApprovedCount >= event.getCapacity()) {
                throw new RuntimeException("Event capacity is full!");
            }
        }

        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setStatus(RegistrationStatus.PENDING); // Default is PENDING

        return registrationRepository.save(registration);
    }

    @Override
    public Registration updateRegistrationStatus(Long registrationId, RegistrationStatus newStatus) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
                
        if (newStatus == RegistrationStatus.APPROVED && registration.getEvent().getCapacity() != null) {
            long currentApprovedCount = registrationRepository.countByEventIdAndStatus(registration.getEvent().getId(), RegistrationStatus.APPROVED);
            if (currentApprovedCount >= registration.getEvent().getCapacity()) {
                throw new RuntimeException("Cannot approve. Event capacity is full!");
            }
        }

        registration.setStatus(newStatus);
        return registrationRepository.save(registration);
    }
}

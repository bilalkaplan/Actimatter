package com.actimatter.backend.service;

import com.actimatter.backend.model.Event;
import com.actimatter.backend.model.Registration;
import com.actimatter.backend.model.RegistrationStatus;
import com.actimatter.backend.model.User;
import com.actimatter.backend.repository.EventRepository;
import com.actimatter.backend.repository.RegistrationRepository;
import com.actimatter.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RegistrationServiceImplTest {

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RegistrationServiceImpl registrationService;

    private User user;
    private Event event;
    private Registration registration;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(2L);
        user.setUsername("participant");

        event = new Event();
        event.setId(1L);
        event.setCapacity(2); // Small capacity for testing

        registration = new Registration();
        registration.setId(1L);
        registration.setEvent(event);
        registration.setUser(user);
        registration.setStatus(RegistrationStatus.PENDING);
    }

    @Test
    void testRegisterToEvent_Success() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(registrationRepository.countByEventIdAndStatus(1L, RegistrationStatus.APPROVED)).thenReturn(1L);
        when(registrationRepository.save(any(Registration.class))).thenReturn(registration);

        Registration savedRegistration = registrationService.registerToEvent(1L, 2L);

        assertNotNull(savedRegistration);
        assertEquals(RegistrationStatus.PENDING, savedRegistration.getStatus());
        verify(registrationRepository, times(1)).save(any(Registration.class));
    }

    @Test
    void testRegisterToEvent_CapacityFull() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        // Capacity is 2, current approved is 2
        when(registrationRepository.countByEventIdAndStatus(1L, RegistrationStatus.APPROVED)).thenReturn(2L);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            registrationService.registerToEvent(1L, 2L);
        });

        assertEquals("Event capacity is full!", exception.getMessage());
        verify(registrationRepository, never()).save(any(Registration.class));
    }

    @Test
    void testUpdateRegistrationStatus_ApproveSuccess() {
        when(registrationRepository.findById(1L)).thenReturn(Optional.of(registration));
        when(registrationRepository.countByEventIdAndStatus(1L, RegistrationStatus.APPROVED)).thenReturn(1L);
        when(registrationRepository.save(any(Registration.class))).thenReturn(registration);

        Registration updatedRegistration = registrationService.updateRegistrationStatus(1L, RegistrationStatus.APPROVED);

        assertEquals(RegistrationStatus.APPROVED, registration.getStatus());
        verify(registrationRepository, times(1)).save(registration);
    }

    @Test
    void testUpdateRegistrationStatus_ApproveWhenFull() {
        when(registrationRepository.findById(1L)).thenReturn(Optional.of(registration));
        // Capacity is 2, and 2 are already approved
        when(registrationRepository.countByEventIdAndStatus(1L, RegistrationStatus.APPROVED)).thenReturn(2L);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            registrationService.updateRegistrationStatus(1L, RegistrationStatus.APPROVED);
        });

        assertEquals("Cannot approve. Event capacity is full!", exception.getMessage());
        verify(registrationRepository, never()).save(any(Registration.class));
    }
}

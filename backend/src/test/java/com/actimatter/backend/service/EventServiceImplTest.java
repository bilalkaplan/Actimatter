package com.actimatter.backend.service;

import com.actimatter.backend.model.Event;
import com.actimatter.backend.model.User;
import com.actimatter.backend.repository.EventRepository;
import com.actimatter.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EventServiceImplTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EventServiceImpl eventService;

    private User coordinator;
    private Event event;

    @BeforeEach
    void setUp() {
        coordinator = new User();
        coordinator.setId(1L);
        coordinator.setUsername("coordinator");

        event = new Event();
        event.setId(1L);
        event.setTitle("Test Event");
        event.setDescription("Test Description");
        event.setEventDate(LocalDateTime.now().plusDays(5));
        event.setCapacity(50);
        event.setCoordinator(coordinator);
    }

    @Test
    void testCreateEvent_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(coordinator));
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        Event createdEvent = eventService.createEvent(event, 1L);

        assertNotNull(createdEvent);
        assertEquals("Test Event", createdEvent.getTitle());
        verify(userRepository, times(1)).findById(1L);
        verify(eventRepository, times(1)).save(event);
    }

    @Test
    void testCreateEvent_CoordinatorNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            eventService.createEvent(event, 1L);
        });

        assertEquals("Coordinator not found", exception.getMessage());
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void testGetAllEvents() {
        when(eventRepository.findAll()).thenReturn(Arrays.asList(event));

        List<Event> events = eventService.getAllEvents();

        assertEquals(1, events.size());
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void testGetEventById_Success() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        Event foundEvent = eventService.getEventById(1L);

        assertNotNull(foundEvent);
        assertEquals(1L, foundEvent.getId());
    }

    @Test
    void testUpdateEvent_Success() {
        Event updatedDetails = new Event();
        updatedDetails.setTitle("Updated Title");
        updatedDetails.setCapacity(100);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        Event updatedEvent = eventService.updateEvent(1L, updatedDetails);

        assertEquals("Updated Title", event.getTitle()); // It modifies the existing event instance
        assertEquals(100, event.getCapacity());
        verify(eventRepository, times(1)).save(event);
    }

    @Test
    void testDeleteEvent_Success() {
        doNothing().when(eventRepository).deleteById(1L);

        eventService.deleteEvent(1L);

        verify(eventRepository, times(1)).deleteById(1L);
    }
}

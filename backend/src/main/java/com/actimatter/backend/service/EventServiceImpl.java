package com.actimatter.backend.service;

import com.actimatter.backend.model.Event;
import com.actimatter.backend.model.User;
import com.actimatter.backend.repository.EventRepository;
import com.actimatter.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of the {@link EventService}.
 * Handles business logic for creating, updating, and retrieving events.
 */
@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public Event createEvent(Event event, Long coordinatorId) {
        User coordinator = userRepository.findById(coordinatorId)
            .orElseThrow(() -> new RuntimeException("Coordinator not found"));
        event.setCoordinator(coordinator);
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Long eventId, Event eventDetails) {
        Event event = getEventById(eventId);
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setEventDate(eventDetails.getEventDate());
        event.setLocation(eventDetails.getLocation());
        event.setCapacity(eventDetails.getCapacity());
        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    @Override
    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public List<Event> getMyEvents(Long coordinatorId) {
        return eventRepository.findByCoordinatorId(coordinatorId);
    }
}

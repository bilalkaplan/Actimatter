package com.actimatter.backend.service;

import com.actimatter.backend.model.Event;
import java.util.List;

/**
 * Service interface for managing events.
 * Provides methods for creating, updating, deleting, and retrieving events.
 */
public interface EventService {
    
    /**
     * Creates a new event.
     * @param event The event details to be created.
     * @param coordinatorId The ID of the coordinator creating the event.
     * @return The created event.
     */
    Event createEvent(Event event, Long coordinatorId);

    /**
     * Updates an existing event.
     * @param eventId The ID of the event to update.
     * @param eventDetails The new details for the event.
     * @return The updated event.
     */
    Event updateEvent(Long eventId, Event eventDetails);

    /**
     * Deletes an event by its ID.
     * @param eventId The ID of the event to delete.
     */
    void deleteEvent(Long eventId);

    /**
     * Retrieves an event by its ID.
     * @param eventId The ID of the event.
     * @return The found event.
     */
    Event getEventById(Long eventId);

    /**
     * Retrieves all events.
     * @return A list of all events.
     */
    List<Event> getAllEvents();

    /**
     * Retrieves all events for a specific coordinator.
     * @param coordinatorId The ID of the coordinator.
     * @return A list of events.
     */
    List<Event> getMyEvents(Long coordinatorId);
}

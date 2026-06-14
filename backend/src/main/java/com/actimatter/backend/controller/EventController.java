package com.actimatter.backend.controller;

import com.actimatter.backend.model.Event;
import com.actimatter.backend.service.EventService;
import com.actimatter.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // Herkese Açık (Public) Endpoint
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // Herkese Açık (Public) Endpoint
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            Event event = eventService.getEventById(id);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // Sadece Coordinator veya Admin etkinlik oluşturabilir
    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createEvent(@RequestBody Event event, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Event createdEvent = eventService.createEvent(event, userDetails.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Sadece Coordinator veya Admin etkinlik güncelleyebilir
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        try {
            Event updatedEvent = eventService.updateEvent(id, eventDetails);
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // Sadece Coordinator veya Admin etkinlik silebilir
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}

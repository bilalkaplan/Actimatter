package com.actimatter.backend.controller;

import com.actimatter.backend.model.Registration;
import com.actimatter.backend.model.RegistrationStatus;
import com.actimatter.backend.service.RegistrationService;
import com.actimatter.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    // Sisteme kayıtlı kullanıcıların etkinliğe başvurması
    @PostMapping("/event/{eventId}")
    @PreAuthorize("hasRole('PARTICIPANT') or hasRole('COORDINATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> registerToEvent(@PathVariable Long eventId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Registration registration = registrationService.registerToEvent(eventId, userDetails.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(registration);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Koordinatörlerin başvuruyu Onaylama(APPROVED) veya Reddetme(REJECTED) işlemi
    @PutMapping("/{registrationId}/status")
    @PreAuthorize("hasRole('COORDINATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateRegistrationStatus(
            @PathVariable Long registrationId, 
            @RequestBody Map<String, String> payload) {
        try {
            String statusStr = payload.get("status");
            RegistrationStatus status = RegistrationStatus.valueOf(statusStr.toUpperCase());
            
            Registration updatedRegistration = registrationService.updateRegistrationStatus(registrationId, status);
            return ResponseEntity.ok(updatedRegistration);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid status value. Use PENDING, APPROVED, or REJECTED."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}

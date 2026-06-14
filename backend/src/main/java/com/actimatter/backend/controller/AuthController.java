package com.actimatter.backend.controller;

import com.actimatter.backend.model.User;
import com.actimatter.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private com.actimatter.backend.repository.UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        try {
            String jwt = authService.authenticateUser(loginRequest.get("username"), loginRequest.get("password"));
            User user = userRepository.findByUsername(loginRequest.get("username")).orElse(null);
            String role = user != null ? user.getRole().name() : "";
            
            return ResponseEntity.ok(Map.of(
                "token", jwt, 
                "username", loginRequest.get("username"),
                "role", role
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = authService.registerUser(user);
            registeredUser.setPassword(null); // Şifre hash'ini dışarı sızdırmıyoruz
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}

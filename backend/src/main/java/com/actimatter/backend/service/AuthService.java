package com.actimatter.backend.service;

import com.actimatter.backend.model.User;

public interface AuthService {
    String authenticateUser(String username, String password);
    User registerUser(User user);
}

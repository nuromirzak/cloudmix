package com.github.nuromirzak.cloudmix.dto.response;

import com.github.nuromirzak.cloudmix.model.User;

public record UserResponse(String id, String username, User.Role role) {
    public UserResponse(User user) {
        this(user.getId().toString(), user.getUsername(), user.getRole());
    }
}

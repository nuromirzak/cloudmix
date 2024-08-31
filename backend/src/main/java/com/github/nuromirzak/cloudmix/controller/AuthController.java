package com.github.nuromirzak.cloudmix.controller;

import com.github.nuromirzak.cloudmix.dto.request.LoginRequest;
import com.github.nuromirzak.cloudmix.dto.request.RegistrationRequest;
import com.github.nuromirzak.cloudmix.dto.response.UserResponse;
import com.github.nuromirzak.cloudmix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public void register(@RequestBody RegistrationRequest request) {
        userService.createUser(request);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
}

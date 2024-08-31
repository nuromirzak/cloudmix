package com.github.nuromirzak.cloudmix.service;

import com.github.nuromirzak.cloudmix.dto.request.LoginRequest;
import com.github.nuromirzak.cloudmix.dto.request.RegistrationRequest;
import com.github.nuromirzak.cloudmix.dto.response.UserResponse;
import com.github.nuromirzak.cloudmix.model.Chat;
import com.github.nuromirzak.cloudmix.model.User;
import com.github.nuromirzak.cloudmix.repository.ChatRepository;
import com.github.nuromirzak.cloudmix.repository.UserRepository;
import com.github.nuromirzak.cloudmix.utils.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ChatRepository chatRepository;
    private final AuthenticationProvider authenticationProvider;

    @Transactional
    public void createUser(RegistrationRequest request) {
        Validator.validateRegistrationRequest(request);
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("User already exists");
        }

        String username = request.getUsername();
        String rawPassword = request.getPassword();

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user = userRepository.save(user);
        createChats(user);
    }

    private void createChats(User user) {
        List<User> users = userRepository.findAll();
        users.remove(user);

        List<Chat> chats = new ArrayList<>();
        for (User otherUser : users) {
            Chat chat = new Chat();
            chat.getParticipants().add(user);
            chat.getParticipants().add(otherUser);
            chats.add(chat);
        }
        chatRepository.saveAll(chats);
    }

    public UserResponse login(LoginRequest request) {
        Validator.validateLoginRequest(request);
        Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        if (!authentication.isAuthenticated()) {
            throw new BadCredentialsException("Invalid credentials");
        }
        User user = (User) authentication.getPrincipal();
        return new UserResponse(user.getId().toString(), user.getUsername());
    }
}

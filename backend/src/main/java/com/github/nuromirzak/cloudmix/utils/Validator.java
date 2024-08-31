package com.github.nuromirzak.cloudmix.utils;

import com.github.nuromirzak.cloudmix.dto.request.LoginRequest;
import com.github.nuromirzak.cloudmix.dto.request.RegistrationRequest;
import com.github.nuromirzak.cloudmix.exception.ValidationException;
import io.micrometer.common.util.StringUtils;
import lombok.experimental.UtilityClass;

@UtilityClass
public class Validator {
    public static void validateRegistrationRequest(RegistrationRequest request) {
        validateUsername(request.getUsername());
        validatePassword(request.getPassword());
    }

    private static void validateUsername(String username) {
        final int minLength = 3;
        if (username == null || username.length() < minLength) {
            String message = "Username must be at least " + minLength + " characters long";
            throw new ValidationException(message);
        }
    }

    private static void validatePassword(String password) {
        final int minLength = 8;
        if (password == null || password.length() < minLength) {
            String message = "Password must be at least " + minLength + " characters long";
            throw new ValidationException(message);
        }

        boolean hasLetter = false;
        boolean hasDigit = false;

        for (char ch : password.toCharArray()) {
            if (Character.isLetter(ch)) {
                hasLetter = true;
            }
            if (Character.isDigit(ch)) {
                hasDigit = true;
            }
        }

        if (!hasLetter) {
            throw new ValidationException("Password must contain at least one letter");
        }

        if (!hasDigit) {
            throw new ValidationException("Password must contain at least one digit");
        }
    }

    public static void validateLoginRequest(LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();
        if (StringUtils.isBlank(username) || StringUtils.isBlank(password)) {
            throw new ValidationException("Username and password must be provided");
        }
    }
}

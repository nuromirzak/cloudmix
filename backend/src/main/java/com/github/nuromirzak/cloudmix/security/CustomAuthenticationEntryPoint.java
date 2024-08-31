package com.github.nuromirzak.cloudmix.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.nuromirzak.cloudmix.dto.response.CustomErrorResponse;
import com.github.nuromirzak.cloudmix.utils.ExceptionTitle;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

@Log4j2
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(final HttpServletRequest request,
                         final HttpServletResponse response,
                         final AuthenticationException authException
    ) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        CustomErrorResponse customErrorResponse = new CustomErrorResponse();
        customErrorResponse.setTitle(ExceptionTitle.AUTHENTICATION);

        // Log class of exception
        log.warn("Authentication exception: {}", authException.getClass().getName());
        customErrorResponse.setDetail(authException.getMessage());

        response.getWriter().write(objectMapper.writeValueAsString(customErrorResponse));
    }
}

package com.github.nuromirzak.cloudmix.controller;

import com.github.nuromirzak.cloudmix.dto.response.CustomErrorResponse;
import com.github.nuromirzak.cloudmix.exception.ResourceNotFoundException;
import com.github.nuromirzak.cloudmix.exception.UnauthorizedAccessException;
import com.github.nuromirzak.cloudmix.exception.ValidationException;
import com.github.nuromirzak.cloudmix.utils.ExceptionTitle;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpMediaTypeException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
@Log4j2
@RequiredArgsConstructor
public class ExceptionHandlerController {
    @ExceptionHandler(value = {AuthenticationException.class})
    public ResponseEntity<Object> handleAuthException(final Exception e) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.AUTHENTICATION,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = {UnauthorizedAccessException.class})
    public ResponseEntity<Object> handleUnauthorizedException(final UnauthorizedAccessException e) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.UNAUTHORIZED_ACCESS,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {
            MethodArgumentNotValidException.class,
            IllegalArgumentException.class,
            ValidationException.class
    })
    public ResponseEntity<Object> handleValidationException(final Exception e) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.VALIDATION,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {ResourceNotFoundException.class})
    public ResponseEntity<Object> handleResourceNotFoundException(final ResourceNotFoundException e) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.NOT_FOUND,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {NoResourceFoundException.class})
    public ResponseEntity<Object> handleNoResourceFoundException(final NoResourceFoundException e) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.NOT_FOUND,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {MissingServletRequestParameterException.class})
    public ResponseEntity<Object> handleMissingServletRequestParameterException(
            final MissingServletRequestParameterException e
    ) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.VALIDATION,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {HttpRequestMethodNotSupportedException.class})
    public ResponseEntity<Object> handleHttpRequestMethodNotSupportedException(
            final HttpRequestMethodNotSupportedException e
    ) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.VALIDATION,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(value = {HandlerMethodValidationException.class})
    public ResponseEntity<Object> handleHandlerMethodValidationException(
            final HandlerMethodValidationException e
    ) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.VALIDATION,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {MaxUploadSizeExceededException.class})
    public ResponseEntity<Object> handleMaxUploadSizeExceededException(
            final MaxUploadSizeExceededException e
    ) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.VALIDATION,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {HttpMediaTypeException.class, MultipartException.class})
    public ResponseEntity<Object> handleHttpMediaTypeException(final Exception e) {
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.VALIDATION,
                e.getMessage()
        );

        return new ResponseEntity<>(customErrorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<Object> handleException(final Exception e) {
        String message = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage();
        CustomErrorResponse customErrorResponse = new CustomErrorResponse(
                ExceptionTitle.INTERNAL_SERVER_ERROR,
                message
        );

        log.error("!!!Unhandled exception!!!", e);

        return new ResponseEntity<>(customErrorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


package com.adtech.collector.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(errorBody(400, errors));
    }

    @ExceptionHandler(InvalidTenantException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidTenant(InvalidTenantException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorBody(403, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return ResponseEntity.internalServerError().body(errorBody(500, "Internal server error"));
    }

    private Map<String, Object> errorBody(int status, String message) {
        return Map.of("status", status, "message", message, "timestamp", Instant.now().toString());
    }
}

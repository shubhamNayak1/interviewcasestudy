package com.adtech.insights.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TenantAccessException.class)
    public ResponseEntity<Map<String, Object>> handleTenant(TenantAccessException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("status", 403, "message", ex.getMessage(), "timestamp", Instant.now().toString()));
    }

    @ExceptionHandler(CampaignNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(CampaignNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("status", 404, "message", ex.getMessage(), "timestamp", Instant.now().toString()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return ResponseEntity.internalServerError()
                .body(Map.of("status", 500, "message", "Internal server error", "timestamp", Instant.now().toString()));
    }
}

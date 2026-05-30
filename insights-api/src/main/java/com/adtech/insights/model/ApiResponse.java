package com.adtech.insights.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private T data;
    private String timestamp;
    private String tenantId;

    public static <T> ApiResponse<T> of(T data, String tenantId) {
        return new ApiResponse<>(data, Instant.now().toString(), tenantId);
    }
}

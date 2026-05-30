package com.adtech.insights.exception;

public class TenantAccessException extends RuntimeException {
    public TenantAccessException(String msg) {
        super(msg);
    }
}

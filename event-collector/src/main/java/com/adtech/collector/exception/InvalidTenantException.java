package com.adtech.collector.exception;

public class InvalidTenantException extends RuntimeException {
    public InvalidTenantException(String tenantId) {
        super("Unknown tenant: " + tenantId);
    }
}

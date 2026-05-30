package com.adtech.collector.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdEvent {

    private String eventId;

    @NotBlank(message = "tenantId is required")
    private String tenantId;

    @NotBlank(message = "eventType is required")
    private String eventType;     // AD_IMPRESSION | AD_CLICK | ADD_TO_CART | PRODUCT_VIEW | PRODUCT_CLICK

    private String campaignId;
    private String adId;
    private String productId;
    private String userId;
    private String sessionId;
    private String timestamp;     // ISO-8601 from client; server sets receivedAt separately

    // Device / browser context
    private String browser;
    private String os;
    private String deviceType;
    private String country;
    private String pageUrl;
    private String referrer;
}

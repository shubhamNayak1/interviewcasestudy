package com.adtech.processor.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdEvent {
    private String eventId;
    private String tenantId;
    private String eventType;
    private String campaignId;
    private String adId;
    private String productId;
    private String userId;
    private String sessionId;
    private String timestamp;
    private String browser;
    private String os;
    private String deviceType;
    private String country;
    private String pageUrl;
    private String referrer;
}

package com.adtech.insights.exception;

public class CampaignNotFoundException extends RuntimeException {
    public CampaignNotFoundException(String campaignId) {
        super("Campaign not found: " + campaignId);
    }
}

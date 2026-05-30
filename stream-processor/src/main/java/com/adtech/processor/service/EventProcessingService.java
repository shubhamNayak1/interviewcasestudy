package com.adtech.processor.service;

import com.adtech.processor.model.AdEvent;
import com.adtech.processor.repository.EventRepository;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventProcessingService {

    private static final Logger log = LoggerFactory.getLogger(EventProcessingService.class);

    private final EventRepository eventRepository;
    private final int attributionWindowMinutes;

    private final Counter processedCounter;
    private final Counter attributionCounter;
    private final Counter skippedCounter;

    public EventProcessingService(
            EventRepository eventRepository,
            @Value("${adtech.attribution.window-minutes:30}") int attributionWindowMinutes,
            MeterRegistry meterRegistry) {

        this.eventRepository = eventRepository;
        this.attributionWindowMinutes = attributionWindowMinutes;

        this.processedCounter  = Counter.builder("events_processed_total").register(meterRegistry);
        this.attributionCounter = Counter.builder("attribution_matched_total").register(meterRegistry);
        this.skippedCounter    = Counter.builder("events_skipped_total").register(meterRegistry);
    }

    @Transactional
    public void process(AdEvent event) {
        if (event.getTenantId() == null || event.getEventType() == null) {
            skippedCounter.increment();
            return;
        }

        // 1. Always persist the raw event
        eventRepository.insertRawEvent(event);

        // 2. Update aggregated metrics based on event type
        switch (event.getEventType().toUpperCase()) {
            case "AD_IMPRESSION" -> handleImpression(event);
            case "AD_CLICK"      -> handleClick(event);
            case "ADD_TO_CART"   -> handleAddToCart(event);
            default              -> log.debug("No metric update for event type: {}", event.getEventType());
        }

        processedCounter.increment();
        log.debug("Processed event type={} tenant={} session={}",
                event.getEventType(), event.getTenantId(), event.getSessionId());
    }

    private void handleImpression(AdEvent event) {
        if (event.getCampaignId() == null) return;
        eventRepository.upsertImpressions(event.getTenantId(), event.getCampaignId());
    }

    private void handleClick(AdEvent event) {
        if (event.getCampaignId() == null) return;
        eventRepository.upsertClicks(event.getTenantId(), event.getCampaignId());
    }

    private void handleAddToCart(AdEvent event) {
        // Attribution: find the last AD_CLICK in this session within the attribution window.
        // If found, credit the click-to-basket metric to that campaign.
        if (event.getSessionId() == null) return;

        eventRepository.findCampaignIdForRecentClick(
                event.getTenantId(),
                event.getSessionId(),
                attributionWindowMinutes
        ).ifPresentOrElse(
                campaignId -> {
                    eventRepository.upsertAddToCart(event.getTenantId(), campaignId);
                    attributionCounter.increment();
                    log.info("Attribution matched: ADD_TO_CART session={} → campaign={}", event.getSessionId(), campaignId);
                },
                () -> log.debug("No recent AD_CLICK found for session={} within {}min window",
                        event.getSessionId(), attributionWindowMinutes)
        );
    }
}

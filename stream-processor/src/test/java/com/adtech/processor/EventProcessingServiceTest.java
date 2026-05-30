package com.adtech.processor;

import com.adtech.processor.model.AdEvent;
import com.adtech.processor.repository.EventRepository;
import com.adtech.processor.service.EventProcessingService;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.mockito.Mockito.*;

class EventProcessingServiceTest {

    private EventRepository eventRepository;
    private EventProcessingService service;

    @BeforeEach
    void setUp() {
        eventRepository = Mockito.mock(EventRepository.class);
        service = new EventProcessingService(eventRepository, 30, new SimpleMeterRegistry());
    }

    @Test
    void adImpression_incrementsImpressions() {
        AdEvent event = event("AD_IMPRESSION", "amazon", "camp-001", "sess-1");
        service.process(event);
        verify(eventRepository).insertRawEvent(event);
        verify(eventRepository).upsertImpressions("amazon", "camp-001");
    }

    @Test
    void adClick_incrementsClicks() {
        AdEvent event = event("AD_CLICK", "amazon", "camp-001", "sess-1");
        service.process(event);
        verify(eventRepository).upsertClicks("amazon", "camp-001");
    }

    @Test
    void addToCart_withRecentClick_incrementsClickToBasket() {
        AdEvent event = event("ADD_TO_CART", "amazon", null, "sess-1");
        when(eventRepository.findCampaignIdForRecentClick("amazon", "sess-1", 30))
                .thenReturn(Optional.of("camp-001"));

        service.process(event);

        verify(eventRepository).upsertAddToCart("amazon", "camp-001");
    }

    @Test
    void addToCart_withNoRecentClick_skipsClickToBasket() {
        AdEvent event = event("ADD_TO_CART", "amazon", null, "sess-no-click");
        when(eventRepository.findCampaignIdForRecentClick("amazon", "sess-no-click", 30))
                .thenReturn(Optional.empty());

        service.process(event);

        verify(eventRepository, never()).upsertAddToCart(any(), any());
    }

    @Test
    void nullTenant_skipsProcessing() {
        AdEvent event = new AdEvent();
        event.setEventType("AD_CLICK");
        service.process(event);
        verify(eventRepository, never()).insertRawEvent(any());
    }

    private AdEvent event(String type, String tenant, String campaignId, String sessionId) {
        AdEvent e = new AdEvent();
        e.setEventId("evt-" + System.nanoTime());
        e.setEventType(type);
        e.setTenantId(tenant);
        e.setCampaignId(campaignId);
        e.setSessionId(sessionId);
        e.setTimestamp("2024-01-01T00:00:00Z");
        return e;
    }
}

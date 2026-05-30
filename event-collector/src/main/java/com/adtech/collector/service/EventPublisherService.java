package com.adtech.collector.service;

import com.adtech.collector.exception.InvalidTenantException;
import com.adtech.collector.model.AdEvent;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class EventPublisherService {

    private static final Logger log = LoggerFactory.getLogger(EventPublisherService.class);

    private final KafkaTemplate<String, AdEvent> kafkaTemplate;
    private final List<String> validTenants;

    private final Counter eventsReceived;
    private final Counter eventsPublished;
    private final Counter eventsRejected;
    private final Timer publishTimer;

    public EventPublisherService(
            KafkaTemplate<String, AdEvent> kafkaTemplate,
            @Value("${adtech.valid-tenants}") String validTenantsConfig,
            MeterRegistry meterRegistry) {

        this.kafkaTemplate = kafkaTemplate;
        this.validTenants = Arrays.asList(validTenantsConfig.split(","));

        this.eventsReceived  = Counter.builder("events_received_total").register(meterRegistry);
        this.eventsPublished = Counter.builder("events_published_total").register(meterRegistry);
        this.eventsRejected  = Counter.builder("events_rejected_total").register(meterRegistry);
        this.publishTimer    = Timer.builder("event_publish_duration").register(meterRegistry);
    }

    public void publish(AdEvent event) {
        eventsReceived.increment();

        validateTenant(event.getTenantId());
        enrichEvent(event);

        String topic = resolveTopic(event.getEventType());
        String partitionKey = resolvePartitionKey(event);

        publishTimer.record(() -> {
            kafkaTemplate.send(topic, partitionKey, event);
            eventsPublished.increment();
            log.info("Published event type={} tenant={} campaign={} topic={}",
                    event.getEventType(), event.getTenantId(), event.getCampaignId(), topic);
        });
    }

    private void validateTenant(String tenantId) {
        if (!validTenants.contains(tenantId)) {
            eventsRejected.increment();
            throw new InvalidTenantException(tenantId);
        }
    }

    private void enrichEvent(AdEvent event) {
        if (event.getEventId() == null || event.getEventId().isBlank()) {
            event.setEventId(UUID.randomUUID().toString());
        }
        if (event.getTimestamp() == null || event.getTimestamp().isBlank()) {
            event.setTimestamp(Instant.now().toString());
        }
    }

    // Route event type to correct Kafka topic
    private String resolveTopic(String eventType) {
        return switch (eventType.toUpperCase()) {
            case "AD_IMPRESSION", "AD_CLICK" -> "ad-events";
            case "ADD_TO_CART"               -> "cart-events";
            default                          -> "product-events";  // PRODUCT_VIEW, PRODUCT_CLICK
        };
    }

    // Partition key strategy:
    // ad-events    → campaign_id  (keeps campaign metrics on same partition)
    // cart-events  → session_id   (keeps session attribution on same partition)
    // product-events → product_id
    private String resolvePartitionKey(AdEvent event) {
        return switch (resolveTopic(event.getEventType())) {
            case "ad-events"      -> event.getCampaignId() != null ? event.getCampaignId() : event.getEventId();
            case "cart-events"    -> event.getSessionId()  != null ? event.getSessionId()  : event.getEventId();
            default               -> event.getProductId()  != null ? event.getProductId()  : event.getEventId();
        };
    }
}

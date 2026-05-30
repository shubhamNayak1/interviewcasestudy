package com.adtech.processor.consumer;

import com.adtech.processor.model.AdEvent;
import com.adtech.processor.service.EventProcessingService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
public class AdEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(AdEventConsumer.class);

    private final EventProcessingService processingService;

    public AdEventConsumer(EventProcessingService processingService) {
        this.processingService = processingService;
    }

    @KafkaListener(topics = "ad-events", groupId = "stream-processor-group",
                   containerFactory = "kafkaListenerContainerFactory")
    public void consumeAdEvent(ConsumerRecord<String, AdEvent> record) {
        log.debug("Consuming ad-event partition={} offset={}", record.partition(), record.offset());
        processingService.process(record.value());
    }

    @KafkaListener(topics = "product-events", groupId = "stream-processor-group",
                   containerFactory = "kafkaListenerContainerFactory")
    public void consumeProductEvent(ConsumerRecord<String, AdEvent> record) {
        log.debug("Consuming product-event partition={} offset={}", record.partition(), record.offset());
        processingService.process(record.value());
    }

    @KafkaListener(topics = "cart-events", groupId = "stream-processor-group",
                   containerFactory = "kafkaListenerContainerFactory")
    public void consumeCartEvent(ConsumerRecord<String, AdEvent> record) {
        log.debug("Consuming cart-event partition={} offset={}", record.partition(), record.offset());
        processingService.process(record.value());
    }
}

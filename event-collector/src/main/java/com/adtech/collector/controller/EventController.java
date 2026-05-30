package com.adtech.collector.controller;

import com.adtech.collector.model.AdEvent;
import com.adtech.collector.service.EventPublisherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")   // allow retail-ui to call this directly
public class EventController {

    private final EventPublisherService publisherService;

    public EventController(EventPublisherService publisherService) {
        this.publisherService = publisherService;
    }

    // Single event — used by the tracking SDK
    @PostMapping
    public ResponseEntity<Map<String, Object>> collect(@Valid @RequestBody AdEvent event) {
        publisherService.publish(event);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(Map.of(
                        "status", "accepted",
                        "eventId", event.getEventId(),
                        "timestamp", Instant.now().toString()
                ));
    }

    // Batch endpoint — useful for mobile offline sync
    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> collectBatch(@RequestBody List<@Valid AdEvent> events) {
        events.forEach(publisherService::publish);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(Map.of(
                        "status", "accepted",
                        "count", events.size(),
                        "timestamp", Instant.now().toString()
                ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "event-collector"));
    }
}

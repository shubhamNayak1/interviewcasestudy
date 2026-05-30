package com.adtech.collector.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic adEventsTopic() {
        return TopicBuilder.name("ad-events").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic productEventsTopic() {
        return TopicBuilder.name("product-events").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic cartEventsTopic() {
        return TopicBuilder.name("cart-events").partitions(3).replicas(1).build();
    }
}

package com.adtech.collector;

import com.adtech.collector.model.AdEvent;
import com.adtech.collector.service.EventPublisherService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EventControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean  EventPublisherService publisherService;

    @Test
    void collectEvent_validPayload_returns202() throws Exception {
        doNothing().when(publisherService).publish(any());

        AdEvent event = new AdEvent();
        event.setTenantId("amazon");
        event.setEventType("AD_CLICK");
        event.setCampaignId("camp-amz-001");

        mockMvc.perform(post("/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.status").value("accepted"));
    }

    @Test
    void collectEvent_missingTenantId_returns400() throws Exception {
        AdEvent event = new AdEvent();
        event.setEventType("AD_CLICK");

        mockMvc.perform(post("/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isBadRequest());
    }
}

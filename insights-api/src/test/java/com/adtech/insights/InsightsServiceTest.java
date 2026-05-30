package com.adtech.insights;

import com.adtech.insights.exception.CampaignNotFoundException;
import com.adtech.insights.exception.TenantAccessException;
import com.adtech.insights.model.CampaignMetrics;
import com.adtech.insights.repository.MetricsRepository;
import com.adtech.insights.service.InsightsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class InsightsServiceTest {

    private MetricsRepository repository;
    private InsightsService service;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(MetricsRepository.class);
        service = new InsightsService(repository, "amazon,flipkart,walmart");
    }

    @Test
    void getClicks_validTenantAndCampaign_returnsClicks() {
        when(repository.findByCampaign("amazon", "camp-001"))
                .thenReturn(Optional.of(CampaignMetrics.builder().clicks(42L).impressions(100L)
                        .addToCart(10L).ctr(0.42).clickToBasket(0.25).build()));

        assertThat(service.getClicks("amazon", "camp-001")).isEqualTo(42L);
    }

    @Test
    void getClicks_invalidTenant_throwsTenantAccessException() {
        assertThatThrownBy(() -> service.getClicks("unknown-tenant", "camp-001"))
                .isInstanceOf(TenantAccessException.class);
    }

    @Test
    void getClicks_campaignNotFound_throwsCampaignNotFoundException() {
        when(repository.findByCampaign("amazon", "missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getClicks("amazon", "missing"))
                .isInstanceOf(CampaignNotFoundException.class);
    }

    @Test
    void getClickToBasket_returnsCorrectRate() {
        when(repository.findByCampaign("flipkart", "camp-fk-001"))
                .thenReturn(Optional.of(CampaignMetrics.builder()
                        .clicks(100L).impressions(500L).addToCart(25L)
                        .ctr(0.2).clickToBasket(0.25).build()));

        assertThat(service.getClickToBasket("flipkart", "camp-fk-001")).isEqualTo(0.25);
    }
}

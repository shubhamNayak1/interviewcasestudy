package com.adtech.insights.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Aggregated metrics for an ad campaign")
public class CampaignMetrics {

    @Schema(description = "Tenant identifier", example = "amazon")
    private String tenantId;

    @Schema(description = "Campaign identifier", example = "camp-amz-001")
    private String campaignId;

    @Schema(description = "Total ad impressions", example = "1500")
    private Long impressions;

    @Schema(description = "Total ad clicks", example = "300")
    private Long clicks;

    @Schema(description = "Total add-to-cart events attributed to this campaign", example = "75")
    private Long addToCart;

    @Schema(description = "Click-through rate (clicks / impressions)", example = "0.2000")
    private Double ctr;

    @Schema(description = "Click-to-basket rate (add_to_cart / clicks)", example = "0.2500")
    private Double clickToBasket;

    @Schema(description = "Date range queried", example = "2024-01-01")
    private String date;
}

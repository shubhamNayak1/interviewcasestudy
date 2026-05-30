package com.adtech.insights.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "A single breakdown entry with label and count")
public class BreakdownItem {

    @Schema(description = "Dimension value", example = "Chrome")
    private String label;

    @Schema(description = "Event count", example = "420")
    private Long count;

    @Schema(description = "Percentage share", example = "42.0")
    private Double percentage;
}

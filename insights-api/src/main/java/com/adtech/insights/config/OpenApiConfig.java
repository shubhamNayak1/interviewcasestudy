package com.adtech.insights.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.media.StringSchema;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AdTech Insights API")
                        .version("1.0.0")
                        .description("Real-time campaign analytics for retail media networks")
                        .contact(new Contact().name("AdTech Platform")));
    }

    // Inject X-Tenant-ID as a global header shown in Swagger UI for every endpoint
    @Bean
    public OperationCustomizer globalTenantHeader() {
        return (operation, handlerMethod) -> {
            operation.addParametersItem(
                    new Parameter()
                            .in("header")
                            .name("X-Tenant-ID")
                            .description("Tenant identifier (amazon | flipkart | walmart)")
                            .required(false)   // already declared per-endpoint; this adds UI hint
                            .schema(new StringSchema().addEnumItem("amazon")
                                    .addEnumItem("flipkart").addEnumItem("walmart"))
            );
            return operation;
        };
    }
}

package com.unibus.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String[] allowedOrigins;
    private final String[] allowedOriginPatterns;

    public WebConfig(
            @Value("${unibus.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://localhost:3000,https://unibus-frontend-five.vercel.app,https://s-frontend-five.vercel.app}") String origins,
            @Value("${unibus.cors.allowed-origin-patterns:https://unibus-frontend-*-nicbely.vercel.app}") String originPatterns) {
        this.allowedOrigins = split(origins);
        this.allowedOriginPatterns = split(originPatterns);
    }

    private static String[] split(String values) {
        return Arrays.stream(values.split(","))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .toArray(String[]::new);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedOriginPatterns(allowedOriginPatterns)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("Authorization", "Content-Type", "Accept")
                .allowCredentials(true);
    }
}

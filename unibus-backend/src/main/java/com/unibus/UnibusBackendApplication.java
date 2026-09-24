package com.unibus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UnibusBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(UnibusBackendApplication.class, args);
    }
}
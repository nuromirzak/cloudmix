package com.github.nuromirzak.cloudmix;

import org.springframework.boot.SpringApplication;

public class TestCloudmixBackendApplication {

    public static void main(String[] args) {
        SpringApplication.from(CloudmixBackendApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}

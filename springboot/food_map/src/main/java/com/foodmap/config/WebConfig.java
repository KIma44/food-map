package com.foodmap.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 프로젝트 루트 아래 /uploads/ 경로를 절대 경로로 정규화
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;

        // file: 접두사와 함께 경로 설정 (Windows/Linux 모두 안전함)
        String uploadPath = "file:" + uploadDir;

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}
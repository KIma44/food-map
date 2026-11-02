package com.foodmap.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 프로젝트 루트 내 uploads 디렉터리를 외부 정적 경로로 매핑
        // File.separator 및 OS별 file: 프로토콜 호환성을 안전하게 처리
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
        File file = new File(uploadDir);

        // SecurityConfig의 /uploads/** 접근 허용과 매핑을 맞추어 /uploads/** 경로 전체 지정
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(file.toURI().toString());
    }
}
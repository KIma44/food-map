package com.foodmap.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class AiService {

    private final String FASTAPI_URL = "http://127.0.0.1:8000/api/analyze";

    /**
     * 미리 백업해 둔 바이트 데이터(ImageDataDto)를 받아 비동기로 FastAPI에 AI 분석 요청 전송
     */
    public void requestAsyncAnalysisWithPreparedData(Long reviewId, String reviewText, String userAllergies, List<ImageDataDto> preparedImages) {
        CompletableFuture.runAsync(() -> {
            try {
                RestTemplate restTemplate = new RestTemplate();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);

                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                body.add("review_id", reviewId.toString());
                body.add("review_text", reviewText);
                body.add("user_allergies", userAllergies);

                if (preparedImages != null && !preparedImages.isEmpty()) {
                    for (ImageDataDto imgDto : preparedImages) {
                        ByteArrayResource fileResource = new ByteArrayResource(imgDto.getBytes()) {
                            @Override
                            public String getFilename() {
                                return imgDto.getFilename();
                            }
                        };
                        body.add("files", fileResource);
                    }
                }

                HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
                restTemplate.postForEntity(FASTAPI_URL, requestEntity, Map.class);

            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    @Getter
    @AllArgsConstructor
    public static class ImageDataDto {
        private String filename;
        private byte[] bytes;
    }
}
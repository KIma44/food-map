package com.foodmap.controller;

import com.foodmap.dto.ReviewRequestDto;
import com.foodmap.dto.ReviewResponseDto;
import com.foodmap.security.CustomUserDetails;
import com.foodmap.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // [리뷰 작성] - "/api/reviews" 경로로 매핑됨
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createReview(
            @RequestPart("reviewDto") ReviewRequestDto dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails customUserDetails // 프로젝트에 맞는 UserDetails 구현체
    ) {
        // 인증 객체에서 userId 추출 (CustomUserDetails 구현에 맞춰 id 가져오기)
        Long userId = customUserDetails.getUserId();

        reviewService.createReview(userId, dto, images);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // [베스트 리뷰 상위 3개 조회] - 로그인 없이 누구나 가능
    @GetMapping("/top3")
    public ResponseEntity<List<ReviewResponseDto>> getTop3Reviews(@RequestParam("restaurantId") Long restaurantId) {
        List<ReviewResponseDto> topReviews = reviewService.getTop3Reviews(restaurantId);
        return ResponseEntity.ok(topReviews);
    }
}
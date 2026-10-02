package com.foodmap.controller;

import com.foodmap.dto.ReviewRequestDto;
import com.foodmap.dto.ReviewResponseDto;
import com.foodmap.security.CustomUserDetails;
import com.foodmap.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // [리뷰 작성] - 로그인한 사용자만 가능
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<String> createReview(
            @RequestPart("reviewDto") ReviewRequestDto reviewDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        // 토큰이 없거나 유효하지 않은 경우 (401 Unauthorized 반환)
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요한 서비스입니다.");
        }

        Long userId = userDetails.getUserId();
        reviewService.createReview(userId, reviewDto, images);

        return ResponseEntity.ok("리뷰가 성공적으로 등록되었습니다.");
    }

    // [베스트 리뷰 상위 3개 조회] - 로그인 없이 누구나 가능
    @GetMapping("/top3")
    public ResponseEntity<List<ReviewResponseDto>> getTop3Reviews(@RequestParam("restaurantId") Long restaurantId) {
        List<ReviewResponseDto> topReviews = reviewService.getTop3Reviews(restaurantId);
        return ResponseEntity.ok(topReviews);
    }
}
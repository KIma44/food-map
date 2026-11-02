package com.foodmap.controller;

import com.foodmap.dto.MyPageReviewResponseDto;
import com.foodmap.security.CustomUserDetails;
import com.foodmap.security.JwtTokenProvider;
import com.foodmap.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/top-reviews")
    public ResponseEntity<List<MyPageReviewResponseDto>> getMyTopReviews(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = userDetails.getUserId(); // CustomUserDetails에 구현된 메서드 활용
        List<MyPageReviewResponseDto> topReviews = myPageService.getTopLikedReviews(userId);

        return ResponseEntity.ok(topReviews);
    }
}
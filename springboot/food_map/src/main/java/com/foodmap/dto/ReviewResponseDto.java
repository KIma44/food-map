package com.foodmap.dto;

import com.foodmap.entity.Review;
import com.foodmap.entity.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDto {

    private Long reviewId;
    private Long userId;
    private String userName;
    private String email;
    private Long restaurantId;
    private String content;
    private Double rating;
    private List<String> images; // 여러 장의 이미지 URL 리스트
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // 조인을 통해 전달할 식당 정보
    private String restaurantName;     // 예: "옥상만가"
    private String restaurantCategory; // 예: "술집" (없으면 null 또는 "")

    public static ReviewResponseDto fromEntity(Review review, String userName, String email) {
        return ReviewResponseDto.builder()
                .reviewId(review.getReviewId())
                .userId(review.getUserId()) // getUser().getId() 에러 해결
                .userName(userName)
                .email(email)
                .restaurantId(review.getRestaurant().getRestaurantId())
                .content(review.getContent())
                .rating(review.getRating())
                .images(review.getImages().stream()
                        .map(ReviewImage::getImageUrl)
                        .collect(Collectors.toList()))
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
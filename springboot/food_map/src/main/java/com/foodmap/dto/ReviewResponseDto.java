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

    private boolean isLiked; // 내가 좋아요를 눌렀는지 여부
    private int likeCount;   // 총 좋아요 수

    // AI 분석 결과
    private String aiAnalysis;

    public static ReviewResponseDto fromEntity(Review review, String userName, String email, boolean isLiked) {
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
                .restaurantName(review.getRestaurant().getName())       // 식당 이름도 필요하다면 여기서 함께 매핑 확인
                .restaurantCategory(review.getRestaurant().getCategory()) // 카테고리도 함께 매핑 확인
                .likeCount(review.getLikeCount()) // 💡 엔티티에 있는 likeCount 매핑
                .isLiked(isLiked)
                .aiAnalysis(review.getAiAnalysis())
                .build();
    }
}
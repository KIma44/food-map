package com.foodmap.dto;

import com.foodmap.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDto {

    private Long reviewId;
    private Long userId;
    private String userName; // 작성자 닉네임 추가
    private Double rating;
    private String content;
    private String imageUrl;

    public static ReviewResponseDto fromEntity(Review review, String userName) {
        return ReviewResponseDto.builder()
                .reviewId(review.getReviewId())
                .userId(review.getUserId())
                .userName(userName)
                .rating(review.getRating())
                .content(review.getContent())
                .imageUrl(review.getImageUrl())
                .build();
    }
}
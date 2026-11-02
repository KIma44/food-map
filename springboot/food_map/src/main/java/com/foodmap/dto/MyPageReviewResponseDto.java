package com.foodmap.dto;

import com.foodmap.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class MyPageReviewResponseDto {
    private Long reviewId;
    private String restaurantName;
    private String content;
    private int likeCount;
    private String createdAt;
    private List<String> imageUrls;
    public static MyPageReviewResponseDto from(Review review) {
        // ReviewImage 엔티티에서 이미지 URL/경로를 추출한다고 가정
        List<String> urls = review.getImages() != null
                ? review.getImages().stream().map(img -> img.getImageUrl()).collect(Collectors.toList())
                : List.of();

        return new MyPageReviewResponseDto(
                review.getReviewId(),
                review.getRestaurant().getName(),
                review.getContent(),
                review.getLikeCount(),
                review.getCreatedAt() != null ? review.getCreatedAt().toString() : null,
                urls
        );
    }
}
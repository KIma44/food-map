package com.foodmap.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDto {
    private Long placeId;      // 카카오 맵 식당 ID (restaurant_id)
    private String placeName;  // 식당 이름
    private String address;    // 식당 주소
    private String category;   // 식당 카테고리 (필요 시)
    private String phone;      // 식당 전화번호 (필요 시)
    private Double latitude;   // 위도 (필요 시)
    private Double longitude;  // 경도 (필요 시)
    private Double rating;     // 별점
    private String content;    // 리뷰 내용
}
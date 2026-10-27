package com.foodmap.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ReviewRequestDto {
    private Long placeId;      // 카카오 맵 식당 ID
    private String placeName;
    private String address;
    private String category;
    private String phone;
    private Double latitude;
    private Double longitude;
    private Double rating;     // 별점
    private String content;    // 리뷰 내용
    private List<String> keepImageUrls; //수정 시 삭제하지 않고 유지할 기존 이미지 URL 리스트
}
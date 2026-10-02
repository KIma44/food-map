package com.foodmap.service;

import com.foodmap.dto.ReviewRequestDto;
import com.foodmap.dto.ReviewResponseDto;
import com.foodmap.entity.Restaurant;
import com.foodmap.entity.Review;
import com.foodmap.repository.RestaurantRepository;
import com.foodmap.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final FileService fileService; // S3Service 대신 FileService 주입

    @Transactional
    public void createReview(Long userId, ReviewRequestDto dto, List<MultipartFile> images) {

        // 1. 식당 정보 확인 및 없으면 자동 등록 (Upsert 로직)
        Restaurant restaurant = restaurantRepository.findById(dto.getPlaceId())
                .orElseGet(() -> {
                    Restaurant newRestaurant = Restaurant.builder()
                            .restaurantId(dto.getPlaceId())
                            .name(dto.getPlaceName())
                            .address(dto.getAddress())
                            .category(dto.getCategory())
                            .phone(dto.getPhone())
                            .latitude(dto.getLatitude())
                            .longitude(dto.getLongitude())
                            .build();
                    return restaurantRepository.save(newRestaurant);
                });

        // 2. 이미지 파일 저장 처리 (첫 번째 이미지를 로컬 uploads/reviews/에 저장)
        String imageUrl = null;
        if (images != null && !images.isEmpty()) {
            imageUrl = fileService.saveFile(images.get(0));
        }

        // 3. 리뷰 엔티티 생성 및 DB 저장
        Review review = Review.builder()
                .userId(userId)
                .restaurant(restaurant)
                .content(dto.getContent())
                .rating(dto.getRating())
                .imageUrl(imageUrl)
                .build();

        reviewRepository.save(review);
    }

    // 리뷰 불러오기 상위 3 평점 기준으로
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getTop3Reviews(Long restaurantId) {
        List<Review> topReviews = reviewRepository.findTop3ByRestaurant_RestaurantIdOrderByRatingDesc(restaurantId);

        return topReviews.stream()
                .map(ReviewResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
package com.foodmap.service;

import com.foodmap.dto.ReviewRequestDto;
import com.foodmap.dto.ReviewResponseDto;
import com.foodmap.entity.Restaurant;
import com.foodmap.entity.Review;
import com.foodmap.entity.ReviewImage;
import com.foodmap.entity.User;
import com.foodmap.repository.RestaurantRepository;
import com.foodmap.repository.ReviewRepository;
import com.foodmap.repository.UserRepository;
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
    private final FileService fileService;
    private final UserRepository userRepository;

    @Transactional
    public void createReview(Long userId, ReviewRequestDto dto, List<MultipartFile> images) {

        // 1. 카카오 placeId로 식당 조회 및 없으면 새로 등록 (Upsert)
        Restaurant restaurant = restaurantRepository.findByRestaurantId(dto.getPlaceId())
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

        // 2. 리뷰 엔티티 생성
        Review review = Review.builder()
                .userId(userId)
                .restaurant(restaurant)
                .content(dto.getContent())
                .rating(dto.getRating())
                .build();

        // 3. 이미지 저장
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    String savedPath = fileService.saveFile(file);
                    ReviewImage reviewImage = ReviewImage.builder()
                            .review(review)
                            .imageUrl(savedPath)
                            .build();
                    review.addImage(reviewImage);
                }
            }
        }

        reviewRepository.save(review);
    }

    // 리뷰 불러오기 상위 3 평점 기준
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getTop3Reviews(Long restaurantId) {
        List<Review> topReviews = reviewRepository.findTop3ByRestaurant_RestaurantIdOrderByRatingDesc(restaurantId);

        return topReviews.stream()
                .map(review -> {
                    User user = userRepository.findById(review.getUserId()).orElse(null);
                    String userName = (user != null) ? user.getName() : "회원";
                    String email = (user != null) ? user.getEmail() : "";

                    return ReviewResponseDto.fromEntity(review, userName, email);
                })
                .collect(Collectors.toList());
    }

    // 리뷰 수정
    @Transactional
    public void updateReview(Long userId, Long reviewId, ReviewRequestDto dto, List<MultipartFile> images) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다. ID: " + reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new IllegalStateException("본인이 작성한 리뷰만 수정할 수 있습니다.");
        }

        // 1. 텍스트 및 평점 수정
        review.updateReview(dto.getContent(), dto.getRating());

        // 2. 기존 이미지 관계 초기화 (orphanRemoval=true에 의해 DB에서 기존 ReviewImage 엔티티 삭제)
        review.clearImages();

        // 3. 유지하기로 한 기존 이미지 URL 다시 등록
        if (dto.getKeepImageUrls() != null && !dto.getKeepImageUrls().isEmpty()) {
            for (String keepUrl : dto.getKeepImageUrls()) {
                ReviewImage reviewImage = ReviewImage.builder()
                        .review(review)
                        .imageUrl(keepUrl)
                        .build();
                review.addImage(reviewImage);
            }
        }

        // 4. 새로 업로드된 이미지 파일 저장 후 등록
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    String savedPath = fileService.saveFile(file);
                    ReviewImage reviewImage = ReviewImage.builder()
                            .review(review)
                            .imageUrl(savedPath)
                            .build();
                    review.addImage(reviewImage);
                }
            }
        }
    }
}
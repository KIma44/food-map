package com.foodmap.service;

import com.foodmap.dto.ReviewRequestDto;
import com.foodmap.dto.ReviewResponseDto;
import com.foodmap.entity.Restaurant;
import com.foodmap.entity.Review;
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
    private final FileService fileService; // S3Service 대신 FileService 주입
    private final UserRepository userRepository;

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
                .map(review -> {
                    // userId로 User 엔티티를 찾아서 name과 email을 가져옵니다.
                    User user = userRepository.findById(review.getUserId()).orElse(null);

                    String userName = (user != null) ? user.getName() : "회원";
                    String email = (user != null) ? user.getEmail() : "";

                    // 3번째 인자로 email 전달
                    return ReviewResponseDto.fromEntity(review, userName, email);
                })
                .collect(Collectors.toList());
    }

    // 리뷰 수정
    @Transactional
    public void updateReview(Long userId, Long reviewId, ReviewRequestDto dto, List<MultipartFile> images) {
        // 1. 리뷰 존재 여부 확인
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다. ID: " + reviewId));

        // 2. 본인 작성 리뷰인지 검증
        if (!review.getUserId().equals(userId)) {
            throw new IllegalStateException("본인이 작성한 리뷰만 수정할 수 있습니다.");
        }

        // 3. 새 이미지가 첨부된 경우 저장 (기존 이미지 대체)
        String imageUrl = review.getImageUrl();
        if (images != null && !images.isEmpty()) {
            imageUrl = fileService.saveFile(images.get(0));
        }

        // 4. 리뷰 수정 (Entity에 update 메소드 추가 또는 새로 생성/Setter 사용)
        review.updateReview(dto.getContent(), dto.getRating(), imageUrl);
    }
}
package com.foodmap.service;

import com.foodmap.dto.ReviewRequestDto;
import com.foodmap.dto.ReviewResponseDto;
import com.foodmap.entity.*;
import com.foodmap.repository.RestaurantRepository;
import com.foodmap.repository.ReviewRepository;
import com.foodmap.repository.UserRepository;
import com.foodmap.repository.UserAllergyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final UserAllergyRepository userAllergyRepository;
    private final AiService aiService;

    @Transactional
    public void createReview(Long userId, ReviewRequestDto dto, List<MultipartFile> images) {
        // 🚀 1. 파일 저장(fileService)보다 무조건 먼저, 톰캣 임시 파일이 사라지기 전에 바이트를 메모리에 안전하게 백업합니다.
        List<AiService.ImageDataDto> preparedImages = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    try {
                        preparedImages.add(new AiService.ImageDataDto(
                                file.getOriginalFilename(),
                                file.getBytes()
                        ));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }

        // 2. 유저 알레르기 조회
        List<UserAllergy> allergyList = userAllergyRepository.findByUser_UserId(userId);
        String userAllergies = allergyList.stream()
                .map(UserAllergy::getAllergyName)
                .collect(Collectors.joining(", "));
        if (userAllergies.isEmpty()) userAllergies = "등록된 알레르기 없음";

        // 3. 식당 조회 및 Upsert
        Restaurant restaurant = restaurantRepository.findByRestaurantId(dto.getPlaceId())
                .orElseGet(() -> restaurantRepository.save(Restaurant.builder()
                        .restaurantId(dto.getPlaceId())
                        .name(dto.getPlaceName())
                        .address(dto.getAddress())
                        .category(dto.getCategory())
                        .phone(dto.getPhone())
                        .latitude(dto.getLatitude())
                        .longitude(dto.getLongitude())
                        .build()));

        // 4. 리뷰 엔티티 생성 (ai_analysis는 "AI 분석 중입니다..."로 시작)
        Review review = Review.builder()
                .userId(userId)
                .restaurant(restaurant)
                .content(dto.getContent())
                .rating(dto.getRating())
                .aiAnalysis("AI 분석 중입니다...")
                .build();

        // 5. 실제 파일 저장
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    String savedPath = fileService.saveFile(file);
                    review.addImage(ReviewImage.builder().review(review).imageUrl(savedPath).build());
                }
            }
        }

        Review savedReview = reviewRepository.save(review);

        // 6. 미리 백업해 둔 메모리 데이터(preparedImages)를 사용해 비동기 AI 분석 요청 전송
        aiService.requestAsyncAnalysisWithPreparedData(savedReview.getReviewId(), dto.getContent(), userAllergies, preparedImages);
    }

    // AI 콜백 메서드
    @Transactional
    public void updateAiAnalysisResult(Long reviewId, String aiAnalysisResult) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다. ID: " + reviewId));
        review.updateAiAnalysis(aiAnalysisResult);
    }

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

    // 리뷰 수정 서비스
    @Transactional
    public void updateReview(Long userId, Long reviewId, ReviewRequestDto dto, List<MultipartFile> images) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다. ID: " + reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new IllegalStateException("본인이 작성한 리뷰만 수정할 수 있습니다.");
        }

        // 🚀 1. 수정 시에도 파일 저장 전 가장 먼저 바이트를 메모리에 백업합니다.
        List<AiService.ImageDataDto> preparedImages = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file != null && !file.isEmpty()) {
                    try {
                        preparedImages.add(new AiService.ImageDataDto(
                                file.getOriginalFilename(),
                                file.getBytes()
                        ));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }

        review.updateReview(dto.getContent(), dto.getRating());
        review.updateAiAnalysis("AI 분석 중입니다...");
        review.clearImages();

        if (dto.getKeepImageUrls() != null && !dto.getKeepImageUrls().isEmpty()) {
            for (String keepUrl : dto.getKeepImageUrls()) {
                ReviewImage reviewImage = ReviewImage.builder()
                        .review(review)
                        .imageUrl(keepUrl)
                        .build();
                review.addImage(reviewImage);
            }
        }

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

        List<UserAllergy> allergyList = userAllergyRepository.findByUser_UserId(userId);
        String userAllergies = allergyList.stream()
                .map(UserAllergy::getAllergyName)
                .collect(Collectors.joining(", "));
        if (userAllergies.isEmpty()) userAllergies = "등록된 알레르기 없음";

        // 미리 백업해 둔 메모리 데이터 전달
        aiService.requestAsyncAnalysisWithPreparedData(review.getReviewId(), dto.getContent(), userAllergies, preparedImages);
    }

    // 리뷰 삭제 서비스
    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리뷰입니다. ID: " + reviewId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. ID: " + userId));

        boolean isOwner = review.getUserId().equals(userId);
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalStateException("리뷰를 삭제할 권한이 없습니다.");
        }

        reviewRepository.delete(review);
    }
}
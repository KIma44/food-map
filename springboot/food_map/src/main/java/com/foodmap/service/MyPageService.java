package com.foodmap.service;

import com.foodmap.dto.MyPageReviewResponseDto;
import com.foodmap.entity.Review;
import com.foodmap.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {

    private final ReviewRepository reviewRepository;

    public List<MyPageReviewResponseDto> getTopLikedReviews(Long userId) {
        // 0번째 페이지에서 3개의 데이터만 가져오도록 PageRequest 설정
        Pageable pageable = PageRequest.of(0, 3);
        List<Review> topReviews = reviewRepository.findTop3ByUserIdOrderByLikeCountDesc(userId, pageable);

        return topReviews.stream()
                .map(MyPageReviewResponseDto::from)
                .collect(Collectors.toList());
    }
}
package com.foodmap.repository;

import com.foodmap.entity.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {

    // 특정 사용자가 특정 리뷰에 좋아요를 눌렀는지 확인
    boolean existsByUserIdAndReviewId(Long userId, Long reviewId);

    // 좋아요 취소를 위해 데이터 찾기
    Optional<ReviewLike> findByUserIdAndReviewId(Long userId, Long reviewId);
}
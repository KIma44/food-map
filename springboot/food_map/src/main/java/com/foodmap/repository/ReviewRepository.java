package com.foodmap.repository;

import com.foodmap.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByRestaurant_RestaurantId(Long restaurantId);

    List<Review> findByUserId(Long userId);

    // PlaceId 대신 Restaurant_RestaurantId 사용 (Long 타입)
    List<Review> findTop3ByRestaurant_RestaurantIdOrderByRatingDesc(Long restaurantId);

    // 마이페이지: 내가 쓴 리뷰 중 좋아요순(likeCount DESC), 최신순(createdAt DESC)으로 상위 3개 조회
    List<Review> findTop3ByUserIdOrderByLikeCountDescCreatedAtDesc(Long userId);
}
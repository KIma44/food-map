package com.foodmap.repository;

import com.foodmap.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
=======
import org.springframework.stereotype.Repository;
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

<<<<<<< HEAD
    // PlaceId 대신 Restaurant_RestaurantId 사용 (Long 타입)
    List<Review> findTop3ByRestaurant_RestaurantIdOrderByRatingDesc(Long restaurantId);

    // 특정 유저가 작성한 리뷰 중 좋아요 개수가 많은 상위 3개 조회 (N+1 문제 방지를 위해 restaurant 페치 조인 사용)
    @Query("SELECT r FROM Review r JOIN FETCH r.restaurant WHERE r.userId = :userId ORDER BY r.likeCount DESC")
    List<Review> findTop3ByUserIdOrderByLikeCountDesc(@Param("userId") Long userId, Pageable pageable);
=======
    List<Review> findByRestaurant_RestaurantId(Long restaurantId);

    List<Review> findByUserId(Long userId);

    // PlaceId 대신 Restaurant_RestaurantId 사용 (Long 타입)
    List<Review> findTop3ByRestaurant_RestaurantIdOrderByRatingDesc(Long restaurantId);

    // 마이페이지: 내가 쓴 리뷰 중 좋아요순(likeCount DESC), 최신순(createdAt DESC)으로 상위 3개 조회
    List<Review> findTop3ByUserIdOrderByLikeCountDescCreatedAtDesc(Long userId);
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
}
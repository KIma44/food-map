package com.foodmap.repository;

import com.foodmap.entity.ReviewComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {

    // 특정 리뷰의 댓글 목록을 생성일시 오름차순(오래된 댓글부터)으로 조회
    List<ReviewComment> findByReviewIdOrderByCreatedAtAsc(Long reviewId);
}
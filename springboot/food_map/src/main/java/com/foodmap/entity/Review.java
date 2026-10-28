package com.foodmap.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "review")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private Double rating;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 1:N 연관관계 추가
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReviewImage> images = new ArrayList<>();

    // 연관관계 편의 메서드
    public void addImage(ReviewImage image) {
        this.images.add(image);
        image.setReview(this); // ReviewImage 쪽에 setReview가 구현되어 있다면 추가
    }

    // 리뷰 수정 메서드
    public void updateReview(String content, Double rating) {
        this.content = content;
        this.rating = rating;
    }

    // 이미지 전체 교체용 메서드 (수정 시 사용)
    public void clearImages() {
        this.images.clear();
    }

    // AI 활용 리뷰 분석
    @Column(columnDefinition = "TEXT", name = "ai_analysis")
    private String aiAnalysis;

    // AI 활용 리뷰 콜백
    public void updateAiAnalysis(String aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    // 좋아요 개수 추가
    @Column(name = "like_count", nullable = false)
    @Builder.Default
    private Integer likeCount = 0;

    // 좋아요 개수 증가/감소 메서드
    public void increaseLikeCount() {
        this.likeCount++;
    }

    public void decreaseLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }
}
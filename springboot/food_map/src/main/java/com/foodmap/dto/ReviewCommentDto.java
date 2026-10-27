package com.foodmap.dto;

import com.foodmap.entity.ReviewComment;
import lombok.*;

import java.time.LocalDateTime;

public class ReviewCommentDto {

    // 댓글 작성 요청 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String content;
    }

    // 댓글 응답 DTO
    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long commentId;
        private Long reviewId;
        private Long userId;
        private String userEmail; // 프론트에 보여줄 작성자 이메일
        private String userName;  // 프론트에 보여줄 작성자 이름
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response fromEntity(ReviewComment comment, String userEmail, String userName) {
            return Response.builder()
                    .commentId(comment.getCommentId())
                    .reviewId(comment.getReviewId())
                    .userId(comment.getUserId())
                    .userEmail(userEmail)
                    .userName(userName)
                    .content(comment.getContent())
                    .createdAt(comment.getCreatedAt())
                    .updatedAt(comment.getUpdatedAt())
                    .build();
        }
    }
}
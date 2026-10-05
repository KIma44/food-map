package com.foodmap.controller;

import com.foodmap.dto.ReviewCommentDto;
import com.foodmap.service.ReviewCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewCommentController {

    private final ReviewCommentService commentService;

    // 특정 리뷰의 댓글 목록 조회 (GET /api/reviews/{reviewId}/comments)
    @GetMapping("/reviews/{reviewId}/comments")
    public ResponseEntity<List<ReviewCommentDto.Response>> getComments(@PathVariable Long reviewId) {
        List<ReviewCommentDto.Response> comments = commentService.getCommentsByReviewId(reviewId);
        return ResponseEntity.ok(comments);
    }

    // 댓글 작성 (POST /api/reviews/{reviewId}/comments)
    @PostMapping("/reviews/{reviewId}/comments")
    public ResponseEntity<ReviewCommentDto.Response> createComment(
            @PathVariable Long reviewId,
            @RequestBody ReviewCommentDto.Request request,
            Authentication authentication) {

        // JWT 토큰에 보관된 userEmail (authentication.getName() = "abc@gmail.com")
        String userEmail = authentication.getName();

        ReviewCommentDto.Response response = commentService.createComment(reviewId, userEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 댓글 삭제 (DELETE /api/comments/{commentId})
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {

        String userEmail = authentication.getName();

        // ROLE_ADMIN 여부 확인
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ADMIN"));

        commentService.deleteComment(commentId, userEmail, isAdmin);
        return ResponseEntity.noContent().build();
    }
}
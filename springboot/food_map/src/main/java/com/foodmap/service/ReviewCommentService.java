package com.foodmap.service;

import com.foodmap.dto.ReviewCommentDto;
import com.foodmap.entity.ReviewComment;
import com.foodmap.entity.User; // 회원 엔티티 패키지 경로
import com.foodmap.repository.ReviewCommentRepository;
import com.foodmap.repository.UserRepository; // 회원 리포지토리 패키지 경로
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewCommentService {

    private final ReviewCommentRepository commentRepository;
    private final UserRepository userRepository; // 회원 조회용 추가

    // 1. 특정 리뷰의 댓글 목록 조회 (유저 정보 포함)
    public List<ReviewCommentDto.Response> getCommentsByReviewId(Long reviewId) {
        return commentRepository.findByReviewIdOrderByCreatedAtAsc(reviewId)
                .stream()
                .map(comment -> {
                    // userId로 유저 정보(이메일, 이름) 조회
                    User user = userRepository.findById(comment.getUserId()).orElse(null);
                    String userEmail = (user != null) ? user.getEmail() : "알 수 없음";
                    String userName = (user != null) ? user.getName() : "익명";

                    return ReviewCommentDto.Response.fromEntity(comment, userEmail, userName);
                })
                .collect(Collectors.toList());
    }

    // 2. 댓글 작성 (이메일로 회원 조회 후 userId 저장)
    @Transactional
    public ReviewCommentDto.Response createComment(Long reviewId, String userEmail, ReviewCommentDto.Request request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. email: " + userEmail));

        ReviewComment comment = ReviewComment.builder()
                .reviewId(reviewId)
                .userId(user.getUserId()) // 또는 user.getId() (User 엔티티의 PK 필드명)
                .content(request.getContent())
                .build();

        ReviewComment savedComment = commentRepository.save(comment);

        return ReviewCommentDto.Response.fromEntity(savedComment, user.getEmail(), user.getName());
    }

    // 3. 댓글 삭제 (이메일 검증)
    @Transactional
    public void deleteComment(Long commentId, String userEmail, boolean isAdmin) {
        ReviewComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다. ID: " + commentId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. email: " + userEmail));

        // 작성자본인이거나 관리자(ADMIN)인 경우 삭제 허용
        boolean isOwner = comment.getUserId().equals(user.getUserId());
        if (!isOwner && !isAdmin) {
            throw new IllegalStateException("댓글 삭제 권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }

    // 댓글 수정
    @Transactional
    public ReviewCommentDto.Response updateComment(Long commentId, String userEmail, ReviewCommentDto.Request request) {
        ReviewComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다. ID: " + commentId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. email: " + userEmail));

        if (!comment.getUserId().equals(user.getUserId())) {
            throw new IllegalStateException("댓글 수정 권한이 없습니다.");
        }

        comment.updateContent(request.getContent());

        return ReviewCommentDto.Response.fromEntity(comment, user.getEmail(), user.getName());
    }
}
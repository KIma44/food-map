/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import api from '../../api/api.js';
import * as s from './styles.js';

function ReviewComment({ review, isOpen, onClose, isUserLoggedIn, currentUserEmail, isAdmin }) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // reviewId 키 명칭 예외 처리 (reviewId 또는 id)
  const reviewId = review?.reviewId || review?.id;

  useEffect(() => {
    if (isOpen && reviewId) {
      fetchComments();
    }
  }, [isOpen, reviewId]);

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    if (!reviewId) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/api/reviews/${reviewId}/comments`);
      setComments(response.data || []);
    } catch (error) {
      console.error('댓글 목록 조회 실패:', error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 등록
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      await api.post(`/api/reviews/${reviewId}/comments`, {
        content: commentInput.trim()
      });
      alert('댓글이 등록되었습니다.');
      setCommentInput('');
      fetchComments(); // 작성 후 전체 목록 동기화
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제 권한이 없거나 오류가 발생했습니다.');
    }
  };

  // 닫기 핸들러 (onClose가 함수인 경우에만 안전하게 호출)
  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  if (!isOpen || !review) return null;

  return (
    <div css={s.overlay} onClick={handleClose}>
      <div css={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <div css={s.header}>
          <h3>💬 댓글 ({comments.length})</h3>
          <button type="button" onClick={handleClose} css={s.closeBtn}>✕</button>
        </div>

        {/* 리뷰 요약 정보 */}
        <div css={s.reviewSummary}>
          <span><strong>작성자:</strong> {review.email || review.userName || review.userEmail}</span>
          <p>{review.content}</p>
        </div>

        {/* 댓글 목록 영역 */}
        <div css={s.commentList}>
          {isLoading ? (
            <p css={s.infoText}>댓글을 불러오는 중...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => {
              // 작성자 본인 여부 확인
              const isOwner = currentUserEmail && comment.userEmail === currentUserEmail;
              const canDelete = isOwner || isAdmin;

              return (
                <div key={comment.commentId} css={s.commentItem}>
                  <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div css={s.commentAuthor}>
                      {comment.userName ? `${comment.userName} (${comment.userEmail})` : comment.userEmail}
                    </div>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.commentId)}
                        css={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '12px' }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div css={s.commentContent}>{comment.content}</div>
                </div>
              );
            })
          ) : (
            <p css={s.infoText}>첫 번째 댓글을 작성해 보세요!</p>
          )}
        </div>

        {/* 댓글 작성 영역 */}
        {isUserLoggedIn ? (
          <form onSubmit={handleSubmitComment} css={s.form}>
            <input
              type="text"
              placeholder="댓글을 입력하세요..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              css={s.input}
            />
            <button type="submit" css={s.submitBtn}>등록</button>
          </form>
        ) : (
          <p css={s.infoText}>
            댓글 작성을 위해 로그인이 필요합니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default ReviewComment;
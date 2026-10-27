/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import api from '../../api/api.js';
import * as s from './styles.js';

function ReviewComment({ review, isOpen, onClose, isUserLoggedIn, currentUserEmail, isAdmin }) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editInput, setEditInput] = useState('');

  const reviewId = review?.reviewId || review?.id;

  useEffect(() => {
    if (isOpen && reviewId) {
      fetchComments();
    }
  }, [isOpen, reviewId]);

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

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      await api.post(`/api/reviews/${reviewId}/comments`, {
        content: commentInput.trim()
      });
      alert('댓글이 등록되었습니다.');
      setCommentInput('');
      fetchComments();
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  // 수정 모드 진입
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditInput(comment.content);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditInput('');
  };

  // 댓글 수정 요청
  const handleUpdateComment = async (commentId) => {
    if (!editInput.trim()) return;

    try {
      const response = await api.put(`/api/comments/${commentId}`, {
        content: editInput.trim()
      });
      setComments((prev) =>
        prev.map((c) => (c.commentId === commentId ? response.data : c))
      );
      setEditingCommentId(null);
      setEditInput('');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

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

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  if (!isOpen || !review) return null;

  return (
    <div css={s.overlay} onClick={handleClose}>
      <div css={s.modal} onClick={(e) => e.stopPropagation()}>
        <div css={s.header}>
          <h3>💬 댓글 ({comments.length})</h3>
          <button type="button" onClick={handleClose} css={s.closeBtn}>✕</button>
        </div>

        <div css={s.reviewSummary}>
          <span><strong>작성자:</strong> {review.email || review.userName || review.userEmail}</span>
          <p>{review.content}</p>
        </div>

        <div css={s.commentList}>
          {isLoading ? (
            <p css={s.infoText}>댓글을 불러오는 중...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => {
              const isOwner = currentUserEmail && comment.userEmail === currentUserEmail;
              const canDelete = isOwner || isAdmin;
              const isEditing = editingCommentId === comment.commentId;

              return (
                <div key={comment.commentId} css={s.commentItem}>
                  <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div css={s.commentAuthor}>
                      {comment.userName ? `${comment.userName} (${comment.userEmail})` : comment.userEmail}
                    </div>
                    <div css={{ display: 'flex', gap: '8px' }}>
                      {isOwner && !isEditing && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(comment)}
                          css={{ background: 'none', border: 'none', color: '#1890ff', cursor: 'pointer', fontSize: '12px' }}
                        >
                          수정
                        </button>
                      )}
                      {canDelete && !isEditing && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.commentId)}
                          css={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '12px' }}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div css={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        css={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateComment(comment.commentId)}
                        css={{ padding: '4px 12px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        css={{ padding: '4px 12px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div css={s.commentContent}>{comment.content}</div>
                  )}
                </div>
              );
            })
          ) : (
            <p css={s.infoText}>첫 번째 댓글을 작성해 보세요!</p>
          )}
        </div>

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
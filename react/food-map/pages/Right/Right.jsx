/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import * as s from './styles.js';
import RightLayout from '../../Layout/RightLayout/RightLayout.jsx';
import { useNavigate } from 'react-router-dom';
import defaultProfileImg from '/profile/기본_프로필.png';
import api from '../../api/api.js';

import ReviewComment from '../Comments/ReviewComment.jsx';

// 리뷰 이미지 슬라이더 컴포넌트
function ReviewImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImgUrl = images[currentIndex].startsWith('http')
    ? images[currentIndex]
    : `http://localhost:8080${images[currentIndex]}`;

  return (
    <div css={s.reviewImageWrapper}>
      {images.length > 1 && currentIndex > 0 && (
        <button type="button" css={s.prevBtn} onClick={handlePrev}>
          ‹
        </button>
      )}

      <img
        src={currentImgUrl}
        alt={`리뷰 사진 ${currentIndex + 1}`}
        css={s.reviewImg}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />

      {images.length > 1 && currentIndex < images.length - 1 && (
        <button type="button" css={s.nextBtn} onClick={handleNext}>
          ›
        </button>
      )}

      {images.length > 1 && (
        <span css={s.imageBadge}>
          {currentIndex + 1} / {images.length}
        </span>
      )}
    </div>
  );
}

export function Right({
  isLoggedIn,
  setIsLoggedIn,
  selectedPlace,
  placeList = [],
  onMoveToMyLocation,
  onSelectPlace,
  onSearchKeyword
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [topReviews, setTopReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // 💡 선택된 댓글 대상 리뷰 관리 상태
  const [selectedReviewForComment, setSelectedReviewForComment] = useState(null);

  const token = localStorage.getItem('accessToken');
  const isUserLoggedIn = isLoggedIn || !!token;

  const userName = localStorage.getItem('userName') || '사용자';
  const currentUserEmail = (localStorage.getItem('userEmail') || '').trim().toLowerCase();
  
  const currentUserRole = localStorage.getItem('userRole') || '';
  const isAdmin = currentUserRole === 'ROLE_ADMIN' || currentUserRole === 'ADMIN';

  const rawProfile = localStorage.getItem('userProfile');
  const profileImageUrl =
    rawProfile && rawProfile !== 'null' && rawProfile !== 'undefined' && rawProfile.trim() !== ''
      ? (rawProfile.startsWith('http') ? rawProfile : `http://localhost:8080${rawProfile}`)
      : defaultProfileImg;

  useEffect(() => {
    // 장소가 바뀔 때 댓글 화면 및 리뷰 초기화
    setSelectedReviewForComment(null);

    if (!selectedPlace) {
      setTopReviews([]);
      return;
    }

    const fetchTopReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const restaurantId = selectedPlace.id;
        const response = await api.get('/api/reviews/top3', {
          params: { restaurantId }
        });
        setTopReviews(response.data || []);
      } catch (error) {
        console.error('상위 리뷰 목록 조회 실패:', error);
        setTopReviews([]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchTopReviews();
  }, [selectedPlace]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert('검색어를 입력해 주세요.');
      return;
    }
    if (onSearchKeyword) {
      onSearchKeyword(searchTerm);
    }
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userRole');

    if (setIsLoggedIn) setIsLoggedIn(false);

    alert('로그아웃되었습니다.');
    navigate('/');
  };

  const handleGoToReviewWrite = () => {
    if (!isUserLoggedIn) {
      alert('리뷰 작성을 위해 먼저 로그인해 주세요.');
      navigate('/login');
      return;
    }

    if (!selectedPlace) return;

    navigate('/review/write', {
      state: {
        place: selectedPlace
      }
    });
  };

  const handleEditReview = (review) => {
    navigate('/review/write', {
      state: {
        place: selectedPlace,
        review: review,
        isEdit: true
      }
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/api/reviews/${reviewId}`);
      alert('리뷰가 삭제되었습니다.');
      setTopReviews((prev) => prev.filter((item) => item.reviewId !== reviewId));
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  // 💬 댓글 작성 / 보기 창으로 이동 핸들러
  const handleOpenComment = (review) => {
    setSelectedReviewForComment(review);
  };

  // 🔙 댓글 목록에서 목록/상세 보기로 돌아가기 핸들러
  const handleCloseComment = () => {
    setSelectedReviewForComment(null);
  };

  return (
    <RightLayout>
      <div css={s.container}>
        <form css={s.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="맛집 또는 음식 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div css={s.authProfileSection}>
          {isUserLoggedIn ? (
            <div css={s.profileCard} onClick={() => navigate('/myprofile')}>
              <div css={s.userInfo}>
                <img
                  src={profileImageUrl}
                  alt="프로필"
                  css={s.profileImg}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfileImg;
                  }}
                />
                <div css={s.userText}>
                  <h4>{userName}님</h4>
                  <span>마이페이지 보기 &gt;</span>
                </div>
              </div>
              <button type="button" css={s.logoutBtn} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <div css={s.authButtons}>
              <button type="button" onClick={() => navigate('/login')}>로그인</button>
              <button type="button" onClick={() => navigate('/join')}>회원가입</button>
            </div>
          )}
        </div>

        <button type="button" css={s.myLocationBtn} onClick={onMoveToMyLocation}>
          📍 내 현재 위치로 이동
        </button>

        <hr css={s.divider} />

        <div css={s.contentSection}>
          {/* 💡 선택된 리뷰가 있으면 댓글 작성/보기 화면 표시 */}
          {selectedReviewForComment ? (
            <div css={s.selectedDetailCard}>
              <button
                type="button"
                onClick={handleCloseComment}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  fontSize: '14px',
                  padding: 0
                }}
              >
                ← 베스트 리뷰 목록으로 돌아가기
              </button>

              {/* 댓글 작성 및 보기 컴포넌트 */}
              <ReviewComment
                review={selectedReviewForComment}
                isOpen={!!selectedReviewForComment} 
                onClose={handleCloseComment}
                isUserLoggedIn={isUserLoggedIn}
                isLoggedIn={isUserLoggedIn}
                currentUserEmail={currentUserEmail}
                isAdmin={isAdmin}
              />
            </div>
          ) : selectedPlace ? (
            <div css={s.selectedDetailCard}>
              <h3>{selectedPlace.name}</h3>
              <p>📍 거리: {selectedPlace.distance}</p>
              <p>📞 전화번호: {selectedPlace.phone || '정보 없음'}</p>
              <p>🏠 주소: {selectedPlace.address}</p>

              <div css={s.topReviewsBox}>
                <h4 css={s.topReviewsTitle}>⭐ 베스트 리뷰 Top 3</h4>
                {isLoadingReviews ? (
                  <p css={s.infoText}>리뷰를 가져오는 중...</p>
                ) : topReviews.length > 0 ? (
                  <div css={s.reviewList}>
                    {topReviews.map((review) => {
                      let imageList = [];
                      if (Array.isArray(review.images)) {
                        imageList = review.images.map((img) => typeof img === 'string' ? img : img.imageUrl);
                      } else if (review.imageUrl) {
                        imageList = review.imageUrl.split(',').map((url) => url.trim()).filter(Boolean);
                      }

                      const reviewEmail = (review.email || '').trim().toLowerCase();
                      const isMyReview =
                        isUserLoggedIn &&
                        currentUserEmail !== '' &&
                        reviewEmail === currentUserEmail;

                      const canDeleteReview = isUserLoggedIn && (isMyReview || isAdmin);
                      const categoryName = review.restaurantCategory || selectedPlace?.category;

                      return (
                        <div key={review.reviewId} css={s.reviewItem}>
                          <div css={s.reviewHeader}>
                            <span css={s.reviewAuthor}>{review.email}</span>
                            <span css={s.reviewRating}>★ {review.rating}</span>

                            {(isMyReview || canDeleteReview) && (
                              <div css={s.myReviewActionBtns}>
                                {isMyReview && (
                                  <button
                                    type="button"
                                    css={s.editBtn}
                                    onClick={() => handleEditReview(review)}
                                  >
                                    수정
                                  </button>
                                )}
                                {canDeleteReview && (
                                  <button
                                    type="button"
                                    css={s.deleteBtn}
                                    onClick={() => handleDeleteReview(review.reviewId)}
                                  >
                                    삭제
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 8px 0' }}>
                            <strong style={{ fontSize: '13px', color: '#333' }}>
                              {review.restaurantName || selectedPlace?.name}
                            </strong>
                            {categoryName && (
                              <span css={s.categoryTag}>
                                {categoryName}
                              </span>
                            )}
                          </div>

                          <p css={s.reviewContent}>{review.content}</p>

                          <ReviewImageSlider images={imageList} />

                          {/* 💬 댓글 작성 / 보기 창으로 이동 버튼 */}
                          <div style={{ marginTop: '10px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenComment(review)}
                              style={{
                                background: '#f0f0f0',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              💬 댓글 보기 / 작성 {review.commentCount ? `(${review.commentCount})` : ''}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p css={s.infoText}>등록된 리뷰가 없습니다.</p>
                )}
              </div>

              {isUserLoggedIn && (
                <button
                  type="button"
                  css={s.reviewWriteBtn}
                  onClick={handleGoToReviewWrite}
                >
                  ✏️ 리뷰 작성하기
                </button>
              )}
            </div>
          ) : (
            <p css={s.infoText}>지도의 맛집 마커를 클릭하여 상세 정보를 확인하세요.</p>
          )}
        </div>

        <div css={s.nearbySection}>
          <h4 css={s.sectionTitle}>지도 화면 기준 주변 맛집</h4>
          <div css={s.placeList}>
            {placeList.length > 0 ? (
              placeList.map((place) => (
                <div
                  key={place.id}
                  css={s.placeCard}
                  onClick={() => onSelectPlace && onSelectPlace(place)}
                >
                  <div css={s.placeHeader}>
                    <span css={s.placeName}>{place.name}</span>
                  </div>
                  <div css={s.placeInfo}>
                    <span css={s.categoryTag}>{place.category}</span>
                    <span> {place.distance}</span>
                  </div>
                </div>
              ))
            ) : (
              <p css={s.infoText}>주변에 검색된 맛집이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </RightLayout>
  );
}

export default Right;
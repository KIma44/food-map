/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import * as s from './styles.js';
import RightLayout from '../../Layout/RightLayout/RightLayout.jsx';
import { useNavigate } from 'react-router-dom';
import defaultProfileImg from '/profile/기본_프로필.png';
import api from '../../api/api.js';

import ReviewComment from '../Comments/ReviewComment.jsx';

// 💡 AI 분석 텍스트를 파싱하여 아이콘과 데이터로 분리하는 헬퍼 함수
const parseAiAnalysis = (text) => {
  if (!text || text === "AI 분석 중입니다...") return null;

  // 1. 맵기 숫자 추출 (0~5단계)
  const koreanSpicyMatch = text.match(/한국인\s*맵기.*?([0-5])/);
  const foreignSpicyMatch = text.match(/외국인\s*맵기.*?([0-5])/);

  // 2. 알레르기 위험도 및 원재료 추출 패턴 대응
  const allergyMatch = text.match(/알레르기\s*위험도[:\s]*(?:\[)?\s*(안전|주의|위험)\s*(?:\])?(?:\s*\((.*?)\)|\s*(.*))?/);
  
  // 3. AI 분석된 주요 성분 추출
  const ingredientMatch = text.match(/포함된\s*주요\s*성분.*?[:\]]\s*(.*?)(?:\n|$)/);

  const koreanLevel = koreanSpicyMatch ? parseInt(koreanSpicyMatch[1], 10) : 0;
  const foreignLevel = foreignSpicyMatch ? parseInt(foreignSpicyMatch[1], 10) : 0;
  
  let allergyStatus = allergyMatch ? allergyMatch[1].trim() : null;
  let allergyReason = allergyMatch ? (allergyMatch[2] || allergyMatch[3] || '').trim() : '';
  allergyReason = allergyReason.replace(/^[()]/, '').replace(/[()]$/, '').trim();

  const ingredientsText = ingredientMatch ? ingredientMatch[1].trim() : '';

  return { koreanLevel, foreignLevel, allergyStatus, allergyReason, ingredientsText };
};

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

  // 💡 마이페이지에서 수정된 알레르기 실시간 반영을 위한 상태 관리 변수
  const [userAllergies, setUserAllergies] = useState(() => {
    return JSON.parse(localStorage.getItem('userAllergies') || '[]');
  });

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

  // 1️⃣ 베스트 리뷰 목록 조회 함수
  const fetchTopReviews = async (isPolling = false) => {
    if (!selectedPlace) {
      setTopReviews([]);
      return;
    }

    try {
      if (!isPolling) setIsLoadingReviews(true);
      const restaurantId = selectedPlace.id;
      const response = await api.get('/api/reviews/top3', {
        params: { restaurantId }
      });
      
      const fetchedReviews = response.data || [];

      setTopReviews((prevReviews) => {
        return fetchedReviews.map((newRev) => {
          const oldRev = prevReviews.find((p) => p.reviewId === newRev.reviewId);
          // 백엔드에서 보내준 liked / isLiked 값을 최우선 반영
          const backendIsLiked = newRev.isLiked !== undefined ? newRev.isLiked : newRev.liked;
          
          return {
            ...newRev,
            isLiked: backendIsLiked !== undefined ? backendIsLiked : (oldRev ? oldRev.isLiked : false),
            likeCount: newRev.likeCount !== undefined ? newRev.likeCount : (oldRev ? oldRev.likeCount : 0)
          };
        });
      });
    } catch (error) {
      console.error('상위 리뷰 목록 조회 실패:', error);
      if (!isPolling) setTopReviews([]);
    } finally {
      if (!isPolling) setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    // 장소가 바뀔 때 댓글 화면 및 리뷰 초기화
    setSelectedReviewForComment(null);
    fetchTopReviews();
  }, [selectedPlace]);

  // 🚀 🌟 마이페이지에서 알레르기/프로필 수정 이벤트(userProfileUpdated) 감지 시 자동 갱신
  useEffect(() => {
    const handleProfileUpdate = () => {
      const updatedAllergies = JSON.parse(localStorage.getItem('userAllergies') || '[]');
      setUserAllergies(updatedAllergies);
      fetchTopReviews(true); // 실시간으로 알레르기 판정 리렌더링
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, [selectedPlace]);

  // 🚀 2️⃣ 실시간 폴링(Polling) 적용: "AI 분석 중입니다..." 상태인 리뷰가 존재하면 3초마다 자동 갱신
  useEffect(() => {
    const hasAnalyzingReview = topReviews.some(
      (review) => review.aiAnalysis === "AI 분석 중입니다..."
    );

    if (!hasAnalyzingReview) return; // 분석 중인 리뷰가 없으면 폴링 안 함

    const intervalId = setInterval(() => {
      fetchTopReviews(true); // 백그라운드에서 조용히 리스트 갱신
    }, 3000);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 또는 리뷰 변경 시 타이머 정리
  }, [topReviews, selectedPlace]);

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
    localStorage.removeItem('userAllergies'); // 로그아웃 시 계정 맞춤 알레르기 정보 초기화

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

  // 💖 좋아요 토글 핸들러 (본인 리뷰 사전 차단으로 400 에러 콘솔 발생 원천 차단)
  const handleToggleLike = async (review) => {
    if (!isUserLoggedIn) {
      alert('좋아요 기능은 로그인 후 이용할 수 있습니다.');
      navigate('/login');
      return;
    }

    // 💡 본인이 작성한 리뷰인지 프론트에서 사전 검사하여 API 호출 차단
    const reviewEmail = (review.email || '').trim().toLowerCase();
    const isMyReview = currentUserEmail !== '' && reviewEmail === currentUserEmail;

    if (isMyReview) {
      alert('자신이 작성한 리뷰에는 좋아요를 누를 수 없습니다.');
      return;
    }

    try {
      const response = await api.post(`/api/reviews/${review.reviewId}/like`);
      
      setTopReviews((prevReviews) =>
        prevReviews.map((item) =>
          item.reviewId === review.reviewId
            ? {
                ...item,
                likeCount: response.data.likeCount,
                isLiked: response.data.isLiked
              }
            : item
        )
      );
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
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
          {/* 선택된 리뷰가 있으면 댓글 작성/보기 화면 표시 */}
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
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {/* 💖 좋아요 버튼 및 실시간 카운트 */}
                              <button
                                type="button"
                                css={s.likeButton ? s.likeButton(review.isLiked) : undefined}
                                onClick={() => handleToggleLike(review)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  color: review.isLiked ? '#ff4757' : '#666',
                                  fontWeight: '600',
                                  padding: '4px 6px',
                                  borderRadius: '6px',
                                  transition: 'background 0.2s'
                                }}
                              >
                                {review.isLiked ? '❤️' : '🤍'} <span>{review.likeCount || 0}</span>
                              </button>

                              <span css={s.reviewRating}>★ {review.rating}</span>
                            </div>

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

                          {/* 🚀 Emotion 스타일 기반 AI 분석 시각화 박스 */}
                          {review.aiAnalysis && (
                            <div css={s.aiAnalysisBox}>
                              <div css={s.aiAnalysisTitle}>
                                <span>🤖 AI 음식 및 알레르기 분석</span>
                              </div>
                              
                              {review.aiAnalysis === "AI 분석 중입니다..." ? (
                                <div css={s.aiAnalysisText}>AI 분석 중입니다...</div>
                              ) : (
                                (() => {
                                  const parsed = parseAiAnalysis(review.aiAnalysis);
                                  
                                  if (!parsed) {
                                    return <div css={s.aiAnalysisText}>{review.aiAnalysis}</div>;
                                  }

                                  // 🚀 최신 userAllergies 상태와 실시간 비교 대조
                                  let allergyColor = '#5cb85c';
                                  let allergyBadgeText = '🟢 안전 (포함 성분 없음)';

                                  if (isUserLoggedIn) {
                                    const matchedAllergy = userAllergies.find(allergy => {
                                      const target = allergy.toLowerCase();
                                      return (
                                        (parsed.ingredientsText && parsed.ingredientsText.toLowerCase().includes(target)) ||
                                        (review.aiAnalysis && review.aiAnalysis.toLowerCase().includes(target))
                                      );
                                    });

                                    if (matchedAllergy) {
                                      allergyColor = '#d9534f';
                                      allergyBadgeText = `🔴 위험 (${matchedAllergy} 포함)`;
                                    }
                                  } else {
                                    allergyBadgeText = '🔒 로그인 후 맞춤 알레르기 확인';
                                    allergyColor = '#888888';
                                  }

                                  return (
                                    <div css={s.aiAnalysisContent}>
                                      {/* 1. 한국인 맵기 */}
                                      <div css={s.spicyRow}>
                                        <span css={s.spicyLabel}>🇰🇷 한국인 맵기:</span>
                                        <span>
                                          {parsed.koreanLevel > 0 
                                            ? '🌶️'.repeat(parsed.koreanLevel) 
                                            : '💚 순한맛'}
                                        </span>
                                        <span css={s.spicyLevelText}>({parsed.koreanLevel}/5단계)</span>
                                      </div>

                                      {/* 2. 외국인 맵기 */}
                                      <div css={s.spicyRow}>
                                        <span css={s.spicyLabel}>🌏 외국인 맵기:</span>
                                        <span>
                                          {parsed.foreignLevel > 0 
                                            ? '🌶️'.repeat(parsed.foreignLevel) 
                                            : '💚 순한맛'}
                                        </span>
                                        <span css={s.spicyLevelText}>({parsed.foreignLevel}/5단계)</span>
                                      </div>

                                      {/* 3. 계정 맞춤 알레르기 위험도 */}
                                      <div css={s.allergyRow}>
                                        <span css={s.spicyLabel}>🛡️ 맞춤 알레르기:</span>
                                        <span css={s.allergyBadge(allergyColor)}>
                                          {allergyBadgeText}
                                        </span>
                                        {parsed.ingredientsText && (
                                          <span css={s.allergyReasonText}>
                                            💡 주요 성분: {parsed.ingredientsText}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()
                              )}
                            </div>
                          )}

                          {/* 댓글 작성 / 보기 창으로 이동 버튼 */}
                          <div style={{ marginTop: '10px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenComment(review)}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #ffdcd0',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                color: '#ff6b35',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(255, 107, 53, 0.08)',
                                transition: 'all 0.2s ease'
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
              placeList.placeList?.map((place) => null) || placeList.map((place) => (
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
/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import * as s from './styles.js';
import RightLayout from '../../Layout/RightLayout/RightLayout.jsx';
import { useNavigate } from 'react-router-dom';
import defaultProfileImg from '/profile/기본_프로필.png';
import api from '../../api/api.js';

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

  // Top 3 리뷰 상태 관리
  const [topReviews, setTopReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const token = localStorage.getItem('accessToken');
  const isUserLoggedIn = isLoggedIn || !!token;

  const userName = localStorage.getItem('userName') || '사용자';
  
  // 💡 [수정] localStorage에서 로그인한 유저의 이메일 가져오기 (소문자 및 공백 처리)
  const currentUserEmail = (localStorage.getItem('userEmail') || '').trim().toLowerCase(); 
  
  const rawProfile = localStorage.getItem('userProfile');
  const profileImageUrl = 
    rawProfile && rawProfile !== 'null' && rawProfile !== 'undefined' && rawProfile.trim() !== ''
      ? (rawProfile.startsWith('http') ? rawProfile : `http://localhost:8080${rawProfile}`)
      : defaultProfileImg;

  // 선택된 맛집이 바뀔 때 평점 상위 3개 리뷰 조회
  useEffect(() => {
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

  // 검색창 입력 엔터 / Submit 핸들러
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

    if (setIsLoggedIn) setIsLoggedIn(false);

    alert('로그아웃되었습니다.');
    navigate('/');
  };

  // 리뷰 작성 페이지로 이동 핸들러
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

  // ✏️ 리뷰 수정 페이지로 이동 핸들러
  const handleEditReview = (review) => {
    navigate('/review/write', {
      state: {
        place: selectedPlace,
        review: review,
        isEdit: true
      }
    });
  };

  // 🗑️ 리뷰 삭제 핸들러
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

  return (
    <RightLayout>
      <div css={s.container}>
        {/* 1. 검색바 */}
        <form css={s.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="맛집 또는 음식 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* 2. 로그인 / 프로필 영역 */}
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

        {/* 3. 내 위치로 돌아가기 버튼 */}
        <button type="button" css={s.myLocationBtn} onClick={onMoveToMyLocation}>
          📍 내 현재 위치로 이동
        </button>

        <hr css={s.divider} />

        {/* 4. 선택된 맛집 상세 정보 & 리뷰 리스트 & 리뷰 작성 버튼 */}
        <div css={s.contentSection}>
          {selectedPlace ? (
            <div css={s.selectedDetailCard}>
              <h3>{selectedPlace.name}</h3>
              <p>📍 거리: {selectedPlace.distance}</p>
              <p>📞 전화번호: {selectedPlace.phone || '정보 없음'}</p>
              <p>🏠 주소: {selectedPlace.address}</p>

              {/* [누구나 조회 가능] 평점 높은 상위 리뷰 Top 3 표시 영역 */}
              <div css={s.topReviewsBox}>
                <h4 css={s.topReviewsTitle}>⭐ 베스트 리뷰 Top 3</h4>
                {isLoadingReviews ? (
                  <p css={s.infoText}>리뷰를 가져오는 중...</p>
                ) : topReviews.length > 0 ? (
                  <div css={s.reviewList}>
                    {topReviews.map((review) => {
                      const reviewImgUrl = review.imageUrl
                        ? (review.imageUrl.startsWith('http') 
                            ? review.imageUrl 
                            : `http://localhost:8080${review.imageUrl}`)
                        : null;

                      // 💡 [핵심 수정] 오직 이메일로만 본인 작성 여부 비교!
                      const reviewEmail = (review.email || '').trim().toLowerCase();
                      const isMyReview = isUserLoggedIn && 
                        currentUserEmail !== '' && 
                        reviewEmail === currentUserEmail;

                      return (
                        <div key={review.reviewId} css={s.reviewItem}>
                          <div css={s.reviewHeader}>
                            <span css={s.reviewAuthor}>{review.email}</span>
                            <span css={s.reviewRating}>★ {review.rating}</span>

                            {/* ✏️ 로그인한 본인의 이메일과 일치할 때만 수정/삭제 버튼 표시 */}
                            {isMyReview && (
                              <div css={s.myReviewActionBtns}>
                                <button 
                                  type="button" 
                                  css={s.editBtn} 
                                  onClick={() => handleEditReview(review)}
                                >
                                  수정
                                </button>
                                <button 
                                  type="button" 
                                  css={s.deleteBtn} 
                                  onClick={() => handleDeleteReview(review.reviewId)}
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>

                          <p css={s.reviewContent}>{review.content}</p>

                          {reviewImgUrl && (
                            <div css={s.reviewImageWrapper}>
                              <img 
                                src={reviewImgUrl} 
                                alt="리뷰 사진" 
                                css={s.reviewImg}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p css={s.infoText}>등록된 리뷰가 없습니다.</p>
                )}
              </div>

              {/* [로그인 시에만 노출] 리뷰 작성하기 버튼 */}
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

        {/* 5. 실시간 주변 맛집 리스트 */}
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
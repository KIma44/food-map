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
  const rawProfile = localStorage.getItem('userProfile');
  
  const profileImageUrl = 
    rawProfile && rawProfile !== 'null' && rawProfile !== 'undefined' && rawProfile.trim() !== ''
      ? (rawProfile.startsWith('http') ? rawProfile : `http://localhost:8080${rawProfile}`)
      : defaultProfileImg;

  // 선택된 맛집이 바뀔 때 평점 상위 3개 리뷰 조회 (비로그인 사용자도 접근 가능)
  useEffect(() => {
    if (!selectedPlace) {
      setTopReviews([]);
      return;
    }

    const fetchTopReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const restaurantId = selectedPlace.id;
        // [수정] 백엔드 @RequestParam("restaurantId") 명칭에 맞춰 params 변경
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
                      // 이미지 상대 경로가 있을 경우 백엔드 서버 URL(http://localhost:8080) 결합
                      const reviewImgUrl = review.imageUrl
                        ? (review.imageUrl.startsWith('http') 
                            ? review.imageUrl 
                            : `http://localhost:8080${review.imageUrl}`)
                        : null;

                      return (
                        <div key={review.reviewId} css={s.reviewItem}>
                          <div css={s.reviewHeader}>
                            {/* 1. 작성자 닉네임 표시 */}
                            <span css={s.reviewAuthor}>{review.userName}</span>
                            <span css={s.reviewRating}>★ {review.rating}</span>
                          </div>

                          {/* 2. 리뷰 내용 */}
                          <p css={s.reviewContent}>{review.content}</p>

                          {/* 3. 리뷰 사진 표시 (이미지 URL이 존재할 때만 렌더링) */}
                          {reviewImgUrl && (
                            <div css={s.reviewImageWrapper}>
                              <img 
                                src={reviewImgUrl} 
                                alt="리뷰 사진" 
                                css={s.reviewImg}
                                onError={(e) => {
                                  e.target.style.display = 'none'; // 이미지 불러오기 실패 시 엑박 대신 숨김
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
                    <span>• {place.distance}</span>
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
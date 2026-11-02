/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as s from './styles.js';
import api from '../../api/api'; 
import defaultProfileImg from '/profile/기본_프로필.png';

const DEFAULT_ALLERGIES = [
  '난류(계란)', '우유', '메밀', '땅콩', '대두(콩)', 
  '밀', '게', '새우', '돼지고기', '복숭아', '토마토', 
  '아황산류', '호두', '닭고기', '쇠고기', '오징어', '조개류', '잣'
];

const MyProfile = () => {
  const navigate = useNavigate();

  const savedName = localStorage.getItem('userName') || '';
  const savedProfile = localStorage.getItem('userProfile');

<<<<<<< HEAD
=======
  // api 인스턴스에 설정된 baseURL 활용 (중복 선언 제거)
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
  const getFullImageUrl = (url) => {
    if (!url || url === 'undefined' || url === 'null') return defaultProfileImg;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url;
    return `${api.defaults.baseURL}${url}`;
  };

  const [nickname, setNickname] = useState(savedName);
  const [profileImg, setProfileImg] = useState(getFullImageUrl(savedProfile));
  const [imgFile, setImgFile] = useState(null);
  
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

<<<<<<< HEAD
  // 내가 작성한 좋아요 상위 3개 리뷰 상태
  const [topReviews, setTopReviews] = useState([]);

=======
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/users/me');
        const data = response.data;

        const currentName = data.name || data.nickname;
        if (currentName) {
          setNickname(currentName);
          localStorage.setItem('userName', currentName);
        }
        if (data.profile) {
          setProfileImg(getFullImageUrl(data.profile));
          localStorage.setItem('userProfile', data.profile);
        } else {
          setProfileImg(defaultProfileImg);
        }

        if (data.allergies && Array.isArray(data.allergies)) {
          const formattedAllergies = data.allergies.map(item => {
            if (typeof item === 'object' && item !== null) {
              return {
                userAllergyId: item.userAllergyId || null,
                allergyName: item.allergyName,
                isCustom: item.isCustom ?? !DEFAULT_ALLERGIES.includes(item.allergyName)
              };
            }
            return {
              userAllergyId: null,
              allergyName: item,
              isCustom: !DEFAULT_ALLERGIES.includes(item)
            };
          }).filter(item => item.allergyName);

          setSelectedAllergies(formattedAllergies);
<<<<<<< HEAD
=======

          // 💡 초기 로딩 시에도 내 알레르기 목록을 localStorage에 저장해둡니다.
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
          const initialAllergyNames = formattedAllergies.map(a => a.allergyName);
          localStorage.setItem('userAllergies', JSON.stringify(initialAllergyNames));
        }
      } catch (error) {
        console.error('내 정보 조회 실패:', error);
      }
    };

<<<<<<< HEAD
    // 좋아요 상위 3개 리뷰 조회 함수
    const fetchTopReviews = async () => {
      try {
        const response = await api.get('/api/mypage/top-reviews');
        setTopReviews(response.data);
      } catch (error) {
        console.error('인기 리뷰 조회 실패:', error);
      }
    };

    fetchUserData();
    fetchTopReviews();
=======
    fetchUserData();
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setProfileImg(URL.createObjectURL(file));
    }
  };

  const toggleAllergy = (name) => {
    const exists = selectedAllergies.some(a => a.allergyName === name);
    if (exists) {
      setSelectedAllergies(prev => prev.filter(a => a.allergyName !== name));
    } else {
      setSelectedAllergies(prev => [
        ...prev, 
        { userAllergyId: null, allergyName: name, isCustom: false }
      ]);
    }
  };

  const handleAddCustomAllergy = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;

    const exists = selectedAllergies.some(a => a.allergyName === trimmed);
    if (!exists) {
      setSelectedAllergies(prev => [
        ...prev, 
        { userAllergyId: null, allergyName: trimmed, isCustom: true }
      ]);
      setCustomInput('');
    }
  };

  const handleRemoveAllergy = (targetName) => {
    setSelectedAllergies(prev => prev.filter(a => a.allergyName !== targetName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', nickname);
    
    if (imgFile) {
      formData.append('profileImage', imgFile);
    }

    formData.append('allergies', JSON.stringify(selectedAllergies));

    try {
      const response = await api.put('/api/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = response.data;

      if (updatedUser.name) localStorage.setItem('userName', updatedUser.name);
      if (updatedUser.profile) localStorage.setItem('userProfile', updatedUser.profile);

<<<<<<< HEAD
=======
      // 💡 저장할 알레르기 이름 리스트를 추출합니다.
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
      let allergyNames = [];
      if (updatedUser && updatedUser.allergies && Array.isArray(updatedUser.allergies)) {
        allergyNames = updatedUser.allergies.map(item => 
          typeof item === 'object' && item !== null ? item.allergyName : item
        ).filter(Boolean);
      } else {
        allergyNames = selectedAllergies.map(item => item.allergyName).filter(Boolean);
      }

<<<<<<< HEAD
      localStorage.setItem('userAllergies', JSON.stringify(allergyNames));
      window.dispatchEvent(new Event('userProfileUpdated'));

      alert('프로필이 성공적으로 수정되었습니다.');
=======
      // 🌟 최신 알레르기 목록을 localStorage('userAllergies')에 갱신
      localStorage.setItem('userAllergies', JSON.stringify(allergyNames));

      // 🌟 메인 화면(Right.jsx)으로 알레르기 변경 이벤트 전파
      window.dispatchEvent(new Event('userProfileUpdated'));

      alert('프로필이 성공적으로 수정되었습니다.');
      
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
      navigate(-1);
    } catch (error) {
      console.error('수정 실패:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div css={s.container}>
      {/* 뒤로 가기 버튼 헤더 */}
      <div css={s.header}>
        <button type="button" css={s.backButton} onClick={() => navigate(-1)} aria-label="뒤로 가기">
          ←
        </button>
        <h2 css={s.title}>프로필 및 알레르기 설정</h2>
      </div>

      <form css={s.form} onSubmit={handleSubmit}>
        {/* 프로필 이미지 */}
        <div css={s.authProfileSection}>
          <div css={s.imageWrapper}>
            <img 
              css={s.avatar} 
              src={profileImg} 
              alt="프로필 이미지" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultProfileImg;
              }} 
            />
            <label css={s.uploadLabel} htmlFor="profile-upload">변경</label>
            <input 
              css={s.hiddenFileInput}
              id="profile-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>
        </div>

        {/* 닉네임 */}
        <div css={s.inputGroup}>
          <label css={s.label}>닉네임</label>
          <input 
            css={s.input}
            type="text" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            placeholder="닉네임을 입력하세요"
            required
          />
        </div>

        {/* 알레르기 설정 */}
        <div css={s.allergySection}>
          <label css={s.label}>알레르기 정보</label>
          <p css={s.subText}>선택하신 알레르기 성분이 포함된 식당/메뉴에 경고 표시가 제공됩니다.</p>

          <div css={s.selectedBadgeWrapper}>
            {selectedAllergies.map(item => (
              <span key={item.allergyName} css={s.badge}>
                {item.allergyName}
                <button 
                  type="button" 
                  css={s.removeBtn} 
                  onClick={() => handleRemoveAllergy(item.allergyName)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div css={s.chipGroup}>
            {DEFAULT_ALLERGIES.map(item => {
              const isSelected = selectedAllergies.some(a => a.allergyName === item);
              return (
                <button 
                  key={item} 
                  type="button"
                  css={s.chip(isSelected)}
                  onClick={() => toggleAllergy(item)}
                >
                  {item}
                </button>
              );
            })}
            <button 
              type="button"
              css={s.chip(isCustomOpen)}
              onClick={() => setIsCustomOpen(!isCustomOpen)}
            >
              + 기타 (직접 입력)
            </button>
          </div>

          {isCustomOpen && (
            <div css={s.customInputGroup}>
              <input 
                css={s.input}
                type="text" 
                placeholder="기타 알레르기명 입력 (예: 과일, 젓갈)" 
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomAllergy();
                  }
                }}
              />
              <button type="button" css={s.addButton} onClick={handleAddCustomAllergy}>
                추가
              </button>
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* 내가 작성한 리뷰 중 좋아요 상위 3개 섹션 */}
        <div css={s.allergySection} style={{ marginTop: '30px' }}>
          <label css={s.label}>❤️ 내가 작성한 인기 리뷰 (TOP 3)</label>
          <p css={s.subText}>가장 많은 좋아요를 받은 나의 리뷰입니다.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            {topReviews.length === 0 ? (
              <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                작성한 리뷰가 없거나 받은 좋아요가 없습니다.
              </p>
            ) : (
              topReviews.map((review) => (
                <div 
                  key={review.reviewId}
                  style={{
                    padding: '14px',
                    border: '1px solid #e1e1e1',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>
                      📍 {review.restaurantName}
                    </span>
                    <span style={{ fontSize: '13px', color: '#ff4b4b', fontWeight: '600' }}>
                      ❤️ {review.likeCount}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: '14px', color: '#555', margin: '2px 0', lineHeight: '1.4' }}>
                    {review.content}
                  </p>

                  {/* 리뷰 이미지 썸네일 영역 */}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', overflowX: 'auto' }}>
                      {review.imageUrls.map((imgUrl, idx) => (
                        <img 
                          key={idx}
                          src={imgUrl.startsWith('http') ? imgUrl : `http://localhost:8080${imgUrl}`}
                          alt="리뷰 이미지"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #ddd'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '11px', color: '#999', textAlign: 'right' }}>
                    {review.createdAt ? review.createdAt.replace('T', ' ').substring(0, 16) : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

=======
>>>>>>> e023bf613bd1b9fc0746e53dfc7b540188e23dc6
        <button type="submit" css={s.submitButton}>저장하기</button>
      </form>
    </div>
  );
};

export default MyProfile;
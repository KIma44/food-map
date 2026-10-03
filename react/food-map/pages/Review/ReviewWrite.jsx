/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as s from './styles.js';
import api from '../../api/api.js';
import ReviewLayout from '../../Layout/ReviewLayout/ReviewLayout.jsx';

export function ReviewWrite() {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달받은 맛집 정보 및 수정 관련 정보 추출
  const place = location.state?.place;
  const review = location.state?.review; // 수정 시 전달되는 기존 리뷰 데이터
  const isEdit = location.state?.isEdit || false; // 수정 모드 여부

  // [수정 모드 지원] 기존 리뷰 정보가 전달되면 초기값으로 세팅
  const [rating, setRating] = useState(isEdit && review ? review.rating : 5);
  const [content, setContent] = useState(isEdit && review ? review.content : '');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [수정 모드 지원] 기존 등록된 이미지가 있다면 미리보기에 세팅
  useEffect(() => {
    if (isEdit && review?.imageUrl) {
      const fullImageUrl = review.imageUrl.startsWith('http')
        ? review.imageUrl
        : `http://localhost:8080${review.imageUrl}`;
      setImagePreviews([fullImageUrl]);
    }
  }, [isEdit, review]);

  // 맛집 정보 없이 예외 접근 시 처리
  if (!place) {
    return (
      <ReviewLayout>
        <div css={s.container}>
          <p>선택된 맛집 정보가 없습니다.</p>
          <button type="button" onClick={() => navigate('/')}>메인으로 돌아가기</button>
        </div>
      </ReviewLayout>
    );
  }

  // 별점 클릭 핸들러
  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert('사진은 최대 5장까지 첨부할 수 있습니다.');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index) => {
    // 기존에 있던 서버 이미지를 지운 경우와 새로 추가한 로컬 파일을 지운 경우 모두 고려
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('리뷰 내용을 작성해 주세요.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Restaurant 자동 등록 및 Review 저장을 위한 데이터
      const reviewData = {
        placeId: place.id ? parseInt(place.id, 10) : null, 
        placeName: place.place_name || place.name || '',
        address: place.road_address_name || place.address || '',
        category: place.category_name || place.category || '',
        phone: place.phone || '',
        latitude: place.y ? parseFloat(place.y) : (place.latitude ? parseFloat(place.latitude) : null),
        longitude: place.x ? parseFloat(place.x) : (place.longitude ? parseFloat(place.longitude) : null),
        rating: Number(rating),
        content: content,
      };

      formData.append(
        'reviewDto',
        new Blob([JSON.stringify(reviewData)], { type: 'application/json' })
      );

      images.forEach((image) => {
        formData.append('images', image);
      });

      // ✏️ [분기 처리] 수정 모드(isEdit)일 때는 PUT 요청, 작성일 때는 POST 요청
      if (isEdit && review) {
        await api.put(`/api/reviews/${review.reviewId}`, formData);
        alert('리뷰가 성공적으로 수정되었습니다!');
      } else {
        await api.post('/api/reviews', formData);
        alert('리뷰가 성공적으로 등록되었습니다!');
      }

      navigate(-1);
    } catch (error) {
      console.error(isEdit ? '리뷰 수정 실패:' : '리뷰 등록 실패:', error);
      alert(isEdit ? '리뷰 수정 중 오류가 발생했습니다.' : '리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReviewLayout>
      <div css={s.container}>
        <div css={s.header}>
          {/* ✏️ 수정 모드 여부에 맞춰 제목 표시 */}
          <h2>{isEdit ? '리뷰 수정' : '리뷰 작성'}</h2>
          <button type="button" css={s.closeBtn} onClick={() => navigate(-1)}>✕</button>
        </div>

        <div css={s.placeCard}>
          <h3>{place.place_name || place.name}</h3>
          <p>{place.road_address_name || place.address}</p>
        </div>

        <form onSubmit={handleSubmit} css={s.form}>
          <div css={s.section}>
            <label css={s.label}>평점</label>
            <div css={s.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  css={s.star(star <= rating)}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
              <span css={s.ratingText}>{rating}점</span>
            </div>
          </div>

          <div css={s.section}>
            <label css={s.label}>리뷰 내용</label>
            <textarea
              css={s.textarea}
              rows="6"
              placeholder="음식의 맛, 분위기, 서비스 등에 대해 솔직하게 작성해 주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div css={s.section}>
            <label css={s.label}>사진 첨부 (최대 5장)</label>
            <div css={s.imageUploadArea}>
              <label css={s.uploadBtn}>
                📷 사진 추가
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>

              <div css={s.previewList}>
                {imagePreviews.map((src, index) => (
                  <div key={index} css={s.previewItem}>
                    <img src={src} alt={`미리보기 ${index + 1}`} />
                    <button
                      type="button"
                      css={s.removeBtn}
                      onClick={() => handleRemoveImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" css={s.submitBtn} disabled={isSubmitting}>
            {/* ✏️ 수정 모드 여부에 맞춰 버튼 텍스트 변경 */}
            {isSubmitting ? '처리 중...' : isEdit ? '수정 완료' : '작성 완료'}
          </button>
        </form>
      </div>
    </ReviewLayout>
  );
}

export default ReviewWrite;
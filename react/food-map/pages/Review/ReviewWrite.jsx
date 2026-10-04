/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as s from './styles.js';
import api from '../../api/api.js';
import ReviewLayout from '../../Layout/ReviewLayout/ReviewLayout.jsx';

export function ReviewWrite() {
  const navigate = useNavigate();
  const location = useLocation();

  const place = location.state?.place;
  const review = location.state?.review;
  const isEdit = location.state?.isEdit || false;

  const [rating, setRating] = useState(isEdit && review ? review.rating : 5);
  const [content, setContent] = useState(isEdit && review ? review.content : '');
  
  // 기존 서버 이미지 중 남겨둘 URL 목록
  const [existingImages, setExistingImages] = useState([]);
  // 새로 추가할 로컬 File 객체 목록
  const [newFiles, setNewFiles] = useState([]);
  // 미리보기 표시용 객체 목록 [{ id, src, isExisting }]
  const [previews, setPreviews] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [수정 모드] 기존 등록된 이미지 미리보기 세팅
  useEffect(() => {
    if (isEdit && review) {
      let urls = [];
      if (Array.isArray(review.imageUrls)) {
        urls = review.imageUrls;
      } else if (Array.isArray(review.images)) {
        urls = review.images.map((img) => (typeof img === 'string' ? img : img.imageUrl));
      } else if (review.imageUrl) {
        urls = review.imageUrl.split(',').map((url) => url.trim()).filter(Boolean);
      }

      setExistingImages(urls);
      
      const initialPreviews = urls.map((url, idx) => ({
        id: `existing-${idx}`,
        src: url.startsWith('http') ? url : `http://localhost:8080${url}`,
        originalUrl: url,
        isExisting: true
      }));
      setPreviews(initialPreviews);
    }
  }, [isEdit, review]);

  // 장소 정보가 없으면 예외 처리
  const targetPlace = place || (review ? {
    id: review.restaurantId,
    place_name: review.restaurantName || '선택한 식당',
    road_address_name: review.address || ''
  } : null);

  if (!targetPlace) {
    return (
      <ReviewLayout>
        <div css={s.container}>
          <p>선택된 맛집 정보가 없습니다.</p>
          <button type="button" onClick={() => navigate('/')}>메인으로 돌아가기</button>
        </div>
      </ReviewLayout>
    );
  }

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  // 이미지 추가 핸들러
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (previews.length + selectedFiles.length > 5) {
      alert('사진은 최대 5장까지 첨부할 수 있습니다.');
      return;
    }

    setNewFiles((prev) => [...prev, ...selectedFiles]);

    const newPreviewItems = selectedFiles.map((file, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      src: URL.createObjectURL(file),
      file: file,
      isExisting: false
    }));

    setPreviews((prev) => [...prev, ...newPreviewItems]);
    e.target.value = '';
  };

  // 이미지 개별 삭제 핸들러
  const handleRemoveImage = (targetItem) => {
    if (targetItem.isExisting) {
      setExistingImages((prev) => prev.filter((url) => url !== targetItem.originalUrl));
    } else {
      setNewFiles((prev) => prev.filter((f) => f !== targetItem.file));
    }
    setPreviews((prev) => prev.filter((p) => p.id !== targetItem.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('리뷰 내용을 작성해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const reviewData = {
        placeId: targetPlace.id ? Number(targetPlace.id) : null,
        placeName: targetPlace.place_name || targetPlace.name || '',
        address: targetPlace.road_address_name || targetPlace.address || '',
        category: targetPlace.category_name || targetPlace.category || '',
        phone: targetPlace.phone || '',
        latitude: targetPlace.y ? parseFloat(targetPlace.y) : (targetPlace.latitude ? parseFloat(targetPlace.latitude) : null),
        longitude: targetPlace.x ? parseFloat(targetPlace.x) : (targetPlace.longitude ? parseFloat(targetPlace.longitude) : null),
        rating: Number(rating),
        content: content,
        keepImageUrls: existingImages
      };

      // 💡 reviewDto를 JSON Blob으로 변환할 때 'reviewDto.json' 명칭을 추가해 전달
      const jsonBlob = new Blob([JSON.stringify(reviewData)], { type: 'application/json' });
      formData.append('reviewDto', jsonBlob, 'reviewDto.json');

      // 새로 추가된 이미지 파일 전송
      newFiles.forEach((file) => {
        formData.append('images', file);
      });

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
          <h2>{isEdit ? '리뷰 수정' : '리뷰 작성'}</h2>
          <button type="button" css={s.closeBtn} onClick={() => navigate(-1)}>✕</button>
        </div>

        <div css={s.placeCard}>
          <h3>{targetPlace.place_name || targetPlace.name}</h3>
          <p>{targetPlace.road_address_name || targetPlace.address}</p>
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
                {previews.map((item) => (
                  <div key={item.id} css={s.previewItem}>
                    <img src={item.src} alt="리뷰 미리보기" />
                    <button
                      type="button"
                      css={s.removeBtn}
                      onClick={() => handleRemoveImage(item)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" css={s.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? '처리 중...' : isEdit ? '수정 완료' : '작성 완료'}
          </button>
        </form>
      </div>
    </ReviewLayout>
  );
}

export default ReviewWrite;
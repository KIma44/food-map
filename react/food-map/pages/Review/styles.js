import { css } from '@emotion/react';

// 메인 카드 컨테이너
export const container = css`
  max-width: 560px;
  width: 100%;
  margin: 40px auto;
  padding: 28px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
`;

// 헤더 영역 (타이틀 + 닫기 버튼)
export const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #222222;
  }
`;

export const closeBtn = css`
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #888888;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #222222;
  }
`;

// 가게 정보 카드
export const placeCard = css`
  background-color: #f8f9fa;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #f1f3f5;

  h3 {
    margin: 0 0 6px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #666666;
  }
`;

// 폼 전체 구조
export const form = css`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

// 개별 섹션
export const section = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const label = css`
  font-size: 14px;
  font-weight: 600;
  color: #444444;
`;

// 별점 영역
export const starContainer = css`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const star = (isFilled) => css`
  font-size: 32px;
  color: ${isFilled ? '#ffc107' : '#e0e0e0'};
  cursor: pointer;
  user-select: none;
  transition: color 0.15s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const ratingText = css`
  margin-left: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #333333;
`;

// 리뷰 본문 텍스트 입력창
export const textarea = css`
  width: 100%;
  padding: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }

  &::placeholder {
    color: #aaa;
  }
`;

// 이미지 업로드 영역
export const imageUploadArea = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const uploadBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 40px;
  background-color: #f8f9fa;
  border: 1px dashed #cccccc;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #555555;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f3f5;
    border-color: #999999;
  }
`;

// 이미지 미리보기
export const previewList = css`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const previewItem = css`
  position: relative;
  width: 80px;
  height: 80px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #eee;
  }
`;

export const removeBtn = css`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ff5252;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

// 제출 버튼
export const submitBtn = css`
  width: 100%;
  padding: 14px 0;
  background-color: #ff6b6b;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ff5252;
  }

  &:disabled {
    background-color: #dddddd;
    cursor: not-allowed;
  }
`;
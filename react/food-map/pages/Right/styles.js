import { css } from '@emotion/react';

export const container = css`
  padding: 16px;
  background-color: #fcfcfc;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;

export const searchBar = css`
  margin-bottom: 14px;

  input {
    width: 100%;
    padding: 11px 14px;
    font-size: 14px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    box-sizing: border-box;
    outline: none;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    transition: all 0.2s ease-in-out;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }
  }
`;

export const authProfileSection = css`
  margin-bottom: 12px;
`;

export const profileCard = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background-color: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const userInfo = css`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const profileImg = css`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eef2f6;
`;

export const userText = css`
  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
  }

  span {
    font-size: 12px;
    color: #64748b;
  }
`;

export const logoutBtn = css`
  padding: 6px 12px;
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }
`;

export const authButtons = css`
  display: flex;
  gap: 8px;

  button {
    flex: 1;
    padding: 10px 0;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:first-of-type {
      background-color: #ffffff;
      color: #2563eb;
      border: 1px solid #2563eb;

      &:hover {
        background-color: #eff6ff;
      }
    }

    &:last-of-type {
      background-color: #2563eb;
      color: #ffffff;
      border: 1px solid #2563eb;

      &:hover {
        background-color: #1d4ed8;
      }
    }
  }
`;

export const myLocationBtn = css`
  width: 100%;
  padding: 10px;
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e2e8f0;
    color: #0f172a;
  }
`;

export const divider = css`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 16px 0;
`;

export const contentSection = css`
  margin-bottom: 16px;
`;

export const infoText = css`
  font-size: 13px;
  color: #64748b;
  margin: 0;
  text-align: center;
  padding: 8px 0;
`;

export const selectedDetailCard = css`
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 14px;
  border-radius: 10px;

  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #1e3a8a;
  }

  p {
    margin: 4px 0;
    font-size: 13px;
    color: #1e40af;
  }
`;

export const nearbySection = css`
  margin-top: 12px;
`;

export const sectionTitle = css`
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 10px 0;
`;

export const placeList = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const placeCard = css`
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
    transform: translateX(2px);
  }
`;

export const placeHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const placeName = css`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`;

export const placeRating = css`
  font-size: 12px;
  font-weight: 600;
  color: #f59e0b;
`;

export const placeInfo = css`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
`;

export const categoryTag = css`
  background-color: #f1f5f9;
  color: #475569;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
`;

// 리뷰 버튼 
export const reviewWriteBtn = css`
  width: 100%;
  margin-top: 12px;
  padding: 10px 0;
  background-color: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff5252;
  }
`;

// 리뷰 불러오기
export const topReviewsBox = css`
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px dashed #e0e0e0;
`;

export const topReviewsTitle = css`
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

export const reviewList = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

export const reviewItem = css`
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 8px 10px;
`;


export const reviewRating = css`
  font-size: 12px;
  font-weight: bold;
  color: #f39c12;
`;

export const reviewContent = css`
  font-size: 13px;
  color: #495057;
  margin: 0;
  line-height: 1.4;
  word-break: break-all;
`;

export const reviewHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

export const reviewAuthor = css`
  font-weight: bold;
  font-size: 14px;
  color: #333;
`;


// 이미지 다음 넘어가기

export const reviewImageWrapper = css`
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 300px;
  margin-top: 8px;
`;

export const reviewImg = css`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

// 다음(>) 버튼 스타일 (이미지 오른쪽 가운데 위치)[cite: 8]
export const nextBtn = css`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

// 이전(<) 버튼 스타일
export const prevBtn = css`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

// 사진 순서 표시 뱃지
export const imageBadge = css`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
`;
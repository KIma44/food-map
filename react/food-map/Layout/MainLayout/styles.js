import { css } from '@emotion/react';

export const layout = css`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  user-select: none; /* 드래그 중 텍스트 드래그 선택 방지 */
`;

export const mainContent = css`
  flex: 1;
  height: 100%;
  position: relative;
`;

export const mapContainer = css`
  width: 100%;
  height: 100%;
  background-color: #e5e5e5;
`;

/* ==========================================
   드래그 리사이즈 바 (< 핸들)
   ========================================== */
export const resizer = css`
  width: 10px;
  background-color: #e2e8f0;
  cursor: col-resize;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: background-color 0.2s ease;

  &:hover, &:active {
    background-color: #ff6b35;

    div {
      background-color: #ff6b35;
      color: #ffffff;
      border-color: #ff6b35;
    }
  }
`;

export const resizerHandle = css`
  width: 20px;
  height: 40px;
  background-color: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  color: #64748b;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  transition: all 0.2s ease;
`;

/* ==========================================
   우측 패널 전체 컨테이너 및 카드 색상 개선
   ========================================== */
export const container = css`
  width: 100%;
  height: 100%;
  border-left: 1px solid #e2e8f0;
  padding: 18px 16px;
  overflow-y: auto;
  background-color: #f8f6f4; /* 배경을 차분한 오프화이트로 설정해 카드와 확연히 구분 */
  box-sizing: border-box;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
  }
`;

// 검색창
export const searchBar = css`
  margin-bottom: 14px;

  input {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    box-sizing: border-box;
    outline: none;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
    transition: all 0.2s ease;

    &:focus {
      border-color: #ff6b35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
    }
  }
`;

// 프로필 카드
export const profileCard = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  margin-bottom: 12px;
`;

// 내 현재 위치로 이동 버튼
export const myLocationBtn = css`
  width: 100%;
  padding: 11px;
  background-color: #ffffff;
  color: #334155;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;

  &:hover {
    background-color: #fff7ed;
    border-color: #ff6b35;
    color: #ff6b35;
  }
`;

// 선택된 맛집 카드 (강조 오렌지 테두리)
export const selectedDetailCard = css`
  background-color: #ffffff;
  border: 1.5px solid #ffd8c8;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.08);
  margin-top: 14px;

  h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }

  p {
    margin: 6px 0;
    font-size: 13px;
    color: #475569;
  }
`;

// 리뷰 항목 카드
export const reviewItem = css`
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  margin-bottom: 12px;
`;

export const reviewRating = css`
  font-size: 12px;
  font-weight: 700;
  color: #d97706;
  background: #fef3c7;
  padding: 2px 8px;
  border-radius: 6px;
`;

export const reviewContent = css`
  font-size: 13px;
  color: #334155;
  margin: 8px 0;
  line-height: 1.5;
`;
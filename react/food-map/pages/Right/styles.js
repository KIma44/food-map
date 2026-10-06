import { css } from '@emotion/react';

/* 📌 전체 컨테이너: 배경을 연한 쿨그레이로 적용하여 내부 흰색 카드들이 확실히 떠 보이도록 설정 */
export const container = css`
  padding: 18px 16px;
  background-color: #f1f5f9; /* 배경색에 대비를 주어 영역 구분 강화 */
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
  }
`;

/* 📌 검색창: 배경과 또렷하게 구분되는 백그라운드 및 테두리 */
export const searchBar = css`
  margin-bottom: 14px;

  input {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    border: 1.5px solid #cbd5e1; /* 테두리를 두껍고 짙게 설정 */
    border-radius: 12px;
    box-sizing: border-box;
    outline: none;
    background-color: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:focus {
      border-color: #ff6b35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
    }
  }
`;

export const authProfileSection = css`
  margin-bottom: 14px;
`;

/* 📌 프로필 카드: 짙은 테두리와 주황색 강조선으로 독립된 블록 표현 */
export const profileCard = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background-color: #ffffff;
  border: 1.5px solid #ffcbd5; /* 연한 주황/핑크 테두리로 구획 구분 */
  border-left: 5px solid #ff6b35; /* 좌측 포인트 바 적용 */
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 107, 53, 0.15);
  }
`;

export const userInfo = css`
  display: flex;
  align-items: center;
  gap: 12px;
`;

/*  프로필 이미지선명하게 */
export const profileImg = css`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  /* 핵심: 배경을 짙은 스위트 그레이(#334155 또는 #475569)로 지정하여 흰색/연회색 아이콘을 대비시킴 */
  background-color: #475569; 
  border: 2px solid #ff6b35; /* 주황색 테두리로 포인트 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: block;

  /* 밝은 회색 이미지를 어둡고 또렷하게 진하게 만드는 필터 효과 */
  filter: brightness(0.6) contrast(1.4);
`;

export const userText = css`
  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
  }

  span {
    font-size: 12px;
    color: #ff6b35;
    font-weight: 600;
  }
`;

export const logoutBtn = css`
  padding: 6px 12px;
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #dc2626;
    color: #ffffff;
  }
`;

export const authButtons = css`
  display: flex;
  gap: 8px;

  button {
    flex: 1;
    padding: 11px 0;
    font-size: 14px;
    font-weight: 700;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:first-of-type {
      background-color: #ffffff;
      color: #ff6b35;
      border: 1.5px solid #ff6b35;

      &:hover {
        background-color: #fff3ed;
      }
    }

    &:last-of-type {
      background-color: #ff6b35;
      color: #ffffff;
      border: 1.5px solid #ff6b35;
      box-shadow: 0 3px 8px rgba(255, 107, 53, 0.3);

      &:hover {
        background-color: #e85a26;
      }
    }
  }
`;

export const myLocationBtn = css`
  width: 100%;
  padding: 12px;
  background-color: #ffffff;
  color: #1e293b;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;

  &:hover {
    background-color: #fff3ed;
    border-color: #ff6b35;
    color: #ff6b35;
  }
`;

/* 📌 구분선: 경계를 확실히 나눌 수 있도록 두께와 색상 강조 */
export const divider = css`
  border: none;
  border-top: 2px dashed #cbd5e1;
  margin: 18px 0;
`;

export const contentSection = css`
  margin-bottom: 16px;
`;

/* 📌 안내 박스: 회색 단순 글자 대신 박스로 영역 구분 */
export const infoText = css`
  font-size: 13px;
  color: #475569;
  margin: 0;
  text-align: center;
  padding: 18px 12px;
  font-weight: 600;
  background-color: #ffffff;
  border: 1.5px dashed #cbd5e1;
  border-radius: 12px;
`;

/* 📌 선택한 상세 정보 카드: 주황색 상단 강조선과 뚜렷한 흰색 박스 */
export const selectedDetailCard = css`
  background-color: #ffffff;
  border: 1.5px solid #ffcbd5;
  border-top: 4px solid #ff6b35;
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);

  h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }

  p {
    margin: 6px 0;
    font-size: 13px;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

export const nearbySection = css`
  margin-top: 16px;
`;

export const sectionTitle = css`
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px 0;
`;

export const placeList = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* 📌 맛집 목록 카드: 명확한 테두리와 호버 시 확실히 뜨는 입체감 */
export const placeCard = css`
  background-color: #ffffff;
  border: 1.5px solid #e2e8f0;
  padding: 14px 16px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff6b35;
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(255, 107, 53, 0.15);
  }
`;

export const placeHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

export const placeName = css`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
`;

export const placeRating = css`
  font-size: 13px;
  font-weight: 800;
  color: #d97706;
  background-color: #fffbeb;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid #fde68a;
`;

export const placeInfo = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
`;

export const categoryTag = css`
  background-color: #fff3ed;
  color: #ff6b35;
  border: 1px solid #ffcbd5;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
`;

export const reviewWriteBtn = css`
  width: 100%;
  margin-top: 16px;
  padding: 12px 0;
  background-color: #ff6b35;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background-color: #e85a26;
    transform: translateY(-1px);
  }
`;

export const topReviewsBox = css`
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1.5px dashed #cbd5e1;
`;

export const topReviewsTitle = css`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
`;

export const reviewList = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/* 📌 리뷰 항목 카드: 배경을 회색조로 두어 부모 흰색 카드와 구분 */
export const reviewItem = css`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
`;

export const reviewRating = css`
  font-size: 12px;
  font-weight: 700;
  color: #d97706;
  background: #fffbeb;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #fde68a;
`;

export const reviewContent = css`
  font-size: 13px;
  color: #334155;
  margin: 6px 0;
  line-height: 1.5;
  word-break: break-all;
`;

export const reviewHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const reviewAuthor = css`
  font-weight: 700;
  font-size: 13px;
  color: #0f172a;
`;

export const myReviewActionBtns = css`
  display: flex;
  gap: 6px;
`;

export const editBtn = css`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 11px;
  color: #475569;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
  }
`;

export const deleteBtn = css`
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 11px;
  color: #dc2626;
  cursor: pointer;

  &:hover {
    background: #f87171;
    color: #ffffff;
  }
`;

export const reviewImageWrapper = css`
  position: relative;
  display: block;
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

export const reviewImg = css`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
`;

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
  backdrop-filter: blur(2px);

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

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
  backdrop-filter: blur(2px);

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

export const imageBadge = css`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
`;
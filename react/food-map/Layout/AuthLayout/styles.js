import { css } from "@emotion/react";

// 화면 전체를 중앙 정렬하는 배경 레이아웃
export const layout = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f8f9fa;
`;

// 로그인 상자 (카드 디자인)
export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// 서비스 타이틀
export const title = css`
  font-size: 28px;
  font-weight: 700;
  color: #ff6b6b; /* 브랜드 포인트 컬러 (음식 서비스에 어울리는 색상) */
  margin-bottom: 24px;
  text-align: center;
`;
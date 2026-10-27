import { css } from "@emotion/react";

export const layoutContainer = css`
  width: 100vw;
  min-height: 100vh;
  background-color: #f4f5f7; /* 연한 회색 배경으로 리뷰 카드가 강조됨 */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
`;

export const mainContent = css`
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
`;
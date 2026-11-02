import { css } from '@emotion/react';

export const layoutContainer = css`
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
  box-sizing: border-box;
`;

export const mainContent = css`
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  box-sizing: border-box;
`;
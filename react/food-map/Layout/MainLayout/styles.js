import { css } from '@emotion/react';

export const layout = css`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

export const mainContent = css`
  flex: 1;
  height: 100%; /* 추가: 부모 100vh 높이를 그대로 물려받음 */
  position: relative;
`;

export const mapContainer = css`
  width: 100%;
  height: 100%;
  background-color: #e5e5e5;
`;
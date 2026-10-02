/** @jsxImportSource @emotion/react */
import React from 'react';
import * as s from './styles.js';

export function MainLayout({ children, rightContent }) {
  return (
    <div css={s.layout}>
      {/* 좌측: 지도 또는 메인 콘텐츠 영역 */}
      <div css={s.mainContent}>
        {children}
      </div>

      {/* 우측: 사이드바 레이아웃 */}
      {rightContent}
    </div>
  );
}

export default MainLayout;
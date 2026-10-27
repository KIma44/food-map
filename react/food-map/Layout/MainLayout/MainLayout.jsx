/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useCallback } from 'react';
import * as s from './styles.js';

export function MainLayout({ children, rightContent }) {
  // 우측 패널 너비 상태 (기본값 420px)
  const [rightWidth, setRightWidth] = useState(420);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    
    // 전체 창 너비에서 마우스 위치(X)를 빼서 우측 패널 너비 계산
    const newWidth = window.innerWidth - e.clientX;
    
    // 최소 320px, 최대 700px 제약
    if (newWidth >= 320 && newWidth <= 700) {
      setRightWidth(newWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  return (
    <div css={s.layout}>
      {/* 좌측: 지도 또는 메인 콘텐츠 영역 */}
      <div css={s.mainContent}>
        {children}
      </div>

      {/* 중간: 드래그 가능한 리사이즈 바 (< 버튼) */}
      <div css={s.resizer} onMouseDown={handleMouseDown}>
        <div css={s.resizerHandle}>
          &lt;
        </div>
      </div>

      {/* 우측: 사이드바 레이아웃 (가변 너비 적용) */}
      <div style={{ width: `${rightWidth}px`, height: '100%', flexShrink: 0 }}>
        {rightContent}
      </div>
    </div>
  );
}

export default MainLayout;
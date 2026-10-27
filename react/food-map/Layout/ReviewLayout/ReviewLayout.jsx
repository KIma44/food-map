/** @jsxImportSource @emotion/react */
import React from 'react';
import * as s from './styles.js'; 

export function ReviewLayout({ children }) {
  return (
    <div css={s.layoutContainer}>
      <main css={s.mainContent}>
        {children}
      </main>
    </div>
  );
}

export default ReviewLayout;
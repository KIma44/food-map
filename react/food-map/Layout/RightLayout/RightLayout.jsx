/** @jsxImportSource @emotion/react */
import React from 'react';
import * as s from './styles.js';

export function RightLayout({ children }) {
  return (
    <div css={s.container}>
      {children}
    </div>
  );
}

export default RightLayout;
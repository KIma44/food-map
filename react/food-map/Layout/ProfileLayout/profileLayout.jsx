/** @jsxImportSource @emotion/react */
import React from 'react';
import { Outlet } from 'react-router-dom';
import * as s from './styles.js';

const ProfileLayout = () => {
  return (
    <div css={s.layoutContainer}>
      <main css={s.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;
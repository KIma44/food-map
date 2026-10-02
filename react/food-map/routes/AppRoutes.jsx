import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from '../pages/Main/Main';
import Join from '../pages/Auth/Join';
import ReviewWrite from '../pages/Review/ReviewWrite';
import AdminRoute from './AdminRoute';
import Login from '../pages/Auth/Login';
import AuthRoute from './AuthRoute';


export function AppRoutes({ isLoggedIn, isAdmin }) {
  return (
    <Routes>
      {/* 누구나 접근 가능한 공개 페이지 */}
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />

      {/* 로그인한 사용자만 접근 가능한 페이지 */}
      <Route element={<AuthRoute isLoggedIn={isLoggedIn} />}>
        <Route path="/review/write" element={<ReviewWrite />} />
      </Route>

      {/* 관리자만 접근 가능한 페이지 */}
      <Route element={<AdminRoute isAdmin={isAdmin} />}>
        {/* <Route path="/admin" element={<AdminPage />} /> */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
// src/routes/AuthRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function AuthRoute({ isLoggedIn }) {
  // state의 isLoggedIn 뿐만 아니라 실제 localStorage 토큰 유무도 확인
  const token = localStorage.getItem('accessToken');
  const isAuthenticated = isLoggedIn || !!token;

  if (!isAuthenticated) {
    alert('로그인이 필요한 페이지입니다.');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AuthRoute;
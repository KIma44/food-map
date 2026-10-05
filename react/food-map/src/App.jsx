import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from '../pages/Main/Main';
import Join from '../pages/Auth/Join/Join';
import Login from '../pages/Auth/Login/Login';
import ReviewWrite from '../pages/Review/ReviewWrite';
import ReviewComment from '../pages/Comments/ReviewComment';
import AuthRoute from '../routes/AuthRoute';
import AdminRoute from '../routes/AdminRoute';

export function AppRoutes({ isLoggedIn, setIsLoggedIn, isAdmin }) {
  return (
    <Routes>
      {/* 누구나 접근 가능한 공개 페이지 */}
      <Route path="/" element={<Main isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/join" element={<Join />} />

      {/* 댓글 단독 페이지 경로가 필요한 경우 */}
      <Route path="/reviews/:reviewId/comments" element={<ReviewComment isUserLoggedIn={isLoggedIn} />} />

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
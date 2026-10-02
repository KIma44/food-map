import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Main from '../pages/Main/Main';
import Join from '../pages/Auth/Join/Join';
import Login from '../pages/Auth/Login/Login';
import ReviewWrite from '../pages/Review/ReviewWrite';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 앱 로드 시 로컬스토리지에 토큰 존재 여부 확인
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<Main isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route
        path="/login"
        element={<Login setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route path="/join" element={<Join />} />

      <Route path="/review/write" element={<ReviewWrite />} />
    </Routes>
  );
}

export default App;
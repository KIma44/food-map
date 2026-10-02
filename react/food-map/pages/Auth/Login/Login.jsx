/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as s from './styles';
import api from '../../../api/api';

export function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/login', {
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, refreshToken, name, profile } = response.data;

      // LocalStorage에 토큰 및 유저 정보 저장
      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (name) localStorage.setItem('userName', name);
      if (profile) {
        localStorage.setItem('userProfile', profile);
      } else {
        localStorage.removeItem('userProfile'); // null인 경우 삭제
      }

      if (setIsLoggedIn) setIsLoggedIn(true);

      alert('성공적으로 로그인되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert(error.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div css={s.container}>
      <div css={s.card}>
        <h2 css={s.title}>로그인</h2>
        <form css={s.form} onSubmit={handleSubmit}>
          <div css={s.inputGroup}>
            <label css={s.label}>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="이메일을 입력하세요"
              css={s.input}
            />
          </div>
          <div css={s.inputGroup}>
            <label css={s.label}>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="비밀번호를 입력하세요"
              css={s.input}
            />
          </div>
          <button type="submit" css={s.submitButton}>로그인</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as s from './styles.js';
import api from '../../../api/api';

import defaultProfileImg from '/profile/기본_프로필.png';

export function Join() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(defaultProfileImg);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError('올바른 이메일 형식을 입력해 주세요.');
      } else {
        setEmailError('');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setProfileImage(null);
    setPreviewImage(defaultProfileImg);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || !formData.email) {
      alert('올바른 이메일을 입력해 주세요.');
      return;
    }

    if (!formData.password || !formData.name) {
      alert('필수 입력 항목을 모두 채워주세요.');
      return;
    }

    try {
      const submitData = new FormData();

      const signupDto = JSON.stringify({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      submitData.append(
        'signupDto',
        new Blob([signupDto], { type: 'application/json' })
      );

      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      await api.post('/api/join', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('회원가입이 완료되었습니다! 로그인해 주세요.');
      navigate('/login'); // ⭕ 회원가입 후 로그인 페이지(또는 '/')로 이동
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(
        error.response?.data?.message || '회원가입 진행 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <div css={s.container}>
      <div css={s.card}>
        <h2 css={s.title}>회원가입</h2>

        <form css={s.form} onSubmit={handleSubmit}>
          {/* 프로필 사진 */}
          <div css={s.inputGroup} style={{ alignItems: 'center' }}>
            <label css={s.label}>프로필 사진 (선택)</label>
            <div
              style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                marginBottom: '10px',
              }}
            >
              <img
                src={previewImage}
                alt="프로필 미리보기"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #ddd',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <label
                htmlFor="profile-upload"
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                사진 선택
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {profileImage && (
                <button
                  type="button"
                  onClick={handleResetImage}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  취소
                </button>
              )}
            </div>
          </div>

          {/* 이메일 */}
          <div css={s.inputGroup}>
            <label css={s.label}>아이디 (이메일)</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              css={s.input}
              required
            />
            {emailError && <span css={s.errorMessage}>{emailError}</span>}
          </div>

          {/* 비밀번호 */}
          <div css={s.inputGroup}>
            <label css={s.label}>비밀번호</label>
            <div css={s.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                css={s.passwordInput}
                required
              />
              <button
                type="button"
                css={s.eyeButton}
                onClick={toggleShowPassword}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* 이름 */}
          <div css={s.inputGroup}>
            <label css={s.label}>이름</label>
            <input
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              css={s.input}
              required
            />
          </div>

          <button type="submit" css={s.submitButton}>
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default Join;
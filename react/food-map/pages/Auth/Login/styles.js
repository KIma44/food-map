import { css } from '@emotion/react';

export const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
`;

export const card = css`
  width: 100%;
  max-width: 440px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 32px;
  box-sizing: border-box;
`;

export const title = css`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: #333333;
`;

export const form = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const inputGroup = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const label = css`
  font-size: 14px;
  font-weight: 600;
  color: #495057;
`;

export const inputWrapper = css`
  position: relative;
  display: flex;
  align-items: center;
`;

export const input = css`
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }
`;

export const passwordInput = css`
  ${input};
  padding-right: 44px;
`;

export const eyeButton = css`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    color: #333;
  }
`;

export const errorMessage = css`
  font-size: 12px;
  color: #e63946;
  margin-top: 2px;
`;

export const submitButton = css`
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #4a90e2;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }

  /* 비밀번호 불일치 시 버튼 비활성화 스타일 */
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;
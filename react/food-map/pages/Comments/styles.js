import { css } from '@emotion/react';

export const overlay = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const modal = css`
  background-color: #ffffff;
  width: 400px;
  max-height: 80vh;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const header = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
`;

export const closeBtn = css`
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }
`;

export const reviewSummary = css`
  background-color: #f8f9fa;
  padding: 10px 12px;
  border-radius: 8px;
  margin: 12px 0;
  font-size: 13px;

  p {
    margin: 4px 0 0 0;
    color: #555;
    word-break: break-all;
  }
`;

export const commentList = css`
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
  margin-bottom: 12px;
  padding-right: 4px;

  /* 스크롤바 예쁘게 커스텀 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
`;

export const commentItem = css`
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const commentAuthor = css`
  font-weight: bold;
  font-size: 13px;
  color: #333;
`;

export const commentContent = css`
  font-size: 14px;
  margin-top: 2px;
  color: #444;
  word-break: break-all;
`;

export const infoText = css`
  text-align: center;
  color: #888;
  font-size: 13px;
  margin: 20px 0;
`;

export const form = css`
  display: flex;
  gap: 8px;
  border-top: 1px solid #eee;
  padding-top: 12px;
`;

export const input = css`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007bff;
  }
`;

export const submitBtn = css`
  padding: 8px 16px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
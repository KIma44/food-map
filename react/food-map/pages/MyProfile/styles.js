import { css } from '@emotion/react';

export const container = css`
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 20px;
`;

export const title = css`
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin: 0;
`;

export const form = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const authProfileSection = css`
  display: flex;
  justify-content: center;
`;

export const imageWrapper = css`
  position: relative;
  width: 120px;
  height: 120px;
`;

export const avatar = css`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;

  /* 연하고 밝은 이미지를 어둡고 또렷하게 만드는 필터 효과 */
  filter: brightness(0.85) contrast(1.2);
  transition: filter 0.2s ease-in-out;

  &:hover {
    filter: brightness(0.75) contrast(1.25);
  }
`;

export const uploadLabel = css`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #ff6b6b;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  /* 가독성을 높이기 위한 그림자 효과 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background-color: #fa5252;
    transform: scale(1.05);
  }
`;

export const hiddenFileInput = css`
  display: none;
`;

export const inputGroup = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const label = css`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const subText = css`
  font-size: 13px;
  color: #666;
  margin-top: -4px;
  margin-bottom: 8px;
`;

export const input = css`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`;

export const allergySection = css`
  display: flex;
  flex-direction: column;
`;

export const selectedBadgeWrapper = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  min-height: 32px;
`;

export const badge = css`
  background-color: #ff6b6b;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const removeBtn = css`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
`;

export const chipGroup = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const chip = (isActive) => css`
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid ${isActive ? '#ff6b6b' : '#ddd'};
  background-color: ${isActive ? '#fff0f0' : '#fff'};
  color: ${isActive ? '#ff6b6b' : '#555'};
  font-weight: ${isActive ? 'bold' : 'normal'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const customInputGroup = css`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

export const addButton = css`
  padding: 0 18px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
`;

export const submitButton = css`
  width: 100%;
  padding: 14px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fa5252;
  }
`;

export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 24px;
`;

export const backButton = css`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 10;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;


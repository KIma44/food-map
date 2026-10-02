// src/api/map.js
export const initKakaoMap = (containerId, lat, lng, level = 4) => {
  if (!window.kakao || !window.kakao.maps) {
    console.error("Kakao Map SDK가 로드되지 않았습니다.");
    return null;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`ID가 '${containerId}'인 HTML 요소를 찾을 수 없습니다.`);
    return null;
  }

  const options = {
    center: new window.kakao.maps.LatLng(lat, lng), // 중심 좌표 설정
    level: level, // 기본 확대 레벨
  };

  // 지도 인스턴스 생성
  const map = new window.kakao.maps.Map(container, options);

  // 지도 크기 재계산 (SPA 컨테이너 높이 미적용 이슈 방지)
  setTimeout(() => {
    map.relayout();
    map.setCenter(new window.kakao.maps.LatLng(lat, lng));
  }, 100);

  return map;
};
export function getDistanceInKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // 지구의 평균 반지름 (단위: km)

  const nLat1 = Number(lat1);
  const nLng1 = Number(lng1);
  const nLat2 = Number(lat2);
  const nLng2 = Number(lng2);

  // 좌표 유효성 검사 (하나라도 숫자가 아니면 0 반환)
  if (isNaN(nLat1) || isNaN(nLng1) || isNaN(nLat2) || isNaN(nLng2)) {
    return 0;
  }

  const dLat = deg2rad(nLat2 - nLat1);
  const dLng = deg2rad(nLng2 - nLng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(nLat1)) *
      Math.cos(deg2rad(nLat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
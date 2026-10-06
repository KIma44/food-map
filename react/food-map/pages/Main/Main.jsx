/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react';
import * as s from './styles.js';
import MainLayout from '../../Layout/MainLayout/MainLayout.jsx';
import Right from '../Right/Right.jsx';
import { initKakaoMap } from '../../api/map.js';
import { getDistanceInKm } from '../../utils/distance.js';

export function Main() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [placeList, setPlaceList] = useState([]);
  
  // 지도 부모 컨테이너 크기 변화 감지용 Ref
  const mapWrapperRef = useRef(null);

  // 기본 사용자 위치 (울산/양산 지역 기본값)
  const [userLocation, setUserLocation] = useState({ lat: 35.4072, lng: 129.1558 });

  const markersRef = useRef([]); // 음식점 마커들
  const userMarkerRef = useRef(null); // 내 위치 마커
  const userLocationRef = useRef(userLocation);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  // 💡 사이드바 당기기 등 크기 변경 시 지도를 자동으로 맞추는 ResizeObserver
  useEffect(() => {
    if (!mapInstance || !mapWrapperRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      const center = mapInstance.getCenter(); // 현재 지도 중심좌표 보존
      mapInstance.relayout();                 // 지도 레이아웃 재계산 및 렌더링
      mapInstance.setCenter(center);          // 중심점 유지
    });

    resizeObserver.observe(mapWrapperRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mapInstance]);

  // 음식점 마커 전체 삭제
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  // 📍 내 위치 마커 생성/업데이트
  const updateUserMarker = (map, lat, lng) => {
    const { kakao } = window;
    if (!map || !kakao) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    const userMarkerImage = new kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
      new kakao.maps.Size(35, 39),
      { offset: new kakao.maps.Point(13, 37) }
    );

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(lat, lng),
      image: userMarkerImage,
      map: map,
      zIndex: 3,
    });

    userMarkerRef.current = marker;
  };

  // 📍 화면에 장소 마커 표시
  const renderMarkers = (map, places) => {
    const { kakao } = window;
    clearMarkers();

    const newMarkers = places.map((place) => {
      const markerPosition = new kakao.maps.LatLng(place.lat, place.lng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: map,
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedPlace(place);
      });

      return marker;
    });

    markersRef.current = newMarkers;
  };

  // 📍 중심 좌표 기반 주변 음식점(FD6) 자동 검색 (최대 10개)
  const searchPlaces = (map, centerLat, centerLng) => {
    const { kakao } = window;
    if (!map || !kakao || !kakao.maps || !kakao.maps.services) return;

    const ps = new kakao.maps.services.Places();
    const searchPosition = new kakao.maps.LatLng(centerLat, centerLng);

    ps.categorySearch(
      'FD6',
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const limitedData = data.slice(0, 10);

          const realPlaces = limitedData.map((place) => {
            const placeLat = parseFloat(place.y);
            const placeLng = parseFloat(place.x);
            const distance = getDistanceInKm(
              userLocationRef.current.lat,
              userLocationRef.current.lng,
              placeLat,
              placeLng
            );

            return {
              id: place.id,
              name: place.place_name,
              category: place.category_name ? place.category_name.split(' > ').pop() : '음식점',
              address: place.road_address_name || place.address_name,
              phone: place.phone,
              lat: placeLat,
              lng: placeLng,
              distance: `${distance.toFixed(1)}km`,
              placeUrl: place.place_url,
            };
          });

          setPlaceList(realPlaces);
          renderMarkers(map, realPlaces);
        } else {
          setPlaceList([]);
          clearMarkers();
        }
      },
      {
        location: searchPosition,
        radius: 3000,
        sort: kakao.maps.services.SortBy.DISTANCE,
      }
    );
  };

  // 🔍 우측 검색창 키워드 검색
  const handleSearchKeyword = (keyword) => {
    if (!mapInstance || !window.kakao || !window.kakao.maps.services) return;

    const { kakao } = window;
    const ps = new kakao.maps.services.Places();

    const center = mapInstance.getCenter();

    ps.keywordSearch(
      keyword,
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const limitedData = data.slice(0, 10);

          const searchResults = limitedData.map((place) => {
            const placeLat = parseFloat(place.y);
            const placeLng = parseFloat(place.x);
            const distance = getDistanceInKm(
              userLocationRef.current.lat,
              userLocationRef.current.lng,
              placeLat,
              placeLng
            );

            return {
              id: place.id,
              name: place.place_name,
              category: place.category_name ? place.category_name.split(' > ').pop() : '음식점',
              address: place.road_address_name || place.address_name,
              phone: place.phone,
              lat: placeLat,
              lng: placeLng,
              distance: `${distance.toFixed(1)}km`,
              placeUrl: place.place_url,
            };
          });

          setPlaceList(searchResults);
          renderMarkers(mapInstance, searchResults);

          if (searchResults.length > 0) {
            const firstPlace = searchResults[0];
            const moveLatLng = new kakao.maps.LatLng(firstPlace.lat, firstPlace.lng);
            mapInstance.panTo(moveLatLng);
            setSelectedPlace(firstPlace);
          }
        } else {
          alert('검색 결과가 존재하지 않습니다.');
        }
      },
      {
        location: center,
        radius: 5000,
      }
    );
  };

  // 내 위치로 이동 버튼 클릭
  const handleGoToMyLocation = () => {
    if (!mapInstance) return;
    const { kakao } = window;
    const myLatLng = new kakao.maps.LatLng(userLocation.lat, userLocation.lng);

    mapInstance.setLevel(4);
    mapInstance.panTo(myLatLng);
    setSelectedPlace(null);
    updateUserMarker(mapInstance, userLocation.lat, userLocation.lng);
    searchPlaces(mapInstance, userLocation.lat, userLocation.lng);
  };

  // 우측 리스트에서 장소 클릭 시 지도 이동 및 해당 마커 강조/상세 선택
  const handleSelectPlace = (place) => {
    if (!mapInstance || !place) return;
    const { kakao } = window;
    const moveLatLng = new kakao.maps.LatLng(place.lat, place.lng);

    mapInstance.setLevel(3);
    mapInstance.panTo(moveLatLng);
    setSelectedPlace(place);
  };

  // 지도 초기화 및 GPS 내 위치 가져오기
  useEffect(() => {
    const handleMapInit = (lat, lng) => {
      const { kakao } = window;
      if (!kakao || !kakao.maps) return;

      kakao.maps.load(() => {
        setUserLocation({ lat, lng });
        userLocationRef.current = { lat, lng };

        // 1. 지도 생성
        const map = initKakaoMap('map', lat, lng, 4);
        if (!map) return;
        
        setMapInstance(map);

        // 2. 내 위치 마커 생성
        updateUserMarker(map, lat, lng);

        // 3. 최초 음식점 검색
        setTimeout(() => {
          searchPlaces(map, lat, lng);
        }, 300);

        // 4. 지도 이동(드래그) 완료 시 주변 재검색
        kakao.maps.event.addListener(map, 'dragend', () => {
          const center = map.getCenter();
          searchPlaces(map, center.getLat(), center.getLng());
        });

        // 5. 지도 확대/축소 시 주변 재검색
        kakao.maps.event.addListener(map, 'zoom_changed', () => {
          const center = map.getCenter();
          searchPlaces(map, center.getLat(), center.getLng());
        });
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => handleMapInit(position.coords.latitude, position.coords.longitude),
        () => handleMapInit(35.4072, 129.1558)
      );
    } else {
      handleMapInit(35.4072, 129.1558);
    }
  }, []);

  return (
    <MainLayout
      rightContent={
        <Right
          selectedPlace={selectedPlace}
          placeList={placeList}
          onSelectPlace={handleSelectPlace}
          onMoveToMyLocation={handleGoToMyLocation}
          onSearchKeyword={handleSearchKeyword}
        />
      }
    >
      <div ref={mapWrapperRef} style={{ width: '100%', height: '100%' }}>
        <div id="map" css={s.mapContainer} />
      </div>
    </MainLayout>
  );
}

export default Main;
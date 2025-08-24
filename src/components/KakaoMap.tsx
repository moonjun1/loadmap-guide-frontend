import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Location, CandidatePoint } from '../types/kakao';

interface KakaoMapProps {
  locations: Location[];
  middlePoints: CandidatePoint[];
  onMapClick?: (lat: number, lng: number, displayName?: string) => void;
}

const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible; /* 스크롤과 줌 허용 */
  
  /* 지도 내부 스크롤 허용 */
  * {
    box-sizing: border-box;
  }
`;

const MapLoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  color: #64748b;
  font-size: 16px;
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const KakaoMap: React.FC<KakaoMapProps> = ({ locations, middlePoints, onMapClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const onMapClickRef = useRef(onMapClick);
  const lastClickMarkerRef = useRef<any>(null); // 클릭 마커 저장용 ref
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [mapError, setMapError] = React.useState(false);
  
  // onMapClick이 변경될 때마다 ref 업데이트
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    // 카카오맵 SDK 동적 로드
    const loadKakaoScript = () => {
      const KAKAO_JS_KEY = process.env.REACT_APP_KAKAO_JS_KEY;
      
      if (!KAKAO_JS_KEY) {
        console.error('카카오 JavaScript API 키가 없습니다.');
        setMapError(true);
        return;
      }

      // 이미 스크립트가 로드되었는지 확인
      if (document.querySelector('script[src*="dapi.kakao.com"]')) {
        if (window.kakao && window.kakao.maps) {
          initMap();
          return;
        }
      }

      // 스크립트 동적 로드
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services&autoload=false`;
      
      script.onload = () => {
        window.kakao.maps.load(() => {
          console.log('카카오맵 SDK 로드 완료');
          initMap();
        });
      };
      
      script.onerror = () => {
        console.error('카카오맵 SDK 로드 실패');
        setMapError(true);
      };
      
      document.head.appendChild(script);
    };

    // 지도 초기화 함수
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapRef.current) {
        return;
      }

      try {
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 5,
        };

        const map = new window.kakao.maps.Map(mapRef.current, mapOption);
        mapInstanceRef.current = map;
        
        // 지도 컨트롤 활성화
        map.setDraggable(true);
        map.setZoomable(true);
        
        // 지도 타입 컨트롤과 줌 컨트롤 추가
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
        
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        
        setMapLoaded(true);
        setMapError(false);
        console.log('카카오맵 초기화 완료');

        // 클릭 이벤트 - 마커 표시 및 주소 변환
        window.kakao.maps.event.addListener(map, 'click', async (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;
          const lat = latlng.getLat();
          const lng = latlng.getLng();
          
          console.log(`클릭한 위치: (${lat}, ${lng})`);
          
          // 클릭한 위치에 마커 표시
          const clickMarker = new window.kakao.maps.Marker({
            position: latlng,
            map: map
          });
          
          // 이전 클릭 마커 제거
          if (lastClickMarkerRef.current) {
            lastClickMarkerRef.current.setMap(null);
          }
          lastClickMarkerRef.current = clickMarker;
          
          // 주소 변환 시도
          try {
            const geocoder = new window.kakao.maps.services.Geocoder();
            
            geocoder.coord2Address(lng, lat, (result: any, status: any) => {
              let displayName = `클릭한 위치 (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
              
              if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0];
                if (address.road_address) {
                  displayName = address.road_address.address_name;
                } else if (address.address) {
                  displayName = address.address.address_name;
                }
              }
              
              console.log('변환된 주소:', displayName);
              
              if (onMapClickRef.current) {
                onMapClickRef.current(lat, lng, displayName);
              }
            });
          } catch (error) {
            console.error('주소 변환 실패:', error);
            if (onMapClickRef.current) {
              onMapClickRef.current(lat, lng);
            }
          }
        });
      } catch (error) {
        console.error('지도 초기화 실패:', error);
        setMapError(true);
      }
    };

    loadKakaoScript();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();

    // 시작점 마커 추가 (파란색)
    locations.forEach((location, index) => {
      if (location.latitude && location.longitude) {
        const position = new window.kakao.maps.LatLng(location.latitude, location.longitude);
        
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: mapInstanceRef.current,
        });

        // 인포윈도우 추가
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;"><b>시작점 ${index + 1}</b><br/>${location.address}</div>`,
        });

        // 마커 클릭 시 인포윈도우 표시
        window.kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
        bounds.extend(position);
      }
    });

    // 중간지점 마커 추가 (빨간색)
    middlePoints.forEach((point, index) => {
      const position = new window.kakao.maps.LatLng(point.latitude, point.longitude);
      
      const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
      const imageSize = new window.kakao.maps.Size(64, 69);
      const imageOption = { offset: new window.kakao.maps.Point(27, 69) };
      
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      
      const marker = new window.kakao.maps.Marker({
        position: position,
        image: markerImage,
        map: mapInstanceRef.current,
      });

      // 인포윈도우 추가
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:12px;min-width:200px;">
                    <b>${point.placeName && point.placeName !== '장소명 없음' ? point.placeName : `후보지점 ${point.rank}`}</b><br/>
                    <small style="color:#666;">${point.address && point.address !== '주소 정보 없음' ? point.address : '위치 정보 없음'}</small><br/>
                    점수: ${point.overallScore.toFixed(1)}<br/>
                    평균 이동시간: ${point.averageTravelTime.toFixed(1)}분<br/>
                    상업지역 점수: ${point.commercialScore.toFixed(1)}
                  </div>`,
      });

      // 마커 클릭 시 인포윈도우 표시
      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (locations.length > 0 || middlePoints.length > 0) {
      mapInstanceRef.current.setBounds(bounds);
    }
  }, [locations, middlePoints]);

  return (
    <MapContainer>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {!mapLoaded && !mapError && (
        <MapLoadingContainer>
          <LoadingSpinner />
          <div>카카오맵을 로딩 중입니다...</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: '0.7' }}>
            잠시만 기다려주세요
          </div>
        </MapLoadingContainer>
      )}
      {mapError && (
        <MapLoadingContainer>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🗺️</div>
          <div>지도를 불러올 수 없습니다</div>
          <div style={{ fontSize: '14px', marginTop: '8px', color: '#9ca3af' }}>
            페이지를 새로고침하거나 잠시 후 다시 시도해 주세요
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            새로고침
          </button>
        </MapLoadingContainer>
      )}
    </MapContainer>
  );
};

export default KakaoMap;
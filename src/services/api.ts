import axios from 'axios';
import { Location, MiddlePointResponse, PlaceSearchResponse, CandidatePoint } from '../types/kakao';

const API_BASE_URL = 'http://localhost:8080/api';

// 백엔드 응답을 프론트엔드 형식으로 변환
const transformBackendResponse = (backendData: any): MiddlePointResponse => {
  console.log('🔥 Backend response data:', backendData);
  
  const candidates: CandidatePoint[] = [];
  
  // 백엔드 응답 구조 확인
  if (backendData.candidates && Array.isArray(backendData.candidates)) {
    console.log('✅ Found candidates array:', backendData.candidates.length);
    backendData.candidates.forEach((candidate: any, index: number) => {
      candidates.push({
        rank: candidate.rank || (index + 1),
        latitude: candidate.latitude,
        longitude: candidate.longitude,
        address: candidate.description || candidate.address || `위치 ${index + 1}`,
        placeName: candidate.address || candidate.description || `후보지점 ${index + 1}`,
        averageTravelTime: candidate.avgTravelTime || 0,
        commercialScore: candidate.commercialScore || 0,
        overallScore: candidate.score || candidate.overallScore || 50,
      });
    });
  } else {
    console.log('❌ No candidates array found');
    console.log('Available keys:', Object.keys(backendData));
  }
  
  console.log('🚀 Transformed candidates:', candidates);
  
  return {
    success: true,
    message: backendData.message || '중간지점을 성공적으로 계산했습니다.',
    data: {
      message: backendData.message || `총 ${candidates.length}개의 후보지점을 찾았습니다.`,
      candidates: candidates,
    }
  };
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const locationApi = {
  // 기본 중간지점 계산
  calculateMiddlePoint: async (locations: Location[], transportationType = 'CAR'): Promise<MiddlePointResponse> => {
    const requestData = { locations, transportationType };
    const response = await api.post('/location/middle-point/simple', requestData);
    return transformBackendResponse(response.data.data);
  },

  // 날씨 정보 포함 중간지점 계산
  calculateMiddlePointWithWeather: async (locations: Location[], transportationType = 'CAR'): Promise<MiddlePointResponse> => {
    const requestData = { locations, transportationType };
    const response = await api.post('/location/middle-point/with-weather', requestData);
    const transformedData = transformBackendResponse(response.data.data);
    
      
  // 날씨 정보가 있다면 추가
  if (response.data.data.weather) {
    const w = response.data.data.weather;
    transformedData.data.weather = {
      condition: w.main || w.condition,
      description: w.description,
      temperature: Math.round(w.temp || w.temperature || 20), // 기본값 20도
      humidity: w.humidity || 60, // 기본값 60%
      cityName: w.name || w.cityName || '서울',
    };
  }

    
    return transformedData;
  },

  // 위치 유효성 검증
  validateLocation: async (location: Location): Promise<boolean> => {
    const response = await api.post('/location/validate', location);
    return response.data.data;
  },
};

export const placeApi = {
  // 주변 장소 검색
  searchNearbyPlaces: async (
    latitude: number, 
    longitude: number, 
    radius: number = 1000,
    category?: string
  ): Promise<PlaceSearchResponse> => {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
      ...(category && { category }),
    });
    
    const response = await api.get(`/places/nearby?${params}`);
    return response.data;
  },

  // 카테고리 목록 조회
  getCategories: async () => {
    const response = await api.get('/places/categories');
    return response.data;
  },
};

export const healthApi = {
  // 외부 API 상태 확인
  checkExternalApiHealth: async () => {
    const response = await api.get('/health/external-apis');
    return response.data;
  },
};

export default api;
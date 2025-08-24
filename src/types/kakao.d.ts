declare global {
  interface Window {
    kakao: any;
  }
}

export interface KakaoMapOptions {
  center: kakao.maps.LatLng;
  level: number;
}

export interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface MiddlePointResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    candidates: CandidatePoint[];
    weather?: WeatherInfo;
  };
}

export interface CandidatePoint {
  rank: number;
  latitude: number;
  longitude: number;
  address: string;
  placeName: string;
  averageTravelTime: number;
  commercialScore: number;
  overallScore: number;
}

export interface WeatherInfo {
  condition: string;
  description: string;
  temperature: number;
  humidity: number;
  cityName: string;
}

export interface PlaceSearchResponse {
  success: boolean;
  message: string;
  data: Place[];
}

export interface Place {
  id: number;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  distanceMeters: number;
}
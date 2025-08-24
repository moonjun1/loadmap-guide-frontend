import React, { useState } from 'react';
import styled from 'styled-components';
import KakaoMap from './components/KakaoMap';
import LocationForm from './components/LocationForm';
import ResultDisplay from './components/ResultDisplay';
import { Location, CandidatePoint, WeatherInfo } from './types/kakao';
import { locationApi } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1e293b;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightPanel = styled.div``;

const MapSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
`;

const MapTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const LoadingMessage = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0284c7;
  padding: 16px 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [candidates, setCandidates] = useState<CandidatePoint[]>([]);
  const [weather, setWeather] = useState<WeatherInfo | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddLocation = (location: Location) => {
    setLocations(prev => [...prev, location]);
    setError(null);
  };

  const handleRemoveLocation = (index: number) => {
    setLocations(prev => prev.filter((_, i) => i !== index));
    // 위치가 변경되면 결과 초기화
    if (candidates.length > 0) {
      setCandidates([]);
      setWeather(undefined);
    }
  };

  const handleCalculate = async () => {
    if (locations.length < 2) {
      setError('최소 2개 이상의 위치를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 날씨 정보 포함하여 중간지점 계산
      const result = await locationApi.calculateMiddlePointWithWeather(locations);
      
      if (result.success) {
        setCandidates(result.data.candidates);
        setWeather(result.data.weather);
      } else {
        throw new Error(result.message || '계산에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('Calculate error:', err);
      
      // 기본 계산 API로 재시도
      try {
        const basicResult = await locationApi.calculateMiddlePoint(locations);
        if (basicResult.success && basicResult.data.candidates) {
          setCandidates(basicResult.data.candidates);
          setWeather(undefined);
          setError('날씨 정보를 가져올 수 없어 기본 중간지점만 계산했습니다.');
        } else {
          throw new Error(basicResult.message || '계산에 실패했습니다.');
        }
      } catch (fallbackErr: any) {
        setError(fallbackErr.response?.data?.message || fallbackErr.message || '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <ContentWrapper>
        <Header>
          <Title>🗺️ LoadMap Guide</Title>
          <Subtitle>여러 위치의 최적 중간지점을 찾아드립니다</Subtitle>
        </Header>

        <MainContent>
          <LeftPanel>
            <LocationForm
              locations={locations}
              onAddLocation={handleAddLocation}
              onRemoveLocation={handleRemoveLocation}
              onCalculate={handleCalculate}
              loading={loading}
            />
            
            {candidates.length > 0 && (
              <ResultDisplay candidates={candidates} weather={weather} />
            )}
          </LeftPanel>

          <RightPanel>
            <MapSection>
              <MapTitle>📍 지도에서 확인하기</MapTitle>
              {loading && (
                <LoadingMessage>
                  🔄 최적 중간지점을 계산하고 있습니다...
                </LoadingMessage>
              )}
              {error && <ErrorMessage>❌ {error}</ErrorMessage>}
              <KakaoMap
                locations={locations}
                middlePoints={candidates}
                onMapClick={(lat, lng, displayName) => {
                  // 좌표 유효성 검사
                  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                    console.error('유효하지 않은 좌표:', lat, lng);
                    setError('유효하지 않은 좌표입니다. 다시 클릭해주세요.');
                    return;
                  }
                  
                  const address = displayName || `클릭한 위치 (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
                  console.log('지도 클릭 - 위치 추가:', address);
                  handleAddLocation({ address, latitude: lat, longitude: lng });
                  setError(null); // 성공시 에러 메시지 제거
                }}
              />
            </MapSection>
          </RightPanel>
        </MainContent>

        {candidates.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            color: '#64748b', 
            fontSize: '16px', 
            marginTop: '32px',
            padding: '24px',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
            fontWeight: '500'
          }}>
            💡 위치를 추가하고 중간지점을 계산해보세요! 지도를 클릭해서도 위치를 추가할 수 있습니다.
          </div>
        )}
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;

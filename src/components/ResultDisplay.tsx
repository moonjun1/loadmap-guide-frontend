import React from 'react';
import styled from 'styled-components';
import { CandidatePoint, WeatherInfo } from '../types/kakao';

interface ResultDisplayProps {
  candidates: CandidatePoint[];
  weather?: WeatherInfo;
}

const ResultContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  margin-bottom: 24px;
  overflow: hidden;
`;

const ResultHeader = styled.div`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 28px 32px;
  border-radius: 20px 20px 0 0;
`;

const Title = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
`;

const Content = styled.div`
  padding: 32px;
`;

const WeatherSection = styled.div`
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.2);
`;

const WeatherIcon = styled.div`
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
`;

const WeatherInfoContainer = styled.div`
  flex: 1;
`;

const WeatherTemp = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const WeatherDesc = styled.div`
  font-size: 15px;
  opacity: 0.9;
  font-weight: 400;
`;

const CandidateList = styled.div`
  display: grid;
  gap: 16px;
`;

const CandidateItem = styled.div<{ rank: number }>`
  background: ${props => props.rank === 1 ? 'linear-gradient(135deg, #10b981, #059669)' : '#fafbfc'};
  color: ${props => props.rank === 1 ? 'white' : '#334155'};
  border: 2px solid ${props => props.rank === 1 ? 'transparent' : '#f1f5f9'};
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.rank === 1 
      ? '0 12px 30px rgba(16, 185, 129, 0.25)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.rank === 1 ? 'transparent' : '#e2e8f0'};
  }
`;

const RankBadge = styled.div<{ rank: number }>`
  position: absolute;
  top: -12px;
  left: 24px;
  background: ${props => {
    switch (props.rank) {
      case 1: return '#fbbf24';
      case 2: return '#e5e7eb';
      case 3: return '#f59e0b';
      default: return '#94a3b8';
    }
  }};
  color: ${props => props.rank <= 3 ? '#1f2937' : '#fff'};
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const CandidateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CandidateTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

const ScoreBadge = styled.span<{ rank: number }>`
  background: ${props => props.rank === 1 ? 'rgba(255, 255, 255, 0.2)' : '#f1f5f9'};
  color: ${props => props.rank === 1 ? 'white' : '#475569'};
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  border: ${props => props.rank === 1 ? 'none' : '1px solid #e2e8f0'};
`;

const CandidateDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  font-size: 15px;
  
  & > div:first-child {
    grid-column: 1 / -1;
  }
`;

const DetailItem = styled.div<{ rank: number }>`
  color: ${props => props.rank === 1 ? 'rgba(255, 255, 255, 0.9)' : '#64748b'};
`;

const DetailLabel = styled.span`
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
`;

const DetailValue = styled.span<{ rank: number }>`
  color: ${props => props.rank === 1 ? 'white' : '#1e293b'};
  font-weight: 700;
  font-size: 15px;
`;

const getWeatherIcon = (condition: string) => {
  switch (condition?.toLowerCase()) {
    case 'clear': return '☀️';
    case 'clouds': return '☁️';
    case 'rain': return '🌧️';
    case 'snow': return '❄️';
    default: return '🌤️';
  }
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ candidates, weather }) => {
  if (candidates.length === 0) {
    return null;
  }

  return (
    <ResultContainer>
      <ResultHeader>
        <Title>🎯 최적 중간지점 계산 결과</Title>
        <Subtitle>
          {candidates.length}개의 후보지점을 찾았습니다. 1번이 가장 최적의 장소입니다.
        </Subtitle>
      </ResultHeader>

      <Content>
        {weather && typeof weather.temperature === 'number' && (
          <WeatherSection>
            <WeatherIcon>{getWeatherIcon(weather.condition)}</WeatherIcon>
            <WeatherInfoContainer>
              <WeatherTemp>{weather.temperature}°C</WeatherTemp>
              <WeatherDesc>
                {weather.description} • 습도 {weather.humidity}% • {weather.cityName}
              </WeatherDesc>
            </WeatherInfoContainer>
          </WeatherSection>
        )}

        <CandidateList>
          {candidates.map((candidate, index) => (
            <CandidateItem key={index} rank={candidate.rank}>
              <RankBadge rank={candidate.rank}>
                {candidate.rank === 1 ? '🏆 최적' : `${candidate.rank}위`}
              </RankBadge>
              
              <CandidateHeader>
                <CandidateTitle>
                  {candidate.placeName && candidate.placeName !== '장소명 없음' ? candidate.placeName : `후보지점 ${candidate.rank}`}
                </CandidateTitle>
                <ScoreBadge rank={candidate.rank}>
                  점수: {candidate.overallScore.toFixed(1)}
                </ScoreBadge>
              </CandidateHeader>

              <CandidateDetails>
                <DetailItem rank={candidate.rank}>
                  <DetailLabel>📍 주소</DetailLabel>
                  <DetailValue rank={candidate.rank}>
                    {candidate.address && candidate.address !== '주소 정보 없음' 
                      ? candidate.address 
                      : `${candidate.latitude.toFixed(4)}, ${candidate.longitude.toFixed(4)}`
                    }
                  </DetailValue>
                </DetailItem>
                
                <DetailItem rank={candidate.rank}>
                  <DetailLabel>🚇 평균 이동시간</DetailLabel>
                  <DetailValue rank={candidate.rank}>
                    {candidate.averageTravelTime.toFixed(1)}분
                  </DetailValue>
                </DetailItem>
                
                <DetailItem rank={candidate.rank}>
                  <DetailLabel>🏢 상업지역 점수</DetailLabel>
                  <DetailValue rank={candidate.rank}>
                    {candidate.commercialScore.toFixed(1)}점
                  </DetailValue>
                </DetailItem>
              </CandidateDetails>
            </CandidateItem>
          ))}
        </CandidateList>
      </Content>
    </ResultContainer>
  );
};

export default ResultDisplay;
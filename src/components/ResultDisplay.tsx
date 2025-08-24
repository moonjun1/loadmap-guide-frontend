import React from 'react';
import styled from 'styled-components';
import { CandidatePoint, WeatherInfo, RecommendedPlace } from '../types/kakao';

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

const CommercialScoreTooltip = styled.div<{ rank: number }>`
  font-size: 12px;
  color: ${props => props.rank === 1 ? 'rgba(255, 255, 255, 0.8)' : '#64748b'};
  margin-top: 4px;
  font-weight: 400;
`;

const RecommendedSection = styled.div<{ rank: number }>`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.rank === 1 ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0'};
`;

const RecommendedTitle = styled.div<{ rank: number }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.rank === 1 ? 'rgba(255, 255, 255, 0.9)' : '#475569'};
  margin-bottom: 8px;
`;

const RecommendedPlace = styled.div<{ rank: number }>`
  background: ${props => props.rank === 1 ? 'rgba(255, 255, 255, 0.1)' : '#f8fafc'};
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 6px;
  font-size: 13px;
`;

const PlaceName = styled.div<{ rank: number }>`
  font-weight: 600;
  color: ${props => props.rank === 1 ? 'white' : '#1e293b'};
  margin-bottom: 4px;
`;

const PlaceTags = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
`;

const PlaceTag = styled.span<{ rank: number }>`
  background: ${props => props.rank === 1 ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0'};
  color: ${props => props.rank === 1 ? 'white' : '#64748b'};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
`;

const PlaceDescription = styled.div<{ rank: number }>`
  color: ${props => props.rank === 1 ? 'rgba(255, 255, 255, 0.8)' : '#64748b'};
  font-size: 12px;
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

const getCommercialScoreDescription = (score: number) => {
  if (score >= 80) return '활발한 상업지역 · 다양한 시설';
  if (score >= 60) return '보통 상업지역 · 기본 시설';
  if (score >= 40) return '주거 중심지역 · 편의시설';
  return '조용한 지역 · 제한적 시설';
};

const getRecommendedPlaces = (candidate: CandidatePoint): RecommendedPlace[] => {
  // 실제로는 백엔드에서 받아올 데이터지만, 현재는 지역별 샘플 데이터
  const area = candidate.address.split(' ')[1] || '';
  
  if (area.includes('중구') || area.includes('명동') || area.includes('을지로')) {
    return [
      {
        name: '스타벅스 명동점',
        category: '카페',
        tags: ['카공', '와이파이', '조용함'],
        description: '넓은 공간과 좋은 와이파이로 작업하기 좋은 곳',
        distance: 150
      }
    ];
  }
  
  if (area.includes('강남') || area.includes('서초')) {
    return [
      {
        name: '코워킹스페이스 위워크',
        category: '업무공간',
        tags: ['카공', '회의실', '네트워킹'],
        description: '전문적인 업무 환경과 네트워킹 기회',
        distance: 200
      }
    ];
  }
  
  if (area.includes('홍대') || area.includes('마포')) {
    return [
      {
        name: '홍대 루프탑 카페',
        category: '카페',
        tags: ['뷰맛집', '인스타', '분위기'],
        description: '야경이 예쁜 루프탑에서 즐기는 여유',
        distance: 100
      }
    ];
  }
  
  // 기본 추천
  return [
    {
      name: '근처 카페',
      category: '카페',
      tags: ['모임', '편안함'],
      description: '만남하기 좋은 조용한 분위기',
      distance: 100
    }
  ];
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
                    {(() => {
                      const minutes = Math.round(candidate.averageTravelTime);
                      if (minutes >= 60) {
                        const hours = Math.floor(minutes / 60);
                        const remainingMinutes = minutes % 60;
                        return remainingMinutes > 0 
                          ? `${hours}시간 ${remainingMinutes}분`
                          : `${hours}시간`;
                      }
                      return `${minutes}분`;
                    })()}
                  </DetailValue>
                </DetailItem>
                
                <DetailItem rank={candidate.rank}>
                  <DetailLabel>🏢 상업지역 점수</DetailLabel>
                  <DetailValue rank={candidate.rank}>
                    {candidate.commercialScore.toFixed(1)}점
                  </DetailValue>
                  <CommercialScoreTooltip rank={candidate.rank}>
                    {getCommercialScoreDescription(candidate.commercialScore)}
                  </CommercialScoreTooltip>
                </DetailItem>
              </CandidateDetails>

              <RecommendedSection rank={candidate.rank}>
                <RecommendedTitle rank={candidate.rank}>
                  💡 이 지역 추천 장소
                </RecommendedTitle>
                {getRecommendedPlaces(candidate).map((place, placeIndex) => (
                  <RecommendedPlace key={placeIndex} rank={candidate.rank}>
                    <PlaceName rank={candidate.rank}>
                      {place.name} · {place.distance}m
                    </PlaceName>
                    <PlaceTags>
                      {place.tags.map((tag, tagIndex) => (
                        <PlaceTag key={tagIndex} rank={candidate.rank}>
                          {tag}
                        </PlaceTag>
                      ))}
                    </PlaceTags>
                    <PlaceDescription rank={candidate.rank}>
                      {place.description}
                    </PlaceDescription>
                  </RecommendedPlace>
                ))}
              </RecommendedSection>
            </CandidateItem>
          ))}
        </CandidateList>
      </Content>
    </ResultContainer>
  );
};

export default ResultDisplay;
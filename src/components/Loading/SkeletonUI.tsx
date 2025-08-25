import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SkeletonUIProps {
  type: 'result' | 'card' | 'list' | 'map' | 'text';
  count?: number;
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 8px;
`;

const SkeletonContainer = styled.div`
  padding: 16px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  margin-bottom: 24px;
`;

const SkeletonHeader = styled.div`
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  padding: 28px 32px;
  border-radius: 20px 20px 0 0;
  margin: -16px -16px 24px -16px;
`;

const SkeletonTitle = styled(SkeletonBase)`
  height: 28px;
  width: 60%;
  margin-bottom: 8px;
`;

const SkeletonSubtitle = styled(SkeletonBase)`
  height: 16px;
  width: 80%;
`;

const SkeletonWeatherSection = styled.div`
  background: linear-gradient(135deg, #e0f2fe, #bae6fd);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SkeletonWeatherIcon = styled(SkeletonBase)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const SkeletonWeatherInfo = styled.div`
  flex: 1;
`;

const SkeletonWeatherTemp = styled(SkeletonBase)`
  height: 32px;
  width: 80px;
  margin-bottom: 8px;
`;

const SkeletonWeatherDesc = styled(SkeletonBase)`
  height: 16px;
  width: 200px;
`;

const SkeletonCardList = styled.div`
  display: grid;
  gap: 16px;
`;

const SkeletonCard = styled.div<{ isFirst?: boolean }>`
  background: ${props => props.isFirst ? 'linear-gradient(135deg, #e8f5e8, #d1f2d1)' : '#fafbfc'};
  border: 2px solid ${props => props.isFirst ? 'transparent' : '#f1f5f9'};
  border-radius: 16px;
  padding: 24px;
  position: relative;
`;

const SkeletonBadge = styled(SkeletonBase)`
  position: absolute;
  top: -12px;
  left: 24px;
  height: 24px;
  width: 60px;
  border-radius: 16px;
`;

const SkeletonCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SkeletonCardTitle = styled(SkeletonBase)`
  height: 20px;
  width: 40%;
`;

const SkeletonScore = styled(SkeletonBase)`
  height: 24px;
  width: 80px;
  border-radius: 12px;
`;

const SkeletonDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  & > div:first-child {
    grid-column: 1 / -1;
  }
`;

const SkeletonDetailItem = styled.div`
  margin-bottom: 12px;
`;

const SkeletonDetailLabel = styled(SkeletonBase)`
  height: 14px;
  width: 60%;
  margin-bottom: 4px;
`;

const SkeletonDetailValue = styled(SkeletonBase)`
  height: 16px;
  width: 80%;
`;

const SkeletonMapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
`;

const SkeletonMap = styled(SkeletonBase)`
  width: 100%;
  height: 100%;
  border-radius: 16px;
`;

const SkeletonMapOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const SkeletonTextLine = styled(SkeletonBase)<{ width?: string }>`
  height: 16px;
  width: ${props => props.width || '100%'};
  margin-bottom: 8px;
`;

const SkeletonListItem = styled.div`
  padding: 16px;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const SkeletonListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SkeletonListTitle = styled(SkeletonBase)`
  height: 18px;
  width: 60%;
`;

const SkeletonListMeta = styled(SkeletonBase)`
  height: 14px;
  width: 40%;
`;

const SkeletonListContent = styled.div`
  display: flex;
  gap: 12px;
`;

const SkeletonListText = styled.div`
  flex: 1;
`;

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  margin-top: 16px;
  justify-content: center;
`;

const Dots = styled.div`
  display: flex;
  gap: 4px;
  
  & > div {
    width: 6px;
    height: 6px;
    background: #64748b;
    border-radius: 50%;
    animation: ${keyframes`
      0%, 20% { opacity: 0.3; }
      50% { opacity: 1; }
      80%, 100% { opacity: 0.3; }
    `} 1.4s infinite;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const SkeletonUI: React.FC<SkeletonUIProps> = ({ type, count = 3 }) => {
  const renderResultSkeleton = () => (
    <SkeletonContainer>
      <SkeletonHeader>
        <SkeletonTitle />
        <SkeletonSubtitle />
      </SkeletonHeader>
      
      <div style={{ padding: '0 16px' }}>
        <SkeletonWeatherSection>
          <SkeletonWeatherIcon />
          <SkeletonWeatherInfo>
            <SkeletonWeatherTemp />
            <SkeletonWeatherDesc />
          </SkeletonWeatherInfo>
        </SkeletonWeatherSection>

        <SkeletonCardList>
          {[...Array(count)].map((_, index) => (
            <SkeletonCard key={index} isFirst={index === 0}>
              <SkeletonBadge />
              <SkeletonCardHeader>
                <SkeletonCardTitle />
                <SkeletonScore />
              </SkeletonCardHeader>
              <SkeletonDetails>
                <SkeletonDetailItem>
                  <SkeletonDetailLabel />
                  <SkeletonDetailValue />
                </SkeletonDetailItem>
                <SkeletonDetailItem>
                  <SkeletonDetailLabel />
                  <SkeletonDetailValue />
                </SkeletonDetailItem>
                <SkeletonDetailItem>
                  <SkeletonDetailLabel />
                  <SkeletonDetailValue />
                </SkeletonDetailItem>
              </SkeletonDetails>
            </SkeletonCard>
          ))}
        </SkeletonCardList>
        
        <LoadingText>
          <span>최적의 중간지점을 찾고 있어요</span>
          <Dots>
            <div />
            <div />
            <div />
          </Dots>
        </LoadingText>
      </div>
    </SkeletonContainer>
  );

  const renderCardSkeleton = () => (
    <SkeletonCard>
      <SkeletonCardHeader>
        <SkeletonCardTitle />
        <SkeletonScore />
      </SkeletonCardHeader>
      <SkeletonDetails>
        <SkeletonDetailItem>
          <SkeletonDetailLabel />
          <SkeletonDetailValue />
        </SkeletonDetailItem>
        <SkeletonDetailItem>
          <SkeletonDetailLabel />
          <SkeletonDetailValue />
        </SkeletonDetailItem>
      </SkeletonDetails>
    </SkeletonCard>
  );

  const renderListSkeleton = () => (
    <div>
      {[...Array(count)].map((_, index) => (
        <SkeletonListItem key={index}>
          <SkeletonListHeader>
            <SkeletonListTitle />
            <SkeletonListMeta />
          </SkeletonListHeader>
          <SkeletonListContent>
            <SkeletonListText>
              <SkeletonTextLine width="80%" />
              <SkeletonTextLine width="60%" />
            </SkeletonListText>
          </SkeletonListContent>
        </SkeletonListItem>
      ))}
    </div>
  );

  const renderMapSkeleton = () => (
    <SkeletonMapContainer>
      <SkeletonMap />
      <SkeletonMapOverlay>
        <div>🗺️</div>
        <div>지도를 불러오는 중...</div>
      </SkeletonMapOverlay>
    </SkeletonMapContainer>
  );

  const renderTextSkeleton = () => (
    <div>
      {[...Array(count)].map((_, index) => (
        <SkeletonTextLine 
          key={index} 
          width={index === count - 1 ? '60%' : '100%'} 
        />
      ))}
    </div>
  );

  switch (type) {
    case 'result':
      return renderResultSkeleton();
    case 'card':
      return renderCardSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'map':
      return renderMapSkeleton();
    case 'text':
      return renderTextSkeleton();
    default:
      return renderResultSkeleton();
  }
};

export default SkeletonUI;
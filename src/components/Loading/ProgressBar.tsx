import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

interface ProgressBarProps {
  progress: number; // 0-100
  animated?: boolean;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  height?: number;
  steps?: string[];
  currentStep?: number;
  className?: string;
}

const progressAnimation = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 40px 0; }
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin: 16px 0;
`;

const ProgressWrapper = styled.div<{ height: number; backgroundColor: string }>`
  width: 100%;
  height: ${props => props.height}px;
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => props.height / 2}px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div<{
  progress: number;
  color: string;
  animated: boolean;
  height: number;
}>`
  height: 100%;
  width: ${props => Math.min(100, Math.max(0, props.progress))}%;
  background: ${props => props.color};
  border-radius: ${props => props.height / 2}px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  ${props => props.animated && css`
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    background-size: 40px 40px;
    animation: ${progressAnimation} 1s linear infinite;
  `}
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    border-radius: inherit;
  }
`;

const ProgressText = styled.div`
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const StepsContainer = styled.div`
  margin-top: 16px;
`;

const StepsList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Step = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 12px;
    right: -50%;
    width: 100%;
    height: 2px;
    background: ${props => props.isCompleted ? '#10b981' : '#e5e7eb'};
    z-index: -1;
    transition: background 0.3s ease;
  }
`;

const StepCircle = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  
  ${props => {
    if (props.isCompleted) {
      return css`
        background: #10b981;
        color: white;
        &::after {
          content: '✓';
        }
      `;
    } else if (props.isActive) {
      return css`
        background: #3b82f6;
        color: white;
        animation: ${keyframes`
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        `} 2s infinite;
      `;
    } else {
      return css`
        background: #e5e7eb;
        color: #9ca3af;
      `;
    }
  }}
`;

const StepLabel = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  font-size: 12px;
  text-align: center;
  font-weight: ${props => (props.isActive || props.isCompleted) ? '600' : '400'};
  color: ${props => {
    if (props.isCompleted) return '#10b981';
    if (props.isActive) return '#3b82f6';
    return '#9ca3af';
  }};
  transition: all 0.3s ease;
`;

// 미리 정의된 단계별 메시지
const defaultSteps = [
  '위치 분석',
  '경로 계산',
  '장소 검색',
  '결과 생성'
];

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  animated = false,
  showPercentage = false,
  color = 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  backgroundColor = '#f3f4f6',
  height = 8,
  steps,
  currentStep,
  className
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progress]);

  const stepLabels = steps || defaultSteps;
  const activeStep = currentStep !== undefined ? currentStep : Math.floor((progress / 100) * stepLabels.length);

  return (
    <ProgressContainer className={className}>
      <ProgressWrapper height={height} backgroundColor={backgroundColor}>
        <ProgressFill
          progress={displayProgress}
          color={color}
          animated={animated}
          height={height}
        />
      </ProgressWrapper>
      
      {showPercentage && (
        <ProgressText>
          {Math.round(displayProgress)}% 완료
        </ProgressText>
      )}
      
      {stepLabels.length > 0 && (
        <StepsContainer>
          <StepsList>
            {stepLabels.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              
              return (
                <Step
                  key={index}
                  isActive={isActive}
                  isCompleted={isCompleted}
                >
                  <StepCircle
                    isActive={isActive}
                    isCompleted={isCompleted}
                  >
                    {!isCompleted && index + 1}
                  </StepCircle>
                  <StepLabel
                    isActive={isActive}
                    isCompleted={isCompleted}
                  >
                    {step}
                  </StepLabel>
                </Step>
              );
            })}
          </StepsList>
        </StepsContainer>
      )}
    </ProgressContainer>
  );
};

export default ProgressBar;
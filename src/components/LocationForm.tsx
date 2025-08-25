import React, { useState } from 'react';
import styled from 'styled-components';
import { Location } from '../types/kakao';

interface LocationFormProps {
  locations: Location[];
  onAddLocation: (location: Location) => void;
  onRemoveLocation: (index: number) => void;
  onCalculate: (transportationType?: string) => void;
  loading: boolean;
}

const FormContainer = styled.div`
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 28px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const AddressInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: #fafbfc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    background: white;
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:hover {
    border-color: #e2e8f0;
    background: white;
  }
`;

const AddButton = styled.button`
  padding: 16px 28px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LocationList = styled.div`
  margin-bottom: 28px;
`;

const LocationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafbfc;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const LocationText = styled.span`
  color: #334155;
  font-size: 15px;
  font-weight: 500;
  flex: 1;
`;

const RemoveButton = styled.button`
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #fecaca;

  &:hover {
    background: #fecaca;
    color: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(220, 38, 38, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CalculateButton = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.35);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: #10b981;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const TransportSection = styled.div`
  margin-bottom: 24px;
`;

const TransportTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TransportOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
`;

const TransportOption = styled.button<{ selected: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.selected ? '#3b82f6' : '#f1f5f9'};
  border-radius: 12px;
  background: ${props => props.selected ? '#f0f8ff' : 'white'};
  color: ${props => props.selected ? '#1e40af' : '#64748b'};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    border-color: #3b82f6;
    background: #f0f8ff;
    color: #1e40af;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LocationForm: React.FC<LocationFormProps> = ({
  locations,
  onAddLocation,
  onRemoveLocation,
  onCalculate,
  loading,
}) => {
  const [addressInput, setAddressInput] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('CAR');

  const transportOptions = [
    { value: 'CAR', label: '🚗 자동차', description: '평균 35km/h' },
    { value: 'SUBWAY', label: '🚇 지하철', description: '평균 40km/h' },
    { value: 'BUS', label: '🚌 버스', description: '평균 20km/h' },
    { value: 'PUBLIC_TRANSPORT', label: '🚊 대중교통', description: '지하철+버스' },
    { value: 'WALK', label: '🚶 도보', description: '평균 5km/h' }
  ];

  const handleAddLocation = () => {
    if (addressInput.trim() && locations.length < 10) {
      // 현재 위치 사용 여부 확인
      if (addressInput.toLowerCase() === '현재위치' || addressInput.toLowerCase() === '내위치') {
        getCurrentLocation();
      } else {
        onAddLocation({ address: addressInput.trim() });
        setAddressInput('');
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onAddLocation({
            address: `현재 위치 (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
            latitude,
            longitude,
          });
          setAddressInput('');
        },
        (error) => {
          alert('현재 위치를 가져올 수 없습니다: ' + error.message);
        }
      );
    } else {
      alert('브라우저가 위치 서비스를 지원하지 않습니다.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddLocation();
    }
  };

  return (
    <FormContainer>
      <Title>📍 만남 장소 찾기</Title>
      
      <InputContainer>
        <AddressInput
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="주소 입력 (예: 강남역, 홍대입구역) 또는 '현재위치'"
          disabled={locations.length >= 10}
        />
        <AddButton
          onClick={handleAddLocation}
          disabled={!addressInput.trim() || locations.length >= 10}
        >
          추가
        </AddButton>
      </InputContainer>

      <LocationList>
        {locations.map((location, index) => (
          <LocationItem key={index}>
            <LocationText>
              {index + 1}. {location.address}
            </LocationText>
            <RemoveButton onClick={() => onRemoveLocation(index)}>
              삭제
            </RemoveButton>
          </LocationItem>
        ))}
      </LocationList>

      {locations.length > 0 && (
        <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: '10px 0' }}>
          {locations.length}/10 개 위치가 추가되었습니다
        </p>
      )}

      <TransportSection>
        <TransportTitle>🚗 교통수단 선택</TransportTitle>
        <TransportOptions>
          {transportOptions.map((option) => (
            <TransportOption
              key={option.value}
              selected={selectedTransport === option.value}
              onClick={() => setSelectedTransport(option.value)}
              type="button"
            >
              <div>{option.label}</div>
              <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.7 }}>
                {option.description}
              </div>
            </TransportOption>
          ))}
        </TransportOptions>
      </TransportSection>

      <CalculateButton
        onClick={() => onCalculate(selectedTransport)}
        disabled={locations.length < 2 || loading}
      >
        {loading && <LoadingSpinner />}
        {loading ? '계산 중...' : '중간지점 계산하기'}
      </CalculateButton>

      {locations.length < 2 && (
        <p style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center', marginTop: '10px' }}>
          최소 2개 이상의 위치를 입력해주세요
        </p>
      )}
    </FormContainer>
  );
};

export default LocationForm;
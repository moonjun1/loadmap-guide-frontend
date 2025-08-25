import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface TagInfo {
  tag: string;
  displayName: string;
  emoji: string;
  category: string;
}

interface TagFilterProps {
  onTagsChange: (selectedTags: string[]) => void;
  selectedTags: string[];
  className?: string;
}

interface TagsResponse {
  success: boolean;
  message: string;
  data: TagInfo[];
}

const TagFilter: React.FC<TagFilterProps> = ({ 
  onTagsChange, 
  selectedTags = [], 
  className 
}) => {
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { key: 'ALL', label: '전체', emoji: '🔍' },
    { key: 'STUDY', label: '공부', emoji: '📚' },
    { key: 'FOOD', label: '음식', emoji: '🍽️' },
    { key: 'ENTERTAINMENT', label: '놀기', emoji: '🎮' },
    { key: 'MEETING', label: '모임', emoji: '☕' },
    { key: 'ACCESSIBILITY', label: '접근성', emoji: '🚇' },
    { key: 'PRICE', label: '가격', emoji: '💰' }
  ];

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/places/tags');
      const data: TagsResponse = await response.json();
      
      if (data.success) {
        setTags(data.data);
      } else {
        console.error('태그 조회 실패:', data.message);
      }
    } catch (error) {
      console.error('태그 조회 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = activeCategory === 'ALL' 
    ? tags 
    : tags.filter(tag => tag.category === activeCategory);

  const handleTagClick = (tagName: string) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter(tag => tag !== tagName)
      : [...selectedTags, tagName];
    
    onTagsChange(newSelectedTags);
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  return (
    <Container className={className}>
      <Header>
        <Title>
          <span>원하는 장소 태그를 선택하세요</span>
          {selectedTags.length > 0 && (
            <SelectedCount>{selectedTags.length}개 선택</SelectedCount>
          )}
        </Title>
        {selectedTags.length > 0 && (
          <ClearButton onClick={handleClearAll}>
            전체 해제
          </ClearButton>
        )}
      </Header>

      <CategoryTabs>
        {categories.map(category => (
          <CategoryTab
            key={category.key}
            active={activeCategory === category.key}
            onClick={() => setActiveCategory(category.key)}
          >
            <span className="emoji">{category.emoji}</span>
            <span className="label">{category.label}</span>
          </CategoryTab>
        ))}
      </CategoryTabs>

      {loading ? (
        <LoadingMessage>태그 목록을 불러오는 중...</LoadingMessage>
      ) : (
        <TagsGrid>
          {filteredTags.map(tag => (
            <TagButton
              key={tag.tag}
              selected={selectedTags.includes(tag.tag)}
              onClick={() => handleTagClick(tag.tag)}
            >
              <TagEmoji>{tag.emoji}</TagEmoji>
              <TagText>{tag.displayName}</TagText>
            </TagButton>
          ))}
        </TagsGrid>
      )}

      {selectedTags.length > 0 && (
        <SelectedTagsSection>
          <SelectedTagsTitle>선택된 태그</SelectedTagsTitle>
          <SelectedTags>
            {selectedTags.map(tagName => {
              const tagInfo = tags.find(t => t.tag === tagName);
              return tagInfo ? (
                <SelectedTag key={tagName}>
                  <span className="emoji">{tagInfo.emoji}</span>
                  <span className="name">{tagInfo.displayName}</span>
                  <RemoveButton onClick={() => handleTagClick(tagName)}>
                    ×
                  </RemoveButton>
                </SelectedTag>
              ) : null;
            })}
          </SelectedTags>
        </SelectedTagsSection>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
`;

const SelectedCount = styled.span`
  background: #007AFF;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
`;

const ClearButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    color: #495057;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding: 4px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryTab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  background: ${props => props.active ? '#007AFF' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6c757d'};

  .emoji {
    font-size: 16px;
  }

  .label {
    font-weight: ${props => props.active ? '600' : '500'};
  }

  &:hover {
    background: ${props => props.active ? '#0056CC' : '#e9ecef'};
    color: ${props => props.active ? 'white' : '#495057'};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  font-size: 16px;
`;

const TagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
`;

const TagButton = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid ${props => props.selected ? '#007AFF' : '#e9ecef'};
  border-radius: 12px;
  background: ${props => props.selected ? '#f0f8ff' : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 80px;

  &:hover {
    border-color: ${props => props.selected ? '#0056CC' : '#007AFF'};
    background: ${props => props.selected ? '#e6f3ff' : '#f8f9fa'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TagEmoji = styled.span`
  font-size: 24px;
  line-height: 1;
`;

const TagText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  text-align: center;
  word-break: keep-all;
`;

const SelectedTagsSection = styled.div`
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
`;

const SelectedTagsTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 12px;
`;

const SelectedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SelectedTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #007AFF;
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;

  .emoji {
    font-size: 14px;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default TagFilter;
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  existingCategories: string[];
  placeholder?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  existingCategories,
  placeholder = "Выберите категорию"
}) => {
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Проверяем, является ли текущее значение новой категорией
  useEffect(() => {
    if (value && !existingCategories.includes(value)) {
      setIsNewCategory(true);
      setNewCategoryName(value);
    }
  }, [value, existingCategories]);

  const handleCategoryChange = (selectedValue: string) => {
    if (selectedValue === 'new') {
      setIsNewCategory(true);
      setNewCategoryName('');
      onChange('');
    } else {
      setIsNewCategory(false);
      setNewCategoryName('');
      onChange(selectedValue);
    }
  };

  const handleNewCategoryChange = (newValue: string) => {
    setNewCategoryName(newValue);
    onChange(newValue);
  };

  return (
    <Container>
      {!isNewCategory ? (
        <Select
          value={value}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {existingCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value="new">➕ Новая категория</option>
        </Select>
      ) : (
        <NewCategoryContainer>
          <Select
            value="new"
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="new">➕ Новая категория</option>
            {existingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Input
            type="text"
            value={newCategoryName}
            onChange={(e) => handleNewCategoryChange(e.target.value)}
            placeholder="Введите название новой категории"
            required
          />
        </NewCategoryContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const NewCategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export default CategorySelector;







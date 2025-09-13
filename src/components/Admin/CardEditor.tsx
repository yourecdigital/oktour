import React, { useState } from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  padding: 20px;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
`;

const Title = styled.h2`
  color: #1e293b;
  margin: 0;
  font-size: 20px;
`;

const AddButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;

  &:hover {
    background: #059669;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div<{ imageUrl?: string }>`
  height: 200px;
  background: ${props => props.imageUrl ? `url(${props.imageUrl})` : '#f1f5f9'};
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 14px;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const CardTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #1e293b;
  font-size: 16px;
`;

const CardDescription = styled.p`
  margin: 0 0 15px 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  background: ${props => props.variant === 'delete' ? '#ef4444' : '#3b82f6'};
  color: white;

  &:hover {
    background: ${props => props.variant === 'delete' ? '#dc2626' : '#2563eb'};
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #1e293b;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  
  &:hover {
    color: #1e293b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FileInput = styled.input`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
`;

const SaveButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.3s ease;

  &:hover {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export interface CardData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
}

interface CardEditorProps {
  title: string;
  cards: CardData[];
  onSave: (card: CardData) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ title, cards, onSave, onDelete, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [formData, setFormData] = useState<Partial<CardData>>({});

  const handleEdit = (card: CardData) => {
    setEditingCard(card);
    setFormData(card);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCard(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCard) {
      onSave({ ...editingCard, ...formData });
    } else {
      onSave({ 
        id: Date.now().toString(), 
        title: formData.title || '', 
        description: formData.description || '',
        imageUrl: formData.imageUrl,
        price: formData.price
      });
    }
    setIsModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, imageUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <Title>{title}</Title>
        <AddButton onClick={handleAdd}>Добавить карточку</AddButton>
      </EditorHeader>

      <CardsGrid>
        {cards.map((card) => (
          <Card key={card.id}>
            <CardImage imageUrl={card.imageUrl}>
              {!card.imageUrl && 'Нет изображения'}
            </CardImage>
            <CardContent>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              {card.price && <p>Цена: {card.price} ₽</p>}
              <CardActions>
                <ActionButton onClick={() => handleEdit(card)}>
                  Редактировать
                </ActionButton>
                <ActionButton variant="delete" onClick={() => onDelete(card.id)}>
                  Удалить
                </ActionButton>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </CardsGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingCard ? 'Редактировать карточку' : 'Добавить карточку'}
            </ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
          </ModalHeader>
          
          <Form onSubmit={handleSave}>
            <FormGroup>
              <Label>Название</Label>
              <Input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Описание</Label>
              <TextArea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Изображение</Label>
              <FileInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Цена (₽)</Label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </FormGroup>
            
            <SaveButton type="submit">
              {editingCard ? 'Сохранить' : 'Добавить'}
            </SaveButton>
          </Form>
        </ModalContent>
      </Modal>
    </EditorContainer>
  );
};

export default CardEditor;


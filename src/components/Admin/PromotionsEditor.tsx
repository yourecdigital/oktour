import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import CategorySelector from './CategorySelector';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #1e293b;
  margin: 0;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  color: #1e293b;
  margin: 0 0 10px 0;
  font-size: 18px;
`;

const CardDescription = styled.p`
  color: #64748b;
  margin: 0 0 15px 0;
  line-height: 1.5;
`;

const DiscountBadge = styled.div`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 16px;
  display: inline-block;
  margin-bottom: 15px;
`;

const CardInfo = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  color: #64748b;
`;

const StatusBadge = styled.span<{ active: boolean }>`
  background: ${props => props.active ? '#10b981' : '#6b7280'};
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const EditButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;

  &:hover {
    background: #2563eb;
  }
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;

  &:hover {
    background: #dc2626;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  color: #1e293b;
  margin: 0 0 20px 0;
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
  font-weight: 500;
  color: #374151;
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

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const SaveButton = styled.button`
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

const CancelButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;

  &:hover {
    background: #4b5563;
  }
`;

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount_percent: number;
  valid_until?: string;
  category?: string;
  image_url?: string;
  active: boolean;
}

const PromotionsEditor: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percent: '',
    valid_until: '',
    category: '',
    image_url: '',
    active: true
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/promotions');
      setPromotions(response.data);
      
      // Собираем уникальные категории из существующих акций
      const categories = Array.from(new Set(
        response.data
          .map((promotion: Promotion) => promotion.category)
          .filter(Boolean)
      )) as string[];
      setExistingCategories(categories);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Ошибка загрузки акций');
    }
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      discount_percent: '',
      valid_until: '',
      category: '',
      image_url: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      discount_percent: promotion.discount_percent.toString(),
      valid_until: promotion.valid_until || '',
      category: promotion.category || '',
      image_url: promotion.image_url || '',
      active: promotion.active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту акцию?')) {
      try {
        await axios.delete(`http://localhost:5000/api/promotions/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
        toast.success('Акция удалена');
        fetchPromotions();
      } catch (error) {
        console.error('Error deleting promotion:', error);
        toast.error('Ошибка удаления акции');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const promotionData = {
        ...formData,
        discount_percent: parseInt(formData.discount_percent)
      };

      if (editingPromotion) {
        await axios.put(`http://localhost:5000/api/promotions/${editingPromotion.id}`, promotionData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Акция обновлена');
      } else {
        await axios.post('http://localhost:5000/api/promotions', promotionData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Акция создана');
      }

      setIsModalOpen(false);
      fetchPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error('Ошибка сохранения акции');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Без ограничений';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Container>
      <Header>
        <Title>Управление акциями</Title>
        <AddButton onClick={handleAddNew}>Добавить акцию</AddButton>
      </Header>

      <Grid>
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardTitle>{promotion.title}</CardTitle>
            <CardDescription>{promotion.description}</CardDescription>
            <DiscountBadge>-{promotion.discount_percent}%</DiscountBadge>
            <CardInfo>
              <strong>Действует до:</strong> {formatDate(promotion.valid_until || '')}
            </CardInfo>
            <CardInfo>
              <strong>Статус:</strong> <StatusBadge active={promotion.active}>
                {promotion.active ? 'Активна' : 'Неактивна'}
              </StatusBadge>
            </CardInfo>
            {promotion.category && (
              <CardInfo>
                <strong>Категория:</strong> {promotion.category}
              </CardInfo>
            )}
            {promotion.image_url && (
              <CardInfo>
                <strong>Изображение:</strong>
                <img 
                  src={`http://localhost:5000${promotion.image_url}`} 
                  alt={promotion.title}
                  style={{ 
                    width: '100%', 
                    height: '150px', 
                    objectFit: 'cover', 
                    borderRadius: '6px', 
                    marginTop: '8px' 
                  }}
                />
              </CardInfo>
            )}
            <ButtonGroup>
              <EditButton onClick={() => handleEdit(promotion)}>
                Редактировать
              </EditButton>
              <DeleteButton onClick={() => handleDelete(promotion.id)}>
                Удалить
              </DeleteButton>
            </ButtonGroup>
          </Card>
        ))}
      </Grid>

      {isModalOpen && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              {editingPromotion ? 'Редактировать акцию' : 'Добавить акцию'}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Название акции</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Описание</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Процент скидки</Label>
                <Input
                  type="number"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                  required
                  min="1"
                  max="100"
                />
              </FormGroup>
              <FormGroup>
                <Label>Действует до (необязательно)</Label>
                <Input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Категория</Label>
                <CategorySelector
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  existingCategories={existingCategories}
                  placeholder="Выберите категорию акции"
                />
              </FormGroup>
              <FormGroup>
                <Label>URL изображения (необязательно)</Label>
                <Input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  Активна
                </Label>
              </FormGroup>
              <ModalButtons>
                <CancelButton type="button" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </CancelButton>
                <SaveButton type="submit">
                  {editingPromotion ? 'Сохранить' : 'Создать'}
                </SaveButton>
              </ModalButtons>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default PromotionsEditor;


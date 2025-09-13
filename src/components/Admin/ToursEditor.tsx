import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
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
  background: rgba(107, 114, 128, 0.9);
  color: white;
  border: 1px solid rgba(107, 114, 128, 0.3);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(156, 163, 175, 0.95);
    border-color: rgba(107, 114, 128, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
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

const CardPrice = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 15px;
`;

const CardInfo = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  color: #64748b;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const EditButton = styled.button`
  background: rgba(107, 114, 128, 0.9);
  color: white;
  border: 1px solid rgba(107, 114, 128, 0.3);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(156, 163, 175, 0.95);
    border-color: rgba(107, 114, 128, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const DeleteButton = styled.button`
  background: rgba(107, 114, 128, 0.9);
  color: white;
  border: 1px solid rgba(107, 114, 128, 0.3);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(156, 163, 175, 0.95);
    border-color: rgba(107, 114, 128, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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

const FileInput = styled.input`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ImagePreview = styled.div`
  margin-top: 10px;
  max-width: 200px;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 6px;
    border: 1px solid #d1d5db;
  }
`;

const UploadButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
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

interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  duration?: string;
  destination?: string;
  category?: string;
  image_url?: string;
  available: boolean;
}

const ToursEditor: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category') || 'Все';
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [allTours, setAllTours] = useState<Tour[]>([]); // Все туры для фильтрации
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    destination: '',
    category: '',
    image_url: '',
    available: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchTours();
  }, []);

  // Обновляем фильтрацию при изменении категории
  useEffect(() => {
    if (allTours.length > 0) {
      let filteredTours = allTours;
      if (selectedCategory !== 'Все') {
        filteredTours = allTours.filter((tour: Tour) => tour.category === selectedCategory);
      }
      setTours(filteredTours);
    }
  }, [selectedCategory, allTours]);

  const fetchTours = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tours');
      const allToursData = response.data;
      setAllTours(allToursData);
      
      // Фильтруем туры по выбранной категории
      let filteredTours = allToursData;
      if (selectedCategory !== 'Все') {
        filteredTours = allToursData.filter((tour: Tour) => tour.category === selectedCategory);
      }
      setTours(filteredTours);
      
      // Собираем уникальные категории из существующих туров
      const categories = Array.from(new Set(
        allToursData
          .map((tour: Tour) => tour.category)
          .filter(Boolean)
      )) as string[];
      setExistingCategories(categories);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Ошибка загрузки туров');
    }
  };

  const handleAddNew = () => {
    setEditingTour(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      destination: '',
      category: '',
      image_url: '',
      available: true
    });
    setSelectedFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name,
      description: tour.description,
      price: tour.price.toString(),
      duration: tour.duration || '',
      destination: tour.destination || '',
      category: tour.category || '',
      image_url: tour.image_url || '',
      available: tour.available
    });
    setSelectedFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тур?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tours/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
        toast.success('Тур удален');
        fetchTours();
      } catch (error) {
        console.error('Error deleting tour:', error);
        toast.error('Ошибка удаления тура');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Выберите файл для загрузки');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        setFormData(prev => ({ ...prev, image_url: response.data.imageUrl }));
        toast.success('Изображение загружено');
        setSelectedFile(null);
        setImagePreview('');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tourData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingTour) {
        await axios.put(`http://localhost:5000/api/tours/${editingTour.id}`, tourData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Тур обновлен');
      } else {
        await axios.post('http://localhost:5000/api/tours', tourData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Тур создан');
      }

      setIsModalOpen(false);
      fetchTours();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Ошибка сохранения тура');
    }
  };

  return (
    <Container>
      <Header>
        <Title>Управление турами</Title>
        <AddButton onClick={handleAddNew}>Добавить тур</AddButton>
      </Header>

      <Grid>
        {tours.map((tour) => (
          <Card key={tour.id}>
            <CardTitle>{tour.name}</CardTitle>
            <CardDescription>{tour.description}</CardDescription>
            <CardPrice>{tour.price} ₽</CardPrice>
            {tour.duration && (
              <CardInfo>
                <strong>Длительность:</strong> {tour.duration}
              </CardInfo>
            )}
            {tour.destination && (
              <CardInfo>
                <strong>Направление:</strong> {tour.destination}
              </CardInfo>
            )}
            {tour.category && (
              <CardInfo>
                <strong>Категория:</strong> {tour.category}
              </CardInfo>
            )}
            <CardInfo>
              <strong>Статус:</strong> {tour.available ? 'Доступен' : 'Недоступен'}
            </CardInfo>
            {tour.image_url && (
              <CardInfo>
                <strong>Изображение:</strong>
                <img 
                  src={`http://localhost:5000${tour.image_url}`} 
                  alt={tour.name}
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
              <EditButton onClick={() => handleEdit(tour)}>
                Редактировать
              </EditButton>
              <DeleteButton onClick={() => handleDelete(tour.id)}>
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
              {editingTour ? 'Редактировать тур' : 'Добавить тур'}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Название тура</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <Label>Цена (₽)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </FormGroup>
              <FormGroup>
                <Label>Длительность (необязательно)</Label>
                <Input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="например: 4 часа"
                />
              </FormGroup>
              <FormGroup>
                <Label>Направление (необязательно)</Label>
                <Input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="например: Сочи"
                />
              </FormGroup>
              <FormGroup>
                <Label>Категория</Label>
                <CategorySelector
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  existingCategories={existingCategories}
                  placeholder="Выберите категорию тура"
                />
              </FormGroup>
              <FormGroup>
                <Label>Загрузить изображение</Label>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                {imagePreview && (
                  <ImagePreview>
                    <img src={imagePreview} alt="Preview" />
                  </ImagePreview>
                )}
                <UploadButton
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? 'Загрузка...' : 'Загрузить'}
                </UploadButton>
              </FormGroup>
              <FormGroup>
                <Label>URL изображения (необязательно)</Label>
                <Input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Или введите URL изображения"
                />
                {formData.image_url && (
                  <ImagePreview>
                    <img 
                      src={formData.image_url.startsWith('http') ? formData.image_url : `http://localhost:5000${formData.image_url}`} 
                      alt="Current" 
                    />
                  </ImagePreview>
                )}
              </FormGroup>
              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  />
                  Доступен для бронирования
                </Label>
              </FormGroup>
              <ModalButtons>
                <CancelButton type="button" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </CancelButton>
                <SaveButton type="submit">
                  {editingTour ? 'Сохранить' : 'Создать'}
                </SaveButton>
              </ModalButtons>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ToursEditor;


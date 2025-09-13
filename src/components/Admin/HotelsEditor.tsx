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

const CardPrice = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #059669;
  margin-bottom: 15px;
`;

const CardInfo = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  color: #64748b;
`;

const Stars = styled.div`
  color: #fbbf24;
  font-size: 16px;
  margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
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

const Select = styled.select`
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

interface Hotel {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  stars: number;
  category?: string;
  image_url?: string;
  available: boolean;
}

const HotelsEditor: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category') || 'Все';
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]); // Все отели для фильтрации
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    stars: '3',
    category: '',
    image_url: '',
    available: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  // Обновляем фильтрацию при изменении категории
  useEffect(() => {
    if (allHotels.length > 0) {
      let filteredHotels = allHotels;
      if (selectedCategory !== 'Все') {
        filteredHotels = allHotels.filter((hotel: Hotel) => hotel.category === selectedCategory);
      }
      setHotels(filteredHotels);
    }
  }, [selectedCategory, allHotels]);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hotels');
      const allHotelsData = response.data;
      setAllHotels(allHotelsData);
      
      // Фильтруем отели по выбранной категории
      let filteredHotels = allHotelsData;
      if (selectedCategory !== 'Все') {
        filteredHotels = allHotelsData.filter((hotel: Hotel) => hotel.category === selectedCategory);
      }
      setHotels(filteredHotels);
      
      // Собираем уникальные категории из существующих отелей
      const categories = Array.from(new Set(
        allHotelsData
          .map((hotel: Hotel) => hotel.category)
          .filter(Boolean)
      )) as string[];
      setExistingCategories(categories);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error('Ошибка загрузки отелей');
    }
  };

  const handleAddNew = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      location: '',
      stars: '3',
      category: '',
      image_url: '',
      available: true
    });
    setSelectedFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      description: hotel.description,
      price: hotel.price.toString(),
      location: hotel.location,
      stars: hotel.stars.toString(),
      category: hotel.category || '',
      image_url: hotel.image_url || '',
      available: hotel.available
    });
    setSelectedFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отель?')) {
      try {
        await axios.delete(`http://localhost:5000/api/hotels/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
        toast.success('Отель удален');
        fetchHotels();
      } catch (error) {
        console.error('Error deleting hotel:', error);
        toast.error('Ошибка удаления отеля');
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
      const hotelData = {
        ...formData,
        price: parseFloat(formData.price),
        stars: parseInt(formData.stars)
      };

      if (editingHotel) {
        await axios.put(`http://localhost:5000/api/hotels/${editingHotel.id}`, hotelData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Отель обновлен');
      } else {
        await axios.post('http://localhost:5000/api/hotels', hotelData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Отель создан');
      }

      setIsModalOpen(false);
      fetchHotels();
    } catch (error) {
      console.error('Error saving hotel:', error);
      toast.error('Ошибка сохранения отеля');
    }
  };

  const renderStars = (stars: number) => {
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <Container>
      <Header>
        <Title>Управление отелями</Title>
        <AddButton onClick={handleAddNew}>Добавить отель</AddButton>
      </Header>

      <Grid>
        {hotels.map((hotel) => (
          <Card key={hotel.id}>
            <CardTitle>{hotel.name}</CardTitle>
            <CardDescription>{hotel.description}</CardDescription>
            <CardPrice>{hotel.price} ₽</CardPrice>
            <CardInfo>
              <strong>Расположение:</strong> {hotel.location}
            </CardInfo>
            <Stars>{renderStars(hotel.stars)}</Stars>
            {hotel.category && (
              <CardInfo>
                <strong>Категория:</strong> {hotel.category}
              </CardInfo>
            )}
            <CardInfo>
              <strong>Статус:</strong> {hotel.available ? 'Доступен' : 'Недоступен'}
            </CardInfo>
            {hotel.image_url && (
              <CardInfo>
                <strong>Изображение:</strong>
                <img 
                  src={`http://localhost:5000${hotel.image_url}`} 
                  alt={hotel.name}
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
              <EditButton onClick={() => handleEdit(hotel)}>
                Редактировать
              </EditButton>
              <DeleteButton onClick={() => handleDelete(hotel.id)}>
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
              {editingHotel ? 'Редактировать отель' : 'Добавить отель'}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Название отеля</Label>
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
                <Label>Цена за ночь (₽)</Label>
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
                <Label>Расположение</Label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Количество звезд</Label>
                <Select
                  value={formData.stars}
                  onChange={(e) => setFormData({ ...formData, stars: e.target.value })}
                >
                  <option value="1">1 звезда</option>
                  <option value="2">2 звезды</option>
                  <option value="3">3 звезды</option>
                  <option value="4">4 звезды</option>
                  <option value="5">5 звезд</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Категория</Label>
                <CategorySelector
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  existingCategories={existingCategories}
                  placeholder="Выберите категорию отеля"
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
                  {editingHotel ? 'Сохранить' : 'Создать'}
                </SaveButton>
              </ModalButtons>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default HotelsEditor;


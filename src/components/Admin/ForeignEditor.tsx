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

const Highlights = styled.div`
  margin-bottom: 15px;
`;

const HighlightTag = styled.span`
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  display: inline-block;
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

const Select = styled.select`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

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

const HighlightsInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HighlightInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
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

const AddHighlightButton = styled.button`
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

const RemoveHighlightButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s ease;

  &:hover {
    background: #dc2626;
  }
`;

// Популярные страны для путешествий
const POPULAR_COUNTRIES = [
  'Италия',
  'Франция',
  'Испания',
  'Германия',
  'Турция',
  'Греция',
  'Таиланд',
  'Япония',
  'США',
  'ОАЭ'
];

interface ForeignTour {
  id: number;
  name: string;
  description: string;
  price: number;
  country: string;
  duration?: string;
  highlights?: string[];
  category?: string;
  image_url?: string;
  available: boolean;
}

const ForeignEditor: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category') || 'Все';
  
  const [tours, setTours] = useState<ForeignTour[]>([]);
  const [allTours, setAllTours] = useState<ForeignTour[]>([]); // Все туры для фильтрации
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<ForeignTour | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    country: '',
    duration: '',
    highlights: [] as string[],
    category: '',
    image_url: '',
    available: true
  });
  const [newHighlight, setNewHighlight] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [existingCountries, setExistingCountries] = useState<string[]>([]);

  useEffect(() => {
    fetchTours();
  }, []);

  // Обновляем фильтрацию при изменении категории (страны)
  useEffect(() => {
    if (allTours.length > 0) {
      let filteredTours = allTours;
      if (selectedCategory !== 'Все') {
        filteredTours = allTours.filter((tour: ForeignTour) => tour.country === selectedCategory);
      }
      setTours(filteredTours);
    }
  }, [selectedCategory, allTours]);

  const fetchTours = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/foreign-tours');
      // Parse highlights JSON for each tour
      const toursWithHighlights = response.data.map((tour: any) => ({
        ...tour,
        highlights: tour.highlights ? JSON.parse(tour.highlights) : []
      }));
      setAllTours(toursWithHighlights);
      
      // Фильтруем туры по выбранной стране
      let filteredTours = toursWithHighlights;
      if (selectedCategory !== 'Все') {
        filteredTours = toursWithHighlights.filter((tour: ForeignTour) => tour.country === selectedCategory);
      }
      setTours(filteredTours);
      
      // Собираем уникальные категории из существующих туров
      const categories = Array.from(new Set(
        response.data
          .map((tour: any) => tour.category)
          .filter(Boolean)
      )) as string[];
      setExistingCategories(categories);
      
      // Собираем уникальные страны из существующих туров
      const countries = Array.from(new Set([
        ...POPULAR_COUNTRIES,
        ...response.data.map((tour: any) => tour.country)
      ]));
      setExistingCountries(countries);
    } catch (error) {
      console.error('Error fetching foreign tours:', error);
      toast.error('Ошибка загрузки зарубежных туров');
    }
  };

  const handleAddNew = () => {
    setEditingTour(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      country: '',
      duration: '',
      highlights: [],
      category: '',
      image_url: '',
      available: true
    });
    setSelectedFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleEdit = (tour: ForeignTour) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name,
      description: tour.description,
      price: tour.price.toString(),
      country: tour.country,
      duration: tour.duration || '',
      highlights: tour.highlights || [],
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
        await axios.delete(`http://localhost:5000/api/foreign-tours/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Тур удален');
        fetchTours();
      } catch (error) {
        console.error('Error deleting foreign tour:', error);
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

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tourData = {
        ...formData,
        price: parseFloat(formData.price),
        highlights: JSON.stringify(formData.highlights)
      };

      if (editingTour) {
        await axios.put(`http://localhost:5000/api/foreign-tours/${editingTour.id}`, tourData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Тур обновлен');
      } else {
        await axios.post('http://localhost:5000/api/foreign-tours', tourData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Тур создан');
      }

      setIsModalOpen(false);
      fetchTours();
    } catch (error) {
      console.error('Error saving foreign tour:', error);
      toast.error('Ошибка сохранения тура');
    }
  };



  return (
    <Container>
      <Header>
        <Title>Управление зарубежными турами</Title>
        <AddButton onClick={handleAddNew}>Добавить тур</AddButton>
      </Header>

      <Grid>
        {tours.map((tour) => (
          <Card key={tour.id}>
            <CardTitle>{tour.name}</CardTitle>
            <CardDescription>{tour.description}</CardDescription>
            <CardPrice>{tour.price} ₽</CardPrice>
            <CardInfo>
              <strong>Страна:</strong> {tour.country}
            </CardInfo>
            {tour.duration && (
              <CardInfo>
                <strong>Длительность:</strong> {tour.duration}
              </CardInfo>
            )}
            {tour.category && (
              <CardInfo>
                <strong>Категория:</strong> {tour.category}
              </CardInfo>
            )}
            {tour.highlights && tour.highlights.length > 0 && (
              <Highlights>
                <strong>Особенности:</strong>
                <div style={{ marginTop: '5px' }}>
                  {tour.highlights.map((highlight, index) => (
                    <HighlightTag key={index}>{highlight}</HighlightTag>
                  ))}
                </div>
              </Highlights>
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
                <Label>Страна</Label>
                <Select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                >
                  <option value="">Выберите страну</option>
                  {existingCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                  <option value="new">➕ Новая страна</option>
                </Select>
                {formData.country === 'new' && (
                  <Input
                    type="text"
                    placeholder="Введите название новой страны"
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                )}
              </FormGroup>
              <FormGroup>
                <Label>Длительность (необязательно)</Label>
                <Input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="например: 7 дней / 6 ночей"
                />
              </FormGroup>
                              <FormGroup>
                  <Label>Категория</Label>
                  <CategorySelector
                    value={formData.category}
                    onChange={(category) => setFormData({ ...formData, category })}
                    existingCategories={existingCategories}
                    placeholder="Выберите категорию тура"
                  />
                </FormGroup>
              <FormGroup>
                <Label>Особенности тура</Label>
                <HighlightsInput>
                  {formData.highlights.map((highlight, index) => (
                    <HighlightInput key={index}>
                      <Input
                        type="text"
                        value={highlight}
                        onChange={(e) => {
                          const newHighlights = [...formData.highlights];
                          newHighlights[index] = e.target.value;
                          setFormData({ ...formData, highlights: newHighlights });
                        }}
                      />
                      <RemoveHighlightButton
                        type="button"
                        onClick={() => removeHighlight(index)}
                      >
                        Удалить
                      </RemoveHighlightButton>
                    </HighlightInput>
                  ))}
                  <HighlightInput>
                    <Input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Добавить особенность"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    />
                    <AddHighlightButton type="button" onClick={addHighlight}>
                      Добавить
                    </AddHighlightButton>
                  </HighlightInput>
                </HighlightsInput>
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

export default ForeignEditor;


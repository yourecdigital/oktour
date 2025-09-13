import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';

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

interface Cruise {
  id: number;
  name: string;
  description: string;
  price: number;
  departure: string;
  duration?: string;
  destination?: string;
  image_url?: string;
  available: boolean;
}

const CruisesEditor: React.FC = () => {
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCruise, setEditingCruise] = useState<Cruise | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    departure: '',
    duration: '',
    destination: '',
    image_url: '',
    available: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCruises();
  }, []);

  const fetchCruises = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cruises');
      setCruises(response.data);
    } catch (error) {
      console.error('Error fetching cruises:', error);
      toast.error('Ошибка загрузки круизов');
    }
  };

  const handleAddNew = () => {
    setEditingCruise(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      departure: '',
      duration: '',
      destination: '',
      image_url: '',
      available: true
    });
    setSelectedFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleEdit = (cruise: Cruise) => {
    setEditingCruise(cruise);
    setFormData({
      name: cruise.name,
      description: cruise.description,
      price: cruise.price.toString(),
      departure: cruise.departure,
      duration: cruise.duration || '',
      destination: cruise.destination || '',
      image_url: cruise.image_url || '',
      available: cruise.available
    });
    setSelectedFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот круиз?')) {
      try {
        await axios.delete(`http://localhost:5000/api/cruises/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
        toast.success('Круиз удален');
        fetchCruises();
      } catch (error) {
        console.error('Error deleting cruise:', error);
        toast.error('Ошибка удаления круиза');
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
      const cruiseData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingCruise) {
        await axios.put(`http://localhost:5000/api/cruises/${editingCruise.id}`, cruiseData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Круиз обновлен');
      } else {
        await axios.post('http://localhost:5000/api/cruises', cruiseData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Круиз создан');
      }

      setIsModalOpen(false);
      fetchCruises();
    } catch (error) {
      console.error('Error saving cruise:', error);
      toast.error('Ошибка сохранения круиза');
    }
  };

  return (
    <Container>
      <Header>
        <Title>Управление круизами</Title>
        <AddButton onClick={handleAddNew}>Добавить круиз</AddButton>
      </Header>

      <Grid>
        {cruises.map((cruise) => (
          <Card key={cruise.id}>
            <CardTitle>{cruise.name}</CardTitle>
            <CardDescription>{cruise.description}</CardDescription>
            <CardPrice>{cruise.price} ₽</CardPrice>
            <CardInfo>
              <strong>Порт отправления:</strong> {cruise.departure}
            </CardInfo>
            {cruise.duration && (
              <CardInfo>
                <strong>Длительность:</strong> {cruise.duration}
              </CardInfo>
            )}
            {cruise.destination && (
              <CardInfo>
                <strong>Направление:</strong> {cruise.destination}
              </CardInfo>
            )}
            <CardInfo>
              <strong>Статус:</strong> {cruise.available ? 'Доступен' : 'Недоступен'}
            </CardInfo>
            {cruise.image_url && (
              <CardInfo>
                <strong>Изображение:</strong>
                <img 
                  src={`http://localhost:5000${cruise.image_url}`} 
                  alt={cruise.name}
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
              <EditButton onClick={() => handleEdit(cruise)}>
                Редактировать
              </EditButton>
              <DeleteButton onClick={() => handleDelete(cruise.id)}>
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
              {editingCruise ? 'Редактировать круиз' : 'Добавить круиз'}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Название круиза</Label>
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
                <Label>Порт отправления</Label>
                <Input
                  type="text"
                  value={formData.departure}
                  onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                  required
                />
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
                <Label>Направление (необязательно)</Label>
                <Input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="например: Средиземное море"
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
                  {editingCruise ? 'Сохранить' : 'Создать'}
                </SaveButton>
              </ModalButtons>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CruisesEditor;


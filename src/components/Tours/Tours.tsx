import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styled from 'styled-components';

interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  destination: string;
  image_url?: string;
}

const ToursContainer = styled.div`
  padding: 60px 20px;
  background: #f8f9fa;
`;

const ToursContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 50px;
  font-size: 36px;
`;

const FilterSection = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'linear-gradient(135deg, #1e293b 0%, #1e293b 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? 'transparent' : '#1e293b'};
  border-radius: 25px;
  padding: 10px 20px;
  margin: 0 10px 10px 0;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CategorySection = styled.div`
  margin-bottom: 60px;
`;

const CategoryTitle = styled.h3`
  color: #333;
  font-size: 28px;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 3px solid #1e293b;
  display: inline-block;
`;

const ToursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const TourCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TourImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
`;

const TourContent = styled.div`
  padding: 20px;
`;

const TourName = styled.h4`
  color: #333;
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 1.3;
`;

const TourDescription = styled.p`
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
  font-size: 14px;
`;

const TourPrice = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 15px;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #1e293b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Tours: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Данные туров
  const toursData: Tour[] = [
    // Красная поляна
    {
      id: 1,
      name: "Панорама Красной поляны",
      description: "Захватывающий вид на горные вершины и долины Красной Поляны. Идеально для фотографий и наслаждения природой.",
      price: 2500,
      category: "Красная поляна",
      duration: "1 час",
      destination: "Красная Поляна"
    },
    {
      id: 2,
      name: "Поляна 960",
      description: "Посещение знаменитой смотровой площадки на высоте 960 метров. Панорамный вид на весь курорт.",
      price: 1800,
      category: "Красная поляна",
      duration: "1 час",
      destination: "Красная Поляна"
    },
    {
      id: 3,
      name: "Панорама Красной Поляны V1 тариф семейный",
      description: "Специальный семейный тариф для посещения панорамной площадки. Включает скидки для детей.",
      price: 4000,
      category: "Красная поляна",
      duration: "1 час",
      destination: "Красная Поляна"
    },
    // Прогулочные билеты
    {
      id: 4,
      name: "Прогулочный билет \"День на Роза Хутор\"",
      description: "Полноценный день на знаменитом курорте Роза Хутор. Включает подъемники и доступ к инфраструктуре.",
      price: 3500,
      category: "Прогулочные билеты",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 5,
      name: "Прогулочный билет «Путь к вершинам + Парк Водопадов + Моя Россия»",
      description: "Комплексный тур включающий подъем к вершинам, посещение парка водопадов и этнографического комплекса.",
      price: 4200,
      category: "Прогулочные билеты",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 6,
      name: "Прогулочный билет «В горы к альпакам»",
      description: "Уникальная возможность познакомиться с альпаками в горных условиях. Интерактивная программа для всей семьи.",
      price: 2800,
      category: "Прогулочные билеты",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 7,
      name: "Прогулочный билет «В горы с гидом»",
      description: "Профессиональный гид проведет вас по самым живописным маршрутам с интересными рассказами о местности.",
      price: 3200,
      category: "Прогулочные билеты",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 8,
      name: "Родельбан 1 круг Утренний",
      description: "Утренний спуск на родельбане по специальной трассе. Идеально для начала активного дня.",
      price: 800,
      category: "Прогулочные билеты",
      duration: "1 час",
      destination: "Роза Хутор"
    },
    {
      id: 9,
      name: "Родельбан 1 круг",
      description: "Классический спуск на родельбане по горной трассе. Захватывающие эмоции и адреналин.",
      price: 1000,
      category: "Прогулочные билеты",
      duration: "1 час",
      destination: "Роза Хутор"
    },
    {
      id: 10,
      name: "Родельбан 2 круга",
      description: "Двойная порция адреналина! Два спуска на родельбане с небольшим перерывом.",
      price: 1800,
      category: "Прогулочные билеты",
      duration: "1 час",
      destination: "Роза Хутор"
    },
    {
      id: 11,
      name: "Родельбан 3 круга",
      description: "Тройной экстрим! Три спуска на родельбане для настоящих любителей острых ощущений.",
      price: 2500,
      category: "Прогулочные билеты",
      duration: "1 час",
      destination: "Роза Хутор"
    },
    {
      id: 12,
      name: "Родельбан 1 круг Ночные виражи",
      description: "Ночной спуск на родельбане с подсветкой трассы. Романтичное и захватывающее приключение.",
      price: 1200,
      category: "Прогулочные билеты",
      duration: "1 час",
      destination: "Роза Хутор"
    },
    // Туры на квадроциклах
    {
      id: 13,
      name: "Квадротур \"7 вершин\"",
      description: "Экстремальный тур на квадроциклах по семи горным вершинам. Для опытных водителей.",
      price: 4500,
      category: "Туры на квадроциклах",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 14,
      name: "Квадротур \"Хадкор\"",
      description: "Тур по сложным горным маршрутам с преодолением препятствий. Высокий уровень сложности.",
      price: 3800,
      category: "Туры на квадроциклах",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 15,
      name: "Квадротур \"Новичок\"",
      description: "Идеальный тур для начинающих. Простые маршруты с обучением управлению квадроциклом.",
      price: 2500,
      category: "Туры на квадроциклах",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    // Туры на Джипах
    {
      id: 16,
      name: "Джип-тур по горным тропам",
      description: "Захватывающее путешествие на внедорожнике по горным дорогам с посещением смотровых площадок.",
      price: 3500,
      category: "Туры на Джипах",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 17,
      name: "Джип-тур \"Водопады и каньоны\"",
      description: "Тур на джипе к самым красивым водопадам и каньонам региона. Фотосессия включена.",
      price: 4200,
      category: "Туры на Джипах",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    // Абхазия
    {
      id: 18,
      name: "Тур \"Золотое Кольцо Абхазии\"",
      description: "Комплексный тур по главным достопримечательностям Абхазии. Включает Озеро Рица, Новый Афон и другие места.",
      price: 5500,
      category: "Абхазия",
      duration: "1 день",
      destination: "Абхазия"
    },
    // Сочи
    {
      id: 19,
      name: "\"Обзорная экскурсия по Сочи\" из Красной Поляны",
      description: "Полноценная обзорная экскурсия по Сочи с выездом из Красной Поляны. Все главные достопримечательности города.",
      price: 2800,
      category: "Сочи",
      duration: "1 день",
      destination: "Сочи"
    },
    // Трансфер
    {
      id: 20,
      name: "Трансфер в Скайпарк",
      description: "Комфортный трансфер к знаменитому Скайпарку. Включает ожидание и обратную дорогу.",
      price: 1500,
      category: "Трансфер",
      duration: "1 день",
      destination: "Скайпарк"
    },
    {
      id: 21,
      name: "Трансфер в Аэропорт",
      description: "Надежный трансфер в аэропорт Сочи. Встреча в отеле, помощь с багажом.",
      price: 2000,
      category: "Трансфер",
      duration: "1 день",
      destination: "Аэропорт"
    },
    {
      id: 22,
      name: "Трансфер из аэропорта",
      description: "Встреча в аэропорту и трансфер до места назначения. Включает табличку с именем.",
      price: 2000,
      category: "Трансфер",
      duration: "1 день",
      destination: "Аэропорт"
    },
    // Конные туры
    {
      id: 23,
      name: "Конный тур \"Ахштырская пещера\"",
      description: "Конная прогулка к знаменитой Ахштырской пещере. Романтичное путешествие верхом.",
      price: 3200,
      category: "Конные туры",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 24,
      name: "Конный тур \"Каньон Псахо\"",
      description: "Верховая прогулка по живописному каньону Псахо. Уникальные виды и природа.",
      price: 3800,
      category: "Конные туры",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 25,
      name: "Конный тур \"Сухой Каньон\"",
      description: "Тур верхом по Сухому каньону с остановками для фотографий и отдыха.",
      price: 3500,
      category: "Конные туры",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    {
      id: 26,
      name: "Конный тур \"Маршрут на смотровую\"",
      description: "Конная прогулка к смотровой площадке с панорамным видом на горы и море.",
      price: 3000,
      category: "Конные туры",
      duration: "1 день",
      destination: "Роза Хутор"
    },
    // Морской отдых
    {
      id: 27,
      name: "Морская прогулка",
      description: "Романтичная прогулка на катере по Черному морю. Виды на побережье с воды.",
      price: 2500,
      category: "Морской отдых",
      duration: "1 день",
      destination: "Черное море"
    },
    {
      id: 28,
      name: "Морская рыбалка",
      description: "Профессиональная морская рыбалка с опытным капитаном. Снасти включены.",
      price: 4000,
      category: "Морской отдых",
      duration: "1 день",
      destination: "Черное море"
    },
    // Рафтинг
    {
      id: 29,
      name: "Рафтинг по горной реке Мзымте",
      description: "Экстремальный сплав по горной реке Мзымте. Полное снаряжение и инструктор включены.",
      price: 3500,
      category: "Рафтинг",
      duration: "1 день",
      destination: "Мзымта"
    }
  ];

  const categories = ['Все', 'Красная поляна', 'Прогулочные билеты', 'Туры на квадроциклах', 'Туры на Джипах', 'Абхазия', 'Сочи', 'Трансфер', 'Конные туры', 'Морской отдых', 'Рафтинг'];

  const filteredTours = selectedCategory === 'Все' 
    ? toursData 
    : toursData.filter(tour => tour.category === selectedCategory);

  const groupedTours = filteredTours.reduce((acc, tour) => {
    if (!acc[tour.category]) {
      acc[tour.category] = [];
    }
    acc[tour.category].push(tour);
    return acc;
  }, {} as Record<string, Tour[]>);

  const handleAddToCart = async (tour: Tour) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(tour.id, 'tour', tour);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <ToursContainer>
      <ToursContent>
        <Title>Наши туры</Title>
        
        <FilterSection>
          {categories.map((category) => (
            <FilterButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterSection>

        {Object.entries(groupedTours).map(([category, tours]) => (
          <CategorySection key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            <ToursGrid>
              {tours.map((tour) => (
                <TourCard key={tour.id}>
                  <TourImage>
                    {tour.name.charAt(0)}
                  </TourImage>
                  <TourContent>
                    <TourName>{tour.name}</TourName>
                    <TourDescription>{tour.description}</TourDescription>
                    <TourPrice>{formatPrice(tour.price)} ₽</TourPrice>
                    <AddToCartButton onClick={() => handleAddToCart(tour)}>
                      Добавить в корзину
                    </AddToCartButton>
                  </TourContent>
                </TourCard>
              ))}
            </ToursGrid>
          </CategorySection>
        ))}
      </ToursContent>
    </ToursContainer>
  );
};

export default Tours;

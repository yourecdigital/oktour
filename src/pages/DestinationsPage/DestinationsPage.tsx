import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './DestinationsPage.css';

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  capacity: string;
  features: string[];
}

interface Hotel {
  id: number;
  name: string;
  stars: number;
  description: string;
  image: string;
  rooms: Room[];
}

const HotelsPage: React.FC = () => {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const hotels: Hotel[] = [
    {
      id: 1,
      name: "Сочи Марриотт Красная Поляна",
      stars: 5,
      description: "Премиальный отель в сердце Красной Поляны с роскошными номерами и первоклассным сервисом",
      image: "https://via.placeholder.com/400x300/667eea/ffffff?text=Marriott",
      rooms: [
        {
          id: 1,
          name: "Номер делюкс с 2-мя раздельными кроватями",
          description: "Просторный номер с двумя раздельными кроватями, современным интерьером и всеми удобствами",
          price: 15000,
          capacity: "2 гостя",
          features: ["2 раздельные кровати", "Вид на горы", "Балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 2,
          name: "Номер делюкс с 1-ой двухспальной кроватью",
          description: "Романтичный номер с большой двухспальной кроватью для комфортного отдыха",
          price: 14000,
          capacity: "2 гостя",
          features: ["Двухспальная кровать", "Вид на горы", "Балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 3,
          name: "Номер для людей с ограниченными возможностями",
          description: "Специально оборудованный номер для комфортного пребывания гостей с ограниченными возможностями",
          price: 12000,
          capacity: "2 гостя",
          features: ["Доступная среда", "Широкие проходы", "Специальная ванная", "Wi-Fi"]
        },
        {
          id: 4,
          name: "Номер делюкс с видом на горы с 2-мя раздельными кроватями",
          description: "Номер с панорамным видом на горы и двумя раздельными кроватями",
          price: 18000,
          capacity: "2 гостя",
          features: ["Панорамный вид", "2 раздельные кровати", "Большой балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 5,
          name: "Номер Люкс",
          description: "Роскошный люкс с отдельной гостиной зоной и повышенным уровнем комфорта",
          price: 25000,
          capacity: "2 гостя",
          features: ["Отдельная гостиная", "Двухспальная кровать", "Вид на горы", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 6,
          name: "Номер представительский люкс с видом на горы",
          description: "Эксклюзивный представительский люкс с лучшим видом на горные вершины",
          price: 35000,
          capacity: "2 гостя",
          features: ["Представительский люкс", "Панорамный вид", "Отдельная гостиная", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 7,
          name: "Апартаменты с одной спальней",
          description: "Просторные апартаменты с отдельной спальней и гостиной зоной",
          price: 22000,
          capacity: "4 гостя",
          features: ["1 спальня", "Гостиная", "Кухня", "Балкон", "Wi-Fi"]
        },
        {
          id: 8,
          name: "Улучшенные апартаменты с одной спальней",
          description: "Улучшенные апартаменты с дополнительными удобствами и лучшим видом",
          price: 28000,
          capacity: "4 гостя",
          features: ["1 спальня", "Гостиная", "Кухня", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 9,
          name: "Апартаменты с двумя спальнями",
          description: "Большие апартаменты с двумя отдельными спальнями для семьи",
          price: 32000,
          capacity: "6 гостей",
          features: ["2 спальни", "Гостиная", "Кухня", "Балкон", "Wi-Fi"]
        },
        {
          id: 10,
          name: "Улучшенные апартаменты с двумя спальнями",
          description: "Улучшенные апартаменты с двумя спальнями и дополнительными удобствами",
          price: 38000,
          capacity: "6 гостей",
          features: ["2 спальни", "Гостиная", "Кухня", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 11,
          name: "Апартаменты с тремя спальнями",
          description: "Просторные апартаменты с тремя спальнями для большой семьи или компании",
          price: 45000,
          capacity: "8 гостей",
          features: ["3 спальни", "Гостиная", "Кухня", "Балкон", "Wi-Fi"]
        },
        {
          id: 12,
          name: "Пентхаус с тремя спальнями",
          description: "Эксклюзивный пентхаус с тремя спальнями и панорамным видом на горы",
          price: 65000,
          capacity: "8 гостей",
          features: ["3 спальни", "Гостиная", "Кухня", "Панорамный вид", "Wi-Fi"]
        }
      ]
    },
    {
      id: 2,
      name: "Сочи Риксосс 5* Красная поляна 960",
      stars: 5,
      description: "Роскошный отель на высоте 960 метров с неповторимым видом на горные пейзажи",
      image: "https://via.placeholder.com/400x300/764ba2/ffffff?text=Rixos",
      rooms: [
        {
          id: 13,
          name: "Супериор Твин (Улучшенный стандарт)",
          description: "Улучшенный стандартный номер с двумя раздельными кроватями",
          price: 18000,
          capacity: "2 гостя",
          features: ["2 раздельные кровати", "Вид на горы", "Балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 14,
          name: "Супериор Кинг (Улучшенный стандарт)",
          description: "Улучшенный стандартный номер с большой кроватью",
          price: 17000,
          capacity: "2 гостя",
          features: ["Кровать King", "Вид на горы", "Балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 15,
          name: "Делюкс Кинг с двуспальной кроватью",
          description: "Просторный делюкс номер с двуспальной кроватью",
          price: 22000,
          capacity: "2 гостя",
          features: ["Двуспальная кровать", "Вид на горы", "Балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 16,
          name: "Премиум",
          description: "Премиум номер с повышенным уровнем комфорта и сервиса",
          price: 28000,
          capacity: "2 гостя",
          features: ["Премиум интерьер", "Вид на горы", "Балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 17,
          name: "Люкс категории Джуниор",
          description: "Джуниор люкс с отдельной гостиной зоной",
          price: 35000,
          capacity: "2 гостя",
          features: ["Джуниор люкс", "Гостиная", "Вид на горы", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 18,
          name: "Представительский люкс",
          description: "Представительский люкс с роскошным интерьером",
          price: 45000,
          capacity: "2 гостя",
          features: ["Представительский люкс", "Гостиная", "Вид на горы", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 19,
          name: "Президентский люкс",
          description: "Эксклюзивный президентский люкс с максимальным комфортом",
          price: 65000,
          capacity: "4 гостя",
          features: ["Президентский люкс", "Гостиная", "Панорамный вид", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 20,
          name: "Королевский люкс",
          description: "Королевский люкс - вершина роскоши и комфорта",
          price: 85000,
          capacity: "4 гостя",
          features: ["Королевский люкс", "Гостиная", "Панорамный вид", "Мини-бар", "Wi-Fi"]
        }
      ]
    },
    {
      id: 3,
      name: "Картъярд Марриотт Сочи Красная Поляна",
      stars: 4,
      description: "Современный отель сети Marriott с комфортными номерами и отличным сервисом",
      image: "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Courtyard",
      rooms: [
        {
          id: 21,
          name: "Номер Стандарт",
          description: "Комфортный стандартный номер с современным интерьером",
          price: 12000,
          capacity: "2 гостя",
          features: ["Стандарт", "Вид на горы", "Балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 22,
          name: "Номер Делюкс",
          description: "Просторный делюкс номер с улучшенным интерьером",
          price: 16000,
          capacity: "2 гостя",
          features: ["Делюкс", "Вид на горы", "Балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 23,
          name: "Номер Премиум Делюкс",
          description: "Премиум делюкс номер с дополнительными удобствами",
          price: 20000,
          capacity: "2 гостя",
          features: ["Премиум делюкс", "Вид на горы", "Балкон", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 24,
          name: "Номер Люкс \"Гранд\" (Апартамент с 1 спальней)",
          description: "Гранд люкс с отдельной спальней и гостиной зоной",
          price: 28000,
          capacity: "4 гостя",
          features: ["1 спальня", "Гостиная", "Вид на горы", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 25,
          name: "Номер Люкс Гранд с рабочим кабинетом (Апартамент с 1 спальней)",
          description: "Гранд люкс с рабочим кабинетом для деловых поездок",
          price: 32000,
          capacity: "4 гостя",
          features: ["1 спальня", "Гостиная", "Рабочий кабинет", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 26,
          name: "Люкс Джуниор 3-х комнатный апартамент",
          description: "Джуниор люкс с тремя комнатами для комфортного отдыха",
          price: 38000,
          capacity: "6 гостей",
          features: ["3 комнаты", "Гостиная", "Вид на горы", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 27,
          name: "Представительский Люкс",
          description: "Представительский люкс с роскошным интерьером",
          price: 45000,
          capacity: "4 гостя",
          features: ["Представительский люкс", "Гостиная", "Вид на горы", "Мини-бар", "Wi-Fi"]
        },
        {
          id: 28,
          name: "Представительский Люкс с джакузи",
          description: "Представительский люкс с джакузи для максимального расслабления",
          price: 52000,
          capacity: "4 гостя",
          features: ["Представительский люкс", "Джакузи", "Гостиная", "Вид на горы", "Wi-Fi"]
        }
      ]
    },
    {
      id: 4,
      name: "Беларусь",
      stars: 3,
      description: "Уютный отель с комфортными номерами и домашней атмосферой",
      image: "https://via.placeholder.com/400x300/25d366/ffffff?text=Belarus",
      rooms: [
        {
          id: 29,
          name: "2 корпус \"Люкс Комфорт\" 2-х местный 2-х комнатный номер с балконом",
          description: "Комфортный люкс с двумя комнатами и балконом",
          price: 8000,
          capacity: "2 гостя",
          features: ["2 комнаты", "Балкон", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 30,
          name: "2 корпус \"Люкс\" 2-х местный 2-х комнатный",
          description: "Люкс номер с двумя комнатами",
          price: 7500,
          capacity: "2 гостя",
          features: ["2 комнаты", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 31,
          name: "2 корпус \"Стандарт Комфорт\" 2-х местный 1 комнатный",
          description: "Комфортный стандартный номер",
          price: 6000,
          capacity: "2 гостя",
          features: ["1 комната", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 32,
          name: "2 корпус \"Стандарт Комфорт\" (с балконом) 2-х местный 1 комнатный",
          description: "Стандартный номер с балконом",
          price: 6500,
          capacity: "2 гостя",
          features: ["1 комната", "Балкон", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 33,
          name: "4 корпус \"Стандарт\" 2-х местный 1 комнатный",
          description: "Стандартный номер в 4 корпусе",
          price: 5500,
          capacity: "2 гостя",
          features: ["1 комната", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 34,
          name: "4 корпус \"Стандарт 3 местный\" 3-х местный 1 комнатный",
          description: "Трехместный стандартный номер",
          price: 7000,
          capacity: "3 гостя",
          features: ["1 комната", "3 кровати", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 35,
          name: "5 корпус \"Стандарт\" 2-х местный 1 комнатный",
          description: "Стандартный номер в 5 корпусе",
          price: 5500,
          capacity: "2 гостя",
          features: ["1 комната", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 36,
          name: "5 корпус \"Стандарт ПК\" 2-х местный 1 комнатный",
          description: "Стандартный номер с повышенным комфортом",
          price: 6000,
          capacity: "2 гостя",
          features: ["1 комната", "Повышенный комфорт", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 37,
          name: "5 корпус \"Люкс\" 2-х местный 2-х комнатный",
          description: "Люкс номер в 5 корпусе",
          price: 8000,
          capacity: "2 гостя",
          features: ["2 комнаты", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 38,
          name: "Коттедж На один номер 6-ти местный",
          description: "Отдельный коттедж на 6 человек",
          price: 15000,
          capacity: "6 гостей",
          features: ["Коттедж", "Кухня", "Вид на горы", "Wi-Fi"]
        },
        {
          id: 39,
          name: "Коттедж На 2 номера 6-ти местный",
          description: "Коттедж с двумя номерами на 6 человек",
          price: 18000,
          capacity: "6 гостей",
          features: ["2 номера", "Кухня", "Вид на горы", "Wi-Fi"]
        }
      ]
    }
  ];

  const handleAddToCart = async (room: Room) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    try {
      await addToCart(room.id, 'room', room);
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const renderStars = (stars: number) => {
    return '★'.repeat(stars);
  };

  const openModal = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  return (
    <div className="destinations-page">
      <div className="destinations-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Отели Красной поляны</h1>
          <p>Выбирайте лучшие</p>
          <p className="hero-subtitle">Мы помогаем гостям выбрать и забронировать лучшие отели Красной поляны</p>
        </motion.div>
      </div>

      <div className="destinations-container">
        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <motion.article
              key={hotel.id}
              className="hotel-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="hotel-image">
                <img src={hotel.image} alt={hotel.name} />
                <div className="hotel-stars">{renderStars(hotel.stars)}</div>
              </div>
              
              <div className="hotel-content">
                <h3>{hotel.name}</h3>
                <p className="hotel-description">{hotel.description}</p>
                
                <button 
                  className="btn-primary"
                  onClick={() => openModal(hotel)}
                >
                  Выбрать номер
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Модальное окно с номерами */}
      <AnimatePresence>
        {isModalOpen && selectedHotel && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{selectedHotel.name}</h2>
                <button className="modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="rooms-grid-modal">
                  {selectedHotel.rooms.map((room) => (
                    <motion.div
                      key={room.id}
                      className="room-card-modal"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="room-header">
                        <h4>{room.name}</h4>
                        <div className="room-price-modal">{formatPrice(room.price)} ₽</div>
                      </div>
                      
                      <p className="room-description-modal">{room.description}</p>
                      
                      <div className="room-features-modal">
                        {room.features.map((feature, index) => (
                          <span key={index} className="feature-tag-modal">
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <div className="room-footer">
                        <span className="room-capacity-modal">{room.capacity}</span>
                        <button 
                          className="btn-book-modal"
                          onClick={() => handleAddToCart(room)}
                        >
                          Забронировать
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelsPage;

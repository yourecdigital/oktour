const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./server/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
    checkTablesAndInitialize();
  }
});

function checkTablesAndInitialize() {
  // Проверяем существование таблиц
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error checking tables:', err);
      db.close();
      return;
    }
    
    const tableNames = tables.map(t => t.name);
    console.log('Existing tables:', tableNames);
    
    // Проверяем, что все нужные таблицы существуют
    const requiredTables = ['services', 'hotels', 'foreign_tours', 'cruises', 'promotions'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.error('Missing tables:', missingTables);
      console.log('Please start the server first to create tables, then run this script again.');
      db.close();
      return;
    }
    
    console.log('All required tables exist. Initializing test data...');
    initializeTestData();
  });
}

function initializeTestData() {
  db.serialize(() => {
    // Очищаем существующие данные
    db.run('DELETE FROM services');
    db.run('DELETE FROM hotels');
    db.run('DELETE FROM foreign_tours');
    db.run('DELETE FROM cruises');
    db.run('DELETE FROM promotions');

    // Добавляем тестовые услуги
    const testServices = [
      {
        name: 'Трансфер из аэропорта',
        description: 'Комфортабельный трансфер из аэропорта Сочи до вашего отеля',
        price: 1500,
        category: 'Транспорт',
        available: 1
      },
      {
        name: 'Экскурсия с гидом',
        description: 'Персональная экскурсия по Сочи с профессиональным гидом',
        price: 3000,
        category: 'Экскурсии',
        available: 1
      },
      {
        name: 'Бронирование ресторанов',
        description: 'Помощь в бронировании лучших ресторанов Сочи',
        price: 500,
        category: 'Питание',
        available: 1
      },
      {
        name: 'Аренда автомобиля',
        description: 'Аренда автомобиля для самостоятельных поездок по Сочи',
        price: 2500,
        category: 'Транспорт',
        available: 1
      }
    ];

    const insertService = db.prepare('INSERT INTO services (name, description, price, category, available) VALUES (?, ?, ?, ?, ?)');
    testServices.forEach(service => {
      insertService.run(service.name, service.description, service.price, service.category, service.available);
    });
    insertService.finalize();

    // Добавляем тестовые отели
    const testHotels = [
      {
        name: 'Сочи Марриотт Красная Поляна',
        description: 'Премиальный отель с видом на горы и современным спа-центром',
        price: 18000,
        location: 'Красная Поляна',
        stars: 5,
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        available: 1
      },
      {
        name: 'Гостиница "Морская"',
        description: 'Уютная гостиница в центре Сочи с видом на море',
        price: 8000,
        location: 'Центр Сочи',
        stars: 4,
        image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
        available: 1
      },
      {
        name: 'Курорт "Лазурный берег"',
        description: 'Курортный комплекс с собственным пляжем и ресторанами',
        price: 12000,
        location: 'Адлер',
        stars: 4,
        image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
        available: 1
      }
    ];

    const insertHotel = db.prepare('INSERT INTO hotels (name, description, price, location, stars, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?)');
    testHotels.forEach(hotel => {
      insertHotel.run(hotel.name, hotel.description, hotel.price, hotel.location, hotel.stars, hotel.image_url, hotel.available);
    });
    insertHotel.finalize();

    // Добавляем тестовые зарубежные туры
    const testForeignTours = [
      {
        name: 'Тур в Турцию',
        description: 'Незабываемый отдых в Турции с посещением Стамбула и пляжей Анталии',
        price: 45000,
        country: 'Турция',
        duration: '7 дней / 6 ночей',
        highlights: JSON.stringify(['Стамбул', 'Анталия', 'Эфес', 'Памуккале']),
        image_url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400',
        available: 1
      },
      {
        name: 'Отдых в Греции',
        description: 'Путешествие по греческим островам с посещением Афин и Санторини',
        price: 52000,
        country: 'Греция',
        duration: '8 дней / 7 ночей',
        highlights: JSON.stringify(['Афины', 'Санторини', 'Крит', 'Миконос']),
        image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
        available: 1
      },
      {
        name: 'Тур в Италию',
        description: 'Классический тур по Италии: Рим, Флоренция, Венеция',
        price: 65000,
        country: 'Италия',
        duration: '10 дней / 9 ночей',
        highlights: JSON.stringify(['Рим', 'Флоренция', 'Венеция', 'Пиза']),
        image_url: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=400',
        available: 1
      }
    ];

    const insertForeignTour = db.prepare('INSERT INTO foreign_tours (name, description, price, country, duration, highlights, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    testForeignTours.forEach(tour => {
      insertForeignTour.run(tour.name, tour.description, tour.price, tour.country, tour.duration, tour.highlights, tour.image_url, tour.available);
    });
    insertForeignTour.finalize();

    // Добавляем тестовые круизы
    const testCruises = [
      {
        name: 'Круиз по Средиземному морю',
        description: 'Недельный круиз по Средиземному морю с посещением Италии, Греции и Турции',
        price: 85000,
        departure: 'Сочи',
        duration: '7 дней / 6 ночей',
        destination: 'Средиземное море',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
        available: 1
      },
      {
        name: 'Круиз по Балтийскому морю',
        description: 'Путешествие по Балтийскому морю с остановками в Санкт-Петербурге и Хельсинки',
        price: 65000,
        departure: 'Санкт-Петербург',
        duration: '5 дней / 4 ночи',
        destination: 'Балтийское море',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        available: 1
      },
      {
        name: 'Круиз по Черному морю',
        description: 'Круиз по Черному морю с посещением Сочи, Батуми и Стамбула',
        price: 45000,
        departure: 'Сочи',
        duration: '4 дня / 3 ночи',
        destination: 'Черное море',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
        available: 1
      }
    ];

    const insertCruise = db.prepare('INSERT INTO cruises (name, description, price, departure, duration, destination, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    testCruises.forEach(cruise => {
      insertCruise.run(cruise.name, cruise.description, cruise.price, cruise.departure, cruise.duration, cruise.destination, cruise.image_url, cruise.available);
    });
    insertCruise.finalize();

    // Добавляем тестовые акции
    const testPromotions = [
      {
        title: 'Скидка 30% на туры по Сочи',
        description: 'Специальное предложение! Скидка 30% на все туры по Сочи при бронировании до конца месяца.',
        discount_percent: 30,
        valid_until: '2024-12-31',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        active: 1
      },
      {
        title: 'Раннее бронирование круизов',
        description: 'Забронируйте круиз заранее и получите скидку до 25%! Действует до 31 декабря.',
        discount_percent: 25,
        valid_until: '2024-12-31',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
        active: 1
      },
      {
        title: 'Семейный отдых в отелях',
        description: 'Специальные цены для семей с детьми. Бесплатное размещение детей до 12 лет.',
        discount_percent: 20,
        valid_until: '2024-12-31',
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        active: 1
      }
    ];

    const insertPromotion = db.prepare('INSERT INTO promotions (title, description, discount_percent, valid_until, image_url, active) VALUES (?, ?, ?, ?, ?, ?)');
    testPromotions.forEach(promotion => {
      insertPromotion.run(promotion.title, promotion.description, promotion.discount_percent, promotion.valid_until, promotion.image_url, promotion.active);
    });
    insertPromotion.finalize();

    console.log('Test data initialized successfully!');
    db.close();
  });
}


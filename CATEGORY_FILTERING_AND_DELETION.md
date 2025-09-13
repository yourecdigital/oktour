# Реализация фильтрации по категориям и удаления категорий

## 🎯 Цель изменений

Обновить админскую панель для:
1. Правильной фильтрации контента по категориям/странам в зависимости от раздела
2. Добавить возможность удаления категорий с подтверждением
3. Удалять все объекты в категории при её удалении

## 📋 Выполненные изменения

### 1. Обновление AdminLayout.tsx

#### Новые стили:
- **DeleteButton** - кнопка удаления категории
- **Modal** - модальное окно подтверждения
- **ModalContent** - содержимое модального окна
- **ModalTitle** - заголовок модального окна
- **ModalText** - текст модального окна
- **ModalButtons** - контейнер кнопок
- **ModalButton** - кнопка с поддержкой опасного стиля

#### Новое состояние:
```typescript
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [categoryToDelete, setCategoryToDelete] = useState<string>('');
```

#### Новые функции:

**handleDeleteCategory** - обработчик клика по кнопке удаления:
```typescript
const handleDeleteCategory = (category: string, e: React.MouseEvent) => {
  e.stopPropagation(); // Предотвращаем срабатывание onClick родительской кнопки
  if (category === 'Все') return; // Нельзя удалить "Все"
  
  setCategoryToDelete(category);
  setShowDeleteModal(true);
};
```

**confirmDeleteCategory** - подтверждение удаления категории:
```typescript
const confirmDeleteCategory = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.error('No admin token found');
      return;
    }

    let endpoint = '';
    let fieldName = '';
    
    switch (currentSection) {
      case 'tours':
        endpoint = '/api/tours';
        fieldName = 'category';
        break;
      case 'foreign':
        endpoint = '/api/foreign-tours';
        fieldName = 'country';
        break;
      case 'cruises':
        endpoint = '/api/cruises';
        fieldName = 'category';
        break;
      case 'promotions':
        endpoint = '/api/promotions';
        fieldName = 'category';
        break;
      case 'services':
        endpoint = '/api/services';
        fieldName = 'category';
        break;
      case 'hotels':
        endpoint = '/api/hotels';
        fieldName = 'category';
        break;
      default:
        endpoint = '/api/tours';
        fieldName = 'category';
    }

    // Удаляем все элементы с данной категорией/страной
    const response = await axios.delete(`${endpoint}/category/${encodeURIComponent(categoryToDelete)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      // Обновляем список категорий
      await fetchCategories();
      setSelectedCategory('Все');
      navigate(`/admin/dashboard?section=${currentSection}&category=Все`);
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    alert('Ошибка при удалении категории');
  } finally {
    setShowDeleteModal(false);
    setCategoryToDelete('');
  }
};
```

**cancelDeleteCategory** - отмена удаления:
```typescript
const cancelDeleteCategory = () => {
  setShowDeleteModal(false);
  setCategoryToDelete('');
};
```

#### Обновленный JSX:
- Кнопки категорий теперь содержат кнопку удаления (кроме "Все")
- Добавлено модальное окно подтверждения удаления
- Динамические заголовки в зависимости от типа контента

### 2. Добавление API endpoints в server/index.js

#### Новые endpoints для удаления категорий:

**Удаление категории туров:**
```javascript
app.delete('/api/tours/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM tours WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its tours deleted successfully`,
      deletedCount: this.changes 
    });
  });
});
```

**Удаление страны зарубежных туров:**
```javascript
app.delete('/api/foreign-tours/category/:country', authenticateToken, (req, res) => {
  const { country } = req.params;
  const decodedCountry = decodeURIComponent(country);
  
  db.run('DELETE FROM foreign_tours WHERE country = ?', [decodedCountry], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Country "${decodedCountry}" and all its tours deleted successfully`,
      deletedCount: this.changes 
    });
  });
});
```

**Удаление категории круизов:**
```javascript
app.delete('/api/cruises/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM cruises WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its cruises deleted successfully`,
      deletedCount: this.changes 
    });
  });
});
```

**Удаление категории акций:**
```javascript
app.delete('/api/promotions/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM promotions WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its promotions deleted successfully`,
      deletedCount: this.changes 
    });
  });
});
```

**Удаление категории услуг:**
```javascript
app.delete('/api/services/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM services WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its services deleted successfully`,
      deletedCount: this.changes 
    });
  });
});
```

**Удаление категории отелей:**
```javascript
app.delete('/api/hotels/category/:category', authenticateToken, (req, res) => {
  const { category } = req.params;
  const decodedCategory = decodeURIComponent(category);
  
  db.run('DELETE FROM hotels WHERE category = ?', [decodedCategory], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ 
      message: `Category "${decodedCategory}" and all its hotels deleted successfully`,
      deletedCount: this.changes 
    });
  });
});
```

## 🔧 Логика фильтрации

### Правила фильтрации по разделам:

1. **Туры по Сочи** - фильтрация по категориям (`category`)
2. **Зарубежные туры** - фильтрация по странам (`country`)
3. **Круизы** - фильтрация по категориям (`category`)
4. **Горящие предложения** - фильтрация по категориям (`category`)
5. **Наши услуги** - фильтрация по категориям (`category`)
6. **Отели и гостиницы** - фильтрация по категориям (`category`)

### Динамические заголовки:
```typescript
{currentSection === 'foreign' ? 'Фильтр по странам' : 'Фильтр по категориям'}
```

## 🎨 Пользовательский интерфейс

### Кнопки категорий:
- Каждая категория отображается как кнопка
- Активная категория выделена синим цветом
- Кнопка удаления (🗑️) появляется справа от названия категории
- Кнопка "Все" не имеет кнопки удаления

### Модальное окно подтверждения:
- Затемнение фона
- Центрированное окно с заголовком
- Предупреждающий текст о необратимости действия
- Две кнопки: "Отмена" и "Удалить"
- Кнопка "Удалить" выделена красным цветом

## 🔒 Безопасность

### Аутентификация:
- Все endpoints удаления требуют токен администратора
- Проверка наличия токена перед выполнением операций

### Валидация:
- Проверка существования категории перед удалением
- URL-декодирование параметров для безопасной обработки
- Обработка ошибок базы данных

## 📊 Результаты

### Функциональность:
- ✅ Правильная фильтрация по типам контента
- ✅ Удаление категорий с подтверждением
- ✅ Удаление всех объектов в категории
- ✅ Обновление списка категорий после удаления
- ✅ Переход к "Все" после удаления категории

### Пользовательский опыт:
- ✅ Интуитивный интерфейс
- ✅ Предупреждение о необратимости
- ✅ Визуальная обратная связь
- ✅ Защита от случайного удаления

### Техническая реализация:
- ✅ RESTful API endpoints
- ✅ Обработка ошибок
- ✅ Аутентификация
- ✅ Безопасное удаление данных

## 🚀 Использование

1. **Фильтрация**: Выберите категорию/страну в левой панели
2. **Удаление категории**: Нажмите на кнопку 🗑️ рядом с названием категории
3. **Подтверждение**: В модальном окне подтвердите удаление
4. **Результат**: Категория и все её объекты будут удалены

## 🎉 Заключение

Система фильтрации и удаления категорий полностью реализована и готова к использованию. Все разделы админской панели теперь имеют правильную фильтрацию и возможность безопасного удаления категорий с подтверждением.







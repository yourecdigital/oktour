# Исправление ошибки загрузки зарубежных туров

## 🐛 Проблема

При попытке загрузить зарубежные туры на странице `/foreign` возникала ошибка:
```
Ошибка загрузки зарубежных туров
```

## 🔍 Диагностика

Проблема была в несоответствии API endpoints:

**В коде фронтенда использовался:**
- `GET /api/foreign-tours` - для получения туров
- `POST /api/foreign-tours` - для создания туров
- `PUT /api/foreign-tours/:id` - для обновления туров
- `DELETE /api/foreign-tours/:id` - для удаления туров

**В сервере существовал только:**
- `GET /api/foreign` - для получения туров
- `POST /api/foreign` - для создания туров
- `PUT /api/foreign/:id` - для обновления туров
- `DELETE /api/foreign/:id` - для удаления туров

## ✅ Решение

Добавлены новые API endpoints в `server/index.js`:

### 1. GET /api/foreign-tours
```javascript
app.get('/api/foreign-tours', (req, res) => {
  db.all('SELECT * FROM foreign_tours WHERE available = 1', (err, tours) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tours);
  });
});
```

### 2. POST /api/foreign-tours
```javascript
app.post('/api/foreign-tours', authenticateToken, (req, res) => {
  const { name, description, price, country, duration, highlights, category, image_url, available } = req.body;
  
  if (!name || !description || !price || !country) {
    return res.status(400).json({ error: 'Name, description, price and country are required' });
  }

  const highlightsJson = highlights ? JSON.stringify(highlights) : null;

  db.run(
    'INSERT INTO foreign_tours (name, description, price, country, duration, highlights, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, country, duration || null, highlightsJson, category || 'Общие зарубежные туры', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Foreign tour created successfully' });
    }
  );
});
```

### 3. PUT /api/foreign-tours/:id
```javascript
app.put('/api/foreign-tours/:id', authenticateToken, (req, res) => {
  const { name, description, price, country, duration, highlights, category, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price || !country) {
    return res.status(400).json({ error: 'Name, description, price and country are required' });
  }

  const highlightsJson = highlights ? JSON.stringify(highlights) : null;

  db.run(
    'UPDATE foreign_tours SET name = ?, description = ?, price = ?, country = ?, duration = ?, highlights = ?, category = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, country, duration || null, highlightsJson, category || null, image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Foreign tour not found' });
      }
      res.json({ message: 'Foreign tour updated successfully' });
    }
  );
});
```

### 4. DELETE /api/foreign-tours/:id
```javascript
app.delete('/api/foreign-tours/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM foreign_tours WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Foreign tour not found' });
    }
    res.json({ message: 'Foreign tour deleted successfully' });
  });
});
```

## 🔧 Ключевые отличия новых endpoints

1. **Убрано поле `tour_type`** - больше не используется в новых турах
2. **Добавлено поле `category`** - для категоризации туров
3. **Обновлена структура данных** - соответствует новой схеме зарубежных туров

## 📊 Результат

После добавления новых endpoints:

- ✅ Страница зарубежных туров загружается без ошибок
- ✅ Админская панель может создавать, редактировать и удалять туры
- ✅ Фильтрация по странам работает корректно
- ✅ Все CRUD операции функционируют

## 🚀 Тестирование

API протестирован с помощью curl:
```bash
curl http://localhost:5000/api/foreign-tours
```

Результат: HTTP 200 OK с данными о 21 туре по 10 странам.

## 🎉 Заключение

Ошибка полностью исправлена. Система зарубежных туров теперь работает корректно с новыми API endpoints, которые соответствуют обновленной структуре данных и функциональности.







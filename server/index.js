const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Build React app if build folder doesn't exist
const buildPath = path.join(__dirname, '../build');
if (!fs.existsSync(buildPath)) {
  console.log('Build folder not found, building React app...');
  const { execSync } = require('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } catch (error) {
    console.error('Failed to build React app:', error.message);
  }
}

// Serve static files from React build
app.use(express.static(buildPath));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup
const db = new sqlite3.Database('./server/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      bonus_points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tours table
    db.run(`CREATE TABLE IF NOT EXISTS tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      duration TEXT,
      destination TEXT,
      category TEXT DEFAULT 'Общие туры',
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Hotels table
    db.run(`CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      location TEXT,
      stars INTEGER,
      category TEXT DEFAULT 'Общие отели',
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Foreign tours table
    db.run(`CREATE TABLE IF NOT EXISTS foreign_tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      country TEXT,
      duration TEXT,
      highlights TEXT,
      tour_type TEXT,
      category TEXT DEFAULT 'Общие зарубежные туры',
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Cruises table
    db.run(`CREATE TABLE IF NOT EXISTS cruises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      departure TEXT,
      duration TEXT,
      destination TEXT,
      category TEXT DEFAULT 'Общие круизы',
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Services table
    db.run(`CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT DEFAULT 'Общие услуги',
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Promotions table
    db.run(`CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      discount_percent INTEGER,
      valid_until TEXT,
      category TEXT DEFAULT 'Общие акции',
      image_url TEXT,
      active BOOLEAN DEFAULT 1
    )`);

    // Cart table
    db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      quantity INTEGER DEFAULT 1,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      duration TEXT,
      destination TEXT,
      capacity TEXT,
      features TEXT,
      country TEXT,
      highlights TEXT,
      departure TEXT
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Order items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id)
    )`);

    // Insert sample tours
    const sampleTours = [
      {
        name: 'Экскурсия по Сочи',
        description: 'Увлекательная экскурсия по главным достопримечательностям Сочи',
        price: 2500,
        duration: '4 часа',
        destination: 'Сочи',
        image_url: '/images/sochi-tour.jpg'
      },
      {
        name: 'Красная Поляна',
        description: 'Горнолыжный курорт и летний отдых в горах',
        price: 3500,
        duration: '8 часов',
        destination: 'Красная Поляна',
        image_url: '/images/krasnaya-polyana.jpg'
      },
      {
        name: 'Морская прогулка',
        description: 'Прогулка на катере по Черному морю',
        price: 1800,
        duration: '2 часа',
        destination: 'Сочи',
        image_url: '/images/sea-tour.jpg'
      },
      {
        name: 'Олимпийский парк',
        description: 'Посещение олимпийских объектов и парка развлечений',
        price: 2200,
        duration: '5 часов',
        destination: 'Адлер',
        image_url: '/images/olympic-park.jpg'
      }
    ];

    const insertTour = db.prepare('INSERT OR IGNORE INTO tours (name, description, price, duration, destination, image_url) VALUES (?, ?, ?, ?, ?, ?)');
    sampleTours.forEach(tour => {
      insertTour.run(tour.name, tour.description, tour.price, tour.duration, tour.destination, tour.image_url);
    });
    insertTour.finalize();
  });
}

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Telegram bot setup
let bot;
if (process.env.TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
}

// Send order to Telegram
async function sendOrderToTelegram(orderData) {
  if (!bot || !process.env.TELEGRAM_CHAT_ID) return;

  const message = `
🛒 НОВЫЙ ЗАКАЗ #${orderData.id}

👤 Покупатель: ${orderData.userName}
📧 Email: ${orderData.userEmail}
📱 Телефон: ${orderData.userPhone}

💰 Сумма: ${orderData.totalAmount} ₽
📅 Дата: ${new Date().toLocaleString('ru-RU')}

📋 Товары:
${orderData.items.map(item => `• ${item.name} x${item.quantity} - ${item.price} ₽`).join('\n')}
  `;

  try {
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  } catch (error) {
    console.error('Error sending to Telegram:', error);
  }
}

// API Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, phone],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        
        const token = jwt.sign(
          { userId: this.lastID, email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );
        
        res.json({ token, user: { id: this.lastID, email, name, phone } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          bonusPoints: user.bonus_points
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, email, name, phone, bonus_points FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      bonusPoints: user.bonus_points
    });
  });
});

// Get tours
app.get('/api/tours', (req, res) => {
  db.all('SELECT * FROM tours WHERE available = 1', (err, tours) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tours);
  });
});

// Create tour
app.post('/api/tours', authenticateToken, (req, res) => {
  const { name, description, price, duration, destination, category, image_url, available } = req.body;
  
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description and price are required' });
  }

  db.run(
    'INSERT INTO tours (name, description, price, duration, destination, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, duration || null, destination || null, category || 'Общие туры', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Tour created successfully' });
    }
  );
});

// Update tour
app.put('/api/tours/:id', authenticateToken, (req, res) => {
  const { name, description, price, duration, destination, category, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description and price are required' });
  }

  db.run(
    'UPDATE tours SET name = ?, description = ?, price = ?, duration = ?, destination = ?, category = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, duration || null, destination || null, category || 'Общие туры', image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Tour not found' });
      }
      res.json({ message: 'Tour updated successfully' });
    }
  );
});

// Delete tour
app.delete('/api/tours/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM tours WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json({ message: 'Tour deleted successfully' });
  });
});

// Get cart items
app.get('/api/cart', authenticateToken, (req, res) => {
  db.all(`
    SELECT id, item_id, item_type, name, description, price, quantity, added_at, duration, destination, capacity, features, country, highlights, departure
    FROM cart 
    WHERE user_id = ?
    ORDER BY added_at DESC
  `, [req.user.userId], (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Parse features JSON for each item
    const items = cartItems.map(item => ({
      ...item,
      features: item.features ? JSON.parse(item.features) : null,
      highlights: item.highlights ? JSON.parse(item.highlights) : null
    }));
    
    res.json(items);
  });
});

// Add to cart
app.post('/api/cart/add', authenticateToken, (req, res) => {
  const { itemId, type, quantity = 1, itemData } = req.body;
  
  if (!itemId || !type || !itemData) {
    return res.status(400).json({ error: 'Item ID, type and item data are required' });
  }

  const features = itemData.features ? JSON.stringify(itemData.features) : null;
  const highlights = itemData.highlights ? JSON.stringify(itemData.highlights) : null;

  db.run(
    'INSERT INTO cart (user_id, item_id, item_type, name, description, price, quantity, duration, destination, capacity, features, country, highlights, departure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      req.user.userId, 
      itemId, 
      type, 
      itemData.name, 
      itemData.description, 
      itemData.price, 
      quantity,
      itemData.duration || null,
      itemData.destination || null,
      itemData.capacity || null,
      features,
      itemData.country || null,
      highlights,
      itemData.departure || null
    ],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Added to cart', cartItemId: this.lastID });
    }
  );
});

// Remove from cart
app.delete('/api/cart/:id', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM cart WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      res.json({ message: 'Removed from cart' });
    }
  );
});

// Create order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    // Get cart items
    db.all(`
      SELECT id, item_id, item_type, name, description, price, quantity, duration, destination, capacity, features, country, highlights, departure
      FROM cart 
      WHERE user_id = ?
    `, [req.user.userId], async (err, cartItems) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create order
      db.run(
        'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
        [req.user.userId, totalAmount],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          const orderId = this.lastID;

          // Add order items
          const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, item_id, item_type, quantity, price) VALUES (?, ?, ?, ?, ?)');
          cartItems.forEach(item => {
            insertOrderItem.run(orderId, item.item_id, item.item_type, item.quantity, item.price);
          });
          insertOrderItem.finalize();

          // Clear cart
          db.run('DELETE FROM cart WHERE user_id = ?', [req.user.userId]);

          // Get user info for Telegram
          db.get('SELECT name, email, phone FROM users WHERE id = ?', [req.user.userId], (err, user) => {
            if (!err && user) {
              const orderData = {
                id: orderId,
                userName: user.name,
                userEmail: user.email,
                userPhone: user.phone,
                totalAmount: totalAmount,
                items: cartItems.map(item => ({
                  name: item.name,
                  type: item.item_type,
                  quantity: item.quantity,
                  price: item.price * item.quantity
                }))
              };
              sendOrderToTelegram(orderData);
            }
          });

          res.json({ message: 'Order created successfully', orderId });
        }
      );
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get orders
app.get('/api/orders', authenticateToken, (req, res) => {
  db.all(`
    SELECT o.*, oi.item_id, oi.item_type, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `, [req.user.userId], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Group items by order
    const groupedOrders = orders.reduce((acc, row) => {
      if (!acc[row.id]) {
        acc[row.id] = {
          id: row.id,
          totalAmount: row.total_amount,
          status: row.status,
          createdAt: row.created_at,
          items: []
        };
      }
      acc[row.id].items.push({
        itemId: row.item_id,
        itemType: row.item_type,
        quantity: row.quantity,
        price: row.price
      });
      return acc;
    }, {});

    res.json(Object.values(groupedOrders));
  });
});

// Add bonus points
app.post('/api/bonus/add', authenticateToken, (req, res) => {
  const { points = 500 } = req.body;
  
  db.run(
    'UPDATE users SET bonus_points = bonus_points + ? WHERE id = ?',
    [points, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: `Added ${points} bonus points` });
    }
  );
});

// ===== ADMIN AUTHENTICATION =====
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Простая проверка админа (в реальном проекте должна быть в базе данных)
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { adminId: 1, username: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ token, message: 'Admin login successful' });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// ===== SERVICES API =====
app.get('/api/services', (req, res) => {
  db.all('SELECT * FROM services WHERE available = 1', (err, services) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(services);
  });
});

app.post('/api/services', authenticateToken, (req, res) => {
  const { name, description, price, category, image_url, available } = req.body;
  
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description and price are required' });
  }

  db.run(
    'INSERT INTO services (name, description, price, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, category || 'Общие услуги', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Service created successfully' });
    }
  );
});

app.put('/api/services/:id', authenticateToken, (req, res) => {
  const { name, description, price, category, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description and price are required' });
  }

  db.run(
    'UPDATE services SET name = ?, description = ?, price = ?, category = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, category || 'Общие услуги', image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json({ message: 'Service updated successfully' });
    }
  );
});

app.delete('/api/services/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM services WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  });
});

// ===== HOTELS API =====
app.get('/api/hotels', (req, res) => {
  db.all('SELECT * FROM hotels WHERE available = 1', (err, hotels) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(hotels);
  });
});

app.post('/api/hotels', authenticateToken, (req, res) => {
  const { name, description, price, location, stars, category, image_url, available } = req.body;
  
  if (!name || !description || !price || !location) {
    return res.status(400).json({ error: 'Name, description, price and location are required' });
  }

  db.run(
    'INSERT INTO hotels (name, description, price, location, stars, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, location, stars || null, category || 'Общие отели', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Hotel created successfully' });
    }
  );
});

app.put('/api/hotels/:id', authenticateToken, (req, res) => {
  const { name, description, price, location, stars, category, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price || !location) {
    return res.status(400).json({ error: 'Name, description, price and location are required' });
  }

  db.run(
    'UPDATE hotels SET name = ?, description = ?, price = ?, location = ?, stars = ?, category = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, location, stars || null, category || 'Общие отели', image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
      res.json({ message: 'Hotel updated successfully' });
    }
  );
});

app.delete('/api/hotels/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM hotels WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted successfully' });
  });
});

// ===== FOREIGN TOURS API =====
app.get('/api/foreign', (req, res) => {
  db.all('SELECT * FROM foreign_tours WHERE available = 1', (err, tours) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tours);
  });
});

// Новый endpoint для зарубежных туров
app.get('/api/foreign-tours', (req, res) => {
  db.all('SELECT * FROM foreign_tours WHERE available = 1', (err, tours) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tours);
  });
});

app.post('/api/foreign', authenticateToken, (req, res) => {
  const { name, description, price, country, duration, highlights, tour_type, category, image_url, available } = req.body;
  
  if (!name || !description || !price || !country) {
    return res.status(400).json({ error: 'Name, description, price and country are required' });
  }

  const highlightsJson = highlights ? JSON.stringify(highlights) : null;

  db.run(
    'INSERT INTO foreign_tours (name, description, price, country, duration, highlights, tour_type, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, country, duration || null, highlightsJson, tour_type || null, category || 'Общие зарубежные туры', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Foreign tour created successfully' });
    }
  );
});

// Новый endpoint для создания зарубежных туров
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

app.put('/api/foreign/:id', authenticateToken, (req, res) => {
  const { name, description, price, country, duration, highlights, tour_type, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price || !country) {
    return res.status(400).json({ error: 'Name, description, price and country are required' });
  }

  const highlightsJson = highlights ? JSON.stringify(highlights) : null;

  db.run(
    'UPDATE foreign_tours SET name = ?, description = ?, price = ?, country = ?, duration = ?, highlights = ?, tour_type = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, country, duration || null, highlightsJson, tour_type || null, image_url || null, available ? 1 : 0, id],
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

// Новый endpoint для обновления зарубежных туров
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

app.delete('/api/foreign/:id', authenticateToken, (req, res) => {
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

// Новый endpoint для удаления зарубежных туров
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

// ===== CRUISES API =====
app.get('/api/cruises', (req, res) => {
  db.all('SELECT * FROM cruises WHERE available = 1', (err, cruises) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(cruises);
  });
});

app.post('/api/cruises', authenticateToken, (req, res) => {
  const { name, description, price, departure, duration, destination, category, image_url, available } = req.body;
  
  if (!name || !description || !price || !departure) {
    return res.status(400).json({ error: 'Name, description, price and departure are required' });
  }

  db.run(
    'INSERT INTO cruises (name, description, price, departure, duration, destination, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, departure, duration || null, destination || null, category || 'Общие круизы', image_url || null, available ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Cruise created successfully' });
    }
  );
});

app.put('/api/cruises/:id', authenticateToken, (req, res) => {
  const { name, description, price, departure, duration, destination, category, image_url, available } = req.body;
  const { id } = req.params;
  
  if (!name || !description || !price || !departure) {
    return res.status(400).json({ error: 'Name, description, price and departure are required' });
  }

  db.run(
    'UPDATE cruises SET name = ?, description = ?, price = ?, departure = ?, duration = ?, destination = ?, category = ?, image_url = ?, available = ? WHERE id = ?',
    [name, description, price, departure, duration || null, destination || null, category || 'Общие круизы', image_url || null, available ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cruise not found' });
      }
      res.json({ message: 'Cruise updated successfully' });
    }
  );
});

app.delete('/api/cruises/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM cruises WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cruise not found' });
    }
    res.json({ message: 'Cruise deleted successfully' });
  });
});

// ===== PROMOTIONS API =====
app.get('/api/promotions', (req, res) => {
  db.all('SELECT * FROM promotions WHERE active = 1', (err, promotions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(promotions);
  });
});

app.post('/api/promotions', authenticateToken, (req, res) => {
  const { title, description, discount_percent, valid_until, category, image_url, active } = req.body;
  
  if (!title || !description || !discount_percent) {
    return res.status(400).json({ error: 'Title, description and discount_percent are required' });
  }

  db.run(
    'INSERT INTO promotions (title, description, discount_percent, valid_until, category, image_url, active) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, discount_percent, valid_until || null, category || 'Общие акции', image_url || null, active ? 1 : 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Promotion created successfully' });
    }
  );
});

app.put('/api/promotions/:id', authenticateToken, (req, res) => {
  const { title, description, discount_percent, valid_until, image_url, active } = req.body;
  const { id } = req.params;
  
  if (!title || !description || !discount_percent) {
    return res.status(400).json({ error: 'Title, description and discount_percent are required' });
  }

  db.run(
    'UPDATE promotions SET title = ?, description = ?, discount_percent = ?, valid_until = ?, image_url = ?, active = ? WHERE id = ?',
    [title, description, discount_percent, valid_until || null, image_url || null, active ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Promotion not found' });
      }
      res.json({ message: 'Promotion updated successfully' });
    }
  );
});

app.delete('/api/promotions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM promotions WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json({ message: 'Promotion deleted successfully' });
  });
});

// ===== CATEGORY DELETE API =====

// Удаление категории туров
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

// Удаление страны зарубежных туров
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

// Удаление категории круизов
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

// Удаление категории акций
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

// Удаление категории услуг
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

// Удаление категории отелей
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

// ===== FILE UPLOAD API =====
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;





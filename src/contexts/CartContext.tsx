import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  item_id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  added_at: string;
  type: 'tour' | 'room' | 'foreign' | 'cruise' | 'hotel'; // Тип товара: тур, номер, зарубежный тур, круиз или отель
  // Дополнительные поля для туров
  duration?: string;
  destination?: string;
  // Дополнительные поля для номеров
  capacity?: string;
  features?: string[];
  // Дополнительные поля для зарубежных туров
  country?: string;
  highlights?: string[];
  // Дополнительные поля для круизов
  departure?: string;
  image_url?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (itemId: number, type: 'tour' | 'room' | 'foreign' | 'cruise' | 'hotel', itemData: any, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCartItems = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Ошибка загрузки корзины');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user, fetchCartItems]);

  const addToCart = async (itemId: number, type: 'tour' | 'room' | 'foreign' | 'cruise' | 'hotel', itemData: any, quantity: number = 1) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    try {
      // Отправляем на сервер
      await axios.post('http://localhost:5000/api/cart/add', {
        itemId,
        type,
        quantity,
        itemData
      });
      
      // Обновляем корзину с сервера
      await fetchCartItems();
      
      let itemType = 'Товар';
      if (type === 'tour') itemType = 'Тур';
      else if (type === 'room') itemType = 'Номер';
      else if (type === 'foreign') itemType = 'Зарубежный тур';
      else if (type === 'cruise') itemType = 'Круиз';
      
      toast.success(`${itemType} добавлен в корзину`);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Ошибка добавления в корзину';
      toast.error(message);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`);
      
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      toast.success('Товар удален из корзины');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Ошибка удаления из корзины';
      toast.error(message);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};





import { useEffect, useState } from 'react';
import './App.css';
import { useLaunchParams } from '@telegram-apps/sdk-react';

// Расширяем глобальный объект window для работы с Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            username?: string;
          };
        };
      };
    };
  }
}

interface Product {
  id: number;
  title: string;
  price: number;
}

export function App() {
  const lp = useLaunchParams();

  // Состояния корзины
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const listOfProducts: Product[] = [
    { id: 1, title: "Пицца", price: 3000 }, 
    { id: 2, title: "Coca Cola", price: 500 },
    { id: 3, title: "Пончик", price: 650 }
  ];

  useEffect(() => {
    console.log('Telegram InitData:', lp.initDataRaw);
  }, [lp]);

  // Функция добавления товара
  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Динамический подсчет количества и суммы
  const cartCount = cart.length;
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Отправка заказа на бэкенд Django
  const handleCheckout = async () => {
    if (cartCount === 0) {
      alert("Корзина пустая!");
      return;
    }

    setLoading(true);

    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    const orderPayload = {
      user: user ? {
        id: user.id,
        first_name: user.first_name,
        username: user.username,
      } : {
        id: 12345,
        first_name: "Тестовый Юзер",
      },
      items: cart,
      totalPrice: cartTotal,
    };

    try {
      const response = await fetch('https://tma-backend-lcq9.onrender.com/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (data.status === 'ok') {
        alert(`Заказ №${data.order_id} успешно оформлен!`);
        setCart([]); // Очищаем корзину
      } else {
        alert('Ошибка при создании заказа');
      }
    } catch (error) {
      console.error('Ошибка соединения:', error);
      alert('Не удалось связаться с сервером Django');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-grid">
      {listOfProducts.map((product) => (
        <div key={product.id} className="product-card">
          <h3 className="product-title">{product.title}</h3>
          <div className="product-price">{product.price} ₸</div>
          <button 
            className="product-button"
            onClick={() => addToCart(product)}
          >
            В корзину
          </button>
        </div>
      ))}

      <div className="cart-bar">
        <div className="cart-info">
          <span>В корзине: <strong>{cartCount}</strong> шт.</span>
          <span>Итого: <strong>{cartTotal}</strong> ₸</span>
        </div>
        <button 
          className="cart-btn"
          onClick={handleCheckout}
          disabled={cartCount === 0 || loading}
        >
          {loading ? 'Отправка...' : 'Оформить заказ'}
        </button>
      </div>
    </div>
  );
}

export default App;
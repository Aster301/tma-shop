import { useEffect, useState } from 'react';
import './App.css';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { 
  AppRoot, 
  Button, 
  Card, 
  FixedLayout, 
  LargeTitle, 
  Text,
  Subheadline
} from '@telegram-apps/telegram-ui';

// Обязательный импорт стилей библиотеки
import '@telegram-apps/telegram-ui/dist/styles.css';

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
    <AppRoot style={{ padding: '16px', paddingBottom: '100px' }}>
      <LargeTitle style={{ marginBottom: '16px' }}>Меню</LargeTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
        {listOfProducts.map((product) => (
          <Card key={product.id} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Text weight="1">{product.title}</Text>
            <Subheadline level="2" style={{ color: 'var(--tgui--hint_color)' }}>
              {product.price} ₸
            </Subheadline>
            <Button 
              size="s" 
              mode="bezeled"
              onClick={() => addToCart(product)}
            >
              В корзину
            </Button>
          </Card>
        ))}
      </div>

      {/* Нижняя панель корзины с зафиксированным позиционированием */}
      <FixedLayout vertical="bottom" style={{ padding: '16px', backgroundColor: 'var(--tgui--bg_color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <Text weight="2">В корзине: {cartCount} шт.</Text>
          <Text weight="1" style={{ fontSize: '18px' }}>{cartTotal} ₸</Text>
        </div>
        <Button 
          size="l" 
          stretched 
          loading={loading}
          disabled={cartCount === 0 || loading}
          onClick={handleCheckout}
        >
          Оформить заказ
        </Button>
      </FixedLayout>
    </AppRoot>
  );
}

export default App;
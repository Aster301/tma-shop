import { useEffect } from 'react';
import './App.css';
import { useLaunchParams} from '@telegram-apps/sdk-react';
import './App.css';

export function App() {
  const lp = useLaunchParams();

  const listOfProducts = [
    {id:1, title: "Пицца", price: 3000}, 
    {id:2, title: "Coca Cola", price: 500},
    {id:3, title: "Пончик", price: 650}
  ];

  useEffect(() => {
    // Проверяем, что приложение запущено внутри Telegram
    console.log('Telegram InitData:', lp.initDataRaw);
  }, [lp]);

  return (
    <div className = "product-grid">
      <div className = "product-card">
        <h3 className = "product-title">{listOfProducts[0].title}</h3>
        <div className = "product-price">{listOfProducts[0].price} ₸</div>
         <button className = "product-button">В корзину</button>
      </div>
      <div className = "product-card">
        <h3 className = "product-title">{listOfProducts[1].title}</h3>
        <div className = "product-price">{listOfProducts[1].price} ₸</div>
         <button className = "product-button">В корзину</button>
      </div>
      <div className = "product-card">
        <h3 className = "product-title">{listOfProducts[2].title}</h3>
        <div className = "product-price">{listOfProducts[2].price} ₸</div>
         <button className = "product-button">В корзину</button>
      </div>
      <div className = "cart-bar">
        <div className = "cart-info">
          <span>В корзине: <strong id="cart-count">0</strong> шт.</span>
          <span>Итого: <strong id="cart-total">0</strong> ₸</span>
        </div>
        <button className="cart-btn">Оформить заказ</button>
      </div>
    </div>
  );
}

export default App;
import { useEffect } from 'react';
import './App.css';
import { useLaunchParams, miniApp, initData, useSignal } from '@telegram-apps/sdk-react';

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);
  
  // Получаем пользователя через сигнал initData.user
  const user = useSignal(initData.user);

  useEffect(() => {
    // Проверяем, что приложение запущено внутри Telegram
    console.log('Telegram InitData:', lp.initDataRaw);
  }, [lp]);

  return (
    <div style={{ backgroundColor: isDark ? '#111' : '#fff', color: isDark ? '#fff' : '#000', minHeight: '100vh', padding: 16 }}>
      <h1>Привет, Telegram Mini App!</h1>
      <p>ID пользователя: {user?.id ?? 'не определен (разработка)'}</p>
    </div>
  );
}

export default App;
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // Добавляем key в деструктуризацию
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // Если есть хеш (например, #contacts), не скроллим вверх, 
    // чтобы не мешать стандартному поведению якорей
    if (hash) return;

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    // Таймаут иногда нужен, если контент подгружается динамически
    const timer = setTimeout(scrollToTop, 0);
    
    return () => clearTimeout(timer);
  }, [pathname, hash, key]); // Добавляем key в зависимости

  return null;
}

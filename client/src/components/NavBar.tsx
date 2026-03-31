import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';

const links = [
  { label: 'Главная', href: '/' },
  { label: 'Конфигуратор', href: '/#configurator' },
  { label: 'Наши работы', href: '/galery' },
  { label: 'О нас', href: '/about' },
];

function Navbar() {
  const location = useLocation();

  // Плавный скролл при изменении hash
  useEffect(() => {
    if (location.hash === '#configurator') {
      const element = document.getElementById('configurator');
      if (element) {
        // Небольшая задержка, чтобы компонент успел отрисоваться
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <header className="bg-slate-50/80 backdrop-blur-md text-slate-900 font-headline font-bold tracking-tight sticky top-0 border-b border-slate-200/10 shadow-sm z-50">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center py-4 px-6">
        
        <div className="text-xl font-black text-slate-900 uppercase tracking-tighter">
          Строительная компания
        </div>

        <nav className="hidden md:flex gap-8 items-center font-headline font-bold tracking-[0.04em]">
          {links.map((link) => {
            const isActive = 
              link.href === '/#configurator'
                ? location.pathname === '/' && location.hash === '#configurator'
                : location.pathname === link.href;

            return (
              <Link
                key={link.label}
                to={link.href}
                className="group relative text-[15px] pb-1 transition-colors duration-200"
              >
                <span 
                  className={isActive ? "text-orange-700" : "text-slate-600 group-hover:text-slate-900"}
                >
                  {link.label}
                </span>

                <span 
                  className={`
                    absolute bottom-0 left-0 h-[2.5px] bg-orange-700 rounded transition-all duration-300
                    ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                  `}
                />
              </Link>
            );
          })}
        </nav>

        <button className="bg-[#8f4e00] text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition-all active:scale-95">
          Войти в личный кабинет
        </button>
      </div>
    </header>
  );
}

export default Navbar;
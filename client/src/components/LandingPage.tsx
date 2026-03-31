import HouseConfigurator from "./HouseConfigurator";
import house from "../assets/house.jpg";

function Content() {
  return (
    <main className="relative">
      {/* Сетка на фоне всего контента */}
      <div className="absolute inset-0 blueprint-grid pointer-events-none opacity-10"></div>

      {/* Hero Section */}
      <section className=" relative min-h-[870px] bg-[#eeeeee] flex items-center overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Левая часть: Текст */}
          <div className="lg:col-span-7">
            <h1 className="font-headline text-5xl md:text-7xl font-black text-[#051125] leading-[1.1] -tracking-[0.03em] mb-8">
              Современное, качественное и надежное строительство домов.
            </h1>
            <p className="text-[#45474d] text-xl max-w-xl mb-10 leading-relaxed">
              Мы создаем дома, которые становятся фамильным наследием.
              Инженерная точность, премиальные материалы и архитектурный надзор
              на каждом этапе.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#8f4e00] text-white px-10 py-5 rounded-lg font-bold text-lg hover:bg-orange-700 transition-all shadow-xl">
                Начать проект
              </button>
              <button className="border-b-2 border-[#051125] py-5 px-4 font-bold text-lg hover:bg-[#051125]/5 transition-colors">
                Наши проекты
              </button>
            </div>
          </div>

          {/* Правая часть: Изображение и Плашка 15+ лет */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-[#e6e6e6] rounded-lg overflow-hidden relative shadow-2xl transform lg:translate-x-12 lg:-rotate-2">
              <img
                src={house}
                alt="Premium House Design"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051125]/40 to-transparent"></div>
            </div>

            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-lg shadow-2xl border border-slate-100 max-w-[200px]">
              <span className="text-[#8f4e00] font-headline text-4xl font-black block mb-1">
                15+
              </span>
              <span className="text-[#45474d] text-sm font-bold uppercase tracking-wider leading-tight">
                Лет безупречного строительства
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- СЕКЦИЯ "О НАС" (Восстановлена) --- */}
      <section className="py-24 relative overflow-hidden bg-[#dadada] z-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#051125]/5 text-[#051125] text-xs font-bold tracking-[0.2em] uppercase mb-4 rounded">
                <span className="w-1.5 h-1.5 bg-[#8f4e00] rounded-full"></span>
                Строительная компания
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-black text-[#051125] mb-6 tracking-tight leading-tight">
                Более 10 лет создаем архитектурные шедевры
              </h2>
              <div className="space-y-4 text-[#45474d] text-base leading-relaxed">
                <p>
                  За десятилетие работы мы отточили мастерство в каждой детали.
                  Наш подход базируется на трех фундаментальных принципах:
                  <strong className="text-[#051125]">
                    {" "}
                    абсолютная надежность
                  </strong>
                  ,
                  <strong className="text-[#051125]">
                    {" "}
                    инженерное совершенство
                  </strong>{" "}
                  и
                  <strong className="text-[#051125]">
                    {" "}
                    индивидуальный подход
                  </strong>{" "}
                  к каждому клиенту.
                </p>
                <p>
                  Мы не просто строим стены — мы проектируем пространство для
                  жизни, объединяя передовые технологии с эстетикой современного
                  минимализма.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-black pt-8">
                <div>
                  <div className="text-3xl font-black text-[#051125] font-headline mb-1">
                    10+
                  </div>
                  <div className="text-[10px] font-bold text-[#45474d] uppercase tracking-[0.2em]">
                    Лет опыта
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#051125] font-headline mb-1">
                    150+
                  </div>
                  <div className="text-[10px] font-bold text-[#45474d] uppercase tracking-[0.2em]">
                    Проектов реализовано
                  </div>
                </div>
              </div>
            </div>

            {/* Визуальный акцент для секции */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#8f4e00] rounded-xl rotate-3 scale-95 opacity-5 group-hover:rotate-0 transition-transform"></div>
              <div className="bg-[#f3f3f3] aspect-square rounded-xl border border-slate-200 relative overflow-hidden">
                <div className="blueprint-grid absolute inset-0 opacity-20"></div>
                <img
                  src={house}
                  alt="Premium House Design"
                  className="absolute inset-0 w-full h-full object-cover scale-110 translate-x-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Интерактивный блок конфигуратора */}
      <section id="configurator" className="scroll-mt-28 ">
        <HouseConfigurator />
      </section>
    </main>
  );
}

export default Content;

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader, Button, Modal, Text, TextInput } from "@gravity-ui/uikit";
import { ChevronLeft, CircleCheck, Xmark } from "@gravity-ui/icons";

// --- ИНТЕРФЕЙСЫ ---
interface StepCard {
  title: string;
  description: string;
  image?: string;
  pros: string[];
  cons: string[];
  pricePerMeter?: number;
}

interface Step {
  stepName: string;
  cards: StepCard[];
}

interface SelectionItem {
  stepName: string;
  title: string;
  cost: number;
}

type Selections = Record<number, SelectionItem>;

interface TableRow {
  step: string;
  choice: string;
  price: string;
}

function HouseConfigurator() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selections, setSelections] = useState<Selections>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [area, setArea] = useState<number>(0);
  const [isBasicsSet, setIsBasicsSet] = useState<boolean>(false);

  // ВЫЧИСЛЯЕМАЯ СУММА
  const totalPrice = Object.values(selections).reduce(
    (acc, curr) => acc + curr.cost,
    0,
  );

  const scrollToConfigurator = () => {
    const element = document.getElementById("configurator");
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    axios
      .get<Step[]>("http://localhost:3001/api/steps")
      .then((res) => {
        setSteps(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка запроса:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isBasicsSet) scrollToConfigurator();
  }, [currentStepIndex, isBasicsSet]);

  const handleSelect = (cardTitle: string, pricePerM: number = 0): void => {
    const stepCost = area * pricePerM;

    setSelections((prev) => ({
      ...prev,
      [currentStepIndex]: {
        stepName: steps[currentStepIndex].stepName,
        title: cardTitle,
        cost: stepCost,
      },
    }));

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsModalOpen(true);
    }
  };

  const tableData: TableRow[] = Object.values(selections).map((s) => ({
    step: s.stepName,
    choice: s.title,
    price: `${s.cost.toLocaleString()} ₽`,
  }));

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#eeeeee]">
        <Loader size="l" />
      </div>
    );

  if (!isBasicsSet) {
    return (
      <section className="py-20 bg-[#eeeeee] min-h-screen flex items-center justify-center">
        <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl max-w-lg w-full text-center">
          <Text variant="caption-1" color="hint" className="uppercase font-bold mb-4 block">
            Начало расчета
          </Text>
          <h2 className="text-4xl font-black text-[#051125] mb-8 tracking-tighter">
            Укажите площадь дома
          </h2>
          <div className="space-y-8">
            <TextInput
              placeholder="М²"
              size="xl"
              type="number"
              onUpdate={(v) => setArea(Number(v))}
              controlProps={{
                style: { fontSize: "32px", textAlign: "center", fontWeight: "900", height: "80px" },
              }}
            />
            <Button
              size="xl"
              view="action"
              width="max"
              disabled={area <= 0}
              onClick={() => setIsBasicsSet(true)}
              style={{ height: "50px", borderRadius: "20px", fontSize: "18px", fontWeight: "bold" }}
            >
              Начать конфигурацию
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <section id="configurator" className="py-12 md:py-20 bg-[#eeeeee] min-h-screen flex items-center justify-center scroll-mt-24">
      <div className="w-full max-w-[1100px] px-6">
        <div className="bg-white p-8 md:p-16 rounded-[48px] shadow-xl border border-slate-200">
          <div className="flex justify-between items-center mb-16">
            <div className="w-32">
              {currentStepIndex > 0 && (
                <Button view="flat-secondary" size="xl" onClick={() => setCurrentStepIndex((p) => p - 1)}>
                  <ChevronLeft /> Назад
                </Button>
              )}
            </div>
            <div className="text-center">
              <Text variant="caption-1" color="hint" className="font-bold uppercase block mb-2">
                Этап {currentStepIndex + 1} из {steps.length} • {area} м²
              </Text>
              <h2 className="text-4xl md:text-6xl font-black text-[#051125] tracking-tighter uppercase leading-[0.8]">
                {currentStep?.stepName}
              </h2>
            </div>
            <div className="w-32 text-right">
              <Button view="flat-info" size="xl" onClick={() => handleSelect("Пропущено", 0)}>
                Пропустить
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {currentStep?.cards.map((card, idx) => {
              const isSelected = selections[currentStepIndex]?.title === card.title;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(card.title, card.pricePerMeter)}
                  className={`flex flex-col cursor-pointer border rounded-[40px] p-8 transition-all duration-500 ${
                    isSelected
                      ? "bg-blue-50 border-blue-500 shadow-lg scale-[1.02]"
                      : "bg-slate-50/50 border-slate-100 hover:bg-white hover:shadow-2xl"
                  }`}
                >
                  {card.image && (
                    <div className="overflow-hidden rounded-[28px] mb-8 h-72 shadow-inner bg-slate-200">
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-3xl font-black text-[#051125] mb-4 uppercase tracking-tighter">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-lg leading-relaxed mb-8">{card.description}</p>

                  <div className="space-y-6 mb-10 flex-grow">
                    {card.pros && card.pros.length > 0 && card.pros[0] !== "" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                          <CircleCheck width={16} height={16} /> Преимущества
                        </div>
                        <ul className="space-y-2 text-slate-600 text-sm">
                          {card.pros.map((p, i) => <li key={i}>• {p}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-3xl font-black text-[#8f4e00]">
                      {((card.pricePerMeter || 0) * area).toLocaleString()} ₽
                    </span>
                    <Button view="action" size="l" pin="round-round">Выбрать</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8 max-w-2xl bg-white rounded-3xl relative">
          <div className="absolute right-4 top-4">
            <Button view="flat" onClick={() => setIsModalOpen(false)}>
              <Xmark width={24} height={24} />
            </Button>
          </div>
          <div className="mb-6">
            <Text variant="header-2">Ваш идеальный дом готов!</Text>
          </div>

          {/* НАДЕЖНАЯ ТАБЛИЦА НА TAILWIND */}
          <div className="mb-8 border rounded-2xl overflow-hidden border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Этап</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Выбор</th>
                  <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Стоимость</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm text-slate-700 font-medium">{row.step}</td>
                    <td className="p-4 text-sm text-slate-600">{row.choice}</td>
                    <td className="p-4 text-sm text-slate-900 font-bold text-right whitespace-nowrap">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-6 bg-slate-900 text-white rounded-2xl">
            <div>
              <Text variant="caption-1" className="opacity-60 uppercase font-bold">Итоговая стоимость:</Text>
              <div className="text-4xl font-black">{totalPrice.toLocaleString()} ₽</div>
            </div>
            <Button size="xl" view="action" onClick={() => alert("Заявка отправлена!")}>
              Оформить заявку
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

export default HouseConfigurator;

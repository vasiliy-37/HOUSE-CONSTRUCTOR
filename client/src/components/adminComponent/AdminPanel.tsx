import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Card,
  Text,
  Flex,
  Icon,
  Divider,
} from "@gravity-ui/uikit";
import {
  Plus,
  ChevronUp,
  ChevronDown,
  TrashBin,
  Xmark,
} from "@gravity-ui/icons";
import imageCompression from "browser-image-compression";
import axios from "axios";

const API_URL = "http://localhost:3001/api/steps";

interface StepCard {
  title: string;
  description: string;
  image?: string;
  pros: string[];
  cons: string[];
  pricePerMeter: number; // ДОБАВИЛИ ПОЛЕ ЦЕНЫ
}

interface Step {
  stepName: string;
  cards: StepCard[];
  order?: number;
}

const AdminPanel = () => {
  const [stepName, setStepName] = useState("");
  const [cards, setCards] = useState<StepCard[]>([
    {
      title: "",
      description: "",
      image: "",
      pros: [""],
      cons: [""],
      pricePerMeter: 0,
    },
  ]);
  const [allSteps, setAllSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Загрузка списка всех этапов
  const fetchAllSteps = async () => {
    try {
      const res = await axios.get<Step[]>(API_URL);
      setAllSteps(res.data);
    } catch (e) {
      console.error("Ошибка при получении списка этапов", e);
    }
  };

  useEffect(() => {
    fetchAllSteps();
  }, []);

  // 2. Авто-подгрузка данных при выборе этапа
  useEffect(() => {
    const existing = allSteps.find(
      (s) => s.stepName.toLowerCase() === stepName.toLowerCase(),
    );
    if (existing) {
      setCards(
        existing.cards.map((c) => ({
          ...c,
          pricePerMeter: c.pricePerMeter || 0, // Защита от старых данных без цены
        })),
      );
    }
  }, [stepName, allSteps]);

  const updateCardField = <K extends keyof StepCard>(
    index: number,
    field: K,
    value: StepCard[K],
  ) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleImageUpload = async (index: number, file: File | null) => {
    if (!file) return;
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      updateCardField(index, "image", base64);
    } catch (error) {
      console.error("Ошибка сжатия:", error);
    }
  };

  const addCard = () =>
    setCards([
      ...cards,
      {
        title: "",
        description: "",
        image: "",
        pros: [""],
        cons: [""],
        pricePerMeter: 0,
      },
    ]);
  const removeCard = (index: number) =>
    setCards(cards.filter((_, i) => i !== index));

  const moveCard = (index: number, direction: "up" | "down") => {
    const newCards = [...cards];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target >= 0 && target < newCards.length) {
      [newCards[index], newCards[target]] = [newCards[target], newCards[index]];
      setCards(newCards);
    }
  };

  const updateArrayField = (
    cardIdx: number,
    field: "pros" | "cons",
    itemIdx: number,
    value: string,
  ) => {
    const newCards = [...cards];
    newCards[cardIdx][field][itemIdx] = value;
    setCards(newCards);
  };

  const addArrayItem = (cardIdx: number, field: "pros" | "cons") => {
    const newCards = [...cards];
    newCards[cardIdx][field].push("");
    setCards(newCards);
  };

  const removeArrayItem = (
    cardIdx: number,
    field: "pros" | "cons",
    itemIdx: number,
  ) => {
    const newCards = [...cards];
    newCards[cardIdx][field] = newCards[cardIdx][field].filter(
      (_, i) => i !== itemIdx,
    );
    setCards(newCards);
  };

  const saveToDb = async () => {
    if (!stepName) return alert("Введите название этапа");
    setIsLoading(true);
    try {
      await axios.post(API_URL, { stepName, cards, order: 1 });
      await fetchAllSteps();
      alert("Сохранено успешно!");
    } catch (e) {
      alert(`Ошибка сохранения: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStep = async () => {
    if (!window.confirm(`Удалить весь этап "${stepName}"?`)) return;
    try {
      await axios.delete(`${API_URL}/${stepName}`);
      setStepName("");
      setCards([
        {
          title: "",
          description: "",
          image: "",
          pros: [""],
          cons: [""],
          pricePerMeter: 0,
        },
      ]);
      await fetchAllSteps();
      alert("Этап удален");
    } catch (e) {
      alert(`Ошибка удаления: ${e}`);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <Flex direction="column" gap="6">
        <Text variant="header-2">🛠️ Админ-панель конструктора</Text>

        {/* НАВИГАЦИЯ */}
        <Card view="raised" style={{ padding: "20px" }}>
          <Text
            variant="subheader-2"
            style={{ marginBottom: "12px", display: "block" }}
          >
            Выберите этап:
          </Text>
          <Flex gap="2" wrap="wrap">
            {allSteps.map((s) => (
              <Button
                key={s.stepName}
                view={stepName === s.stepName ? "action" : "outlined"}
                onClick={() => {
                  setStepName(s.stepName);
                  setCards(s.cards);
                }}
              >
                {s.stepName}
              </Button>
            ))}
            <Button
              view="flat-info"
              onClick={() => {
                setStepName("");
                setCards([
                  {
                    title: "",
                    description: "",
                    image: "",
                    pros: [""],
                    cons: [""],
                    pricePerMeter: 0,
                  },
                ]);
              }}
            >
              <Icon data={Plus} /> Новый этап
            </Button>
          </Flex>
        </Card>

        <Divider />

        {/* НАЗВАНИЕ ЭТАПА */}
        <Flex gap="3" alignItems="flex-end">
          <TextInput
            label="Название текущего этапа"
            placeholder="Например: Фундамент"
            size="l"
            value={stepName}
            onUpdate={setStepName}
            style={{ flex: 1 }}
          />
          {allSteps.some((s) => s.stepName === stepName) && (
            <Button view="flat-danger" onClick={deleteStep} size="l">
              <Icon data={TrashBin} /> Удалить этап
            </Button>
          )}
        </Flex>

        {/* КАРТОЧКИ ТЕХНОЛОГИЙ */}
        {cards.map((card, idx) => (
          <Card key={idx} view="raised" style={{ padding: "24px" }}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              style={{ marginBottom: "20px" }}
            >
              <Text variant="subheader-2">Технология №{idx + 1}</Text>
              <Flex gap="2">
                <Button
                  size="s"
                  disabled={idx === 0}
                  onClick={() => moveCard(idx, "up")}
                >
                  <Icon data={ChevronUp} />
                </Button>
                <Button
                  size="s"
                  disabled={idx === cards.length - 1}
                  onClick={() => moveCard(idx, "down")}
                >
                  <Icon data={ChevronDown} />
                </Button>
                <Button
                  size="s"
                  view="flat-danger"
                  onClick={() => removeCard(idx)}
                >
                  <Icon data={TrashBin} />
                </Button>
              </Flex>
            </Flex>

            <Flex direction="column" gap="5">
              <Flex direction="column" gap="2">
                <Text color="secondary">Фото (Base64):</Text>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(idx, e.target.files?.[0] || null)
                  }
                />
                {card.image && (
                  <img
                    src={card.image}
                    alt="preview"
                    style={{
                      width: "150px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginTop: "10px",
                    }}
                  />
                )}
              </Flex>

              <TextInput
                label="Название технологии"
                value={card.title}
                onUpdate={(v) => updateCardField(idx, "title", v)}
              />
              <TextInput
                label="Описание"
                value={card.description}
                onUpdate={(v) => updateCardField(idx, "description", v)}
              />

              {/* ПОЛЕ ЦЕНЫ */}
              <div style={{ maxWidth: "300px" }}>
                <Text
                  color="secondary"
                  style={{ marginBottom: "4px", display: "block" }}
                >
                  Стоимость за м² (₽):
                </Text>
                <TextInput
                  type="number"
                  placeholder="0"
                  size="l"
                  value={String(card.pricePerMeter || 0)}
                  onUpdate={(v) =>
                    updateCardField(idx, "pricePerMeter", Number(v))
                  }
                  // Убрали leftContent, так как он часто вызывает ошибки типизации
                />
              </div>

              <Flex gap="4">
                <Flex direction="column" gap="2" style={{ flex: 1 }}>
                  <Text color="positive" style={{ fontWeight: "bold" }}>
                    Плюсы:
                  </Text>
                  {card.pros.map((p, pIdx) => (
                    <Flex key={pIdx} gap="1">
                      <TextInput
                        value={p}
                        onUpdate={(v) => updateArrayField(idx, "pros", pIdx, v)}
                        style={{ flex: 1 }}
                      />
                      <Button
                        view="flat"
                        onClick={() => removeArrayItem(idx, "pros", pIdx)}
                      >
                        <Icon data={Xmark} />
                      </Button>
                    </Flex>
                  ))}
                  <Button
                    size="s"
                    view="outlined-info"
                    onClick={() => addArrayItem(idx, "pros")}
                  >
                    <Icon data={Plus} /> Добавить плюс
                  </Button>
                </Flex>

                <Flex direction="column" gap="2" style={{ flex: 1 }}>
                  <Text color="danger" style={{ fontWeight: "bold" }}>
                    Минусы:
                  </Text>
                  {card.cons.map((c, cIdx) => (
                    <Flex key={cIdx} gap="1">
                      <TextInput
                        value={c}
                        onUpdate={(v) => updateArrayField(idx, "cons", cIdx, v)}
                        style={{ flex: 1 }}
                      />
                      <Button
                        view="flat"
                        onClick={() => removeArrayItem(idx, "cons", cIdx)}
                      >
                        <Icon data={Xmark} />
                      </Button>
                    </Flex>
                  ))}
                  <Button
                    size="s"
                    view="outlined-info"
                    onClick={() => addArrayItem(idx, "cons")}
                  >
                    <Icon data={Plus} /> Добавить минус
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        ))}

        <Button
          size="xl"
          view="outlined"
          onClick={addCard}
          style={{ borderStyle: "dashed" }}
        >
          <Icon data={Plus} /> Добавить еще технологию в этот этап
        </Button>

        <Divider />

        <Button
          size="xl"
          view="action"
          loading={isLoading}
          onClick={saveToDb}
          style={{ height: "60px" }}
        >
          Сохранить весь этап в базу данных
        </Button>
      </Flex>
    </div>
  );
};

export default AdminPanel;

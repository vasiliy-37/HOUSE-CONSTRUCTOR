import { useState, useEffect } from "react";
import { Card, Button, Text, Flex, Loader } from "@gravity-ui/uikit";
import axios from "axios";

interface StepCard {
  title: string;
  description: string;
  image?: string; // Поле для нашей строки Base64
  pros: string[];
  cons: string[];
}

interface Step {
  stepName: string;
  cards: StepCard[];
}

const API_URL = "http://localhost:3001/api/steps";

const QuizContainer = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setSteps(res.data);
        setLoading(false);
      })
      .catch(() => alert("Ошибка загрузки данных"));
  }, []);

  const currentStep = steps[currentStepIndex];

  const handleSelect = (cardTitle: string) => {
    setSelections((prev) => ({ ...prev, [currentStep.stepName]: cardTitle }));

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (loading)
    return (
      <Flex justifyContent="center" style={{ padding: "100px" }}>
        <Loader size="l" />
      </Flex>
    );
    
  if (!currentStep && !isFinished) return <Text>Нет данных</Text>;

  return (
    <Flex
      direction="column"
      alignItems="center"
      gap="8"
      style={{ padding: "40px" }}
    >
      {!isFinished ? (
        <>
          <Text variant="header-2">{currentStep.stepName}</Text>

          <Flex gap="6" wrap="wrap" justifyContent="center">
            {currentStep.cards.map((card, idx) => (
              <Card
                key={idx}
                view="raised"
                style={{ width: "320px", padding: "20px", display: 'flex', flexDirection: 'column' }}
              >
                {/* 🖼️ ВЫВОД КАРТИНКИ ТЕХНОЛОГИИ */}
                {card.image && (
                  <div style={{ width: "100%", height: "180px", marginBottom: "15px", overflow: "hidden", borderRadius: "12px" }}>
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                )}

                <Flex direction="column" gap="4" style={{ flexGrow: 1 }}>
                  <Text variant="header-1">{card.title}</Text>
                  <Text color="secondary">{card.description}</Text>

                  <div style={{ flexGrow: 1, margin: "15px 0" }}>
                    <Text variant="subheader-1" color="positive">
                      ✓ Плюсы:
                    </Text>
                    {card.pros.map((p, i) => (
                      <div key={i} style={{ marginBottom: "4px" }}>
                        <Text variant="body-1">• {p}</Text>
                      </div>
                    ))}

                    <Text
                      variant="subheader-1"
                      color="danger"
                      style={{ marginTop: "10px", display: "block" }}
                    >
                      × Минусы:
                    </Text>
                    {card.cons.map((c, i) => (
                      <div key={i} style={{ marginBottom: "4px" }}>
                        <Text variant="body-1">• {c}</Text>
                      </div>
                    ))}
                  </div>

                  <Button
                    view="action"
                    size="l"
                    width="max"
                    onClick={() => handleSelect(card.title)}
                  >
                    Выбрать
                  </Button>
                </Flex>
              </Card>
            ))}
          </Flex>
        </>
      ) : (
        /* ЭКРАН РЕЗУЛЬТАТА */
        <Card view="raised" style={{ padding: "40px", maxWidth: "600px", width: "100%" }}>
          <Text variant="header-2" style={{ marginBottom: "20px", display: "block" }}>
            Ваша конфигурация дома:
          </Text>
          <Flex direction="column" gap="4">
            {Object.entries(selections).map(([step, value]) => (
              <Flex key={step} justifyContent="space-between" style={{ borderBottom: "1px solid #ccc", paddingBottom: "8px" }}>
                <Text variant="body-2" color="secondary">{step}:</Text>
                <Text variant="body-2" style={{ fontWeight: "bold" }}>{value}</Text>
              </Flex>
            ))}
          </Flex>
          <Button 
            view="action" 
            size="xl" 
            style={{ marginTop: "30px" }} 
            onClick={() => window.location.reload()}
          >
            Начать заново
          </Button>
        </Card>
      )}
    </Flex>
  );
};

export default QuizContainer;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";
import axios from "axios";

import AdminContent from "./components/adminComponent/AdminContent.tsx";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Content from "./components/Content";
import Galery from "./components/Galery";
import About from "./components/About";
import ScrollToTop from "./components/ScrollToTop";
import AdminGalery from "./components/adminComponent/AdminGalery";
import type { LandingData } from "./types.ts";

import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";

// Дефолтные данные, если в БД еще пусто
const DEFAULT_LANDING: LandingData = {
  heroTitle: "Современное, качественное и надежное строительство домов.",
  heroSub: "Мы создаем дома, которые становятся фамильным наследием...",
  heroImg: "",
  experienceYears: "15+",
  aboutBadge: "Строительная компания",
  aboutTitle: "Более 10 лет создаем архитектурные шедевры",
  aboutText1: "За десятилетие работы мы отточили мастерство...",
  aboutText2: "Мы не просто строим стены...",
  statYears: "10+",
  statProjects: "150+",
  aboutImg: "",
};

function App() {
  const [landingData, setLandingData] = useState<LandingData | null>(null);

  // 1. Загружаем контент лендинга из БД
  useEffect(() => {
    axios
      .get<LandingData>("http://localhost:3001/api/landing-content")
      .then((res) => {
        // Если объект пришел пустой (база чистая), ставим дефолты
        setLandingData(
          Object.keys(res.data).length > 0 ? res.data : DEFAULT_LANDING,
        );
      })
      .catch(() => setLandingData(DEFAULT_LANDING));
  }, []);

  // 2. Функция сохранения (вызывается из админки)
  const handleSaveLanding = async (updatedData: LandingData) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/landing-content",
        updatedData,
      );
      setLandingData(res.data);
      alert("✅ Контент успешно обновлен");
    } catch (error) {
      console.error(error);
      alert("❌ Ошибка при сохранении");
    }
  };

  if (!landingData) return null; // Или лоадер от Gravity UI

  return (
    <ThemeProvider theme="light">
      <BrowserRouter>
        <ScrollToTop />
        <NavBar />

        <Routes>
          {/* Передаем данные в основной контент */}
          <Route path="/" element={<Content data={landingData} />} />

          {/* Передаем данные и функцию сохранения в админку */}
          <Route
            path="/admin"
            element={
              <AdminContent
                initialData={landingData}
                onSaveToServer={handleSaveLanding}
              />
            }
          />

          <Route path="/admin/galery" element={<AdminGalery />} />
          <Route path="/galery" element={<Galery />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

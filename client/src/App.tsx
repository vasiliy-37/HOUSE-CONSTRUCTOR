import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@gravity-ui/uikit';
import AdminPanel from './components/AdminPanel';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage'
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import Galery from './components/Galery';
import About from './components/About';
import ScrollToTop from './components/ScrollToTop';
import AdminGalery from './components/AdminGalery';

function App() {
  return (
    <ThemeProvider theme="light">
      <BrowserRouter>
        <ScrollToTop/>
        {/* NavBar будет виден на всех страницах */}
        <NavBar /> 

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/galery" element={<AdminGalery />} />
          <Route path="/galery" element={<Galery />} />
          <Route path="/about" element={<About />} />
        </Routes>

        {/* Footer будет виден на всех страницах */}
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

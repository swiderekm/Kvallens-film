import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteProvider } from "./context/SiteContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { MovieDetail } from "./pages/MovieDetail";
import { About } from "./pages/About";
import { WatchList } from "./pages/WatchList";
import { WatchedList } from "./pages/WatchedList";
import "./App.css";

function App() {
  return (
    <SiteProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/watched" element={<WatchedList />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </SiteProvider>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingCart from "./components/FloatingCart";
import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Accessories from "./pages/Accessories";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <CartProvider>
      <div className="app">
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/product" element={<Product />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <FloatingCart />
      </div>
    </CartProvider>
  );
}

export default App;

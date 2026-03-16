import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="logo">SneakerStudio</p>
          <p className="muted">Minimalist sneakers for everyday movement.</p>
        </div>
        <div>
          <p className="footer-title">Shop</p>
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
          <Link to="/accessories">Accessories</Link>
          <Link to="/product">Product</Link>
        </div>
        <div>
          <p className="footer-title">Order</p>
          <span className="muted">Viber / Telegram</span>
          <span className="muted">+959670000834</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 SneakerStudio. All rights reserved.</p>
      </div>
    </footer>
  );
}


import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CONTACT_PHONE = "+959670000834";
const TELEGRAM_URL = "https://t.me/share/url";
const VIBER_URL = "viber://forward";

const parsePrice = (value) => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9]/g, "");
  return Number(cleaned || 0);
};

const formatMMK = (amount) => {
  return `MMK ${amount.toLocaleString("en-US")}`;
};

export default function FloatingCart() {
  const { items, count, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [items]
  );

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + parsePrice(item.price) * (item.quantity || 1),
        0
      ),
    [items]
  );

  const buildMessage = () => {
    if (!items.length) return "";
    const origin = window.location.origin;

    return [
      "New SneakerStudio Order",
      `To: ${CONTACT_PHONE}`,
      "",
      "Items:",
      ...items.map((item, index) => {
        const lineTotal = parsePrice(item.price) * (item.quantity || 1);
        const imageUrl = item.image
          ? item.image.startsWith("http")
            ? item.image
            : `${origin}${item.image}`
          : "-";
        const imageLine = `Image: ${imageUrl}`;
        return `${index + 1}. ${item.name} (${item.size}) x${item.quantity} — ${formatMMK(
          lineTotal
        )}\n${imageLine}`;
      }),
      "",
      `Total items: ${totalItems}`,
      `Total amount: ${formatMMK(totalAmount)}`,
    ].join("\n");
  };

  const handleSend = (platform) => {
    if (!items.length) {
      setOpen(true);
      return;
    }

    const message = buildMessage();
    const encoded = encodeURIComponent(message);

    const targetUrl =
      platform === "viber"
        ? `${VIBER_URL}?text=${encoded}`
        : `${TELEGRAM_URL}?text=${encoded}`;

    window.open(targetUrl, "_blank", "noopener,noreferrer");
    clearCart();
    setOpen(false);
  };

  const handleCartClick = () => {
    if (location.pathname !== "/product") {
      navigate("/product");
      return;
    }
    setOpen((prev) => !prev);
  };

  return (
    <div className={`floating-cart-wrap${open ? " open" : ""}`}>
      <button
        className="floating-cart"
        type="button"
        aria-label="Open order options"
        onClick={handleCartClick}
      >
        <span className="cart-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
            <path d="M7 4H5L3 7v2h2l2.6 8.2c.2.6.8 1 1.5 1h7.9c.7 0 1.3-.4 1.5-1L21 9V7H7zM9 20a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </span>
        <span className="cart-count">{count}</span>
      </button>
      <div className="cart-menu" role="menu">
        <p className="cart-menu-title">Send order via</p>
        <button
          className="btn"
          type="button"
          onClick={() => handleSend("telegram")}
        >
          Telegram
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => handleSend("viber")}
        >
          Viber
        </button>
        {!items.length && (
          <p className="muted">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}

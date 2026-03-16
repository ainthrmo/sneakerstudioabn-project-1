import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";

const CONTACT_PHONE = "+959670000834";

const parsePrice = (value) => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9]/g, "");
  return Number(cleaned || 0);
};

const formatMMK = (amount) => {
  return `MMK ${amount.toLocaleString("en-US")}`;
};

export default function Product() {
  const { items, count, removeItem } = useCart();
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const cartTotal = useMemo(
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
        return `${index + 1}. ${item.name} (${item.size}) x${item.quantity} — ${formatMMK(
          lineTotal
        )}\nImage: ${imageUrl}`;
      }),
      "",
      `Total items: ${count}`,
      `Total amount: ${formatMMK(cartTotal)}`,
      "",
      "Is this product still available?",
    ].join("\n");
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const temp = document.createElement("textarea");
    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.style.position = "absolute";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.select();
    const success = document.execCommand("copy");
    document.body.removeChild(temp);
    return success;
  };

  const handleCopy = async () => {
    if (!items.length) {
      setStatus({ type: "error", message: "Your cart is empty." });
      return;
    }

    const message = buildMessage();
    try {
      const copied = await copyToClipboard(message);
      if (!copied) {
        setStatus({
          type: "error",
          message: "Could not copy. Please copy the message manually.",
        });
        return;
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Could not copy. Please copy the message manually.",
      });
      return;
    }

    setStatus({ type: "success", message: "Order copied. Paste into chat." });
  };

  const handleSend = async (platform) => {
    if (!items.length) {
      setStatus({ type: "error", message: "Your cart is empty." });
      return;
    }

    const message = buildMessage();
    try {
      const copied = await copyToClipboard(message);
      if (!copied) {
        setStatus({
          type: "error",
          message: "Could not copy. Please copy the message manually.",
        });
        return;
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Could not copy. Please copy the message manually.",
      });
      return;
    }

    const targetUrl =
      platform === "viber"
        ? `viber://chat?number=${encodeURIComponent(CONTACT_PHONE)}`
        : "https://t.me/+959670000834";

    window.open(targetUrl, "_blank", "noopener,noreferrer");
    setStatus({
      type: "success",
      message: `Order copied. Opened ${platform === "viber" ? "Viber" : "Telegram"}.`,
    });
  };

  return (
    <main id="main" className="product-page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Your Cart</p>
          <h1>Review your items.</h1>
          <p className="lead">Only products you add will appear here.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="order-panel">
            <div className="order-header">
              <h2>Selected items</h2>
              <span className="order-count">{count} items</span>
            </div>
            {items.length === 0 ? (
              <p className="muted">Your cart is empty. Add items to see them here.</p>
            ) : (
              <ul className="order-list">
                {items.map((item, index) => {
                  const lineTotal = parsePrice(item.price) * (item.quantity || 1);
                  return (
                    <li key={`${item.name}-${item.size}-${index}`}>
                      <div>
                        {item.image && (
                          <img
                            className="order-thumb"
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                          />
                        )}
                        <p className="order-name">
                          {item.name} ({item.size}) x{item.quantity}
                        </p>
                        <p className="order-price">{formatMMK(lineTotal)}</p>
                        <button
                          className="order-remove"
                          type="button"
                          onClick={() => removeItem(item.name, item.size)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
                <li>
                  <div>
                    <p className="order-name">Total</p>
                    <p className="order-price">{formatMMK(cartTotal)}</p>
                  </div>
                </li>
              </ul>
            )}
            <div className="support-actions">
              <button
                className="support-btn telegram"
                type="button"
                onClick={() => handleSend("telegram")}
              >
                Chat on Telegram
              </button>
              <button
                className="support-btn viber"
                type="button"
                onClick={() => handleSend("viber")}
              >
                Chat on Viber
              </button>
            </div>
            {status.type !== "idle" && (
              <p className={`form-status ${status.type}`}>{status.message}</p>
            )}
            <span className="support-note">{CONTACT_PHONE}</span>
          </div>
        </div>
      </section>

    </main>
  );
}

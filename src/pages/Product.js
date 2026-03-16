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
        return `${index + 1}. ${item.name} (${item.size}) x${item.quantity} - ${formatMMK(
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
                      <div className="order-item">
                        {item.image && (
                          <img
                            className="order-thumb"
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                          />
                        )}
                        <div className="order-details">
                          <p className="order-name">
                            {item.name}
                            <span className="order-meta">
                              {item.size} • Qty {item.quantity}
                            </span>
                          </p>
                          <p className="order-price">{formatMMK(lineTotal)}</p>
                        </div>
                        <button
                          className="order-remove"
                          type="button"
                          onClick={() => removeItem(item.name, item.size)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <span className="trash-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="img" focusable="false">
                              <path
                                d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v9h-2V9Zm4 0h2v9h-2V9ZM7 9h2v9H7V9Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                          <span className="sr-only">Remove</span>
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
                <span className="support-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path
                      d="M20.4 4.8 3.9 11.2c-1.1.4-1.1 1 .2 1.4l4.1 1.3 1.6 4.7c.2.6.4.7.8.3l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l2.9-13.4c.3-1.2-.4-1.7-1.4-1.3ZM8.9 13.6l8.2-5.1c.4-.2.8 0 .5.3l-6.6 6-.2 2.3-1-3.2-2.9-.9Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Chat on Telegram
              </button>
              <button
                className="support-btn viber"
                type="button"
                onClick={() => handleSend("viber")}
              >
                <span className="support-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path
                      d="M20.5 14.4c-.7-1.6-2.5-2.1-3.3-1.2l-.7.8c-.3.3-.7.4-1.1.2-1.3-.6-2.7-2-3.3-3.3-.2-.4-.1-.8.2-1.1l.8-.7c.9-.8.4-2.6-1.2-3.3l-1-.4c-.9-.4-1.9-.1-2.4.8-.9 1.7-1 3.9-.1 6.1 1.2 3 4 5.8 7 7 2.2.9 4.4.8 6.1-.1.9-.5 1.2-1.5.8-2.4l-.4-1Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Chat on Viber
              </button>
            </div>
            {status.type !== "idle" && (
              <p className={`form-status ${status.type}`}>{status.message}</p>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}

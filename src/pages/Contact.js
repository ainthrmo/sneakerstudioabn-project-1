import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";

const CONTACT_PHONE = "+959670000834";
const TELEGRAM_URL = `https://t.me/${CONTACT_PHONE}`;
const VIBER_URL = `viber://chat?number=${encodeURIComponent(CONTACT_PHONE)}`;

const initialState = {
  name: "",
  contact: "",
  address: "",
  note: "",
};

const parsePrice = (value) => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9]/g, "");
  return Number(cleaned || 0);
};

const formatMMK = (amount) => {
  return `MMK ${amount.toLocaleString("en-US")}`;
};

export default function Contact() {
  const { items, count, clearCart } = useCart();
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [receipt, setReceipt] = useState("");
  const [shareMessage, setShareMessage] = useState("");

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

  const orderLines = items.map((item, index) => {
    const origin = window.location.origin;
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
  });

  const receiptText = useMemo(() => {
    if (!items.length) {
      return "";
    }

    return [
      "SneakerStudio Order Receipt",
      `Date: ${new Date().toLocaleString()}`,
      "",
      "Customer",
      `Name: ${form.name || "-"}`,
      `Contact: ${form.contact || "-"}`,
      `Address: ${form.address || "-"}`,
      "",
      "Items",
      ...items.map((item, index) => {
        const origin = window.location.origin;
        const lineTotal = parsePrice(item.price) * (item.quantity || 1);
        const imageUrl = item.image
          ? item.image.startsWith("http")
            ? item.image
            : `${origin}${item.image}`
          : "-";
        const imageLine = `Image: ${imageUrl}`;
        return `  ${index + 1}. ${item.name} (${item.size}) x${item.quantity} — ${formatMMK(
          lineTotal
        )}\n    ${imageLine}`;
      }),
      "",
      `Total items: ${totalItems}`,
      `Total amount: ${formatMMK(totalAmount)}`,
      form.note ? `Note: ${form.note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [items, form, totalItems, totalAmount]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildMessage = () =>
    [
      "New SneakerStudio Order",
      `To: ${CONTACT_PHONE}`,
      `Name: ${form.name}`,
      `Contact: ${form.contact}`,
      `Address: ${form.address}`,
      "",
      "Items:",
      ...items.map((item, index) => {
        const origin = window.location.origin;
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
      form.note ? "" : null,
      form.note ? `Note: ${form.note}` : null,
    ]
      .filter(Boolean)
      .join("\n");

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

  const openReceipt = (text) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.focus();
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = `sneakerstudio-receipt-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleSend = async (platform) => {
    if (!form.name || !form.contact || !form.address) {
      setStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    if (items.length === 0) {
      setStatus({ type: "error", message: "Your cart is empty." });
      return;
    }

    const message = buildMessage();
    setShareMessage(message);
    setReceipt(receiptText);

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

    const targetUrl = platform === "viber" ? VIBER_URL : TELEGRAM_URL;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    openReceipt(receiptText);

    setStatus({
      type: "success",
      message: `Order copied. Opened ${platform === "viber" ? "Viber" : "Telegram"}. Receipt downloaded.`,
    });
    clearCart();
  };

  return (
    <main id="main" className="page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Order</p>
          <h1>Review your picks.</h1>
          <p className="lead">
            Send your order via Telegram or Viber. We will confirm availability and
            delivery details.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="order-panel">
            <div className="order-header">
              <h2>Selected items</h2>
              <span className="order-count">{count} items</span>
            </div>
            {items.length === 0 ? (
              <p className="muted">Your cart is empty. Add sneakers to see them here.</p>
            ) : (
              <ul className="order-list">
                {items.map((item, index) => {
                  const lineTotal = parsePrice(item.price) * (item.quantity || 1);
                  return (
                    <li key={`${item.name}-${item.size}-${index}`}>
                      <div>
                        <p className="order-name">
                          {item.name} ({item.size}) x{item.quantity}
                        </p>
                        <p className="order-price">{formatMMK(lineTotal)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="order-form">
            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <div className="form-row">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="contact">Phone / Social</label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  placeholder="Phone, Telegram, Viber"
                  value={form.contact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <label htmlFor="address">Delivery address</label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  placeholder="Street, township, city"
                  value={form.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="form-row">
                <label htmlFor="note">Order note</label>
                <textarea
                  id="note"
                  name="note"
                  rows="3"
                  placeholder="Sizing, color preferences, or delivery note"
                  value={form.note}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="form-row">
                <label htmlFor="order-details">Order details</label>
                <textarea
                  id="order-details"
                  rows="5"
                  readOnly
                  value={orderLines.join("\n")}
                  placeholder="Your selected items will appear here."
                ></textarea>
              </div>
              <div className="order-actions">
                <button
                  className="btn"
                  type="button"
                  onClick={() => handleSend("telegram")}
                >
                  Send via Telegram
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => handleSend("viber")}
                >
                  Send via Viber
                </button>
              </div>
              {status.type !== "idle" && (
                <p className={`form-status ${status.type}`}>{status.message}</p>
              )}
            </form>

            {shareMessage && (
              <div className="receipt-panel">
                <h2>Message to Send</h2>
                <p className="muted">
                  If the app does not open, copy this message and send it to
                  {CONTACT_PHONE}.
                </p>
                <textarea readOnly value={shareMessage} rows="8" />
              </div>
            )}

            {receipt && (
              <div className="receipt-panel">
                <h2>Receipt</h2>
                <p className="muted">Save or screenshot this receipt for reference.</p>
                <textarea readOnly value={receipt} rows="8" />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

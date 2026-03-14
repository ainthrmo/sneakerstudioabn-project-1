import { useMemo, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import products from "../data/products.json";

const CONTACT_PHONE = "+959670000834";

const FALLBACK_PRODUCT = {
  name: "",
  price: "MMK 0",
  description: "",
  sizes: ["One Size"],
  image: "",
  highlights: [
    "Full-grain leather upper",
    "Memory foam insole",
    "Anti-slip rubber outsole",
  ],
};

const parsePrice = (value) => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9]/g, "");
  return Number(cleaned || 0);
};

const formatMMK = (amount) => {
  return `MMK ${amount.toLocaleString("en-US")}`;
};

export default function Product() {
  const { addItem } = useCart();
  const hasProduct = products.length > 0;
  const featured = hasProduct ? products[0] : FALLBACK_PRODUCT;
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(featured.sizes?.[0] || "One Size");
  const [quantity, setQuantity] = useState(1);
  const imageRef = useRef(null);

  const gallery = featured.gallery?.length
    ? featured.gallery
    : [featured.image].filter(Boolean);

  const totalAmount = useMemo(
    () => parsePrice(featured.price) * quantity,
    [featured.price, quantity]
  );

  const handleStep = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 10) return 10;
      return next;
    });
  };

  const flyToCart = () => {
    const img = imageRef.current;
    const cart = document.querySelector(".floating-cart");
    if (!img || !cart) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();
    const clone = img.cloneNode(true);

    clone.classList.add("fly-image");
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.left = `${imgRect.left}px`;
    clone.style.top = `${imgRect.top}px`;

    document.body.appendChild(clone);

    const translateX =
      cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
    const translateY =
      cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);

    requestAnimationFrame(() => {
      clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.2)`;
      clone.style.opacity = "0";
    });

    clone.addEventListener(
      "transitionend",
      () => {
        clone.remove();
      },
      { once: true }
    );
  };

  const handleAdd = () => {
    if (!hasProduct) return;
    addItem({
      name: featured.name,
      price: featured.price,
      size,
      quantity,
    });
    flyToCart();
    setQuantity(1);
  };

  if (!hasProduct) {
    return (
      <main id="main" className="product-page">
        <section className="section">
          <div className="container">
            <h1>No product found</h1>
            <p className="lead">Add products in products.json to display here.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main" className="product-page">
      <section className="product-hero container">
        <div className="product-gallery">
          <div className="gallery-main">
            <span className="badge">Low Stock</span>
            <img
              ref={imageRef}
              src={gallery[activeImage]}
              alt={featured.name}
            />
          </div>
          {gallery.length > 1 && (
            <div className="gallery-thumbs">
              {gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={`thumb${activeImage === index ? " active" : ""}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={src} alt={`${featured.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-panel">
          <p className="eyebrow">Premium Drop</p>
          <h1>{featured.name}</h1>
          <p className="product-sub">{featured.description}</p>
          <div className="price-row">
            <span className="price-tag">{featured.price}</span>
            <span className="total-tag">Total {formatMMK(totalAmount)}</span>
          </div>

          <div className="trust-row">
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span>100% Authentic</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span>2-Day Delivery</span>
            </div>
          </div>

          <div className="size-tiles">
            <p className="label">Select Size</p>
            <div className="tiles">
              {(featured.sizes || ["One Size"]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`size-tile${size === option ? " selected" : ""}`}
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="qty-row">
            <p className="label">Quantity</p>
            <div className="stepper">
              <button type="button" onClick={() => handleStep(-1)}>
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => handleStep(1)}>
                +
              </button>
            </div>
          </div>

          <button className="btn cta" type="button" onClick={handleAdd}>
            Add to Cart
          </button>

          <div className="highlights">
            <p className="label">Highlights</p>
            <div className="highlight-list">
              {(featured.highlights || FALLBACK_PRODUCT.highlights).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Built for Myanmar streets</h2>
            <p className="lead">
              Breathable lining, soft cushioning, and neutral tones made for daily
              wear across Yangon and beyond.
            </p>
          </div>
          <div className="tile">
            <p className="tile-title">Care Guide</p>
            <p className="tile-sub">Wipe clean with dry cloth</p>
            <div className="divider"></div>
            <p className="tile-copy">Store in a cool, dry place away from sun.</p>
          </div>
        </div>
      </section>

      <aside className="support-card" aria-label="Order support">
        <p>Need help? Chat with us</p>
        <div className="support-actions">
          <a
            className="support-btn telegram"
            href={"https://t.me/+959670000834"}
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
          <a
            className="support-btn viber"
            href={`viber://chat?number=${encodeURIComponent(CONTACT_PHONE)}`}
          >
            Viber
          </a>
        </div>
        <span className="support-note">{CONTACT_PHONE}</span>
      </aside>
    </main>
  );
}


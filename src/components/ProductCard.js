import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes?.[0] || "One Size");
  const [quantity, setQuantity] = useState(1);
  const imageRef = useRef(null);

  const sizeOptions = useMemo(
    () => product.sizes || ["One Size"],
    [product.sizes]
  );

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
    addItem({
      name: product.name,
      price: product.price,
      size,
      quantity,
      image: product.image || "",
    });
    flyToCart();
    setQuantity(1);
  };

  const handleStep = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 10) return 10;
      return next;
    });
  };

  return (
    <article className="product">
      <div className={`product-media ${product.tone === "dark" ? "alt" : ""}`}>
        {product.image ? (
          <img
            ref={imageRef}
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <span>{product.tag}</span>
        )}
        <Link className="product-quick" to="/product">
          Quick View
        </Link>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-controls">
          <label className="control">
            <span>Size</span>
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              {sizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div className="control">
            <span>Qty</span>
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
        </div>
        <div className="product-meta">
          <p className="product-price">{product.price}</p>
          <button className="btn small add-btn" type="button" onClick={handleAdd}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

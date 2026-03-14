import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes?.[0] || "One Size");
  const [quantity, setQuantity] = useState(1);

  const sizeOptions = useMemo(
    () => product.sizes || ["One Size"],
    [product.sizes]
  );

  const handleAdd = () => {
    addItem({
      name: product.name,
      price: product.price,
      size,
      quantity,
    });
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
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <span>{product.tag}</span>
        )}
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
          <p className="price">{product.price}</p>
          <button className="btn small" type="button" onClick={handleAdd}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

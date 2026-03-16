import ProductCard from "../components/ProductCard";
import products from "../data/products.json";
import { Link } from "react-router-dom";

export default function Accessories() {
  const accessories = products.filter((item) => item.category === "accessories");

  return (
    <main id="main" className="page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Accessories</p>
          <h1>Finish every pair with purpose.</h1>
          <p className="lead">
            Socks, laces, care kits, and everyday add-ons that keep your rotation
            looking clean.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {accessories.length === 0 ? (
            <div className="tile">
              <p className="tile-title">No accessories yet</p>
              <p className="tile-copy">Add items in products.json with category accessories.</p>
              <Link className="btn ghost" to="/contact">
                Request an item
              </Link>
            </div>
          ) : (
            <div className="grid-3">
              {accessories.map((product) => (
                <ProductCard key={`${product.name}-${product.price}`} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

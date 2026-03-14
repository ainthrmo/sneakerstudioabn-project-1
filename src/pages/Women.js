import ProductCard from "../components/ProductCard";
import products from "../data/products.json";

export default function Women() {
  const womenProducts = products.filter(
    (item) => item.category === "women" || item.category === "unisex"
  );

  return (
    <main id="main" className="page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Women Collection</p>
          <h1>Minimal palettes. Maximum comfort.</h1>
          <p className="lead">
            Refined, lightweight, and versatile sneakers made to move.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-3">
          {womenProducts.map((product) => (
            <ProductCard key={`${product.name}-${product.price}`} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

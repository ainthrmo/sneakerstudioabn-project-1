import ProductCard from "../components/ProductCard";
import products from "../data/products.json";

export default function Men() {
  const menProducts = products.filter(
    (item) => item.category === "men" || item.category === "unisex"
  );

  return (
    <main id="main" className="page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Men Collection</p>
          <h1>Precision silhouettes for every day.</h1>
          <p className="lead">
            Minimal sneakers built for comfort, balance, and a clean profile.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-3">
          {menProducts.map((product) => (
            <ProductCard key={`${product.name}-${product.price}`} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

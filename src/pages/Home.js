import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";

const CATEGORY_LABELS = {
  men: "Men",
  women: "Women",
  unisex: "Unisex",
};

export default function Home() {
  const categories = ["men", "women", "unisex"];

  return (
    <main id="main">
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Minimalist / Black + White</p>
            <h1>Less noise. More sneakers.</h1>
            <p className="lead">
              Original ရဲ့ ဈေးနှုန်းတစ်စိတ်တစ်ပိုင်းလေးနဲ့ Original အတိုင်း ခံစားမှုကို ရယူလိုက်ပါ။ စက်ရုံကနေ သင့်အိမ်အရောက် အကောင်းဆုံး Copy များကိုသာ ကျွန်ုပ်တို့ ရွေးချယ်ပေးထားပါတယ်။"
            </p>
            <div className="cta-row">
              <Link className="btn" to="/men">
                Shop Men
              </Link>
              <Link className="btn ghost" to="/women">
                Shop Women
              </Link>
            </div>
            <div className="stats">
              <div>
                <p className="stat-num">120+</p>
                <p className="stat-label">Core styles</p>
              </div>
              <div>
                <p className="stat-num">24h</p>
                <p className="stat-label">Dispatch</p>
              </div>
              <div>
                <p className="stat-num">5.0</p>
                <p className="stat-label">Studio rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>All Products</h2>
            <Link className="text-link" to="/product">
              View featured product
            </Link>
          </div>
        </div>
        {categories.map((category) => {
          const list = products.filter((item) => item.category === category);
          return (
            <div className="container" key={category}>
              <div className="category-head">
                <h3>{CATEGORY_LABELS[category]}</h3>
                <span className="muted">{list.length} items</span>
              </div>
              <div className="grid-3">
                {list.map((product) => (
                  <ProductCard
                    key={`${product.name}-${product.category}`}
                    product={product}
                  />
                ))}
              </div>
              <p className="scroll-hint">Swipe to see more →</p>
            </div>
          );
        })}
      </section>

    </main>
  );
}

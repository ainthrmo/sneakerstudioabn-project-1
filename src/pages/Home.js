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
          <div className="hero-card">
            <div className="hero-shoe">
              <div className="shoe-line"></div>
              <p>Studio 01</p>
              <span>Monochrome Runner</span>
            </div>
            <div className="hero-info">
              <p className="price">MMK 335,000</p>
              <button className="btn small" type="button">
                Add to cart
              </button>
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
            </div>
          );
        })}
      </section>

      <section className="section alt">
        <div className="container split">
          <div>
            <h2>Designed to move</h2>
            <p>
              The SneakerStudio curation focuses on comfort-first construction and
              balanced proportions. No loud branding, no excess. Just the sneaker.
            </p>
            <ul className="list">
              <li>Premium knit uppers and soft leather mixes</li>
              <li>Neutral palettes that match every wardrobe</li>
              <li>Limited drops announced weekly</li>
            </ul>
          </div>
          <div className="tile">
            <p className="tile-title">Weekly Drop</p>
            <p className="tile-sub">Friday 9:00 AM</p>
            <div className="divider"></div>
            <p className="tile-copy">Stay ready for minimal releases in limited stock.</p>
            <Link className="btn ghost" to="/product">
              Get notified
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="newsletter">
            <div>
              <h2>Join the studio list</h2>
              <p>Early access to drops, restock alerts, and minimalist style edits.</p>
            </div>
            <form className="newsletter-form">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" placeholder="your@email.com" />
              <button className="btn" type="button">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";

const CATEGORY_LABELS = {
  men: "Men",
  women: "Women",
  unisex: "Unisex",
};

const CATEGORIES = ["men", "women", "unisex"];
const BRANDS = [
  { label: "All", value: "all" },
  { label: "Nike", value: "nike" },
  { label: "Jordan", value: "jordan" },
  { label: "Adidas", value: "adidas" },
  { label: "New Balance", value: "new balance" },
];

export default function Home() {
  const categories = CATEGORIES;
  const brands = BRANDS;
  const [activeBrand, setActiveBrand] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const slides = useMemo(
    () =>
      products.slice(0, 5).map((item) => ({
        name: item.name,
        price: item.price,
        tag: item.tag || "Featured",
        image: item.image,
      })),
    []
  );
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const brandMatches = useCallback(
    (product) => {
      if (activeBrand === "all") return true;
      return product.name.toLowerCase().includes(activeBrand);
    },
    [activeBrand]
  );
  const searchMatches = useCallback(
    (product) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.trim().toLowerCase();
      return (
        product.name.toLowerCase().includes(term) ||
        (product.description || "").toLowerCase().includes(term)
      );
    },
    [searchTerm]
  );

  const filteredByCategory = useMemo(
    () =>
      categories.map((category) => ({
        category,
        list: products.filter(
          (item) =>
            item.category === category &&
            brandMatches(item) &&
            searchMatches(item)
        ),
      })),
    [categories, brandMatches, searchMatches]
  );

  const totalMatches = filteredByCategory.reduce(
    (sum, group) => sum + group.list.length,
    0
  );

  const suggestions = useMemo(() => {
    const seedSource = `${activeBrand}:${searchTerm}`.trim();
    let seed = 0;
    for (let i = 0; i < seedSource.length; i += 1) {
      seed = (seed * 31 + seedSource.charCodeAt(i)) % 2147483647;
    }
    const pool = [...products];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      seed = (seed * 48271) % 2147483647;
      const j = seed % (i + 1);
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 4);
  }, [activeBrand, searchTerm]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <main id="main">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
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
          <div className="hero-slider" aria-label="Featured products">
            <div className="hero-slider-top">
              <span className="hero-pill">Featured drop</span>
              <div className="hero-controls">
                <button type="button" onClick={handlePrev} aria-label="Previous slide">
                  ‹
                </button>
                <button type="button" onClick={handleNext} aria-label="Next slide">
                  ›
                </button>
              </div>
            </div>
            <div
              className="hero-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <article className="hero-slide" key={slide.name}>
                  <div className="hero-media">
                    {slide.image && (
                      <img src={slide.image} alt={slide.name} loading="lazy" />
                    )}
                  </div>
                  <div className="hero-slide-body">
                    <p className="hero-tag">{slide.tag}</p>
                    <h3>{slide.name}</h3>
                    <p className="hero-price">{slide.price}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="hero-dots" role="tablist" aria-label="Slide selector">
              {slides.map((slide, index) => (
                <button
                  key={slide.name}
                  type="button"
                  className={index === activeSlide ? "active" : undefined}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-pressed={index === activeSlide}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
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
          <div className="product-toolbar">
            <div className="search-wrap">
              <input
                className="search-input"
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search products"
              />
            </div>
            <div className="filter-row" role="tablist" aria-label="Filter by brand">
              {brands.map((brand) => (
                <button
                  key={brand.value}
                  type="button"
                  className={`filter-pill${activeBrand === brand.value ? " active" : ""}`}
                  aria-pressed={activeBrand === brand.value}
                  onClick={() => setActiveBrand(brand.value)}
                >
                  {brand.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {totalMatches === 0 ? (
          <div className="container no-results">
            <div className="no-results-card">
              <p className="no-results-title">Oops! No sneakers found.</p>
              <p className="no-results-sub">
                Try a different search or pick a new brand.
              </p>
            </div>
            <div className="no-results-suggest">
              <h3>You might also like</h3>
              <div className="grid-3">
                {suggestions.map((product) => (
                  <ProductCard
                    key={`${product.name}-${product.category}-suggest`}
                    product={product}
                  />
                ))}
              </div>
              <p className="scroll-hint">Swipe to see more -></p>
            </div>
          </div>
        ) : (
          filteredByCategory.map(({ category, list }) => {
            if (!list.length) return null;
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
                <p className="scroll-hint">Swipe to see more -></p>
              </div>
            );
          })
        )}
      </section>

    </main>
  );
}

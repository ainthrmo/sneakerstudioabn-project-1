import BrandCard from "../components/BrandCard";
import { brands } from "../data/catalog";
import { Link } from "react-router-dom";

export default function Brands() {
  return (
    <main id="main" className="page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Brands</p>
          <h1>Minimal partners, maximum quality.</h1>
          <p className="lead">
            We work with studios that share the same design language: clean and
            intentional.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          {brands.map((brand) => (
            <BrandCard key={brand.name} brand={brand} />
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="container split">
          <div>
            <h2>Studio Capsule Series</h2>
            <p>
              Quarterly capsule drops from our design partners. Each capsule
              includes a monochrome pair and a limited edition with subtle
              detailing.
            </p>
          </div>
          <div className="tile">
            <p className="tile-title">Next Capsule</p>
            <p className="tile-sub">April 18</p>
            <div className="divider"></div>
            <p className="tile-copy">Sign up for early access and private previews.</p>
            <Link className="btn ghost" to="/contact">
              Notify me
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main id="main" className="page not-found">
      <section className="section">
        <div className="container">
          <p className="eyebrow">404</p>
          <h1>Page not found.</h1>
          <p className="lead">The page you are looking for does not exist.</p>
          <Link className="btn" to="/">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

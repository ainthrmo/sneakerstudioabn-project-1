import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  isActive ? "active" : undefined;

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="logo" to="/" onClick={handleClose}>
          SneakerStudio
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={handleToggle}
        >
          Menu
        </button>
        <nav
          id="site-nav"
          className={`nav-links${open ? " open" : ""}`}
          aria-label="Primary"
        >
          <NavLink className={navLinkClass} to="/" onClick={handleClose}>
            Home
          </NavLink>
          <NavLink className={navLinkClass} to="/men" onClick={handleClose}>
            Men
          </NavLink>
          <NavLink className={navLinkClass} to="/women" onClick={handleClose}>
            Women
          </NavLink>
          <NavLink className={navLinkClass} to="/accessories" onClick={handleClose}>
            Accessories
          </NavLink>
          <NavLink className={navLinkClass} to="/product" onClick={handleClose}>
            Product
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

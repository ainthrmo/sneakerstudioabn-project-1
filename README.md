# SneakerStudio

Premium, mobile-optimized sneaker shop UI built with React. The project focuses on minimalist styling, MMK pricing, and a streamlined order flow for Myanmar users.

## Highlights
- Product grid with fixed-width cards and horizontal scroll on mobile.
- Premium product detail page with gallery, size tiles, low-stock badge, and fly-to-cart animation.
- Floating cart menu for Telegram/Viber ordering.
- Support card with official brand colors for quick chat.
- CSV → JSON pipeline for fast product data entry.

## Project Structure
- `src/pages/Home.js`: Home page showing all products grouped by category (Men/Women/Unisex).
- `src/pages/Men.js`, `src/pages/Women.js`: Category pages (Unisex items appear in both).
- `src/pages/Product.js`: Featured product page (uses first item in `src/data/products.json`).
- `src/components/ProductCard.js`: Reusable product card with size + quantity.
- `src/components/FloatingCart.js`: Floating cart with Telegram/Viber actions.
- `src/data/products.json`: Product data consumed by UI (auto-generated).
- `data/products.csv`: Source data you edit manually.
- `scripts/csv-to-products.js`: CSV converter that generates `src/data/products.json`.

## Data Workflow (Manual)
1. Edit `data/products.csv` (add or update rows).
2. Run:
   ```bash
   node scripts/csv-to-products.js
   ```
3. The UI reads `src/data/products.json`.

## Run Locally
```bash
npm install
npm start
```

## Notes
- Put product images in `public/images/`.
- Telegram/Viber contact number is configured in:
  - `src/components/FloatingCart.js`
  - `src/pages/Product.js`
  - `src/components/Footer.js`


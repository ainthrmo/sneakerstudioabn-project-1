const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const inputPath = path.join(root, "data", "products.csv");
const outputPath = path.join(root, "src", "data", "products.json");

const parseCSV = (text) => {
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if (char === "\n" && !inQuotes) {
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    row.push(current);
    rows.push(row);
  }

  return rows;
};

const toNumber = (value) => {
  const cleaned = String(value || "").replace(/[^0-9]/g, "");
  return Number(cleaned || 0);
};

const formatMMK = (amount) => `MMK ${amount.toLocaleString("en-US")}`;

const csvText = fs.readFileSync(inputPath, "utf8");
const rows = parseCSV(csvText);
const [header, ...dataRows] = rows;

const columns = header.map((col) => col.trim());

const products = dataRows
  .filter((row) => row.some((cell) => String(cell || "").trim() !== ""))
  .map((row) => {
    const record = {};
    columns.forEach((col, index) => {
      record[col] = row[index] ? row[index].trim() : "";
    });

    const sizes = record.sizes
      ? record.sizes.split("|").map((size) => size.trim())
      : [];

    return {
      name: record.name,
      tag: record.tag,
      description: record.description,
      price: formatMMK(toNumber(record.price)),
      image: record.image,
      sizes,
      tone: record.tone || "light",
      category: (record.category || "").toLowerCase(),
    };
  });

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

console.log(`Wrote ${products.length} products to ${outputPath}`);

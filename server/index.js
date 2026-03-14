const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, "data", "orders.json");

app.use(cors());
app.use(express.json());

async function readOrders() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

async function writeOrders(orders) {
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf8");
}

app.get("/orders", async (req, res) => {
  const orders = await readOrders();
  res.json(orders);
});

app.post("/orders", async (req, res) => {
  const { customer, items, count, note } = req.body || {};

  if (!customer || !customer.name || !customer.contact || !customer.address) {
    return res.status(400).json({ error: "Missing customer details." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items in order." });
  }

  const orders = await readOrders();
  const order = {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer,
    items,
    count: count || items.length,
    note: note || "",
    status: "new",
  };

  orders.unshift(order);
  await writeOrders(orders);

  res.status(201).json({ message: "Order saved", order });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

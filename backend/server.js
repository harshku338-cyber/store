const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// The database is a single file called store.db
const db = new Database("store.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    image TEXT
  )
`);

// Add starting products only the first time
const count = db.prepare("SELECT COUNT(*) AS c FROM products").get().c;
if (count === 0) {
  const insert = db.prepare(
    "INSERT INTO products (name, price, stock, image) VALUES (?, ?, ?, ?)"
  );
  insert.run("Rice 1kg", 60, 20, "/images/rice.jpg");
  insert.run("Sugar 1kg", 45, 0, "/images/sugar.jpg");
  insert.run("Wheat Flour 5kg", 220, 12, "/images/flour.jpg");
  insert.run("Tea 250g", 110, 8, "/images/tea.jpg");
  insert.run("Salt 1kg", 25, 30, "/images/salt.jpg");
  insert.run("Cooking Oil 1L", 150, 5, "/images/oil.jpg");
}

// Get all products
app.get("/api/products", (req, res) => {
  res.json(db.prepare("SELECT * FROM products").all());
});

// Add a product
app.post("/api/products", (req, res) => {
  const { name, price, stock, image } = req.body;
  const info = db
    .prepare("INSERT INTO products (name, price, stock, image) VALUES (?, ?, ?, ?)")
    .run(name, price, stock, image);
  const product = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(info.lastInsertRowid);
  res.status(201).json(product);
});

// Edit a product
app.put("/api/products/:id", (req, res) => {
  const { name, price, stock, image } = req.body;
  db.prepare(
    "UPDATE products SET name = ?, price = ?, stock = ?, image = ? WHERE id = ?"
  ).run(name, price, stock, image, req.params.id);
  res.json(db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id));
});

// Delete a product
app.delete("/api/products/:id", (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// Confirm an order: reduce stock (all or nothing)
app.post("/api/orders", (req, res) => {
  const { items } = req.body;
  const getStock = db.prepare("SELECT stock FROM products WHERE id = ?");
  const reduce = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

  const placeOrder = db.transaction((items) => {
    for (const item of items) {
      const row = getStock.get(item.id);
      if (!row || row.stock < item.qty) {
        throw new Error("Not enough stock for one of the items");
      }
      reduce.run(item.qty, item.id);
    }
  });

  try {
    placeOrder(items);
    res.json(db.prepare("SELECT * FROM products").all());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
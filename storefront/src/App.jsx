import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Bill from "./components/Bill";
import StockManager from "./components/StockManager";

const API = "http://localhost:5000/api";

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ---------- Load products from the backend ----------
  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() =>
        setError("Cannot connect to the server. Start it with: node server.js")
      );
  }, []);

  // ---------- Cart ----------
  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.qty >= product.stock) return;
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  }

  function increaseQty(id) {
    const product = products.find((p) => p.id === id);
    setCart(
      cart.map((item) =>
        item.id === id && item.qty < product.stock
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  }

  function decreaseQty(id) {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function removeItem(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  // ---------- Order (reduces stock on the server) ----------
  async function confirmOrder() {
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({ id: item.id, qty: item.qty })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error);
        return;
      }

      setProducts(await res.json());
      setCart([]);
      setShowBill(false);
      setShowCart(false);
    } catch {
      alert("Cannot connect to the server.");
    }
  }

  // ---------- Stock management (saved in the database) ----------
  async function addProduct(data) {
    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const saved = await res.json();
    setProducts([...products, saved]);
  }

  async function updateProduct(id, data) {
    const res = await fetch(`${API}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const saved = await res.json();
    setProducts(products.map((p) => (p.id === id ? saved : p)));
    setCart(cart.map((item) => (item.id === id ? { ...item, ...saved, qty: item.qty } : item)));
  }

  async function deleteProduct(id) {
    await fetch(`${API}/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
    setCart(cart.filter((item) => item.id !== id));
  }

  // ---------- Search ----------
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar
        cartCount={cartCount}
        onSearch={setSearchTerm}
        onCartClick={() => setShowCart(true)}
        page={page}
        onPageChange={() => setPage(page === "shop" ? "stock" : "shop")}
      />

      {error && <p style={{ color: "#ef4444", padding: 20 }}>{error}</p>}

      {page === "shop" ? (
        <div className="product-grid">
          {!error && filteredProducts.length === 0 && <p>No products found.</p>}

          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              price={p.price}
              stock={p.stock}
              image={p.image}
              onAdd={() => addToCart(p)}
            />
          ))}
        </div>
      ) : (
        <StockManager
          products={products}
          onAdd={addProduct}
          onUpdate={updateProduct}
          onDelete={deleteProduct}
        />
      )}

      {showCart && (
        <Cart
          items={cart}
          onClose={() => setShowCart(false)}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onRemove={removeItem}
          onCheckout={() => setShowBill(true)}
        />
      )}

      {showBill && (
        <Bill
          items={cart}
          onClose={() => setShowBill(false)}
          onConfirm={confirmOrder}
        />
      )}
    </div>
  );
}

export default App;
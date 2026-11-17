import { useState } from "react";
import Navbar from "./components/navbar";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import "./App.css"

const products = [
  { id: 1, name: "Rice 1kg", price: 60, stock: 20, image: "/images/rice.jpg" },
  { id: 2, name: "Sugar 1kg", price: 45, stock: 0, image: "/images/sugar.jpg" },
  { id: 3, name: "Wheat Flour 5kg", price: 220, stock: 12, image: "/images/flour.jpg" },
  { id: 4, name: "Tea 250g", price: 110, stock: 8, image: "/images/tea.jpg" },
  { id: 5, name: "Salt 1kg", price: 25, stock: 30, image: "/images/salt.jpg" },
  { id: 6, name: "Cooking Oil 1L", price: 150, stock: 5, image: "/images/oil.jpg" },
];

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.qty >= product.stock) return; // do not pass stock
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar
        cartCount={cartCount}
        onSearch={setSearchTerm}
        onCartClick={() => setShowCart(true)}
      />

      <div className="product-grid">
        {filteredProducts.length === 0 && <p>No products found.</p>}

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

      {showCart && (
        <Cart
          items={cart}
          onClose={() => setShowCart(false)}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onRemove={removeItem}
        />
      )}
    </div>
  );
}

export default App;
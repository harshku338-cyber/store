import { useState } from "react";
import StockManager from "./components/StockManager";
import Navbar from "./components/navbar";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import "./App.css"

const initialProducts = [
  { id: 1, name: "Rice 1kg", price: 60, stock: 20, image: "/images/rice.jpg" },
  { id: 2, name: "Sugar 1kg", price: 45, stock: 0, image: "/images/sugar.jpg" },
  { id: 3, name: "Wheat Flour 5kg", price: 220, stock: 12, image: "/images/flour.jpg" },
  { id: 4, name: "Tea 250g", price: 110, stock: 8, image: "/images/tea.jpg" },
  { id: 5, name: "Salt 1kg", price: 25, stock: 30, image: "/images/salt.jpg" },
  { id: 6, name: "Cooking Oil 1L", price: 150, stock: 5, image: "/images/oil.jpg" },
];

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

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

  function confirmOrder() {
    // reduce stock for every item that was bought
    setProducts(
      products.map((p) => {
       const bought = cart.find((item) => item.id === p.id);
       return bought ? { ...p, stock: p.stock - bought.qty } : p;
     })
    );

    setCart([]);
    setShowBill(false);
    setShowCart(false);
  }

  // ---------- Stock management ----------
  function addProduct(data) {
    setProducts([...products, { ...data, id: Date.now() }]);
  }

  function updateProduct(id, data) {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...data } : p)));
    // keep cart in sync with the new price/name
    setCart(cart.map((item) => (item.id === id ? { ...item, ...data } : item)));
  }

  function deleteProduct(id) {
    setProducts(products.filter((p) => p.id !== id));
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
        page={page}
        onPageChange={() => setPage(page === "shop" ? "stock" : "shop")}
      />

      {page === "shop" ? (
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
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

const products = [
  { id: 1, name: "Rice 1kg", price: 60, stock: 20 },
  { id: 2, name: "Sugar 1kg", price: 45, stock: 0 },
  { id: 3, name: "Wheat Flour 5kg", price: 220, stock: 12 },
  { id: 4, name: "Tea 250g", price: 110, stock: 8 },
  { id: 5, name: "Salt 1kg", price: 25, stock: 30 },
  { id: 6, name: "Cooking Oil 1L", price: 150, stock: 5 },
];

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar cartCount={cartCount} onSearch={setSearchTerm} />

      <div className="product-grid">
        {filteredProducts.length === 0 && <p>No products found.</p>}

        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            name={p.name}
            price={p.price}
            stock={p.stock}
            onAdd={() => setCartCount(cartCount + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
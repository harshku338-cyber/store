import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <Navbar cartCount={cartCount} onSearch={setSearchTerm} />

      <div style={{ padding: 20 }}>
        <p>You searched for: {searchTerm}</p>
        <button onClick={() => setCartCount(cartCount + 1)}>
          Test: add to cart
        </button>
      </div>
    </div>
  );
}

export default App;
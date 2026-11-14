import { useState } from "react";

function ProductCard({name,price,onAdd}){
  return(
    <div>
      <h3>{name}</h3>
      <p>₹{price}</p>
      <button onClick={onAdd}>Add to cart</button>
    </div>
  );
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  const products = [
    {id: 1, name: "self", price:600},
    {id: 2, name: "table", price:1600}
  ]
  return (
    <div>
      <h1>My Store</h1>
      <p>Cart items: {cartCount}</p>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          name={p.name}
          price={p.price}
          onAdd={() => setCartCount(cartCount+1)}
          />
      ))}
    </div>
  );
}

export default App;
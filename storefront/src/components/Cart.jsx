import "./Cart.css";

function Cart({ items, onClose, onIncrease, onDecrease, onRemove }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {items.length === 0 && <p>Your cart is empty.</p>}

      {items.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} />

          <div className="cart-info">
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>

            <div className="qty">
              <button onClick={() => onDecrease(item.id)}>−</button>
              <span>{item.qty}</span>
              <button onClick={() => onIncrease(item.id)}>+</button>
            </div>
          </div>

          <button className="remove" onClick={() => onRemove(item.id)}>
            🗑️
          </button>
        </div>
      ))}

      <div className="cart-total">
        <span>Total</span>
        <strong>₹{total}</strong>
      </div>
    </div>
  );
}

export default Cart;
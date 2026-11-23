import "./Bill.css";

function Bill({ items, onClose, onConfirm }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const today = new Date().toLocaleString("en-IN");

  return (
    <div className="bill-overlay">
      <div className="bill">
        <h2>PM & Sons</h2>
        <p className="bill-date">{today}</p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{item.price}</td>
                <td>₹{item.price * item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="bill-total">Total: ₹{total}</h3>

        <div className="bill-actions no-print">
          <button onClick={() => window.print()}>🖨️ Print</button>
          <button onClick={onConfirm}>✅ Confirm & clear cart</button>
          <button onClick={onClose}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default Bill;
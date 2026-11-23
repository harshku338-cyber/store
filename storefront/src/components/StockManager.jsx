import { useState } from "react";
import "./StockManager.css";

const emptyForm = { name: "", price: "", stock: "", image: "" };

function StockManager({ products, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || form.price === "" || form.stock === "") return;

    const data = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image || "/images/placeholder.jpg",
    };

    if (editingId) {
      onUpdate(editingId, data);
    } else {
      onAdd(data);
    }
    cancelEdit();
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div className="stock-page">
      <h2>{editingId ? "Edit product" : "Add product"}</h2>

      <form className="stock-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input name="image" placeholder="Image path, e.g. /images/rice.jpg" value={form.image} onChange={handleChange} />

        <button type="submit">{editingId ? "Save changes" : "Add product"}</button>
        {editingId && (
          <button type="button" onClick={cancelEdit}>Cancel</button>
        )}
      </form>

      <h2>All products ({products.length})</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><img src={p.image} alt={p.name} /></td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td className={p.stock === 0 ? "low" : ""}>{p.stock}</td>
                <td>
                  <button onClick={() => startEdit(p)}>✏️ Edit</button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${p.name}?`)) onDelete(p.id);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockManager;
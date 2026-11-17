import "./ProductCard.css";

function ProductCard({ name, price, stock, image, onAdd }) {
  return (
    <div className="product-card">
      <img
        src={image}
        alt={name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/200x150?text=No+Image";
        }}
      />

      <h3>{name}</h3>
      <p className="price">₹{price}</p>

      {stock > 0 ? (
        <button onClick={onAdd}>Add to cart</button>
      ) : (
        <p className="out">Out of stock</p>
      )}
    </div>
  );
}

export default ProductCard;
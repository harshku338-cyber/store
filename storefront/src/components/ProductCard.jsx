import "./ProductCard.css";

function ProductCard({ name, price, stock, onAdd}) {
    return(
        <div className="product-card">
            <h3>{name}</h3>
            <p className="price">₹{price}</p>

            {stock > 0 ? (<button onClick={onAdd}>Add to Cart</button>):(<p className="out">Out of stock</p>)}
        </div>
    );
}

export default ProductCard;
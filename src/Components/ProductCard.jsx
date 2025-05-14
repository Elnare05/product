import React from 'react';
import '../css/ProductCard.css'
const ProductCard = ({ product, favorites, toggleFavorite, setSelectedProduct, addToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.title} />
        <button
          className={`favorite-button ${favorites.includes(product.id) ? 'active' : ''}`}
          onClick={() => toggleFavorite(product.id)}
          aria-label={favorites.includes(product.id) ? "Remove from favorites" : "Add to favorites"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={favorites.includes(product.id) ? "crimson" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h2 className="product-title">{product.title}</h2>
        <p className="product-meta"><strong>Brand:</strong> {product.brand}</p>
        <p className="product-meta"><strong>Origin:</strong> {product.origin}</p>
        <p className="product-description">
          {product.description.slice(0, 10)}
          <button className="see-more" onClick={() => setSelectedProduct(product)}>...</button>
        </p>
        <div className="product-footer">
          <span className="product-price">{product.price} ₺</span>
          <button
            className="add-to-cart"
            onClick={() => addToCart(product)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cart-icon">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
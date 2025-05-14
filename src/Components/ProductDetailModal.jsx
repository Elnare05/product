import React, { useEffect, useState } from 'react';
import '../css/ProductDetailModal.css';

const ProductDetailModal = ({
  selectedProduct,
  setSelectedProduct,
  favorites,
  toggleFavorite,
  addToCart,
  buttonPosition
}) => {
  const [modalStyle, setModalStyle] = useState({});

  useEffect(() => {
    if (selectedProduct && buttonPosition) {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const modalHeight = 500;
      const modalWidth = 500;
      let top = buttonPosition.y;
      let left = buttonPosition.x;
      if (top + modalHeight > viewportHeight) {
        top = Math.max(20, buttonPosition.y - modalHeight);
      } if (left + modalWidth > viewportWidth) {
        left = Math.max(20, viewportWidth - modalWidth - 20);
      }

      setModalStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translate(-50%, 0)'
      });
    }
  }, [selectedProduct, buttonPosition]);

  if (!selectedProduct) return null;

  return (
    <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={modalStyle}
      >
        <h2>{selectedProduct.title}</h2>
        <img
          src={selectedProduct.image}
          alt={selectedProduct.title}
          style={{ width: '100%', maxHeight: '250px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/api/placeholder/300/300";
          }}
        />
        <p><strong>Brand:</strong> {selectedProduct.brand}</p>
        <p><strong>Origin:</strong> {selectedProduct.origin}</p>
        <p><strong>Description:</strong> {selectedProduct.description}</p>
        <p><strong>Price:</strong> {selectedProduct.price} ₺</p>
        <div className="modal-actions">
          <button
            className="add-to-cart modal-add"
            onClick={() => {
              addToCart(selectedProduct);
              setSelectedProduct(null);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cart-icon">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add to Cart
          </button>
          <button
            className={`favorite-button-modal ${favorites.includes(selectedProduct.id) ? 'active' : ''}`}
            onClick={() => toggleFavorite(selectedProduct.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={favorites.includes(selectedProduct.id) ? "crimson" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {favorites.includes(selectedProduct.id) ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <button className="modal-close" onClick={() => setSelectedProduct(null)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
import React from 'react';
import '../css/FavoritesComponent.css'
const FavoritesComponent = ({ 
  showFavorites, 
  setShowFavorites, 
  favoriteProducts, 
  toggleFavorite, 
  addToCart 
}) => {
  if (!showFavorites) return null;

  return (
    <div className="favorites-panel">
      <div className="favorites-header">
        <h2>Your Favorites</h2>
        <button className="close-favorites" onClick={() => setShowFavorites(false)}>×</button>
      </div>

      {favoriteProducts.length === 0 ? (
        <p className="empty-favorites">You haven't added any favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favoriteProducts.map(product => (
            <div key={product.id} className="favorite-card">
              <div className="favorite-image">
                <img src={product.image} alt={product.title} />
                <button
                  className="favorite-remove"
                  onClick={() => toggleFavorite(product.id)}
                  aria-label="Remove from favorites"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="crimson" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
              <div className="favorite-info">
                <h3>{product.title}</h3>
                <p className="favorite-price">{product.price} ₺</p>
                <button
                  className="add-to-cart-favorite"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesComponent;
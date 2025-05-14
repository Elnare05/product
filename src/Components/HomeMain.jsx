import React, { useState, useEffect } from 'react';
import '../css/HomeMain.css';
import CartComponent from './CartComponent';
import FavoritesComponent from './FavoritesComponent';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

const HomeMain = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
             const response = await fetch(
          `https://world.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=honeys&json=true&page=1&page_size=20`
        );

        if (!response.ok) throw new Error("Ürünler yüklenirken bir hata oluştu.");

        const data = await response.json();

        const honeyProducts = data.products.map(product => ({
          id: product._id || Math.random().toString(36).substr(2, 9),
          title: product.product_name || product.generic_name || "Honey Product",
          price: (Math.random() * 100 + 50).toFixed(2),
          description: product.ingredients_text || "Pure natural honey product.",
          category: "Honey",
          image: product.image_url || product.image_front_url || "/api/placeholder/300/300",
          origin: product.origins || "Turkey",
          brand: product.brands || "Local Producer"
        }));

        setProducts(honeyProducts);
        setFilteredProducts(honeyProducts);
        setLoading(false); 
      } catch (err) {
        setError(err.message);
        setLoading(false); 
      }
    };

    fetchProducts();
    const savedCart = localStorage.getItem('honeyCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedFavorites = localStorage.getItem('honeyFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    localStorage.setItem('honeyCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('honeyFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    const confirmation = document.createElement('div');
    confirmation.className = 'add-confirmation';
    confirmation.textContent = `${product.title} added to cart!`;
    document.body.appendChild(confirmation);

    setTimeout(() => {
      document.body.removeChild(confirmation);
    }, 2000);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  const getFavoriteProducts = () => {
    return products.filter(product => favorites.includes(product.id));
  };
  if (loading) {
    return <div className="loader">Loading...</div>;
  }
  if (error) {
    return <div className="error">Something went wrong: {error} <button onClick={() => window.location.reload()}>Reload</button></div>;
  }

  const gridClass = filteredProducts.length === 1 ? "product-grid single-product" : "product-grid";

  return (
    <div className="home-container">
      <div className='container2'>
        <h1 className='product'>Our Products</h1>
        <div className="search-cart-container">
          <input
            className='search'
            placeholder='Search'
            value={searchTerm.trimStart()}
            onChange={handleSearchChange}
          />
          <button
            className="favorites-button"
            onClick={() => setShowFavorites(!showFavorites)}
            aria-label="Favorites"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="crimson" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className="favorites-count">{favorites.length}</span>
          </button>
          <button
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
            aria-label="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-count">{getTotalItems()}</span>
          </button>
        </div>
      </div>

      <FavoritesComponent 
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        favoriteProducts={getFavoriteProducts()}
        toggleFavorite={toggleFavorite}
        addToCart={addToCart}
      />
      <CartComponent 
        cart={cart}
        showCart={showCart}
        setShowCart={setShowCart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        getTotalPrice={getTotalPrice}
      />

      <div className={gridClass}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              setSelectedProduct={setSelectedProduct}
              addToCart={addToCart}
            />
          ))
        ) : (
          <div className="no-products">No products found matching your search.</div>
        )}
      </div>

      <ProductDetailModal
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        addToCart={addToCart}
      />
    </div>
  );
};

export default HomeMain;
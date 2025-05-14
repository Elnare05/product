import React, { useState, useEffect, useCallback } from 'react';
import '../css/CartComponent.css';

const CartComponent = ({
  cart,
  showCart,
  setShowCart,
  removeFromCart,
  updateQuantity,
  getTotalPrice,
  clearCart
}) => {

  const [addressInfo, setAddressInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [addressErrors, setAddressErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutPageOpen, setCheckoutPageOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);


  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartActionInProgress, setCartActionInProgress] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [cachedTotal, setCachedTotal] = useState(0);

  useEffect(() => {
    if (Array.isArray(cart)) {
      try {
        const total = getTotalPrice ? getTotalPrice() : calculateTotalPrice(cart);
        setCachedTotal(total);
      } catch (error) {
        console.error("Error calculating total price:", error);

      }
    }
  }, [cart, getTotalPrice]);

  const calculateTotalPrice = (cartItems) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return "0.00";
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleClearCart = useCallback(async () => {
    setCartActionInProgress(true);
    setApiError(null);

    try {
      if (typeof clearCart === 'function') {
        await Promise.resolve(clearCart());
      } else if (Array.isArray(cart) && cart.length > 0 && typeof removeFromCart === 'function') {

        console.warn('clearCart function not provided, using alternative method');

        await Promise.all(cart.map(item => Promise.resolve(removeFromCart(item.id))));
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      setApiError("Failed to clear your cart. Please try again.");
    } finally {
      setCartActionInProgress(false);
    }
  }, [cart, clearCart, removeFromCart]);

  const handleQuantityChange = useCallback(async (itemId, newQuantity) => {
    if (cartActionInProgress) return;

    const originalCart = [...cart];
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex === -1) return;

    if (newQuantity < 1) return;

    setCartActionInProgress(true);
    setApiError(null);

    try {

      const updatedCart = [...cart];
      updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity: newQuantity };

      await Promise.resolve(updateQuantity(itemId, newQuantity));
    } catch (error) {
      console.error("Error updating quantity:", error);
      setApiError("Failed to update quantity. Please try again.");
    } finally {
      setCartActionInProgress(false);
    }
  }, [cart, updateQuantity, cartActionInProgress]);

  const handleRemoveItem = useCallback(async (itemId) => {
    if (cartActionInProgress) return;

    setCartActionInProgress(true);
    setApiError(null);

    try {
      await Promise.resolve(removeFromCart(itemId));
    } catch (error) {
      console.error("Error removing item:", error);
      setApiError("Failed to remove item. Please try again.");
    } finally {
      setCartActionInProgress(false);
    }
  }, [removeFromCart, cartActionInProgress]);

  const validateAddressForm = useCallback(() => {
    const errors = {};

    if (!addressInfo.firstName.trim()) errors.firstName = "First name is required";
    if (!addressInfo.lastName.trim()) errors.lastName = "Last name is required";
    if (!addressInfo.address.trim()) errors.address = "Address is required";
    if (!addressInfo.city.trim()) errors.city = "City is required";
    if (!addressInfo.postalCode.trim()) errors.postalCode = "Postal code is required";
    if (!addressInfo.phone.trim()) errors.phone = "Phone number is required";

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  }, [addressInfo]);

  const validatePaymentForm = useCallback(() => {
    const errors = {};

    if (!paymentInfo.cardName.trim()) errors.cardName = "Name on card is required";
    if (!paymentInfo.cardNumber.trim()) errors.cardNumber = "Card number is required";
    if (paymentInfo.cardNumber.trim().length < 16) errors.cardNumber = "Invalid card number";
    if (!paymentInfo.expiryDate.trim()) errors.expiryDate = "Expiry date is required";
    if (!paymentInfo.cvv.trim()) errors.cvv = "CVV is required";
    if (paymentInfo.cvv.trim().length < 3) errors.cvv = "Invalid CVV";

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  }, [paymentInfo]);

  // Form event handlers
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (validateAddressForm()) {
      setCheckoutStep(2);
    }
  };

  const handleContinueToReview = (e) => {
    e.preventDefault();
    if (validatePaymentForm()) {
      setCheckoutStep(3);
    }
  };


  const resetCheckout = useCallback(() => {

    handleClearCart();

    setPaymentSuccess(false);
    setCheckoutPageOpen(false);
    setCheckoutStep(1);
    setShowCart(false);

    setAddressInfo({
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: ''
    });
    setPaymentInfo({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    });
  }, [handleClearCart, setShowCart]);

  const handlePlaceOrder = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    try {

      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setPaymentSuccess(true);

      await handleClearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      setIsSubmitting(false);
      setApiError("Failed to process your payment. Please try again.");
    }
  }, [handleClearCart]);

  if (checkoutPageOpen) {
    return (
      <div className="trendyol-checkout-page">
        <div className="checkout-container">

          <div className="checkout-header">
            <div className="logo-container">
              <h2>SHOP</h2>
            </div>
            <div className="checkout-steps">
              <div className={`step ${checkoutStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-name">Address</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${checkoutStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-name">Payment</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${checkoutStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-name">Review</div>
              </div>
            </div>
            <button
              className="close-checkout"
              onClick={() => {
                setCheckoutPageOpen(false);
                setCheckoutStep(1);
              }}
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>


          {apiError && (
            <div className="api-error-message">
              <p>{apiError}</p>
              <button onClick={() => setApiError(null)}>Dismiss</button>
            </div>
          )}

          {!paymentSuccess ? (
            <div className="checkout-content">

              <div className="checkout-main">
                {checkoutStep === 1 && (
                  <div className="checkout-address">
                    <h3>Shipping Address</h3>
                    <form className="address-form" onSubmit={handleContinueToPayment}>
                      <div className="form-row">
                        <div className="form-group half">
                          <label>First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={addressInfo.firstName}
                            onChange={handleAddressChange}
                            placeholder="First Name"
                            className={addressErrors.firstName ? "input-error" : ""}
                          />
                          {addressErrors.firstName && <div className="error-message">{addressErrors.firstName}</div>}
                        </div>
                        <div className="form-group half">
                          <label>Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={addressInfo.lastName}
                            onChange={handleAddressChange}
                            placeholder="Last Name"
                            className={addressErrors.lastName ? "input-error" : ""}
                          />
                          {addressErrors.lastName && <div className="error-message">{addressErrors.lastName}</div>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          name="address"
                          value={addressInfo.address}
                          onChange={handleAddressChange}
                          placeholder="Street address"
                          className={addressErrors.address ? "input-error" : ""}
                        />
                        {addressErrors.address && <div className="error-message">{addressErrors.address}</div>}
                      </div>
                      <div className="form-row">
                        <div className="form-group half">
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            value={addressInfo.city}
                            onChange={handleAddressChange}
                            placeholder="City"
                            className={addressErrors.city ? "input-error" : ""}
                          />
                          {addressErrors.city && <div className="error-message">{addressErrors.city}</div>}
                        </div>
                        <div className="form-group half">
                          <label>Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={addressInfo.postalCode}
                            onChange={handleAddressChange}
                            placeholder="Postal Code"
                            className={addressErrors.postalCode ? "input-error" : ""}
                          />
                          {addressErrors.postalCode && <div className="error-message">{addressErrors.postalCode}</div>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={addressInfo.phone}
                          onChange={handleAddressChange}
                          placeholder="Phone Number"
                          className={addressErrors.phone ? "input-error" : ""}
                        />
                        {addressErrors.phone && <div className="error-message">{addressErrors.phone}</div>}
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="continue-button" disabled={isSubmitting}>
                          Continue to Payment
                        </button>
                        <button
                          type="button"
                          className="back-to-shop"
                          onClick={() => {
                            setCheckoutPageOpen(false);
                          }}
                          disabled={isSubmitting}
                        >
                          Back to Shopping
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="checkout-payment">
                    <h3>Payment Method</h3>
                    <div className="payment-methods">
                      <div className="payment-method active">
                        <div className="payment-method-radio">
                          <input type="radio" id="creditCard" name="paymentMethod" checked readOnly />
                          <label htmlFor="creditCard">Credit Card</label>
                        </div>
                        <div className="payment-cards">
                          <span className="card-icon visa"></span>
                          <span className="card-icon mastercard"></span>
                          <span className="card-icon amex"></span>
                        </div>
                      </div>

                      <div className="payment-form-container">
                        <form className="payment-form" onSubmit={handleContinueToReview}>
                          <div className="form-group">
                            <label htmlFor="cardName">Name on Card</label>
                            <input
                              type="text"
                              id="cardName"
                              name="cardName"
                              value={paymentInfo.cardName}
                              onChange={handlePaymentChange}
                              placeholder="John Doe"
                              className={paymentErrors.cardName ? "input-error" : ""}
                            />
                            {paymentErrors.cardName && <div className="error-message">{paymentErrors.cardName}</div>}
                          </div>

                          <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={paymentInfo.cardNumber}
                              onChange={handlePaymentChange}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                              className={paymentErrors.cardNumber ? "input-error" : ""}
                            />
                            {paymentErrors.cardNumber && <div className="error-message">{paymentErrors.cardNumber}</div>}
                          </div>

                          <div className="form-row">
                            <div className="form-group half">
                              <label htmlFor="expiryDate">Expiry Date</label>
                              <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={paymentInfo.expiryDate}
                                onChange={handlePaymentChange}
                                placeholder="MM/YY"
                                maxLength="5"
                                className={paymentErrors.expiryDate ? "input-error" : ""}
                              />
                              {paymentErrors.expiryDate && <div className="error-message">{paymentErrors.expiryDate}</div>}
                            </div>

                            <div className="form-group half">
                              <label htmlFor="cvv">CVV</label>
                              <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={paymentInfo.cvv}
                                onChange={handlePaymentChange}
                                placeholder="123"
                                maxLength="3"
                                className={paymentErrors.cvv ? "input-error" : ""}
                              />
                              {paymentErrors.cvv && <div className="error-message">{paymentErrors.cvv}</div>}
                            </div>
                          </div>
                          <div className="payment-actions">
                            <button
                              type="button"
                              className="back-button"
                              onClick={() => setCheckoutStep(1)}
                              disabled={isSubmitting}
                            >
                              Back
                            </button>
                            <button type="submit" className="continue-button" disabled={isSubmitting}>
                              Review Order
                            </button>
                            <button
                              type="button"
                              className="back-to-shop"
                              onClick={() => {
                                setCheckoutPageOpen(false);
                              }}
                              disabled={isSubmitting}
                            >
                              Back to Shopping
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="checkout-review">
                    <h3>Review Your Order</h3>
                    <div className="review-address">
                      <h4>Shipping To:</h4>
                      <p>
                        {`${addressInfo.firstName} ${addressInfo.lastName}`}<br />
                        {addressInfo.address}<br />
                        {`${addressInfo.city}, ${addressInfo.postalCode}`}<br />
                        Phone: {addressInfo.phone}
                      </p>
                    </div>
                    <div className="review-payment">
                      <h4>Payment Method:</h4>
                      <p>Credit Card ending in {paymentInfo.cardNumber.slice(-4) || '****'}</p>
                    </div>
                    <div className="review-items">
                      <h4>Order Items:</h4>
                      {Array.isArray(cart) && cart.length > 0 ? (
                        cart.map(item => (
                          <div key={item.id} className="review-item">
                            <img src={item.image} alt={item.title} />
                            <div className="review-item-details">
                              <h5>{item.title}</h5>
                              <p>Quantity: {item.quantity}</p>
                              <p>Price: {item.price} ₺</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No items in cart</p>
                      )}
                    </div>
                    <div className="payment-actions">
                      <button
                        className="back-button"
                        onClick={() => setCheckoutStep(2)}
                        disabled={isSubmitting}
                      >
                        Back
                      </button>
                      <button
                        className="place-order-button"
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting || !Array.isArray(cart) || cart.length === 0}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner"></span>
                            Processing...
                          </>
                        ) : (
                          'Place Order'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="checkout-sidebar">
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-items">
                    {Array.isArray(cart) && cart.length > 0 ? (
                      cart.map(item => (
                        <div key={item.id} className="summary-item">
                          <span className="summary-item-name">{item.title} x{item.quantity}</span>
                          <span className="summary-item-price">{(item.price * item.quantity).toFixed(2)} ₺</span>
                        </div>
                      ))
                    ) : (
                      <p>No items in cart</p>
                    )}
                  </div>
                  <div className="summary-subtotal">
                    <span>Subtotal</span>
                    <span>{cachedTotal} ₺</span>
                  </div>
                  <div className="summary-shipping">
                    <span>Shipping</span>
                    <span>{Array.isArray(cart) && cart.length > 0 ? '14.99 ₺' : '0.00 ₺'}</span>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <span>
                      {Array.isArray(cart) && cart.length > 0
                        ? (parseFloat(cachedTotal) + 14.99).toFixed(2)
                        : '0.00'} ₺
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="payment-success">
              <div className="success-icon">✓</div>
              <h2>Order Placed Successfully!</h2>
              <p>Thank you for your purchase. Your order has been received.</p>
              <p className="order-number">Order #: TY{Math.floor(Math.random() * 1000000)}</p>
              <div className="success-actions">
                <button
                  className="continue-shopping"
                  onClick={resetCheckout}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!showCart) return null;

  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h2>Your Shopping Cart</h2>
        <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
      </div>

      {apiError && (
        <div className="api-error-message">
          <p>{apiError}</p>
          <button onClick={() => setApiError(null)}>Dismiss</button>
        </div>
      )}

      {isCartLoading && (
        <div className="cart-loading">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      )}
      {!isCartLoading && (!Array.isArray(cart) || cart.length === 0) && (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button
            className="continue-shopping"
            onClick={() => setShowCart(false)}
          >
            Continue Shopping
          </button>
        </div>
      )}

      {!isCartLoading && Array.isArray(cart) && cart.length > 0 && (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>{item.price} ₺ × {item.quantity}</p>
                </div>
                <div className="cart-item-actions">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || cartActionInProgress}
                    className={cartActionInProgress ? "disabled" : ""}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={cartActionInProgress}
                    className={cartActionInProgress ? "disabled" : ""}
                  >
                    +
                  </button>
                  <button
                    className="remove-item"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={cartActionInProgress}
                  >
                    {cartActionInProgress ? "..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>{cachedTotal} ₺</span>
            </div>

            <button
              className="checkout-button"
              onClick={() => {
                setCheckoutPageOpen(true);
                setShowCart(false);
              }}
              disabled={cartActionInProgress}
            >
              {cartActionInProgress ? "Please wait..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartComponent;
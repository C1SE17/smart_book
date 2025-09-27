import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../../../hooks';
import { cartService } from '../../../services';

const Cart = ({ onBackToHome, onNavigateTo }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useLocalStorage('user', null);

  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setCartItems([]);
        return;
      }

      const data = await cartService.getItems(token);
      setCartItems(data.cart || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      await cartService.removeItem(cartItemId, token);
      // Refresh cart items
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }, [fetchCartItems]);

  const updateQuantity = useCallback(async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await cartService.updateItem(cartItemId, newQuantity, token);
      // Refresh cart items
      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }, [removeFromCart, fetchCartItems]);

  const calculateTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.total_price);
    }, 0);
  }, [cartItems]);

  const handleCheckout = useCallback(() => {
    // TODO: Implement checkout functionality
    alert('Checkout functionality will be implemented soon!');
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f5f5f5', transition: 'all 0.3s ease' }}>
      <div className="container py-4">
        <div style={{ minHeight: '600px', transition: 'all 0.3s ease' }}>
          {/* Back Home Navigation */}
          <div className="mb-3">
            <button
              className="btn btn-link text-dark p-0 no-hover"
              onClick={onBackToHome}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: 'none'
              }}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Home/
              <span className="fw-bold" style={{ fontSize: '16px' }}> Shopping Cart</span>
            </button>
          </div>

          {/* Cart Content */}
          <div className="row">
            <div className="col-12">
              {!user ? (
                <div className="text-center py-5">
                  <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">Please login to view your cart</h5>
                  <p className="text-muted">You need to be logged in to access your shopping cart.</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-cart display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">Your cart is empty</h5>
                  <p className="text-muted">Add some books to get started!</p>
                  <button
                    className="btn btn-primary"
                    onClick={onBackToHome}
                  >
                    Browse Books
                  </button>
                </div>
              ) : (
                <div className="row g-4">
                  {/* Cart Items */}
                  <div className="col-lg-8">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        {cartItems.map((item) => (
                          <div key={item.cart_item_id} className="row align-items-center py-3 border-bottom">
                            <div className="col-md-2">
                              <img
                                src={item.image_url || '/images/book1.jpg'}
                                alt={item.title}
                                className="img-fluid rounded"
                                style={{ maxHeight: '100px', objectFit: 'cover' }}
                              />
                            </div>
                            <div className="col-md-4">
                              <h6 className="mb-1">{item.book_title}</h6>
                              <p className="text-muted small mb-0">Price: ${item.price}</p>
                              <p className="text-muted small mb-0">Total: ${item.total_price}</p>
                            </div>
                            <div className="col-md-2">
                              <div className="input-group input-group-sm">
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  className="form-control text-center"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.cart_item_id, parseInt(e.target.value))}
                                  min="1"
                                />
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="col-md-2">
                              <span className="fw-bold">${item.total_price}</span>
                            </div>
                            <div className="col-md-2">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeFromCart(item.cart_item_id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="col-lg-4">
                    <div className="card shadow-sm">
                      <div className="card-header">
                        <h5 className="mb-0">Order Summary</h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Subtotal ({cartItems.length} items):</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Shipping:</span>
                          <span>Free</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-3">
                          <strong>Total:</strong>
                          <strong>${calculateTotal().toFixed(2)}</strong>
                        </div>
                        <button
                          className="btn btn-primary w-100"
                          onClick={handleCheckout}
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

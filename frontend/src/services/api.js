/**
 * Main API Service - Import và export tất cả các API services
 * Đây là file chính để import các API services đã được tách riêng
 */

// Import tất cả các API services
import bookApi from './bookApi.js';
import categoryApi from './categoryApi.js';
import authorApi from './authorApi.js';
import publisherApi from './publisherApi.js';
import userApi from './userApi.js';
import authApi from './authApi.js';
import reviewApi from './reviewApi.js';
import orderApi from './orderApi.js';
import cartApi from './cartApi.js';
import warehouseApi from './warehouseApi.js';
import BaseApiService from './baseApi.js';

// Tạo một instance của BaseApiService để có các method chung
const baseApi = new BaseApiService();

// Tạo object chứa tất cả các API services
const apiService = {
  // Base API methods
  healthCheck: baseApi.healthCheck.bind(baseApi),
  
  // Book APIs
  books: bookApi,
  // Tương thích ngược - expose trực tiếp các method của bookApi
  getBooks: bookApi.getBooks.bind(bookApi),
  getBookById: bookApi.getBookById.bind(bookApi),
  createBook: bookApi.createBook.bind(bookApi),
  updateBook: bookApi.updateBook.bind(bookApi),
  deleteBook: bookApi.deleteBook.bind(bookApi),
  searchBooks: bookApi.searchBooks.bind(bookApi),
  
  // Category APIs
  categories: categoryApi,
  getCategories: categoryApi.getCategories.bind(categoryApi),
  getCategoryById: categoryApi.getCategoryById.bind(categoryApi),
  createCategory: categoryApi.createCategory.bind(categoryApi),
  updateCategory: categoryApi.updateCategory.bind(categoryApi),
  deleteCategory: categoryApi.deleteCategory.bind(categoryApi),
  
  // Author APIs
  authors: authorApi,
  getAuthors: authorApi.getAuthors.bind(authorApi),
  getAuthorById: authorApi.getAuthorById.bind(authorApi),
  createAuthor: authorApi.createAuthor.bind(authorApi),
  updateAuthor: authorApi.updateAuthor.bind(authorApi),
  deleteAuthor: authorApi.deleteAuthor.bind(authorApi),
  
  // Publisher APIs
  publishers: publisherApi,
  getPublishers: publisherApi.getPublishers.bind(publisherApi),
  getPublisherById: publisherApi.getPublisherById.bind(publisherApi),
  createPublisher: publisherApi.createPublisher.bind(publisherApi),
  updatePublisher: publisherApi.updatePublisher.bind(publisherApi),
  deletePublisher: publisherApi.deletePublisher.bind(publisherApi),
  
  // User APIs
  users: userApi,
  getUsers: userApi.getUsers.bind(userApi),
  getAllUsers: userApi.getAllUsers.bind(userApi),
  getUserById: userApi.getUserById.bind(userApi),
  createUser: userApi.createUser.bind(userApi),
  updateUser: userApi.updateUser.bind(userApi),
  deleteUser: userApi.deleteUser.bind(userApi),
  
  // Auth APIs
  auth: authApi,
  login: authApi.login.bind(authApi),
  register: authApi.register.bind(authApi),
  logout: authApi.logout.bind(authApi),
  refreshToken: authApi.refreshToken.bind(authApi),
  
  // Review APIs
  reviews: reviewApi,
  getReviews: reviewApi.getReviews.bind(reviewApi),
  getReviewById: reviewApi.getReviewById.bind(reviewApi),
  createReview: reviewApi.createReview.bind(reviewApi),
  updateReview: reviewApi.updateReview.bind(reviewApi),
  deleteReview: reviewApi.deleteReview.bind(reviewApi),
  getAverageRating: reviewApi.getAverageRating.bind(reviewApi),
  getAllReviews: reviewApi.getAllReviews.bind(reviewApi),
  
  // Order APIs
  orders: orderApi,
  getOrders: orderApi.getOrders.bind(orderApi),
  getOrderById: orderApi.getOrderById.bind(orderApi),
  createOrder: orderApi.createOrder.bind(orderApi),
  purchase: orderApi.purchase.bind(orderApi),
  updateOrder: orderApi.updateOrder.bind(orderApi),
  deleteOrder: orderApi.deleteOrder.bind(orderApi),
  getPendingOrders: orderApi.getPendingOrders.bind(orderApi),
  getMyOrders: orderApi.getMyOrders.bind(orderApi),
  getMyOrderById: orderApi.getMyOrderById.bind(orderApi),
  saveMyOrder: orderApi.saveMyOrder.bind(orderApi),
  getTotalRevenue: orderApi.getTotalRevenue.bind(orderApi),
  getRevenueStats: orderApi.getRevenueStats.bind(orderApi),
  getAllOrders: orderApi.getAllOrders.bind(orderApi),
  updateOrderStatus: orderApi.updateOrderStatus.bind(orderApi),
  getOrderConfirmation: orderApi.getOrderConfirmation.bind(orderApi),
  getAdminOrderDetails: orderApi.getAdminOrderDetails.bind(orderApi),
  confirmOrder: orderApi.confirmOrder.bind(orderApi),
  
  // Cart APIs
  cart: cartApi,
  getCart: cartApi.getCart.bind(cartApi),
  addToCart: cartApi.addToCart.bind(cartApi),
  updateCartItem: cartApi.updateCartItem.bind(cartApi),
  removeFromCart: cartApi.removeFromCart.bind(cartApi),
  clearCart: cartApi.clearCart.bind(cartApi),
  
  // Warehouse APIs
  warehouse: warehouseApi,
  getWarehouseItems: warehouseApi.getWarehouseItems.bind(warehouseApi),
  getWarehouseItemByBookId: warehouseApi.getWarehouseItemByBookId.bind(warehouseApi),
  createWarehouseItem: warehouseApi.createWarehouseItem.bind(warehouseApi),
  updateWarehouseItem: warehouseApi.updateWarehouseItem.bind(warehouseApi),
  deleteWarehouseItem: warehouseApi.deleteWarehouseItem.bind(warehouseApi),
};

// Export default để tương thích với code cũ
export default apiService;

// Export named exports để có thể import riêng lẻ
export {
  bookApi,
  categoryApi,
  authorApi,
  publisherApi,
  userApi,
  authApi,
  reviewApi,
  orderApi,
  cartApi,
  warehouseApi,
  baseApi
};
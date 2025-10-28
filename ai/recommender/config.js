module.exports = {
  MONGO_URI: 'mongodb://localhost:27017/customer_tracking?replicaSet=rs0',
  // score weights
  VIEW_WEIGHT: 1,
  DWELL_WEIGHT_PER_SEC: 0.02,
  ADD_TO_CART_WEIGHT: 3,
  UPDATE_WEIGHT: 0.5,
  REMOVE_WEIGHT: -1,
  // Trọng số khi có đơn hàng (nếu backend có ghi log sang MongoDB "ordertracks")
  ORDER_WEIGHT: 10,
  // debounce ms to aggregate bursts
  DEBOUNCE_MS: 1200,
  // how many products to keep as candidates
  MAX_CANDIDATES: 100,
  // final top-N to write into recommendations
  TOP_N: 25
};



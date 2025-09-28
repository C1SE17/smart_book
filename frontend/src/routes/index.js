// Routes configuration
export const routes = {
  home: "/",
  books: "/books",
  categories: "/categories",
  profile: "/profile",
  profileOrders: "/profile/orders",
  profileSettings: "/profile/settings",
  profileSecurity: "/profile/security",
  orderDetail: "/order",
  cart: "/cart",
  login: "/login",
  register: "/register",
  search: "/search",
  product: "/product",
  notification: "/notification",
};

// Route handlers
export const handleRoute = (
  pathname,
  setCurrentPage,
  setProductId,
  setSearchQuery,
  setProfileTab
) => {
  const path = pathname.toLowerCase();

  if (path === "/" || path === "/home") {
    setCurrentPage("home");
  } else if (path === "/books") {
    console.log("Setting currentPage to books");
    setCurrentPage("books");
  } else if (path === "/categories") {
    setCurrentPage("categories");
  } else if (path === "/profile" || path === "/profile/") {
    setCurrentPage("profile");
    if (setProfileTab) setProfileTab("profile");
  } else if (path === "/profile/orders") {
    setCurrentPage("profile");
    if (setProfileTab) setProfileTab("orders");
  } else if (path === "/profile/settings") {
    setCurrentPage("profile");
    if (setProfileTab) setProfileTab("settings");
  } else if (path === "/profile/security") {
    setCurrentPage("profile");
    if (setProfileTab) setProfileTab("security");
  } else if (path === "/cart") {
    setCurrentPage("cart");
  } else if (path === "/login") {
    setCurrentPage("auth");
  } else if (path === "/register") {
    setCurrentPage("register");
  } else if (path.startsWith("/search")) {
    setCurrentPage("search");
    // Extract search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q") || "";
    setSearchQuery(query);
  } else if (path.startsWith("/product")) {
    setCurrentPage("product");
    // Extract product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setProductId(parseInt(id));
    }
  } else if (path === "/notification") {
    setCurrentPage("notification");
  } else if (path.startsWith("/order/")) {
    setCurrentPage("order-detail");
    // Extract order ID from URL
    const orderId = path.split("/order/")[1];
    if (orderId) {
      setProductId(parseInt(orderId)); // Reuse productId for orderId
    }
  } else {
    // Default to home for unknown routes
    setCurrentPage("home");
  }
};

// Navigation helper
export const navigateTo = (path, searchParams = {}) => {
  const url = new URL(path, window.location.origin);
  Object.keys(searchParams).forEach((key) => {
    if (searchParams[key]) {
      url.searchParams.set(key, searchParams[key]);
    }
  });
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

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
  blog: "/blog",
  blogDetail: "/blog-detail",
  contact: "/contact",
  about: "/about",
  author: "/author",
  "author-detail": "/author-detail",
  "admin-dashboard": "/admin/dashboard",
  "admin-books": "/admin/books",
  "admin-categories": "/admin/categories",
  "admin-warehouse": "/admin/warehouse",
  "admin-orders": "/admin/orders",
  "admin-users": "/admin/users",
  "admin-reviews": "/admin/reviews",
  "admin-reports": "/admin/reports",
};

// Route handlers
export const handleRoute = (
  pathname,
  setCurrentPage,
  setProductId,
  setSearchQuery,
  setProfileTab,
  setBlogId,
  setAuthorId
) => {
  const path = pathname.toLowerCase();

  if (path === "/" || path === "/home") {
    setCurrentPage("home");
  } else if (path === "/books") {
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
  } else if (path === "/blog") {
    setCurrentPage("blog");
  } else if (path.startsWith("/blog-detail")) {
    setCurrentPage("blog-detail");
    // Extract blog ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setBlogId(parseInt(id));
    }
  } else if (path.startsWith("/order/")) {
    setCurrentPage("order-detail");
    // Extract order ID from URL
    const orderId = path.split("/order/")[1];
    if (orderId) {
      setProductId(parseInt(orderId)); // Reuse productId for orderId
    }
  } else if (path === "/checkout") {
    setCurrentPage("checkout");
  } else if (path === "/orders") {
    setCurrentPage("orders");
  } else if (path === "/contact") {
    setCurrentPage("contact");
  } else if (path === "/about") {
    setCurrentPage("about");
  } else if (path === "/author") {
    setCurrentPage("author");
  } else if (path.startsWith("/author-detail")) {
    setCurrentPage("author-detail");
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setAuthorId(parseInt(id));
    }
  } else if (path.startsWith("/admin")) {
    // Admin routes
    if (path === "/admin/dashboard") {
      setCurrentPage("admin-dashboard");
    } else if (path === "/admin/books") {
      setCurrentPage("admin-books");
    } else if (path === "/admin/categories") {
      setCurrentPage("admin-categories");
    } else if (path === "/admin/warehouse") {
      setCurrentPage("admin-warehouse");
    } else if (path === "/admin/orders") {
      setCurrentPage("admin-orders");
    } else if (path === "/admin/users") {
      setCurrentPage("admin-users");
    } else if (path === "/admin/reviews") {
      setCurrentPage("admin-reviews");
    } else if (path === "/admin/reports") {
      setCurrentPage("admin-reports");
    } else {
      // Default admin route
      setCurrentPage("admin-dashboard");
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

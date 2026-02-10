function getPrice() {
  return Number(localStorage.getItem("price") || 75);
}

function saveOrder(order) {
  let orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

function getAllOrders() {
  return JSON.parse(localStorage.getItem("orders") || "[]");
}

function updateOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

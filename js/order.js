const price = getPrice();
const qtyInput = document.getElementById("qty");
const total = document.getElementById("total");

total.innerText = price;

qtyInput.addEventListener("input", () => {
  total.innerText = qtyInput.value * price;
});

function confirmOrder() {
  saveOrder({
    email: localStorage.getItem("user"),
    qty: qtyInput.value,
    total: qtyInput.value * price,
    status: "Pending",
    seen: false,
    time: new Date().toISOString()
  });
  alert("Order placed");
  window.location.href = "orders.html";
}

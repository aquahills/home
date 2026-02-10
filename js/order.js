let price = 75;

(async () => {
  const settings = await api("getSettings");
  price = Number(settings?.price || 75);
  document.getElementById("total").innerText = price;
})();

document.getElementById("qty").addEventListener("input", e => {
  document.getElementById("total").innerText = e.target.value * price;
});

async function confirmOrder() {
  const email = localStorage.getItem("user");

  const res = await api("createOrder", {
    email,
    bottles: document.getElementById("qty").value,
    total: document.getElementById("total").innerText
  });

  if (res.error === "ADDRESS_REQUIRED") {
    window.location.href = "address.html";
    return;
  }

  alert("Order placed successfully");
  window.location.href = "orders.html";
}

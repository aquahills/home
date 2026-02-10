const price = getPrice();
document.getElementById("total").innerText = price;

document.getElementById("qty").addEventListener("input", e => {
  document.getElementById("total").innerText = e.target.value * price;
});

function confirmOrder() {
  saveOrder({
    email: localStorage.getItem("user"),
    qty: document.getElementById("qty").value,
    status: "Pending"
  });
  alert("Order placed");
}

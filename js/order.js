let price = 75;

document.addEventListener("DOMContentLoaded", () => {

  firebase.auth().onAuthStateChanged(async (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const qtyInput = document.getElementById("qty");
    const totalEl = document.getElementById("total");

    try {
      const settings = await api("getSettings");
      if (!settings.error && settings.price) {
        price = Number(settings.price);
      }
    } catch (e) {
      console.log("Using fallback price 75");
    }

    updateTotal();

    qtyInput.addEventListener("input", updateTotal);

    function updateTotal() {
      const qty = Number(qtyInput.value || 1);
      totalEl.innerText = qty * price;
    }

  });

});

async function confirmOrder() {

  const qty = Number(document.getElementById("qty").value);

  if (!qty || qty <= 0) {
    alert("Invalid quantity");
    return;
  }

  try {

    const res = await api("createOrder", { bottles: qty });

    if (res.error) {
      alert(res.error);
      return;
    }

    alert("Order placed successfully");
    window.location.href = "orders.html";

  } catch (err) {
    console.error(err);
    alert("Order failed. Try again.");
  }
}

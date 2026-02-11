let price = 0;

document.addEventListener("DOMContentLoaded", () => {

  firebase.auth().onAuthStateChanged(async (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {

      // Fetch price ONLY after user is confirmed
      const settings = await api("getSettings");

      if (settings.error) {
        throw new Error(settings.error);
      }

      price = Number(settings.price || 75);

      const qtyInput = document.getElementById("qty");
      const totalEl = document.getElementById("total");

      totalEl.innerText = qtyInput.value * price;

      qtyInput.addEventListener("input", e => {
        totalEl.innerText = e.target.value * price;
      });

    } catch (err) {
      console.error("Price fetch error:", err);
      alert("Unable to fetch price. Please check backend deployment.");
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
    console.error("Order creation failed:", err);
    alert("Order failed. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const email = localStorage.getItem("user");

  if (!email) return;

  try {
    const user = await api("getUser", { email });

    if (user.role === "admin") {
      document.getElementById("adminBtn").style.display = "inline-block";
    }

  } catch (err) {
    console.error(err);
  }
});

/* Order button fix */
function safeOrderNow() {
  const email = localStorage.getItem("user");

  if (!email) {
    window.location.href = "login.html";
    return;
  }

  window.location.href = "order.html";
}

function goOrders() {
  const email = localStorage.getItem("user");

  if (!email) {
    window.location.href = "login.html";
    return;
  }

  window.location.href = "orders.html";
}

function goAdmin() {
  window.location.href = "admin.html";
}

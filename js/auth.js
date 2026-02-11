document.addEventListener("DOMContentLoaded", async () => {
  const email = localStorage.getItem("user");

  // If not logged in, nothing to initialize
  if (!email) return;

  try {
    // Verify user from backend
    const user = await api("getUser", { email });

    // Show admin button if exists on page
    const adminBtn = document.getElementById("adminBtn");
    if (adminBtn && user && user.role === "admin") {
      adminBtn.style.display = "inline-block";
    }

    // Optional: hide login button if already logged in
    const loginBtn = document.getElementById("loginNavBtn");
    if (loginBtn) {
      loginBtn.textContent = "Logout";
      loginBtn.onclick = logout;
    }

  } catch (error) {
    console.error("Auth initialization failed:", error);
  }
});


/* =========================
   Navigation
   ========================= */

function goHome() {
  window.location.href = "index.html";
}

function goOrders() {
  window.location.href = "orders.html";
}

function goAdmin() {
  const email = localStorage.getItem("user");
  if (!email) {
    window.location.href = "login.html";
    return;
  }
  window.location.href = "admin.html";
}

function goLogin() {
  window.location.href = "login.html";
}


/* =========================
   Logout
   ========================= */

function logout() {
  firebase.auth().signOut()
    .then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("name");
      window.location.href = "index.html";
    })
    .catch(error => {
      console.error("Logout failed:", error);
    });
}

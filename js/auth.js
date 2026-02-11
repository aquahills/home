document.addEventListener("DOMContentLoaded", async () => {

  const email = localStorage.getItem("user");
  const loginBtn = document.getElementById("loginNavBtn");

  if (!loginBtn) return;

  if (!email) {
    loginBtn.textContent = "Login";
    loginBtn.onclick = goLogin;
    return;
  }

  loginBtn.textContent = "Logout";
  loginBtn.onclick = logout;
});

function goLogin() {
  window.location.href = "login.html";
}

function goOrders() {
  window.location.href = "orders.html";
}

function logout() {
  firebase.auth().signOut().then(() => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}

let currentPrice = 75;

document.addEventListener("DOMContentLoaded", () => {

  const qtyInput = document.getElementById("qty");
  const totalEl = document.getElementById("total");
  const increaseBtn = document.getElementById("increaseQtyBtn");
  const decreaseBtn = document.getElementById("decreaseQtyBtn");
  const confirmBtn = document.getElementById("confirmOrderBtn");

  firebase.auth().onAuthStateChanged(async (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const settingsDoc = await db.collection("settings").doc("global").get();
    const settings = settingsDoc.data() || {};

    currentPrice = settings.price || 75;

    updateTotal();
  });

  increaseBtn.addEventListener("click", () => changeQty(1));
  decreaseBtn.addEventListener("click", () => changeQty(-1));
  qtyInput.addEventListener("input", updateTotal);
  confirmBtn.addEventListener("click", confirmOrder);

  function changeQty(change) {
    let qty = Number(qtyInput.value || 1);
    qty += change;
    if (qty < 1) qty = 1;
    qtyInput.value = qty;
    updateTotal();
  }

  function updateTotal() {
    const qty = Number(qtyInput.value || 1);
    totalEl.innerText = qty * currentPrice;
  }

});


async function confirmOrder() {

  const user = firebase.auth().currentUser;

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const qty = Number(document.getElementById("qty").value);

  if (!qty || qty <= 0) {
    showMessage("Please enter a valid quantity.");
    return;
  }

  const userDoc = await db.collection("users").doc(user.uid).get();
  const userData = userDoc.data() || {};
  const address = userData.address || {};
  const isGuest = userData.guest === true;

  if (!userData.phone) {
    window.location.href = "address.html?incomplete=true";
    return;
  }

  if (!isGuest && (
      !address.house ||
      !address.city ||
      !address.pincode
  )) {
    window.location.href = "address.html?incomplete=true";
    return;
  }

  const settingsDoc = await db.collection("settings").doc("global").get();
  const settings = settingsDoc.data() || {};

  const price = settings.price || 75;
  const autoAssign = settings.autoAssign;
  const agents = settings.deliveryAgents || [];

  let assignedTo = null;

  if (autoAssign && agents.length > 0) {
    const randomIndex = Math.floor(Math.random() * agents.length);
    assignedTo = agents[randomIndex];
  }

  await db.collection("orders").add({
    customerId: user.uid,
    customerEmail: user.email,
    bottles: qty,
    total: qty * price,
    status: "Pending",
    assignedTo: assignedTo,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.querySelector(".order-card").innerHTML = `
    <h2 style="margin-bottom:15px;">Order Placed Successfully</h2>
    <p style="margin-bottom:20px; opacity:0.8;">
      Your order has been received and is being processed.
    </p>
    <button class="primary-btn" onclick="window.location.href='orders.html'">
      Track Order
    </button>
  `;
}


function showMessage(text) {

  const card = document.querySelector(".order-card");
  const msg = document.createElement("div");

  msg.style.marginTop = "15px";
  msg.style.opacity = "0.9";
  msg.innerText = text;

  card.appendChild(msg);
}

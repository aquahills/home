document.addEventListener("DOMContentLoaded", () => {

  firebase.auth().onAuthStateChanged(async (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const qtyInput = document.getElementById("qty");
    const totalEl = document.getElementById("total");

    const settingsDoc = await db.collection("settings").doc("global").get();
    const price = settingsDoc.data().price || 75;

    updateTotal();
    qtyInput.addEventListener("input", updateTotal);

    function updateTotal() {
      const qty = Number(qtyInput.value || 1);
      totalEl.innerText = qty * price;
    }

  });

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

  // PROFILE VALIDATION (safe)
  if (!userData.phone ||
      !address.house ||
      !address.city ||
      !address.pincode) {

    window.location.href = "address.html?incomplete=true";
    return;
  }

  const settingsRef = db.collection("settings").doc("global");
  const settingsDoc = await settingsRef.get();
  const settings = settingsDoc.data() || {};

  const price = settings.price || 75;
  const autoAssign = settings.autoAssign;
  const agents = settings.deliveryAgents || [];
  let assignedTo = null;

  if (autoAssign && agents.length > 0) {
    const index = settings.lastAssignedIndex || 0;
    assignedTo = agents[index];
    const nextIndex = (index + 1) % agents.length;

    await settingsRef.update({
      lastAssignedIndex: nextIndex
    });
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

  // SUCCESS UI (no alert, no redirect)
  document.querySelector(".card").innerHTML = `
    <h2 style="margin-bottom:15px;">Order Placed Successfully</h2>
    <p style="margin-bottom:20px; opacity:0.8;">
      Your order has been received and is being processed.
    </p>
    <button class="primary-btn" onclick="window.location.href='orders.html'">
      Track Order
    </button>
  `;
}


// Reusable UI message
function showMessage(text) {
  const card = document.querySelector(".card");
  const msg = document.createElement("div");
  msg.style.marginTop = "15px";
  msg.style.opacity = "0.9";
  msg.innerText = text;
  card.appendChild(msg);
}

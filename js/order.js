document.addEventListener("DOMContentLoaded", () => {

  firebase.auth().onAuthStateChanged(async (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const qtyInput = document.getElementById("qty");
    const totalEl = document.getElementById("total");

    // Get price from settings
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
    alert("Invalid quantity");
    return;
  }

  const userDoc = await db.collection("users").doc(user.uid).get();
  const userData = userDoc.data();

  // 🔷 PROFILE VALIDATION
  if (!userData.phone ||
      !userData.address.house ||
      !userData.address.city ||
      !userData.address.pincode) {

    alert("Almost done. Please complete your delivery details so we can process your order.");
    window.location.href = "address.html";
    return;
  }

  // 🔷 GET SETTINGS
  const settingsRef = db.collection("settings").doc("global");
  const settingsDoc = await settingsRef.get();
  const settings = settingsDoc.data();

  const price = settings.price || 75;
  const autoAssign = settings.autoAssign;
  const agents = settings.deliveryAgents || [];
  let assignedTo = null;

  // 🔷 AUTO ASSIGN LOGIC
  if (autoAssign && agents.length > 0) {

    const index = settings.lastAssignedIndex || 0;

    assignedTo = agents[index];

    const nextIndex = (index + 1) % agents.length;

    await settingsRef.update({
      lastAssignedIndex: nextIndex
    });
  }

  // 🔷 CREATE ORDER
  await db.collection("orders").add({
    customerId: user.uid,
    customerEmail: user.email,
    bottles: qty,
    total: qty * price,
    status: "Pending",
    assignedTo: assignedTo,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Order placed successfully.");
  window.location.href = "orders.html";
}

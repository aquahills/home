document.addEventListener("DOMContentLoaded", () => {

  firebase.auth().onAuthStateChanged(async (user) => {

    const content = document.getElementById("contentArea");

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {

      const userDoc = await db.collection("users").doc(user.uid).get();
      const role = userDoc.data()?.role;

      let query;

      if (role === "admin") {
        query = db.collection("orders").orderBy("createdAt", "desc");
      } 
      else if (role === "delivery") {
        query = db.collection("orders")
          .where("assignedTo", "==", user.uid)
          .orderBy("createdAt", "desc");
      } 
      else {
        query = db.collection("orders")
          .where("customerId", "==", user.uid)
          .orderBy("createdAt", "desc");
      }

      const snapshot = await query.get();

      if (snapshot.empty) {
        content.innerHTML = `
          <div class="card orders-card">
            <h2>No Orders Yet</h2>
            <button class="primary-btn" onclick="window.location.href='order.html'">
              Order Now
            </button>
          </div>
        `;
        return;
      }

      if (snapshot.size === 1) {
        const doc = snapshot.docs[0];
        showSingleOrder(doc.id, doc.data());
        return;
      }

      let rows = "";

      snapshot.forEach(doc => {
        const o = doc.data();

        rows += `
          <tr>
            <td><a class="order-link" data-id="${doc.id}">${doc.id}</a></td>
            <td>${o.status}</td>
            <td>${o.bottles}</td>
            <td>₹${o.total}</td>
          </tr>
        `;
      });

      content.innerHTML = `
        <div class="card orders-card">
          <h2>Your Orders</h2>
          <div class="table-wrapper">
            <table>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Bottles</th>
                <th>Total</th>
              </tr>
              ${rows}
            </table>
          </div>
        </div>
      `;

      document.querySelectorAll(".order-link").forEach(link => {
        link.addEventListener("click", () => {
          loadSingleOrder(link.dataset.id);
        });
      });

    } catch (error) {

      content.innerHTML = `
        <div class="card orders-card">
          <h2>Unable to load orders</h2>
        </div>
      `;
    }

  });

});


async function loadSingleOrder(orderId) {

  const doc = await db.collection("orders").doc(orderId).get();
  if (!doc.exists) return;

  showSingleOrder(orderId, doc.data());
}


function showSingleOrder(orderId, data) {

  const content = document.getElementById("contentArea");

  content.innerHTML = `
    <div class="card orders-card">
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Bottles:</strong> ${data.bottles}</p>
      <p><strong>Total:</strong> ₹${data.total}</p>
      <br>
      <button class="primary-btn" id="backBtn">
        Back to Orders
      </button>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => {
    location.reload();
  });
}

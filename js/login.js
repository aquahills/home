document.addEventListener("DOMContentLoaded", () => {

  const googleBtn = document.getElementById("googleLoginBtn");
  const guestBtn = document.getElementById("guestLoginBtn");

  googleBtn.addEventListener("click", () => {
    startGoogleLogin();
  });

  guestBtn.addEventListener("click", startGuestLogin);

});


async function startGuestLogin() {

  try {

    const result = await firebase.auth().signInAnonymously();
    const user = result.user;

    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        name: "",
        phone: "",
        email: "",
        address: {
          house: "",
          street: "",
          city: "",
          pincode: ""
        },
        role: "customer",
        guest: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    window.location.href = "address.html?guest=true";

  } catch (error) {
    console.error("Guest login failed:", error);
    alert("Guest login failed. Please try again.");
  }

}

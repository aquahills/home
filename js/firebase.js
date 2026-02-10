const firebaseConfig = {
  apiKey: "AIzaSyBBs9dJyBGo8Rg8i0B2TktSqfvcyGKZbr4",
  authDomain: "aquahills-3fdcc.firebaseapp.com",
  projectId: "aquahills-3fdcc",
  storageBucket: "aquahills-3fdcc.firebasestorage.app",
  messagingSenderId: "1014475952575",
  appId: "1:1014475952575:web:5a91df107d3a376548510a"
};
// Start Firebase using your project details
firebase.initializeApp(firebaseConfig);

// Get authentication service
const auth = firebase.auth();

// This runs when user clicks "Continue with Google"
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(async (result) => {
      const user = result.user;

      // Remember who is logged in
      localStorage.setItem("user", user.email);

      // Save user to Google Sheet (backend)
      await api("saveUser", {
        email: user.email,
        name: user.displayName || "",
        phone: "",
        role: "customer"
      });

      // Go back to home page
      window.location.href = "../index.html";
    })
    .catch((error) => {
      alert("Login failed. Please try again.");
      console.error(error);
    });
}

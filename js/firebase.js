const firebaseConfig = {
  apiKey: "AIzaSyBBs9dJyBGo8Rg8i0B2TktSqfvcyGKZbr4",
  authDomain: "aquahills-3fdcc.firebaseapp.com",
  projectId: "aquahills-3fdcc",
  appId: "1:1014475952575:web:5a91df107d3a376548510a"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

function startGoogleLogin() {
  localStorage.setItem("loginIntent", "true");
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
}

/**
 * GLOBAL PROMISE: resolves only when Firebase auth is ready
 */
window.waitForAuth = function () {
  return new Promise(resolve => {
    const unsub = auth.onAuthStateChanged(user => {
      if (user) {
        unsub();
        resolve(user);
      }
    });
  });
};

auth.onAuthStateChanged(async user => {
  if (!user) return;

  localStorage.setItem("user", user.email);
  localStorage.setItem("name", user.displayName || "");

  // Redirect ONLY after login.html
  if (
    localStorage.getItem("loginIntent") === "true" &&
    location.pathname.endsWith("login.html")
  ) {
    localStorage.removeItem("loginIntent");
    window.location.replace("index.html");
  }
});

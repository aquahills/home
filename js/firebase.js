const firebaseConfig = {
  apiKey: "AIzaSyBBs9dJyBGo8Rg8i0B2TktSqfvcyGKZbr4",
  authDomain: "aquahills-3fdcc.firebaseapp.com",
  projectId: "aquahills-3fdcc",
  appId: "1:1014475952575:web:5a91df107d3a376548510a"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

firebase.auth().getRedirectResult()
  .then((result) => {
    if (result.user) {
      const email = result.user.email;
      localStorage.setItem("user", email);
      window.location.href = "/";
    }
  })
  .catch((error) => {
    console.error(error);
    alert("Login failed. Please try again.");
  });


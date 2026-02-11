const API_URL =
  "https://script.google.com/macros/s/AKfycbyUQSVzwLJcwvg_0gg-K5X3eYiIyCdKRjuN-qL47rWaxYRtkM0x4Ujs49gUGvHOetIsLA/exec";

async function waitForAuth() {
  return new Promise((resolve) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

async function api(action, payload = {}) {

  // Wait for Firebase to fully restore session
  const user = await waitForAuth();

  const token = user ? await user.getIdToken() : null;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action,
      token,
      ...payload
    })
  });

  return res.json();
}

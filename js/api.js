const API_URL =
  "https://script.google.com/macros/s/AKfycbyUQSVzwLJcwvg_0gg-K5X3eYiIyCdKRjuN-qL47rWaxYRtkM0x4Ujs49gUGvHOetIsLA/exec";

async function api(action, payload = {}) {
  const user = await window.waitForAuth();
  const token = await user.getIdToken();

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

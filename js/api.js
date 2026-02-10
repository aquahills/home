const API_URL = "https://script.google.com/macros/s/AKfycbyUQSVzwLJcwvg_0gg-K5X3eYiIyCdKRjuN-qL47rWaxYRtkM0x4Ujs49gUGvHOetIsLA/exec";

async function api(action, payload = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action, ...payload })
  });
  return res.json();
}

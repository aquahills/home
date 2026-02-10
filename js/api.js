const API_URL = "https://script.google.com/macros/s/AKfycbwFT7DKrs14W8jwr7AF6LipnKRoWiIiBoudh4aQXWVregTUn2Uw2ZNNB_lzb2ku69wzRQ/exec";

async function api(action, payload = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action, ...payload })
  });
  return res.json();
}

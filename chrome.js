const TOKEN = "ey...";
const USER = "";
const API_BASE_URL = "api.karotter.com";
const REFERER_URL = "https://karotter.com";
const CLIENT_TYPE = "web";
const CSRF_UUID = "";
const DEVICE_UUID = "";
const BOT_ID = "";
let cursor = null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function check() {
  try {
    let url = `https://${API_BASE_URL}/api/search/posts?q=from:${USER}&sort=oldest&limit=10`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        referer: REFERER_URL,
        "x-client-type": CLIENT_TYPE,
        "x-csrf-token": CSRF_UUID,
        "x-device-id": DEVICE_UUID,
        "x-active-account-id": BOT_ID
      }
    });
    const data = await res.json();
    for (const post of data.posts) {
      if (!post.rekaroted) {
        await sleep(3000 + Math.random() * 5000);
        const r = await fetch(
          `https://${API_BASE_URL}/api/posts/${post.id}/rekarot`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              referer: REFERER_URL,
              "x-client-type": CLIENT_TYPE,
              "x-csrf-token": CSRF_UUID,
              "x-device-id": DEVICE_UUID,
              "x-active-account-id": BOT_ID
            }
          }
        );
        console.log(`${post.id}: ${r.status}`);
      }
    }
    if (data.pagination.hasNext) {
      cursor = data.pagination.nextCursor;
    }
  } catch (e) {
    console.error(e);
  }
}

check();
setInterval(check, 10000);

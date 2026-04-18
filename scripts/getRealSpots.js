import fs from "fs";

const API_KEY = "AIzaSyCemJKF7ryZuXCUf0V3mmg4NijD3mdIp0Y";

async function fetchPlaces(query, pageToken = null) {
  const body = { textQuery: query };

  if (pageToken) body.pageToken = pageToken;

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.location,places.rating",
      },
      body: JSON.stringify(body),
    }
  );

  return await res.json();
}

function randomPrice() {
  return ["low", "medium", "high"][Math.floor(Math.random() * 3)];
}

function randomVibe() {
  const vibes = ["solo", "chill", "lively", "date"];
  return [vibes[Math.floor(Math.random() * vibes.length)]];
}

async function main() {
  const queries = [
    "ramen Shibuya",
    "sushi Shibuya",
    "izakaya Shibuya",
    "cafe Shibuya",
    "restaurant Shibuya",
    "bar Shibuya",
    "yakitori Shibuya",
    "dessert Shibuya",
    "vegan Shibuya",
    "lunch Shibuya",
    "dinner Shibuya",
    "cheap food Shibuya",
    "fine dining Shibuya",
  ];

  let allSpots = [];

  for (const q of queries) {
    console.log("Fetching:", q);

    let pageToken = null;

    for (let i = 0; i < 3; i++) {
      const data = await fetchPlaces(q, pageToken);
      const places = data.places || [];

      const mapped = places.map((p) => ({
        id: p.id,
        name: p.displayName?.text,
        price: randomPrice(),
        rating: p.rating || 4.0,
        vibe: randomVibe(),
        openLate: Math.random() > 0.5,
        foreignFriendly: true,
        lat: p.location?.latitude,
        lng: p.location?.longitude,
      }));

      allSpots.push(...mapped);

      pageToken = data.nextPageToken;

      if (!pageToken) break;

      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // 重複削除（最重要）
  const unique = Array.from(
    new Map(allSpots.map((s) => [s.id, s])).values()
  );

  fs.writeFileSync(
    "./data/spots_real.json",
    JSON.stringify(unique, null, 2)
  );

  console.log("Done:", unique.length);
}

main();
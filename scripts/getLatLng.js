import fs from "fs";

const API_KEY = "AIzaSyCemJKF7ryZuXCUf0V3mmg4NijD3mdIp0Y";

// 元データ
const spots = JSON.parse(fs.readFileSync("./data/spots.json", "utf-8"));

async function getLatLng(name) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    name
  )}&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.results && data.results.length > 0) {
    const loc = data.results[0].geometry.location;
    return { lat: loc.lat, lng: loc.lng };
  }

  return { lat: null, lng: null };
}

async function main() {
  const newSpots = [];

  for (const spot of spots) {
    console.log("Fetching:", spot.name);

    const { lat, lng } = await getLatLng(spot.name);

    newSpots.push({
      ...spot,
      lat,
      lng,
    });

    // API制限対策（重要）
    await new Promise((r) => setTimeout(r, 200));
  }

  fs.writeFileSync("./data/spots_new.json", JSON.stringify(newSpots, null, 2));
}

main();
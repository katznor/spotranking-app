"use client";

import { useState } from "react";

type Spot = {
  name: string;
  price: string;
  rating: number;
  vibe: string[];
  reason?: string;
};

export default function Finder() {
  const [budget, setBudget] = useState("low");
  const [vibe, setVibe] = useState("chill");
  const [results, setResults] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);

    const res = await fetch("/api/recommend", {
      method: "POST",
      body: JSON.stringify({ budget, vibe }),
    });

    const data = await res.json();
    setResults(data);

    setLoading(false);
  };

  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Find your perfect spot in Shibuya</h1>

      {/* 入力UI */}
      <div style={{ marginBottom: "20px" }}>
        <label>Budget: </label>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        >
          <option value="low">$</option>
          <option value="medium">$$</option>
          <option value="high">$$$</option>
        </select>

        <br /><br />

        <label>Vibe: </label>
        <select
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
        >
          <option value="chill">Chill</option>
          <option value="solo">Solo</option>
          <option value="lively">Lively</option>
          <option value="date">Date</option>
        </select>

        <br /><br />

        <button onClick={search}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* 結果表示 */}
      <div>
        {results.map((r) => (
          <div
            key={r.name}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <h2>{r.name}</h2>

            <p>⭐ Rating: {r.rating}</p>
            <p>💰 Price: {r.price}</p>
            {r.rating > 4.3 && (
            <p style={{ color: "red" }}>🔥 Popular spot</p>
            )}

            {r.reason && (
              <p style={{ fontStyle: "italic" }}>
                {r.reason}
              </p>
            )}

            {/* Google Mapsリンク */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                r.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 View on Google Maps
            </a>

            <br />

            {/* 仮の収益ボタン */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}`}
              target="_blank"
              style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "8px 12px",
                background: "#ff5a5f",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none"
              }}
            >
              🧩Book / View Details
            </a>
            <a
              href="https://www.klook.com/"
              target="_blank"
            >
              🎟 Book Experience
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
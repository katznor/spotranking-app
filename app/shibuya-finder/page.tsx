"use client";

import { useState } from "react";

type Spot = {
  name: string;
  price: string;
  rating: number;
  vibe: string[];
  reason?: string;
  lat?: number;
  lng?: number;
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
      headers: {
        "Content-Type": "application/json",
      },
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

        <button onClick={search}
          style={{
            padding: "10px 16px",
            background: "#0070f3",
            color: "#fff",
            borderRadius: "6px"
          }}
          >
          {loading ? "Searching..." : "Search"}
        </button>
        {loading && <p style={{ marginTop: "10px" }}>🔍 Searching...</p>}
      </div>

      {/* 結果表示 */}
      <div>
          {/* 👇ここに追加 */}
          {results.length === 0 && !loading && (
            <p style={{ marginTop: "20px", color: "#666" }}>
            No spots found. Try different filters.</p>
          )}
        {results.map((r) => {
          console.log("DEBUG:", r); // ←これ追加

          return(
          <div
            key={r.name}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
              }}
          >
            <h2  style={{ marginBottom: "8px" }}>
             {r.name}
            </h2>

            <p style={{ fontWeight: "bold" }}>⭐ {r.rating}</p>
            <p>💰 Price: {r.price}</p>
            {r.rating > 4.3 && (
            <p style={{ color: "red" }}>🔥 Popular spot</p>
            )}

            {r.reason && (
              <p style={{ fontStyle: "italic", color:"#555", marginTop: "6px" }}>
                {r.reason}
              </p>
            )}

            {/* Google Maps埋め込み */}
            {r.lat != null && r.lng != null && (
              <iframe
                width="100%"
                height="200"
                style={{ border: 0, marginTop: "10px" }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${r.lat},${r.lng}&output=embed`}
              />
              )
            }
            <br />

            {/* 仮の収益ボタン */}
            <a
              href="https://affiliate.klook.com/redirect?aid=117048&aff_adid=1253921&k_site=https%3A%2F%2Fwww.klook.com%2F"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                marginTop: "8px",
                padding: "8px",
                background: "#333",
                color: "#fff",
                borderRadius: "6px",
                textAlign: "center",
                fontSize: "13px",
                textDecoration: "none"
              }}
            >
              🎟 Book Tours & Experiences
            </a>
          </div>
          );
        ))}
      </div>
    </main>
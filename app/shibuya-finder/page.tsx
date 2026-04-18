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
    // 👇ここに追加（searchの外！！）
  const trackClick = async (type: string, name: string) => {
    await fetch("/api/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, name }),
    });
  };
  
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
  <main style={{
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    background: "#f7f7f7",
    minHeight: "100vh"
  }}>

    
      <h1 style={{
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "10px"
      }}>
      Find your perfect spot in Shibuya
      </h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Discover the best places based on your vibe.
      </p>

      {/* 入力UI */}
        <div style={{
          marginBottom: "20px",
          padding: "16px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
        <label>Budget: </label>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
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
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            marginBottom: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#fff",
            fontSize: "14px"
          }}
        >
          <option value="chill">Chill</option>
          <option value="solo">Solo</option>
          <option value="lively">Lively</option>
          <option value="date">Date</option>
        </select>

        <br /><br />

        <button onClick={search}
          style={{
          background: "#ff5a5f",
          fontSize: "16px",
          width: "100%",
          padding: "14px"
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
        {results.map((r, index) => {
          console.log("DEBUG:", r); // ←これ追加

          return(
          <div
            key={r.name}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "14px",
              marginBottom: "16px",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              width: "100%"
              }}
          >
          <h2 style={{ marginBottom: "8px" }}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0070f3", textDecoration: "none" }}
            >
              {r.name}
            </a>
          </h2>
                  {/* ① 1位の直後にホテル */}

    {index === 0 && (

      <a
        href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1961634&hl=en-us&city=5085"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick("hotel", r.name)}
        style={{
          display: "block",
          marginTop: "10px",
          padding: "12px",
          background: "#ff5a5f",
          color: "#fff",
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "bold",
          textDecoration: "none"
        }}
      >
        🏨 Stay near this spot (Save up to 40%)
      </a>
    )}
            <p style={{ fontWeight: "bold" }}>⭐ {r.rating}</p>
            <p>💰 Price: {r.price}</p>
            {r.rating > 4.3 && (
            <p style={{ color: "red" }}>🔥 Popular spot</p>
            )}
            {r.rating > 4.5 && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              🔥 Highly Recommended
            </p>
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
              onClick={() => trackClick("klook", r.name)}
              style={{
                display: "block",
                marginTop: "10px",
                padding: "12px",
                background: "#333",
                color: "#fff",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "14px",
                textDecoration: "none"
              }}
            >
              🔥 See Deals Near This Spot
            </a>
          </div>
          );
        })}
      </div>
    </main>
  );
}
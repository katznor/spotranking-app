"use client";

import { useState } from "react";

export default function Finder() {
  const [budget, setBudget] = useState("low");
  const [vibe, setVibe] = useState("chill");
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    const res = await fetch("/api/recommend", {
      method: "POST",
      body: JSON.stringify({ budget, vibe }),
    });
    const data = await res.json();
    setResults(data);
  };

  return (
    <main>
      <h1>Find your perfect spot in Shibuya</h1>

      <div>
        <select onChange={(e) => setBudget(e.target.value)}>
          <option value="low">$</option>
          <option value="medium">$$</option>
          <option value="high">$$$</option>
        </select>

        <select onChange={(e) => setVibe(e.target.value)}>
          <option value="chill">Chill</option>
          <option value="solo">Solo</option>
          <option value="lively">Lively</option>
        </select>

        <button onClick={search}>Search</button>
      </div>

      <div>
        {results.map((r) => (
          <div key={r.name}>
            <h2>{r.name}</h2>
            <p>Rating: {r.rating}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
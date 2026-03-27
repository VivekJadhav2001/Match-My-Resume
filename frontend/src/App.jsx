import { useState, useEffect } from "react";

function App() {
  const [fileName, setFileName] = useState("");
  const [score, setScore] = useState(null);
  const [missingKeywords, setMissingKeywords] = useState([]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      chrome.storage.local.set({
        resume: reader.result,
        resumeName: file.name,
      });

      setFileName(file.name);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    loadData();

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local") {
        if (changes.lastScore) setScore(changes.lastScore.newValue);
        if (changes.missingKeywords)
          setMissingKeywords(changes.missingKeywords.newValue);
      }
    });
  }, []);

  const loadData = () => {
    chrome.storage.local.get(
      ["resumeName", "lastScore", "missingKeywords"],
      (result) => {
        if (result.resumeName) setFileName(result.resumeName);
        if (result.lastScore !== undefined) setScore(result.lastScore);
        if (result.missingKeywords)
          setMissingKeywords(result.missingKeywords);
      }
    );
  };

  return (
    <div
      style={{
        width: "320px",
        padding: "18px",
        background: "#0f0f0f",
        color: "#e5e5e5",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* TITLE */}
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
          ⚡ Resume Matcher
        </h2>
        <p style={{ fontSize: "11px", opacity: 0.6 }}>
          Smart ATS analysis for your resume
        </p>
      </div>

      {/* UPLOAD */}
      <label
        style={{
          display: "block",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          textAlign: "center",
          cursor: "pointer",
          fontSize: "12px",
          transition: "0.2s",
        }}
      >
        📄 Upload Resume
        <input
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </label>

      {/* FILE NAME */}
      {fileName && (
        <div
          style={{
            marginTop: "10px",
            fontSize: "11px",
            opacity: 0.7,
          }}
        >
          ✅ {fileName}
        </div>
      )}

      {/* REMOVE BUTTON */}
      {fileName && (
        <button
          onClick={() => {
            chrome.storage.local.remove(["resume", "resumeName"]);
            setFileName("");
            setScore(null);
            setMissingKeywords([]);
          }}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "8px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(255,255,255,0.05)",
            color: "#ccc",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          Remove Resume
        </button>
      )}

      {/* SCORE */}
      {score !== null && (
        <div
          style={{
            marginTop: "18px",
            padding: "14px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.6 }}>
            ATS Score
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginTop: "4px",
              color:
                score > 75
                  ? "#22c55e"
                  : score > 50
                  ? "#eab308"
                  : "#ef4444",
            }}
          >
            {score}%
          </div>
        </div>
      )}

      {/* KEYWORDS */}
      {missingKeywords.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "12px", marginBottom: "8px", opacity: 0.7 }}>
            Missing Keywords
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {missingKeywords.map((w, i) => (
              <span
                key={i}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  background: "rgba(239,68,68,0.1)",
                  color: "#f87171",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
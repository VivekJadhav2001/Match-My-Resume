import { useState, useEffect } from "react";

function App() {
  const [fileName, setFileName] = useState("");
  const [score, setScore] = useState(null);
  const [missingKeywords, setMissingKeywords] = useState([]);

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      chrome.storage.local.set({
        resume: reader.result,
        resumeName: file.name,
      });

      setFileName(file.name);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    chrome.storage.local.get(
      ["resumeName", "lastScore", "missingKeywords"],
      (result) => {
        if (result.resumeName) {
          setFileName(result.resumeName);
        }

        if (result.lastScore !== undefined) {
          setScore(result.lastScore);
        }

        if (result.missingKeywords) {
          setMissingKeywords(result.missingKeywords);
        }
      },
    );
  }, []);

  return (
    <div style={{ padding: "20px", width: "300px" }}>
      <h3>Resume JD Matcher</h3>

      <input type="file" accept="application/pdf" onChange={handleUpload} />

      {fileName && <p>Uploaded: {fileName}</p>}
      <button
        onClick={() => {
          chrome.storage.local.remove(["resume", "resumeName"]);
          setFileName("");
        }}
      >
        Remove Resume
      </button>

      {score !== null && (
        <>
          <h4>ATS Score: {score}%</h4>

          <h4>Missing Keywords</h4>

          <ul>
            {missingKeywords.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;

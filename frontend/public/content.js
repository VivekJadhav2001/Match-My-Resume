/* eslint-disable no-undef */
console.log("content.js loaded");

let tooltip = null;
let selectedText = "";
let isProcessing = false;

// Helper to clean up
function removeTooltip() {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
  isProcessing = false;
}

// 1. Dismiss on click-away
document.addEventListener("mousedown", (e) => {
  if (tooltip && !tooltip.contains(e.target)) {
    removeTooltip();
  }
});

// 2. Selection logic
document.addEventListener("mouseup", () => {
  if (isProcessing) return;

  const selection = window.getSelection().toString().trim();

  // Using > 20 as per your second version
  if (selection.length > 20) {
    if (tooltip) removeTooltip(); 
    selectedText = selection;
    createTooltip();
  }
});

function createTooltip() {
  if (tooltip) return;

  tooltip = document.createElement("div");
  tooltip.innerText = "⚡ Check Score";

  // Use the modern styling from your second version
  tooltip.style.cssText = `
    position:absolute;
    z-index:999999;
    padding:10px 16px;
    border-radius:12px;
    background: rgba(20,20,20,0.85);
    backdrop-filter: blur(10px);
    color:#e5e5e5;
    font-size:13px;
    font-weight:500;
    font-family: system-ui, -apple-system, sans-serif;
    border:1px solid rgba(255,255,255,0.08);
    box-shadow: 0 4px 20px rgba(0,0,0,0.6);
    cursor:pointer;
    user-select:none;
    white-space: pre-line;
  `;

  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();
  tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
  tooltip.style.left = `${rect.left + window.scrollX}px`;

  tooltip.onclick = (e) => {
    e.stopPropagation();
    if (isProcessing) return;
    
    isProcessing = true;
    tooltip.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center;">
        <div class="loader"></div>
        <span>Analyzing...</span>
      </div>
    `;

    chrome.runtime.sendMessage(
      {
        type: "CHECK_JD", // Ensure this matches your background.js listener
        jobDescription: selectedText,
      },
      (response) => {
        // Check if tooltip still exists (user might have clicked away during fetch)
        if (!tooltip) return;

        if (!response || response.error) {
          tooltip.innerText = "Error ❌";
          // Quick reset on error
          setTimeout(removeTooltip, 3000);
        } else {
          tooltip.innerHTML = `
            <div style="font-weight:600; color: #4ade80;">ATS Score: ${response.score}%</div>
            <div style="font-size:11px; opacity:0.7; margin-top:4px;">
              Dismissing in 15s...
            </div>
          `;
          
          // Reset processing so user can select text again
          isProcessing = false;

          // Start the 15s timer ONLY after success
          setTimeout(() => {
            removeTooltip();
          }, 15000);
        }
      }
    );
  };

  // Loader CSS Injection
  if (!document.getElementById("loader-style")) {
    const style = document.createElement("style");
    style.id = "loader-style";
    style.innerHTML = `
      .loader {
        width:12px; height:12px;
        border:2px solid rgba(255,255,255,0.2);
        border-top:2px solid #fff;
        border-radius:50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(tooltip);
}
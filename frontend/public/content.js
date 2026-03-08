console.log("content.js loaded");

let tooltip = null;
let selectedText = "";

document.addEventListener("mouseup", () => {

  const selection = window.getSelection().toString().trim();

  console.log(selection.length, "selected text triggering");

  if (selection.length > 20) {

    selectedText = selection;
    createTooltip();

  }

});

function createTooltip() {

  if (tooltip) tooltip.remove();

  tooltip = document.createElement("div");

  tooltip.innerText = "Check Score";

  tooltip.style.cssText = `
  height:30px;
  width:110px;
  border-radius:15px;
  cursor:pointer;
  background:black;
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  position:absolute;
  z-index:9999;
  font-size:12px;
  padding:5px;
  white-space:pre-line;
  `;

  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();

  tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
  tooltip.style.left = `${rect.left + window.scrollX}px`;

  tooltip.onclick = () => {

    tooltip.innerText = "Checking...";

    chrome.runtime.sendMessage(
      {
        type: "CHECK_JD",
        jobDescription: selectedText
      },
      (response) => {

        if (!response) {
          tooltip.innerText = "Error";
          return;
        }

        tooltip.innerText =
`ATS Score: ${response.score}%

Missing Keywords
• ${response.missingKeywords.join("\n• ")}`;

      }
    );

  };

  document.body.appendChild(tooltip);

  setTimeout(() => {
    tooltip?.remove();
  }, 8000);

}
console.log("Background.js running");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.type === "CHECK_JD") {

    sendingFileAndText(request.jobDescription, sendResponse);

  }

  return true;
});

function base64ToBlob(base64) {

  const parts = base64.split(",");
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });

}

async function sendingFileAndText(jobDescription, sendResponse) {

chrome.storage.local.get(["resume"], async (result) => {

  if (!result.resume) {

    sendResponse({
      score: 0,
      missingKeywords: []
    });

    return;
  }

  const blob = base64ToBlob(result.resume);

  const formData = new FormData();

  formData.append("resume", blob, "resume.pdf");
  formData.append("jd", jobDescription);

  try {

  const apiRes = await fetch("http://localhost:3000/getResumeScore", {
    method: "POST",
    body: formData
  });

  const data = await apiRes.json();

  chrome.storage.local.set({
    lastScore: data.score,
    missingKeywords: data.missingKeywords
  });

  sendResponse(data);

  } catch (err) {

  console.log("API ERROR", err);

  sendResponse({
    score: 0,
    missingKeywords: []
  });

  }

});

}
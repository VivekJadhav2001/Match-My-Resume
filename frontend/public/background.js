console.log("Background.js file");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log(message,sender,sendResponse)

  if (message.type === "CHECK_JD") {
    // sendResponse("75%")

    sendingFileAndText(message.jobDescription, sendResponse);

    //Convert file into blob(binary)

    //Convert blob into base64

    return true
  }
});

async function sendingFileAndText(jobDescription, sendResponse) {
  try {
    const resumeFileLink = chrome.runtime.getURL(
      "Vivek_Jadhav_Resume_2026.pdf",
    );

    const fileResources = await fetch(resumeFileLink);
    const blobFormat = await fileResources.blob();

    console.log(blobFormat,"BOLB FORMAT")

    const formData = new FormData();
    formData.append("resume", blobFormat, "resume.pdf");
    formData.append("jd", jobDescription);

    // call backend API
    const apiRes = await fetch("http://localhost:3000/getResumeScore", {
      method: "POST",
      body: formData,
    });

    const data = await apiRes.json();

    console.log(data,"DATA FROM API");
    sendResponse(data.message);
  } catch (error) {
    console.log(error, "Error in calling api");
    sendResponse({ error: "Error in callinf api" });
  }
}

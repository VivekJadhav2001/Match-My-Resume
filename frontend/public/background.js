console.log("Background.js file")

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{

    console.log(message,sender,sendResponse)

    if(message.type === "CHECK_JD"){
        sendResponse("75%")
    }
})


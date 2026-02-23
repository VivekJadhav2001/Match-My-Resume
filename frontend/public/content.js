console.log("content.js")
let tooltip

document.addEventListener("mouseup",(e)=>{
    
    const selectedText = window.getSelection().toString().trim()

    console.log(selectedText,selectedText.length,'selected text triggering')

    // Dont create new tool tip if jd/selected string is less than 50 charecters
    if(selectedText.length > 50){
        createTooltip(selectedText)
    }

})


// Creates a tooltip after selecting text
function createTooltip(selectedText){
    // Remove if any previous tooltip  existing
    if(tooltip){
        tooltip.remove()
    }

    tooltip = document.createElement("div")

    tooltip.innerText = "Check Score"
    tooltip.style.height = '30px'
    tooltip.style.width = "90px"

    tooltip.style.borderRadius = "15px"

    tooltip.style.cursor = "pointer"

    tooltip.style.background = "black"
    tooltip.style.color = "white"

    tooltip.style.position = "absolute"
    tooltip.style.zIndex = "999"

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    tooltip.style.top = `${rect.bottom + window.scrollY}px`
    tooltip.style.left = `${rect.left + window.scrollX}px`



    tooltip.onclick = ()=>{
        console.log("clicking tooltip")
      // Update tool tip inner text "loading ..."
        tooltip.innerText = "Checking..."


      // Call function in background.js 
      chrome.runtime.sendMessage({
        type:"CHECK_JD",
        jobDescription:selectedText
      },
      //callback will have response from backeground file
      (response)=>{
        tooltip.innerText = response
      }
    )
    }


    document.body.appendChild(tooltip)

}



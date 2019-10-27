import React from "react"
import ReactDOM from "react-dom"

// We request the storage system to know if rickroll is activated when the tab is loaded
chrome.storage.sync.get(["rickrollIsActive"], result => {
    if (result.rickrollIsActive === true) {
        // If it's active, we replace the links
        replaceLinks()
    }
})

// Our message listener
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.replaceLinks === true) {
        // If message is "replaceLinks" is true, we replace the links
        replaceLinks()
        response({ message: "The links have been replaced." })
    }
})

function replaceLinks() {
    // We select all the links
    const links = document.getElementsByTagName("a")

    for (let i = 0; i < links.length; i++) {
        // We only want to target the link which are not internal anchor links
        if (links[i].href && links[i].href.startsWith(`${document.URL}#`) === false) {
            links[i].href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            links[i].target = "_blank"
        }
    }
}

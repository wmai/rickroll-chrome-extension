import React from "react"
import ReactDOM from "react-dom"

import "./popup.css"

const Popup = ({ tabId, tabUrl, initialState }) => {
    // We initialize the state
    const [isActive, setIsActive] = React.useState(initialState)

    const handleClick = () => {
        const nextState = !isActive

        // We update the storage system with the new value of the rickroll's state
        chrome.storage.sync.set({"rickrollIsActive": nextState}, () => {
            if (nextState === false) {
                // If the user ask to deactivate rickroll, we refresh the tab
                chrome.tabs.update(tabId, { url: tabUrl })
                // Then you update the state of the component
                setIsActive(nextState)
            } else {
                // Else, we send a message that will be received by the content script
                chrome.tabs.sendMessage( tabId, { replaceLinks: nextState }, response => {
                    // Then you update the state of the component
                    if (response) {
                        setIsActive(nextState)
                    }
                })
            }
        })
    }

    return (
        <button
            className={isActive ? "activated" : "deactivated"}
            type="button"
            checked={isActive}
            onClick={handleClick}>
            Rickroll { isActive ? "ON" : "OFF" }
        </button>
    )
}

// This Chrome API call will return an array which the first element is our current active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // We request the storage system to know if rickroll is activated
    chrome.storage.sync.get(["rickrollIsActive"], value => {
        // Then we render our Popup component while passing the props that we need
        ReactDOM.render(<Popup tabId={tabs[0].id} tabUrl={tabs[0].url} initialState={value.rickrollIsActive} />, document.getElementById("popup-container"))
    })
})

document.addEventListener('DOMContentLoaded', async () => {
    const data = await chrome.storage.local.get('lastResult');
    if (data.lastResult) {
        document.getElementById('result').innerText = data.lastResult;
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "DISPLAY_RESULT") {
        document.getElementById('result').innerText = message.data;
    }
});

document.getElementById('capture').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Programmatically inject content script to remove error
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });

        chrome.tabs.sendMessage(tab.id, {
            type: "START_SELECTION"
        })

        document.getElementById('result').innerText = "Reopen the popup after selection to view result";

    } catch (error) {
        console.error('Failed to start capture:', error);
    }
});

window.onbeforeunload = () => {
    chrome.storage.local.remove('lastResult');
};
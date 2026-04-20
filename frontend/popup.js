document.addEventListener('DOMContentLoaded', async () => {
    const data = await chrome.storage.local.get('lastResult');
    if (data.lastResult) {
        document.getElementById('capture').style.display = 'none';
        document.body.style.width = '100%';
        document.getElementById('warning').style.display = 'block';
        document.getElementById('resultsDiv').style.display = 'flex';
        document.getElementById('resultsDiv').style.flexDirection = 'column';
        document.getElementById('resultsDiv').style.overflowY = 'scroll'
        document.getElementById('result').innerText = data.lastResult;

    }
});

document.getElementById('copy').addEventListener('click', async () => {
    const data = await chrome.storage.local.get('lastResult');

    const textToCopy = data.lastResult || "";

    console.log(data.lastResult)
    navigator.clipboard.writeText(textToCopy);
    document.getElementById('copy').innerHTML = '<i class="fa fa-check"></i>';
})

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

        document.getElementById('capture').style.display = 'none';

    } catch (error) {
        console.error('Failed to start capture:', error);
    }
});

window.onbeforeunload = () => {
    chrome.storage.local.remove('lastResult');
};
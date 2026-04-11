document.getElementById('capture').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.tabs.sendMessage(tab.id, {
            type: "START_SELECTION"
        })

        window.close();

    } catch (error) {
        console.error('Failed to start capture:', error);
    }
})
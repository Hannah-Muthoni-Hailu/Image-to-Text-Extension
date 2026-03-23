document.getElementById('capture').addEventListener('click', async () => {
    // aucus (2025) context-capture (Version 1.0) [Source Code]
    // https://github.com/aucus/context-capture/blob/main/src/popup/popup.ts
    try {
        const screenshot = await chrome.tabs.captureVisibleTab(null, {
            format: "png"
        });

        // Show preview in popup
        document.getElementById("preview").src = screenshot;

        // Optional: download automatically
        const link = document.createElement("a");
        link.href = screenshot;
        link.download = "screenshot.png";
        link.click();
    } catch (error) {
        console.error('Failed to start capture:', error);
    }
})
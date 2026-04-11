// Performs the actual capture and cropping
chrome.runtime.onMessage.addListener(async (message, sender) => {
    if (message.type === "CAPTURE_REGION") {
        const screenshot = await chrome.tabs.captureVisibleTab();

        try {
            chrome.tabs.sendMessage(sender.tab.id, {
                type: "PROCESS_IMAGE",
                screenshot,
                rect: message.rect
            });
        } catch (err) {
            console.error("Tab no longer available", err);
        }
    }
});
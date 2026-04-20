let latestResult = null;
let latestImage = null;
let isProcessing = false;

// Performs the actual capture and cropping
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "CAPTURE_REGION") {
        await chrome.storage.local.set({ lastResult: "Processing..." });

        chrome.windows.create({
            url: 'popup.html',
            type: 'popup',
            width: 300,
            height: 300,
            focused: true
        });

        const screenshot = await chrome.tabs.captureVisibleTab(sender.tab.windowId);

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

    if (message.type === "SERVER_RESPONSE_RECEIVED") {
        await chrome.storage.local.set({ lastResult: message.data });

        chrome.runtime.sendMessage({
            type: "DISPLAY_RESULT",
            data: message.data
        });
    }

    if (message.type === "SERVER_RESPONSE_ERROR") {
        await chrome.storage.local.set({ lastResult: "There was a server error. Please try again!" });

        chrome.runtime.sendMessage({
            type: "DISPLAY_RESULT",
            data: message.data
        });
    }
});
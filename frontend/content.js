if (window.hasTextCopierLoaded) {
    // If it's already there, just start the selection process
    startSelection();
} else {
    window.hasTextCopierLoaded = true;

    let isSelecting = false;
    let startX, startY, box;

    // Helper to trigger the cursor/drag logic
    function startSelection() {
        isSelecting = true;
        document.body.style.cursor = "crosshair";
    }

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "START_SELECTION") {
            startSelection()
        }

        if (message.type === "PROCESS_IMAGE") {
            processAndSendImage(message);
        }
    });

    document.addEventListener("mousedown", (e) => {
        if (!isSelecting) return;

        isSelecting = false

        startX = e.clientX;
        startY = e.clientY;

        box = document.createElement("div");
        box.style.position = "fixed";
        box.style.border = "2px dashed red";
        box.style.background = "rgba(255,0,0,0.1)";
        box.style.left = startX + "px";
        box.style.top = startY + "px";

        document.body.appendChild(box);

        function onMouseMove(e) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            box.style.width = Math.abs(width) + "px";
            box.style.height = Math.abs(height) + "px";
            box.style.left = (width < 0 ? e.clientX : startX) + "px";
            box.style.top = (height < 0 ? e.clientY : startY) + "px";
        }

        async function onMouseUp(e) {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            const rect = box.getBoundingClientRect();
            box.remove();

            const scale = window.devicePixelRatio; // Ensure the correct scaling is applied to the cropped image

            chrome.runtime.sendMessage({
                type: "CAPTURE_REGION",
                rect: {
                    x: rect.left * scale,
                    y: rect.top * scale,
                    width: rect.width * scale,
                    height: rect.height * scale
                }
            });

            document.body.style.cursor = "default";
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    async function processAndSendImage(message) {
        const img = new Image();
        img.src = message.screenshot;

        img.onload = async () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = message.rect.width;
            canvas.height = message.rect.height;

            ctx.drawImage(img, message.rect.x, message.rect.y, message.rect.width, message.rect.height, 0, 0, message.rect.width, message.rect.height);

            const cropped = canvas.toDataURL("image/png");

            try {
                const response = await fetch("https://image-to-text-extension.onrender.com/process_image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: cropped })
                });

                const result = await response.text();

                if (!response.ok) {
                    console.log(response);

                    chrome.runtime.sendMessage({
                        type: "SERVER_RESPONSE_ERROR",
                    });

                } else {
                    chrome.runtime.sendMessage({
                        type: "SERVER_RESPONSE_RECEIVED",
                        data: result
                    });
                }

            } catch (error) {
                console.log(error)

                chrome.runtime.sendMessage({
                    type: "SERVER_RESPONSE_ERROR",
                });
            }
            
        };
    }
}

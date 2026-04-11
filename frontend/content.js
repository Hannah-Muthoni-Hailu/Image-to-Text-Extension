if (window.__screenshotTooLoaded) {
    console.log("Alread loaded, skipping...")
} else {
    // Lets user drag a box
    let startX, startY, box;

    let isSelecting = false;

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "START_SELECTION") {
            isSelecting = true;
            document.body.style.cursor = "crosshair";
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

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "PROCESS_IMAGE") {
            const img = new Image();
            img.src = message.screenshot;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = message.rect.width;
                canvas.height = message.rect.height;

                ctx.drawImage(
                    img,
                    message.rect.x,
                    message.rect.y,
                    message.rect.width,
                    message.rect.height,
                    0,
                    0,
                    message.rect.width,
                    message.rect.height
                );

                const cropped = canvas.toDataURL("image/png");

                const link = document.createElement("a");
                link.href = cropped;
                link.download = "cropped.png";
                link.click();
            };
        }
    });
}
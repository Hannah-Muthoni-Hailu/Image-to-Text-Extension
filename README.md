# Image-to-Text-Extension
This extensions allows users to take a screenshot of a piece of text and automatically copy it to their clipboard. It is especially useful for online students who need to copy text from video slides. The extension uses Google's Gemma 4 multimodal model to perform the image to text conversion, accessed through the OpenAI inference provider.

## Usage
The backend is hosted on Render as a web service for your convenience. If you would like to host it yourself, you will need a huggingface inference token. Self hosting is preferable since the web service this extension depends on is on the free tier and therefore spins down with inactivity, which may cause delays in responses. If you choose to self host, remember to update the API fetch call in content.js line 94.

To use the extension:
1. Clone this repository
2. On your browser, visit chrome://extensions
3. Enable developer mode by toggling the button at the top left corner <img src="frontend/images/Wireframe - 4.png" />
4. Click the "Load unpacked" button <img src="/frontend/images/Wireframe - 4 (1).png" />
5. Select the frontend directory from the clone repository

# Image-to-Text-Extension
This extensions allows users to take a screenshot of a piece of text and automatically copy it to their clipboard. It is especially useful for online students who need to copy text from video slides. The extension uses Google's Gemma 4 multimodal model to perform the image to text conversion, accessed through the OpenAI inference provider.

## Usage
The backend is hosted on Render as a web service for your convenience. If you would like to host it yourself, you will need a huggingface inference token.

To use the extension:
1. Clone this repository
2. On your browser, visit chrome://extensions
3. Enable developer mode by toggling the button at the top left corner <img src="frontent/images/Wireframe - 4.png" />
4. Click the "Load unpacked" button <img src="frontent/images/Wireframe - 4(1).png" />
5. Select the frontend directory from the clone repository

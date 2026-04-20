const express = require('express');
const openai = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = 3000
const client = new openai({
	baseURL: "https://router.huggingface.co/v1",
	apiKey: process.env.HF_TOKEN,
});


app.post('/process_image', async (req, res) => {
    try {
        const base64Image = req.body.image;

        const chatCompletion = await client.chat.completions.create({
            model: "google/gemma-4-31B-it:together",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Extract the text from this image",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: base64Image,
                            },
                        },
                    ],
                },
            ],
        });

        const output = chatCompletion.choices[0].message.content;
        res.send(output);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing image");
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
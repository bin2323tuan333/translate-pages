// server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Cho phép React (cổng 5173) gọi sang server này
app.use(cors());
app.use(express.json());

// Tạo một cổng API để React gọi vào
app.post('/api/translate', async (req, res) => {
    const { text, leftLang, rightLang } = req.body;

    try {
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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', // Key của bạn
            },
            body: JSON.stringify({
                model: 'nvidia/riva-translate-4b-instruct-v2',
                messages: [
                    { role: 'system', content: `${leftLang}-${rightLang}` },
                    { role: 'user', content: text }
                ],
                temperature: 0,
                top_p: 0.9,
                max_tokens: 512,
                stream: false,
            }),
        });

        const data = await response.json();
        res.json({ translation: data.choices[0].message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi gọi API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server giả đang chạy tại http://localhost:${PORT}`);
});
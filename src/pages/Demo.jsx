import React, { useState } from "react";

// Cảnh báo: Không nên để API Key ở đây khi đem đi deploy thực tế
const API_KEY = "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";
const API_URL = "/nvidia-api/v1/chat/completions";

const Demo = () => {
    // 1. SỬA LỖI: Dùng ngoặc vuông [] thay vì ngoặc nhọn {}
    const [srcLang, setSrcLang] = useState("en");
    const [desLang, setDesLang] = useState("vi");
    const [srcText, setSrcText] = useState("Hello i am sigma boi");
    const [desText, setDesText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleTranslate = async () => {
        if (!srcText.trim()) return;
        setIsLoading(true);
        setDesText(""); // Xóa kết quả cũ

        try {
            const languagePair = `${srcLang}-${desLang}`;
            const messages = [
                { role: "system", content: languagePair },
                { role: "user", content: srcText },
            ];

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: "nvidia/riva-translate-4b-instruct-v2",
                    messages: messages,
                    temperature: 0,
                    top_p: 0.9,
                    max_tokens: 512,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`Lỗi API: ${response.status}`);
            }

            const data = await response.json();
            const resultText = data.choices[0].message.content;
            setDesText(resultText);

        } catch (error) {
            console.error("Lỗi dịch thuật:", error);
            setDesText("Đã xảy ra lỗi khi kết nối API.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <h2>Demo Dịch Thuật</h2>

            {/* Chọn ngôn ngữ */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <select value={srcLang} onChange={(e) => setSrcLang(e.target.value)}>
                    <option value="en">English</option>
                    <option value="vi">Vietnamese</option>
                    <option value="zh-cn">Chinese</option>
                </select>
                <span>sang</span>
                <select value={desLang} onChange={(e) => setDesLang(e.target.value)}>
                    <option value="vi">Vietnamese</option>
                    <option value="en">English</option>
                    <option value="zh-cn">Chinese</option>
                </select>
            </div>

            {/* Ô nhập văn bản */}
            <textarea
                value={srcText}
                onChange={(e) => setSrcText(e.target.value)}
                rows="4"
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                placeholder="Nhập văn bản cần dịch..."
            />

            <button
                onClick={handleTranslate}
                disabled={isLoading}
                style={{ padding: "10px 20px", cursor: "pointer" }}
            >
                {isLoading ? "Đang dịch..." : "Dịch (OK)"}
            </button>

            {/* Kết quả */}
            <div style={{ marginTop: "20px", padding: "10px", background: "#f0f0f0", minHeight: "50px" }}>
                <strong>Kết quả:</strong>
                <p>{desText}</p>
            </div>
        </div>
    );
};

export default Demo;
import React, { useState } from "react";
import "./Main.css";

const API_KEY = "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";
const API_URL = "/nvidia-api/v1/chat/completions";

const Main = () => {
    const [leftLang, setLeftLang] = useState("en");
    const [rightLang, setRightLang] = useState("vi");
    const [leftText, setLeftText] = useState("");
    const [rightText, setRightText] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);

    const languageOptions = [
        { value: "en", label: "English" },
        { value: "vi", label: "Vietnamese" },
        { value: "zh-cn", label: "Chinese (Simplified)" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
        { value: "ja", label: "Japanese" },
        { value: "ko", label: "Korean" },
        { value: "ru", label: "Russian" },
    ];

    const translateText = async () => {
        if (!leftText.trim()) return;
        setIsTranslating(true);
        setRightText("");

        try {
            const languagePair = `${leftLang}-${rightLang}`;

            const messages = [
                { role: "system", content: languagePair },
                { role: "user", content: leftText },
            ];

            // Gọi API
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

            setRightText(resultText);

        } catch (error) {
            console.error("Lỗi dịch thuật:", error);
            setRightText("Đã xảy ra lỗi khi kết nối API.");
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSwapLanguages = () => {
        setLeftLang(rightLang);
        setRightLang(leftLang);
        setLeftText(rightText);
        setRightText(leftText);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            translateText();
        }
    };

    return (
        <div className="translation-app">
            {/* BẢNG BÊN TRÁI */}
            <div className="panel-left">
                <div className="language-select">
                    <label htmlFor="left-lang">From:</label>
                    <select
                        id="left-lang"
                        value={leftLang}
                        onChange={(e) => setLeftLang(e.target.value)}
                        disabled={isTranslating}
                    >
                        {languageOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <textarea
                    id="left-text"
                    placeholder="Enter text to translate..."
                    value={leftText}
                    onChange={(e) => setLeftText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTranslating}
                    rows="10"
                    className="translation-textarea"
                />
            </div>

            <div className="panel-controls">
                <button
                    onClick={handleSwapLanguages}
                    disabled={isTranslating}
                    className="swap-button"
                    title="Swap languages"
                >
                    ⇄
                </button>
            </div>

            <div className="panel-right">
                <div className="language-select">
                    <label htmlFor="right-lang">To:</label>
                    <select
                        id="right-lang"
                        value={rightLang}
                        onChange={(e) => setRightLang(e.target.value)}
                        disabled={isTranslating}
                    >
                        {languageOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <textarea
                    id="right-text"
                    placeholder={isTranslating ? "Translating..." : "Translation will appear here..."}
                    value={rightText}
                    readOnly
                    rows="10"
                    className="translation-textarea"
                />
            </div>
        </div>
    );
};

export default Main;
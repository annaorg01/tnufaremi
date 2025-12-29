'use client';

import React, { useState } from 'react';

interface ChatBotProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'שלום! אני עוזר וירטואלי למכרזי קרקע. איך אוכל לעזור לך היום?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const predefinedAnswers: { [key: string]: string } = {
        'מה זה פער משומה': 'פער משומה הוא ההפרש באחוזים בין מחיר הזכייה במכרז לבין מחיר השומה הממשלתי. פער חיובי מעיד על ביקוש גבוה, ופער שלילי עשוי להצביע על בעיות אפשריות.',
        'איך מחושב מחיר למ״ר': 'מחיר למ״ר מחושב על ידי חלוקת מחיר הזכייה הכולל בשטח המתחם במטרים רבועים. זה מאפשר השוואה הוגנת בין מכרזים בגדלים שונים.',
        'מה זה תחרות בריאה': 'תחרות בריאה מתייחסת למכרזים שקיבלו 2 הצעות או יותר. ככל שיש יותר הצעות, כך התחרות בריאה יותר והמחירים משקפים טוב יותר את שווי השוק.',
        'מי משלם על התשתיות': 'עלויות הפיתוח (תשתיות, כבישים, ביוב, חשמל) משולמות על ידי היזמים הזוכים, לא על ידי העירייה. העיר מקבלת תשתיות חדשות ללא עלות ישירה.',
        'איך אני מסנן נתונים': 'השתמש בפאנל הסינון בחלק העליון של הדשבורד. תוכל לסנן לפי עיר, טווח מחירים, פער משומה, וכמות הצעות. לחץ על "איפוס סינון" כדי לאפס את כל הפילטרים.',
        'מה המשמעות של מכרז ללא הצעות': 'מכרז ללא הצעות הוא מכרז שלא התקבלו עליו הצעות מיזמים. זה עשוי להצביע על בעיות כמו מחיר שומה גבוה מדי, בעיות תכנוניות, או חוסר עניין בשוק באזור.',
        'איך רואים את הפער בין ההצעות': 'השתמש במרכיב "פער מחירים: שומה לעומת זכייה" שמציג ויזואלית את ההפרש בין מחיר השומה למחיר הזכייה. הוא מציג גם סטטיסטיקות על כמה מכרזים מעל ומתחת לשומה.',
        'מה זה יחידות דיור מתוכננות': 'זה מספר הדירות שמתוכננות להיבנות בכל המכרזים ביחד. זה מייצג את היקף הבנייה הצפוי ומשפיע על היצע הדיור באזור.',
    };

    const getAnswer = (question: string): string => {
        const normalizedQuestion = question.trim().toLowerCase();
        
        // Check for exact matches
        for (const [key, value] of Object.entries(predefinedAnswers)) {
            if (normalizedQuestion.includes(key.toLowerCase())) {
                return value;
            }
        }

        // Check for keywords
        if (normalizedQuestion.includes('פער') || normalizedQuestion.includes('שומה')) {
            return predefinedAnswers['מה זה פער משומה'];
        }
        if (normalizedQuestion.includes('מחיר') && normalizedQuestion.includes('מ״ר')) {
            return predefinedAnswers['איך מחושב מחיר למ״ר'];
        }
        if (normalizedQuestion.includes('תחרות')) {
            return predefinedAnswers['מה זה תחרות בריאה'];
        }
        if (normalizedQuestion.includes('תשתית') || normalizedQuestion.includes('פיתוח')) {
            return predefinedAnswers['מי משלם על התשתיות'];
        }
        if (normalizedQuestion.includes('סינון') || normalizedQuestion.includes('פילטר')) {
            return predefinedAnswers['איך אני מסנן נתונים'];
        }
        if (normalizedQuestion.includes('ללא הצעות')) {
            return predefinedAnswers['מה המשמעות של מכרז ללא הצעות'];
        }
        if (normalizedQuestion.includes('יחידות') || normalizedQuestion.includes('דיור')) {
            return predefinedAnswers['מה זה יחידות דיור מתוכננות'];
        }

        return 'מצטער, אני לא בטוח שהבנתי את השאלה. נסה לשאול על: פער משומה, מחיר למ״ר, תחרות בריאה, תשתיות, סינון נתונים, או יחידות דיור.';
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: messages.length + 1,
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate bot thinking
        setTimeout(() => {
            const botResponse: Message = {
                id: messages.length + 2,
                text: getAnswer(inputText),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        'מה זה פער משומה?',
        'איך מחושב מחיר למ״ר?',
        'מי משלם על התשתיות?',
        'איך אני מסנן נתונים?'
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="glass-card rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col border border-blue-500/40">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-xl">🤖</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">עוזר וירטואלי</h3>
                            <p className="text-xs text-slate-400">תמיד כאן לעזור</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                    message.sender === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-800 text-slate-200'
                                }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs opacity-60 mt-1">
                                    {message.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-slate-800 rounded-2xl px-4 py-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-slate-400 mb-2">שאלות נפוצות:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((question, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setInputText(question);
                                        setTimeout(() => handleSend(), 100);
                                    }}
                                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full transition-colors"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-slate-700">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="שאל שאלה..."
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ChatBotButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-4 right-4 z-40 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
            <span className="text-2xl">💬</span>
        </button>
    );
}

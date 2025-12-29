'use client';

import React, { useState } from 'react';

interface HelpGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpGuide({ isOpen, onClose }: HelpGuideProps) {
    const [activeSection, setActiveSection] = useState('overview');

    if (!isOpen) return null;

    const sections = [
        { id: 'overview', label: 'סקירה כללית' },
        { id: 'metrics', label: 'הסבר מדדים' },
        { id: 'insights', label: 'תובנות לראש העיר' },
        { id: 'developers', label: 'עלויות יזמים' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-card rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">📖</span>
                        מדריך לראש העיר
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700 px-6">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeSection === section.id
                                    ? 'text-blue-400 border-blue-400'
                                    : 'text-slate-400 border-transparent hover:text-slate-300'
                                }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {activeSection === 'overview' && (
                        <div className="space-y-4 text-slate-300">
                            <h3 className="text-lg font-semibold text-white mb-4">מטרת הלוח</h3>
                            <p>
                                לוח בקרה זה מציג ניתוח מקיף של מכרזי קרקע ברשות מקרקעי ישראל,
                                עם דגש על מידע רלוונטי לקבלת החלטות ברמת ראשי ערים.
                            </p>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                                <h4 className="text-blue-400 font-medium mb-2">💡 נקודות מפתח</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>הכנסות ממכרזים מגיעות ישירות לרמ"י (רשות מקרקעי ישראל)</li>
                                    <li>עלויות הפיתוח משולמות על ידי היזמים, לא על ידי העירייה</li>
                                    <li>מספר ההצעות מעיד על אטרקטיביות הקרקע</li>
                                    <li>פער מהשומה מצביע על "ערך נסתר" או בעיות פוטנציאליות</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeSection === 'metrics' && (
                        <div className="space-y-6 text-slate-300">
                            <div>
                                <h4 className="text-white font-medium mb-2">📊 סה״כ הכנסות</h4>
                                <p className="text-sm">
                                    סכום כל הזכיות במכרזים. זה הסכום שהיזמים שילמו לרמ"י עבור הקרקע.
                                    הכנסות גבוהות מעידות על ביקוש גבוה לנדל"ן בעיר.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">📈 פער משומה (חציון/ממוצע)</h4>
                                <p className="text-sm">
                                    ההפרש באחוזים בין מחיר הזכייה לשומה הממשלתית.
                                </p>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-emerald-500/20 rounded p-2">
                                        <span className="text-emerald-400 font-medium">פער חיובי (+)</span>
                                        <p className="text-slate-400 mt-1">יזמים משלמים יותר מהשומה = ביקוש גבוה</p>
                                    </div>
                                    <div className="bg-rose-500/20 rounded p-2">
                                        <span className="text-rose-400 font-medium">פער שלילי (-)</span>
                                        <p className="text-slate-400 mt-1">יזמים משלמים פחות = חוסר עניין או שומה מנופחת</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">🏷️ מספר הצעות</h4>
                                <p className="text-sm">
                                    כמות ההצעות שהוגשו לכל מכרז. מספר גבוה = תחרות ערה,
                                    מספר נמוך = פחות עניין או בעיות בקרקע/תנאים.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">📐 מחיר למ״ר</h4>
                                <p className="text-sm">
                                    מאפשר השוואה בין מכרזים בגדלים שונים. שימושי לזיהוי אזורים יקרים/זולים.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">💰 כסף על השולחן</h4>
                                <p className="text-sm">
                                    הפער בין ההצעה הזוכה להצעה השנייה.
                                    פער גדול = הזוכה יכל לזכות במחיר נמוך יותר.
                                    מעיד על רמת התחרות במכרז.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeSection === 'insights' && (
                        <div className="space-y-4 text-slate-300">
                            <h3 className="text-lg font-semibold text-white mb-4">מה הנתונים אומרים לראש העיר?</h3>

                            <div className="space-y-4">
                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-2">🔥 אזורים "חמים"</h4>
                                    <p className="text-sm">
                                        שכונות עם הצעות רבות ליחידה מעידות על ביקוש גבוה.
                                        כדאי לשקול הקצאת קרקעות נוספות באזורים אלו.
                                    </p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-2">❄️ מכרזים ללא הצעות</h4>
                                    <p className="text-sm">
                                        מכרזים שלא קיבלו הצעות מצביעים על בעיה - מיקום, מחיר מינימום,
                                        עלויות פיתוח גבוהות, או תנאים לא אטרקטיביים. דורש בחינה.
                                    </p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-2">🏗️ יזמים דומיננטיים</h4>
                                    <p className="text-sm">
                                        יזם שזוכה הרבה באותה עיר = גישה טובה לשוק המקומי.
                                        יכול להיות שותף אסטרטגי לפרויקטים עירוניים.
                                    </p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-2">📉 חריגות מהשומה</h4>
                                    <p className="text-sm">
                                        פערים גדולים מהשומה (בין + ובין -) דורשים תשומת לב.
                                        פער חיובי גדול = הזדמנות שלא נוצלה.
                                        פער שלילי = אולי השומה לא ריאלית.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'developers' && (
                        <div className="space-y-4 text-slate-300">
                            <h3 className="text-lg font-semibold text-white mb-4">על עלויות הפיתוח</h3>

                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                                <h4 className="text-amber-400 font-medium mb-2">⚠️ חשוב להבין</h4>
                                <p className="text-sm">
                                    <strong>עלויות הפיתוח נישאות על ידי היזם הזוכה, לא על ידי העירייה.</strong>
                                </p>
                            </div>

                            <div className="mt-4 space-y-3 text-sm">
                                <p>
                                    כאשר יזם זוכה במכרז, הוא משלם שני סכומים עיקריים:
                                </p>
                                <ol className="list-decimal list-inside space-y-2 mr-4">
                                    <li>
                                        <strong className="text-white">מחיר הקרקע</strong> (מחיר הזכייה) -
                                        משולם לרמ"י
                                    </li>
                                    <li>
                                        <strong className="text-white">עלויות פיתוח</strong> -
                                        משולם לקבלני הפיתוח עבור תשתיות (כבישים, ביוב, חשמל, מים)
                                    </li>
                                </ol>

                                <div className="bg-slate-800/50 rounded-lg p-4 mt-4">
                                    <h4 className="text-white font-medium mb-2">💡 משמעות לעירייה</h4>
                                    <ul className="space-y-1">
                                        <li>• העירייה מקבלת תשתיות חדשות ללא עלות ישירה</li>
                                        <li>• עלויות פיתוח גבוהות = פחות תחרות במכרז</li>
                                        <li>• עלויות פיתוח = השקעה בתשתיות השכונה</li>
                                        <li>• סה"כ עלויות הפיתוח בנתונים: מראה את היקף ההשקעה בתשתיות</li>
                                    </ul>
                                </div>

                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-4">
                                    <h4 className="text-emerald-400 font-medium mb-2">✅ סיכום</h4>
                                    <p>
                                        מכרזי קרקע הם דרך להביא פיתוח לעיר כאשר היזם נושא בעלויות.
                                        ככל שהביקוש גבוה יותר, העיר מקבלת יותר תחרות ומחירים טובים יותר.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function HelpButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            מדריך וסברים
        </button>
    );
}

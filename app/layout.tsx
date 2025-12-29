import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "לוח בקרה למכרזי קרקע | ראש העיר",
    description: "לוח בקרה אנליטי למכרזי קרקע עבור ראשי ערים בישראל",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="he" dir="rtl">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}

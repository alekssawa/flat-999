import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flat 999 — Поиск и фильтр квартир",
  description: "Агрегатор и умный мониторинг квартир на 999.md в Кишинёве",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

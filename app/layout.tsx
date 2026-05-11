import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "МТФ Ясная Поляна",
  description: "Рабочий сайт МТФ Ясная Поляна",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

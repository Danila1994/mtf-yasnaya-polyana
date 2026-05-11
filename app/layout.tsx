import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "МТФ Ясная Поляна — отчетность",
  description: "Единая система отчетности МТФ Ясная Поляна"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales Community AI Dashboard",
  description: "Dashboard bersama Sales Community dengan AI Task & Responsibility Analyzer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

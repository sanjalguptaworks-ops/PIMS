import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIMS - Data Entry",
  description: "Pipeline Integrity Management System - field data entry",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}

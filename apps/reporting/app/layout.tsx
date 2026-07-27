import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIMS - Reporting",
  description: "Pipeline Integrity Management System - progress reporting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}

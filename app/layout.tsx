import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIkinsey — Autonomous AI Workforce for SMEs",
  description: "Seed/Series A Investor Pitch Deck - Transforming SMEs with an Autonomous Workforce of AI Employees",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

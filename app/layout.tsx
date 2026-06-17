import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sandhata Design System",
  description:
    "Everything your team needs to ship consistent, accessible interfaces — components, tokens, and guidelines in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

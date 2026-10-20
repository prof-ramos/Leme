import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import "./globals.css";

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Leme — Quadro",
  description: "Quadro de tarefas na sua máquina.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} ${display.variable} antialiased`}>{children}</body>
    </html>
  );
}

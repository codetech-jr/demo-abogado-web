import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Valles Legal | Asistencia Jurídica",
  description: "Firma Jurídica Premium. Evaluación previa de su caso.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans bg-legal-navy text-legal-parchment antialiased selection:bg-legal-gold scroll-smooth selection:text-legal-navy">
        {children}
      </body>
    </html>
  );
}

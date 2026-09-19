import type { Metadata } from "next";
import { Bodoni_Moda, Archivo } from "next/font/google";
import { LoadingScreen } from "@/components/LoadingScreen";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aaron Zanett Samudra — Frontend Developer",
  description:
    "Frontend Developer focused on turning ideas, designs, and requirements into thoughtful digital experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${archivo.variable} h-full antialiased`}
      // Set in the server HTML so scrolling is locked from the first paint; LoadingScreen removes them.
      data-loading=""
      data-hold-anim=""
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const reglo = localFont({
  src: "../../public/Reglo-Bold.otf",
  variable: "--font-reglo",
  display: "swap",
});

const uncut = localFont({
  src: "../../public/UncutSans-Variable.ttf",
  variable: "--font-uncut",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beauty of Cloud 2.0 | Sri Lanka's Inter-University Cloud Ideathon",
  description:
    "Beauty of Cloud 2.0 is Sri Lanka's first student-led inter-university cloud ideathon — second edition. Register as a delegate, explore sessions, and compete.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${jetbrainsMono.variable} ${reglo.variable} ${uncut.variable} antialiased`}
    >
      <body className="bg-background text-foreground selection:bg-accent selection:text-white">
        <div className="grain"></div>
        <div id="cursor-portal">
          <CustomCursor />
        </div>
        <AuthProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}

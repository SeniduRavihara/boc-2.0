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
  metadataBase: new URL("https://www.beautyofcloud.com"),
  title: "Beauty of Cloud 2.0 | Sri Lanka's Inter-University Cloud Ideathon",
  description:
    "Beauty of Cloud 2.0 is Sri Lanka's first student-led inter-university cloud ideathon — second edition. Register as a delegate, explore sessions, and compete.",
  openGraph: {
    title: "Beauty of Cloud 2.0 | Cloud Ideathon",
    description: "Sri Lanka's first student-led inter-university cloud ideathon. Join the second edition now.",
    url: "https://www.beautyofcloud.com",
    siteName: "Beauty of Cloud 2.0",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Beauty of Cloud 2.0 Social Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty of Cloud 2.0",
    description: "Sri Lanka's first student-led inter-university cloud ideathon.",
    images: ["/og-image.png"],
  },
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

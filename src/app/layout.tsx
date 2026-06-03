import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});



export const metadata: Metadata = {
  metadataBase: new URL("https://www.beautyofcloud.com"),
  title: "Beauty of Cloud 2.0 | Sri Lanka's Inter-University Cloud Ideathon",
  description: "Beauty of Cloud 2.0 is Sri Lanka's first student-led inter-university cloud ideathon — second edition. Register as a delegate, explore sessions, and compete.",
  keywords: [
    "Beauty of Cloud",
    "Beauty of Cloud 2.0",
    "Cloud Ideathon Sri Lanka",
    "Inter-University Cloud Ideathon",
    "IEEE USJ",
    "IEEE Student Branch University of Sri Jayewardenepura",
    "Sri Lanka Cloud Computing",
    "Student Tech Events",
    "Cloud-native Engineers Sri Lanka",
    "Ideathon 2025",
    "Cloud Architecture Competition",
    "IEEE Events Sri Lanka",
    "Tech Innovation Sri Lanka",
    "Cloud Computing Workshops",
    "Student Developers Sri Lanka"
  ],
  authors: [{ name: "BOC Team", url: "https://www.beautyofcloud.com" }],
  category: "technology",
  openGraph: {
    title: "Beauty of Cloud 2.0 | Sri Lanka's Inter-University Cloud Ideathon",
    description: "Join Sri Lanka's first student-led inter-university cloud ideathon. Bridge academic learning and industry infrastructure.",
    url: "https://www.beautyofcloud.com",
    siteName: "Beauty of Cloud 2.0",
    images: [
      {
        url: "/open-graph.webp",
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
    title: "Beauty of Cloud 2.0 | Cloud Ideathon",
    description: "Sri Lanka's first student-led inter-university cloud ideathon. Empowering the next generation of cloud engineers.",
    images: ["/open-graph.webp"],
    creator: "@beautyofcloud",
  },
  alternates: {
    canonical: "https://www.beautyofcloud.com",
  },
};

const reglo = localFont({
  src: "../../public/Reglo-Bold.otf",
  variable: "--font-reglo",
});

const uncut = localFont({
  src: "../../public/UncutSans-Variable.ttf",
  variable: "--font-uncut",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${reglo.variable} ${uncut.variable} antialiased`}
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

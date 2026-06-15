import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CarbonProvider } from "@/context/CarbonContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OnboardingModal } from "@/components/layout/OnboardingModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carbon Tracker — Track & Reduce Your Carbon Footprint",
  description:
    "A smart assistant that helps you understand, track, and reduce your personal carbon footprint through activity logging, AI-driven insights, interactive visualizations, and gamified challenges.",
  keywords: ["carbon footprint", "sustainability", "CO2 tracker", "emissions", "climate action"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CarbonProvider>
            <OnboardingModal />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
          </CarbonProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

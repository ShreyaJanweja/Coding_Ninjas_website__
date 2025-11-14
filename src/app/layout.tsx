import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { LenisProvider } from "@/providers/LenisProvider";
import { SkipToContent } from "@/components/shared/SkipToContent";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { GuidedTourOverlay } from "@/components/guided-tour/GuidedTourOverlay";
import { DynamicBackground } from "@/components/global/DynamicBackground";
import { CustomCursor } from "@/components/global/CustomCursor";
import {
  eventsJsonLd,
  getDefaultMetadata,
  jsonLd,
  organizationJsonLd,
} from "@/lib/seo";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = getDefaultMetadata();

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${inter.variable} bg-background text-foreground antialiased`}
      >
        <DynamicBackground />
        <CustomCursor />
        <SkipToContent />
        <LenisProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 pt-32">
              {children}
            </main>
            <Footer />
            <GuidedTourOverlay />
            <CookieConsent />
          </div>
        </LenisProvider>
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {jsonLd(organizationJsonLd)}
        </Script>
        <Script
          id="events-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {jsonLd(eventsJsonLd)}
        </Script>
      </body>
    </html>
  );
}

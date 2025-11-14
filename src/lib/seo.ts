import type { Metadata } from "next";
import { upcomingEvents } from "@/data/club";

const defaultUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://codingninjaschitkara.com";

export const siteConfig = {
  name: "Coding Ninjas — Coding Ninjas",
  shortName: "Coding Ninjas",
  description:
    "Coding Ninjas Chitkara is the Coding Ninjas for builders, designers, and innovators. We craft production-grade experiences, host high-impact events, and mentor the next generation of makers.",
  url: defaultUrl,
  ogImage: `${defaultUrl}/api/og`,
  contactEmail: "Cn.cuiet@chitkara.edu.in",
  social: {
    instagram: "https://instagram.com/codingninjas_chitkara",
    youtube: "https://youtube.com/@codingninjaschitkara",
    github: "https://github.com/CodingNinjas-Chitkara",
  },
};

export const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export const getDefaultMetadata = (): Metadata => ({
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s • ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  keywords: [
    "Coding Ninjas",
    "Chitkara University",
    "Developer Club",
    "Hackathon",
    "Community",
    "Tech Events",
  ],
  authors: [{ name: "Coding Ninjas Chitkara" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "technology",
});

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  alternateName: "Coding Ninjas Club Chitkara University",
  url: siteConfig.url,
  logo: `${siteConfig.url}/favicon.ico`,
  description: siteConfig.description,
  email: siteConfig.contactEmail,
  sameAs: Object.values(siteConfig.social),
  location: {
    "@type": "Campus",
    name: "Chitkara University",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Chandigarh-Patiala National Highway",
      addressLocality: "Rajpura",
      addressRegion: "Punjab",
      postalCode: "140401",
      addressCountry: "IN",
    },
  },
  foundingDate: "2016",
  member: {
    "@type": "OrganizationRole",
    member: {
      "@type": "Organization",
      name: "Coding Ninjas",
    },
    roleName: "Campus Club",
  },
};

export const eventsJsonLd = upcomingEvents.map((event) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: event.name,
  startDate: event.startDate,
  endDate: event.endDate,
  url: event.url,
  eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: event.location.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: event.location.address,
      addressCountry: "IN",
    },
  },
  organizer: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
  description: event.description,
}));

export const jsonLd = (
  data: Record<string, unknown> | Record<string, unknown>[],
) => JSON.stringify(data, null, 2);

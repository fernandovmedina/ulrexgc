import type { Metadata } from "next";
import "./globals.css";
import logoIcon from "./logo_icon_with_transparent_background.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://ulrexgc.com"),
  title: {
    default: "Ulrex General Contracting | Building Excellence",
    template: "%s | Ulrex General Contracting",
  },
  description: "Premium residential remodeling, commercial construction, roofing, exterior restoration, custom work, and painting delivered with disciplined craftsmanship.",
  keywords: ["general contractor", "residential remodeling", "commercial construction", "roofing contractor", "exterior restoration", "residential painting"],
  icons: {
    icon: [{ url: logoIcon.src, type: "image/png" }],
    shortcut: [{ url: logoIcon.src, type: "image/png" }],
    apple: [{ url: logoIcon.src, type: "image/png" }],
  },
  openGraph: {
    title: "Ulrex General Contracting",
    description: "Building. Innovating. Excellence.",
    type: "website",
    images: [{ url: "/logo_with_blue_background.jpeg", width: 1408, height: 768, alt: "Ulrex General Contracting" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

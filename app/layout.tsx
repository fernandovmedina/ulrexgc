import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ulrickelitegc.com"),
  title: {
    default: "Ulrick Elite General Contracting | Building Excellence",
    template: "%s | Ulrick Elite General Contracting",
  },
  description: "Premium residential remodeling, commercial construction, roofing, exterior restoration, custom work, and painting delivered with disciplined craftsmanship.",
  keywords: ["general contractor", "residential remodeling", "commercial construction", "roofing contractor", "exterior restoration", "residential painting"],
  openGraph: {
    title: "Ulrick Elite General Contracting",
    description: "Building. Innovating. Excellence.",
    type: "website",
    images: [{ url: "/logo_with_blue_background.jpeg", width: 1408, height: 768, alt: "Ulrick Elite General Contracting" }],
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

import type { Metadata, Viewport } from "next";
import { Dancing_Script, Lato } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SwRegister } from "@/components/pwa/sw-register";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Toaster } from "sonner";

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const viewport: Viewport = {
  themeColor: "#7a5c2e",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export const metadata: Metadata = {
  title: "Pizza L'Escapade",
  description:
    "Pizzeria artisanale, pâte maison et ingrédients frais, dans une ambiance guinguette nature. Commandez en ligne ou appelez le 07 80 98 81 77.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "L'Escapade",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${dancingScript.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthGuard>
          <Navbar />
          <CartDrawer />
          {children}
          <Toaster richColors position="top-center" />
        </AuthGuard>
        <SwRegister />
      </body>
    </html>
  );
}

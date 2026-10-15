import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { businessConfig } from "@/lib/businessConfig";

export const metadata: Metadata = {
  title: `${businessConfig.name} | ${businessConfig.slogan}`,
  description: `Discover delicious Ghanaian favourites, freshly charcoal-grilled tilapia, rice meals, and refreshing drinks at ${businessConfig.name}, located at ${businessConfig.location}.`,
  openGraph: {
    title: `${businessConfig.name} — ${businessConfig.slogan}`,
    description: `Authentic Ghanaian dishes, fresh grilled food, and chilled pub drinks at ${businessConfig.location}.`,
    type: "website",
    locale: "en_GH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans antialiased text-brand-charcoal bg-[#FDFCF9]">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

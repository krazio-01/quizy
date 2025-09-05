import type { Metadata } from "next";
import Header from "@/components/layout/header/Header";
import { Toaster } from "sonner";
import Footer from "@/components/layout/footer/Footer";
import NextAuthProvider from "@/providers/SessionProvider";
import Script from "next/script";
import "./globals.scss";

export const metadata: Metadata = {
    title: "League Of Logic",
    description: "A platform for your growth!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <NextAuthProvider>
                    <Header />
                    {children}
                    <Toaster
                        position="top-center"
                        visibleToasts={2}
                        expand={true}
                        richColors
                        duration={4000}
                    />
                    <Footer />
                </NextAuthProvider>

                <Script
                    src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
                    strategy="lazyOnload"
                />
            </body>
        </html>
    );
}

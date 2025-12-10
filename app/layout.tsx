import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ActiveStatus from "@/components/ActiveStatus";

const inter = Inter({
    subsets: ["latin"]
})

export const metadata: Metadata = {
    title: "Next Chat App",
    description: "Realtime Chat App with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} antialiased h-screen`}
            >
                <ActiveStatus />
                {children}
                <Toaster position="top-right" richColors theme="light"/>
            </body>
        </html>
    );
}

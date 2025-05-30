// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/header";
import { UserProvider } from "@/context/user-context";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";  // ← импортируем Script

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sports Prediction App",
  description: "Make predictions on sports events and compare with other analysts",
  generator: 'v0.dev'
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeCookie = cookies().get("theme")?.value as
    | "light"
    | "dark"
    | "system"
    | undefined;

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        {/* 1) Подгружаем скрипт библиотеки */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-743840970"
          strategy="afterInteractive"
        />
        {/* 2) Инициализируем gtag */}
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'AW-743840970', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="light"
          forcedTheme={themeCookie}
        >
          <UserProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 container mx-auto py-6 px-4">
                {children}
              </main>
              <footer className="py-6 border-t">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Sports Prediction App
                </div>
              </footer>
            </div>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

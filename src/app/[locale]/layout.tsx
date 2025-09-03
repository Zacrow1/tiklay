import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const locales = ['es', 'en'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Tiklay - Gestión de Academia",
  description: "Sistema de gestión integral para academias y estudios de yoga, pilates y actividades físicas",
  keywords: ["Tiklay", "gestión", "academia", "yoga", "pilates", "clases", "estudiantes"],
  authors: [{ name: "Tiklay Team" }],
  openGraph: {
    title: "Tiklay - Gestión de Academia",
    description: "Sistema de gestión integral para academias y estudios",
    url: "https://tiklay.com",
    siteName: "Tiklay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiklay - Gestión de Academia",
    description: "Sistema de gestión integral para academias y estudios",
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
'use client';

import "./globals.css";
import React from 'react';
import type { ReactNode } from 'react';
import AppShell from '../components/layout/AppShell';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`app-background ${inter.className}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}


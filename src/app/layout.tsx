"use client";

import { Outfit } from 'next/font/google';
import './globals.css';
import { Provider } from "react-redux";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import  { Toaster } from 'react-hot-toast';
import { store } from '@/store/store';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}> 
        <ThemeProvider>
          <SidebarProvider>
            <Provider store={store}>{children}</Provider>
             <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

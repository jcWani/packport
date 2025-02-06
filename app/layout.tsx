import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Nav from "@/components/navigation/nav";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s / Packport",
    default: "Welcome / Packport",
  },
  description: "Provides you with best quality bags",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex-grow px-6 md:px-12 mx-auto max-w-8xl">
            <Nav />
            {children}
            <Toaster position="top-center" richColors />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

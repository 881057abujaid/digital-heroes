import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Digital Heroes — Golf Performance, Charity & Monthly Prize Draws",
  description:
    "Track your Stableford golf scores, support verified charities, and compete in monthly cash prize draws on the Digital Heroes platform.",
  keywords: [
    "golf",
    "stableford",
    "charity",
    "prize draw",
    "golf performance",
    "sports impact",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080B11] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
        <ReduxProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

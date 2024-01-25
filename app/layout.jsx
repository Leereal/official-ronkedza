import { Roboto } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: "%s | " + siteConfig.name,
  },
  description: siteConfig.description || "",
  icons: [{ url: "/images/logo.png", href: "/images/logo.png" }],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={roboto.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

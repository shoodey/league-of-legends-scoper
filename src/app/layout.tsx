import dynamic from "next/dynamic";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "~/components/footer";
import { ThemeProvider } from "~/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

const StoreLoaded = dynamic(() => import("../components/store-loaded"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1 space-y-4 p-8 pt-6 flex flex-col min-h-full">
              <StoreLoaded>{children}</StoreLoaded>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

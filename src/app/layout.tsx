import dynamic from "next/dynamic";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "~/components/footer";
import { ThemeProvider } from "~/components/theme-provider";
import { cn } from "~/lib/utils";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const StoreLoaded = dynamic(() => import("../components/store-loaded"), {
  ssr: false,
});
const QueryClientProvider = dynamic(
  () => import("../components/query-provider"),
  {
    ssr: false,
  }
);
const UserNav = dynamic(() => import("../components/user-nav"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryClientProvider>
            <div className="flex min-h-screen flex-col">
              <UserNav />
              <main className="flex-1 space-y-4 p-8 pt-6 flex flex-col min-h-full">
                <StoreLoaded>{children}</StoreLoaded>
              </main>
              <Footer />
            </div>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

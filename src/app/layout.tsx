import Navbar from "./components/Navbar";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        <Providers>
          <Navbar />
          {children}
          </Providers>
      </body>
    </html>
  );
}

import { Sora, Manrope } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-sora" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-manrope" });

export const metadata = {
  title: "Sunvault Solar | Solar & battery backup in Gauteng",
  description: "Solar panels, inverters and lithium batteries installed in one day. Keep the lights on through loadshedding.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-ZA" className={`${sora.variable} ${manrope.variable}`}>
      <body>
        <noscript><style>{`.preloader{display:none}`}</style></noscript>
        {children}
      </body>
    </html>
  );
}

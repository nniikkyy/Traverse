import { Nunito_Sans, Sora } from "next/font/google";
import "./globals.css";

const nunito = Nunito_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-body"
});

const sora = Sora({
    subsets: ["latin"],
    weight: ["500", "700", "800"],
    variable: "--font-head"
});

export const metadata = {
    title: "Traverse | Explore with Locals + AI Plans",
    description: "A host community platform where tourists match with local hosts and generate AI category-based itineraries."
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${nunito.variable} ${sora.variable}`}>{children}</body>
        </html>
    );
}

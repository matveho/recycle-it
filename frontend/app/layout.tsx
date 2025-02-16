import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
    title: "Recycle-it - AI-Powered Smart Recycling",
    description:
        "Recycle-it is an AI-powered recycling assistant developed by students at the University of Alberta. Snap a photo, get instant sorting guidance, and recycle with confidence. Just recycle it!",
    metadataBase: new URL("https://recycle.uara.ca"),
    openGraph: {
        title: "Recycle-it - Smart AI Recycling Assistant",
        description:
            "Not sure where your waste goes? Recycle-it helps you identify and sort recyclables with AI. Just recycle it!",
        url: "https://recycle.uara.ca",
        images: [
            {
                url: "/assets/Icon.png",
                width: 1200,
                height: 1200,
                alt: "Recycle-it Logo - AI Recycling Assistant",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Recycle-it - AI-Powered Smart Recycling",
        description:
            "Recycle smarter with Recycle-it! Developed by University of Alberta students, this AI tool helps you sort recyclables instantly. Just recycle it!",
        images: ["/assets/recycle-it-logo.png"],
    },
    alternates: {
        canonical: "https://recycle.uara.ca",
        languages: {
            "en-US": "https://recycle.uara.ca/",
        },
    },
};


export default function RootLayout({
   children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96"/>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
            <link rel="shortcut icon" href="/favicon.ico"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
        </head>
        <body className="antialiased">
        {children}
        <Analytics/>
        </body>
        </html>
    );
}

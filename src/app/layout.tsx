import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/providers/WalletProvider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'VaultAI: Decentralized AI-Powered Personal Vault',
  description: 'Your secure, private, and intelligent personal vault.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <WalletProvider>
          {children}
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}

import { ShieldCheck } from 'lucide-react';
import { WalletConnect } from '@/components/WalletConnect';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <ShieldCheck className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-lg font-bold tracking-tight">VaultAI</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { NoteInput } from '@/components/NoteInput';
import { VaultHistory } from '@/components/VaultHistory';
import { AskVault } from '@/components/AskVault';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/providers/WalletProvider';
import type { VaultEntry } from '@/types';
import { History, Search } from 'lucide-react';

export default function Home() {
  const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>([]);
  const { isConnected, walletAddress } = useWallet();

  useEffect(() => {
    if (isConnected && walletAddress) {
      // Mock fetching initial data. In a real app, this would be an API call.
      const mockEntries: VaultEntry[] = [
          { id: '1', note: 'This is a secret note about Project Phoenix.', summary: 'A note regarding Project Phoenix.', tags: ['project', 'secret'], ipfsCid: 'QmYqA...3d5E', txHash: '0xabc...def', timestamp: Date.now() - 86400000 * 2 },
          { id: '2', note: 'Financial plan for Q3 2024.', summary: 'Third quarter financial planning for 2024.', tags: ['finance', 'planning', 'Q3'], ipfsCid: 'QmXvB...9g8H', txHash: '0xdef...abc', timestamp: Date.now() - 172800000 * 2 },
      ];
      setVaultEntries(mockEntries);
    } else {
      setVaultEntries([]);
    }
  }, [isConnected, walletAddress]);

  const handleNoteAdded = (newNote: VaultEntry) => {
    setVaultEntries(prev => [newNote, ...prev]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-secondary/40">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 h-full">
          
          <div className="lg:col-span-3 h-full">
            <NoteInput onNoteAdded={handleNoteAdded} />
          </div>

          <div className="lg:col-span-2 h-full">
            <Tabs defaultValue="history" className="flex flex-col h-full bg-card rounded-xl shadow-sm">
                <div className="p-4 border-b">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="history">
                            <History className="mr-2 h-4 w-4" />
                            Vault History
                        </TabsTrigger>
                        <TabsTrigger value="ask">
                            <Search className="mr-2 h-4 w-4" />
                            Ask Vault
                        </TabsTrigger>
                    </TabsList>
                </div>
              <TabsContent value="history" className="flex-grow mt-0 p-4">
                  <VaultHistory entries={vaultEntries} />
              </TabsContent>
              <TabsContent value="ask" className="flex-grow mt-0 p-4">
                  <AskVault entries={vaultEntries} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

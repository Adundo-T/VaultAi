"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/providers/WalletProvider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { History, Loader2 } from 'lucide-react';
import type { VaultEntry } from '@/types';

interface VaultHistoryProps {
  entries: VaultEntry[];
}

export function VaultHistory({ entries }: VaultHistoryProps) {
    const { isConnected } = useWallet();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500); // Simulate initial load time
        return () => clearTimeout(timer);
    }, []);

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <History className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Connect your wallet</h3>
                <p className="text-sm text-muted-foreground">Your vault history will appear here once you are connected.</p>
            </div>
        );
    }
    
    if (isLoading) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mb-4" />
                <h3 className="text-lg font-semibold">Loading Vault...</h3>
            </div>
        )
    }

    return (
        <div className="space-y-4 h-full overflow-y-auto pr-2">
            {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <History className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No entries yet</h3>
                    <p className="text-sm text-muted-foreground">Create your first note to see it here.</p>
                </div>
            ) : (
                <Accordion type="single" collapsible className="w-full">
                    {entries.map((entry) => (
                        <AccordionItem value={entry.id} key={entry.id} className="bg-secondary/50 border rounded-lg mb-2 shadow-sm">
                            <AccordionTrigger className="px-4 hover:no-underline">
                                <div className="flex-1 text-left">
                                    <p className="font-medium text-sm truncate">{entry.summary}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 space-y-3">
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.note}</p>
                                <div className="flex flex-wrap gap-2">
                                    {entry.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                </div>
                                <div className="text-xs text-muted-foreground pt-2 border-t mt-3 flex flex-col gap-1">
                                    <p className="truncate"><strong>IPFS CID:</strong> {entry.ipfsCid}</p>
                                    <p className="truncate"><strong>TX Hash:</strong> {entry.txHash}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}

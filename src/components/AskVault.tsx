"use client";

import { useState } from 'react';
import { useWallet } from '@/providers/WalletProvider';
import { retrieveNotes } from '@/ai/flows/retrieve-notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { VaultEntry } from '@/types';

interface AskVaultProps {
    entries: VaultEntry[];
}

export function AskVault({ entries }: AskVaultProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isConnected } = useWallet();
    const { toast } = useToast();

    const handleSearch = async () => {
        if (!query.trim()) {
            toast({ title: "Query is empty", description: "Please enter a search query.", variant: "destructive" });
            return;
        }
        if (!isConnected || entries.length === 0) {
            toast({ title: "Nothing to search", description: "Connect your wallet and add notes to your vault first.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setResults([]);

        try {
            const summaries = entries.map(e => e.summary);
            const response = await retrieveNotes({ query, summaries });
            setResults(response.relevantNotes);
        } catch (error) {
            console.error("AI retrieval failed:", error);
            toast({ title: "AI Error", description: "Failed to search your notes.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Connect to Ask</h3>
                <p className="text-sm text-muted-foreground">Connect your wallet to use the AI-powered search on your vault.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-1">
            <div className="flex-shrink-0 mb-4">
                 <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex w-full items-center space-x-2">
                    <Input 
                        type="text" 
                        placeholder="e.g., 'What about my finance plan?'"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
           
            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {isLoading && results.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
                        <Sparkles className="h-10 w-10 mb-4 animate-pulse" />
                        <p className="text-sm">AI is searching your vault...</p>
                    </div>
                )}
                
                {!isLoading && results.length > 0 && (
                    <>
                        <h4 className="text-sm font-semibold">Relevant Notes:</h4>
                        {results.map((summary, index) => (
                            <div key={index} className="p-3 rounded-lg border bg-secondary/50 shadow-sm">
                                <p className="text-sm">{summary}</p>
                            </div>
                        ))}
                    </>
                )}

                {!isLoading && !query && (
                     <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">Ask Your Vault</h3>
                        <p className="text-sm text-muted-foreground">Use natural language to find anything you've stored.</p>
                    </div>
                )}

                 {!isLoading && query && results.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <h3 className="text-lg font-semibold">No results found</h3>
                        <p className="text-sm text-muted-foreground">Try a different search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

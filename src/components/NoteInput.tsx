"use client";

import { useState } from 'react';
import { sha256, storeEntry } from '@/lib/web3';
import { uploadToIpfs } from '@/lib/ipfs';
import { useWallet } from '@/providers/WalletProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, Lock } from 'lucide-react';
import type { VaultEntry } from '@/types';

interface NoteInputProps {
  onNoteAdded: (newNote: VaultEntry) => void;
}

export function NoteInput({ onNoteAdded }: NoteInputProps) {
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!note.trim()) {
      toast({ title: "Note is empty", description: "Please write something in your note before summarizing.", variant: "destructive" });
      return;
    }
    setIsSummarizing(true);
    try {
      setSummary("Summary feature disabled.");
      setTags([]);
    } catch (error) {
      console.error("AI summarization failed:", error);
      toast({ title: "AI Error", description: "Failed to summarize the note.", variant: "destructive" });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleUpload = async () => {
    if (!isConnected) {
        toast({ title: "Wallet not connected", description: "Please connect your wallet to upload your note.", variant: "destructive" });
        connectWallet();
        return;
    }
    if (!summary) {
        toast({ title: "No Summary", description: "Please summarize your note before uploading.", variant: "destructive" });
        return;
    }

    setIsUploading(true);
    try {
        const encryptedNote = note; // Placeholder for actual encryption
        const noteHash = await sha256(encryptedNote);
        const ipfsCid = await uploadToIpfs(JSON.stringify({ note: encryptedNote, summary, tags }));
        const txHash = await storeEntry(noteHash, ipfsCid);

        const newEntry: VaultEntry = {
            id: txHash,
            note,
            summary,
            tags,
            ipfsCid,
            txHash,
            timestamp: Date.now(),
        };

        onNoteAdded(newEntry);
        toast({ title: "Success!", description: "Your note has been securely saved to your vault." });

        // Reset state
        setNote('');
        setSummary('');
        setTags([]);

    } catch (error) {
        console.error("Upload failed:", error);
        toast({ title: "Upload Failed", description: "There was an error saving your note.", variant: "destructive" });
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Create a New Vault Entry</CardTitle>
        <CardDescription>Write your private note below. Only you can access your entries.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          placeholder="Write your secret note here... it will be encrypted and stored securely."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-grow min-h-[150px] text-base"
        />
        <div className="flex justify-end">
            <Button onClick={handleSummarize} disabled={isSummarizing || !note.trim()}>
                {isSummarizing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Summarize with AI
            </Button>
        </div>
        {summary && (
            <div className="space-y-4 rounded-lg border bg-secondary/50 p-4">
                <h3 className="font-semibold text-sm">AI Summary</h3>
                <p className="text-sm text-muted-foreground">{summary}</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>End-to-end encrypted</span>
            </div>
            <Button onClick={handleUpload} disabled={isUploading || !summary || !isConnected} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Send className="mr-2 h-4 w-4" />
                )}
                Upload to Vault
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

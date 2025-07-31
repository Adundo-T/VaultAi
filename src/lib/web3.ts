// Mock Web3/blockchain functionality

export async function connectWallet(): Promise<string> {
  console.log("Connecting wallet (mock)...");
  await new Promise(resolve => setTimeout(resolve, 500));
  const fakeAddress = "0x" + Array.from({ length: 40 }, () => "0123456789abcdef".charAt(Math.floor(Math.random() * 16))).join('');
  console.log("Wallet connected (mock):", fakeAddress);
  return fakeAddress;
}

export async function sha256(text: string): Promise<string> {
    const textAsBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `0x${hash}`;
}


export async function storeEntry(noteHash: string, ipfsCid: string): Promise<string> {
  console.log("Storing entry on blockchain (mock)...");
  console.log("Note Hash:", noteHash);
  console.log("IPFS CID:", ipfsCid);
  await new Promise(resolve => setTimeout(resolve, 2000));
  const fakeTxHash = "0x" + Array.from({ length: 64 }, () => "0123456789abcdef".charAt(Math.floor(Math.random() * 16))).join('');
  console.log("Blockchain transaction successful (mock). TxHash:", fakeTxHash);
  return fakeTxHash;
}

export async function getEntriesByOwner(address: string): Promise<any[]> {
    console.log(`Getting entries for owner ${address} (mock)...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Returning a hardcoded list for demo purposes
    return [
        {
            noteHash: '0x123abc...',
            ipfsCID: 'QmFoo...',
            summary: 'Summary of a past note about investment strategies.'
        },
        {
            noteHash: '0x456def...',
            ipfsCID: 'QmBar...',
            summary: 'A detailed plan for a side project discussed last month.'
        }
    ];
}

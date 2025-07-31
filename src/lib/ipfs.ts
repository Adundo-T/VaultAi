// Mock IPFS upload functionality

export async function uploadToIpfs(data: string): Promise<string> {
  console.log("Uploading to IPFS (mock):", data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return a fake IPFS CID
  const fakeCid = "Qm" + Array.from({ length: 44 }, () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 62))).join('');
  console.log("IPFS upload successful (mock). CID:", fakeCid);
  return fakeCid;
}

export interface VaultEntry {
  id: string;
  note: string;
  summary: string;
  tags: string[];
  ipfsCid: string;
  txHash: string;
  timestamp: number;
}

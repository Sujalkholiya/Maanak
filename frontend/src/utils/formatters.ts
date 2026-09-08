export function truncateHash(hash: string, frontChars = 8, backChars = 6): string {
  if (!hash || hash.length <= frontChars + backChars) return hash;
  return `${hash.slice(0, frontChars)}...${hash.slice(-backChars)}`;
}

export function formatDate(dateString: string): string {
  return dateString;
}

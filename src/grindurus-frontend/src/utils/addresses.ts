export function shortenAddress(addressStr: string): string {
  if (!addressStr || addressStr.length < 8) {
    throw new Error('Invalid address');
  }
  return addressStr.slice(0, 6) + "..." + addressStr.slice(-4);
}
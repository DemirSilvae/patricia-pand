export function shortenAddress(addressStr: string, totalLength: number = 13): string {
  if (!addressStr || addressStr.length < 8) {
    throw new Error('Invalid address');
  }
  if (totalLength < 9 || totalLength >= addressStr.length) {
    return addressStr;
  }

  const ellipsis = "...";
  const charsToShow = totalLength - ellipsis.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return addressStr.slice(0, frontChars) + ellipsis + addressStr.slice(-backChars);
}
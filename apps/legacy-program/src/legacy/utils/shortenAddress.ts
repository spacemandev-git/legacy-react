export function shortenAddress(address: string) {
  if (!address || address?.length <= 10) {
    return address;
  }
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function calculateExpiryDate(days: number = 7): string {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const expiryDate = new Date(Date.now() + days * millisecondsPerDay);
  return expiryDate.toUTCString();
}

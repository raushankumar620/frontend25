export function formatPhoneNumber(phone: string): string {
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (!cleaned) return phone;
  
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return `+${cleaned}`;
}

export function maskPhoneNumber(phone: string): string {
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length < 6) return phone;
  return `+${cleaned.slice(0, 3)} •••• ${cleaned.slice(-4)}`;
}

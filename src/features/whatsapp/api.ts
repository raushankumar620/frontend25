import { whatsappService } from '../../services/whatsappService';
import type { WhatsAppPhoneNumber } from './types';

export const whatsappApi = {
  getNumbers: () => whatsappService.getNumbers(),
  getNumberById: async (id: string): Promise<WhatsAppPhoneNumber | undefined> => {
    const numbers = await whatsappService.getNumbers();
    return numbers.find((n) => n.id === id);
  },
};

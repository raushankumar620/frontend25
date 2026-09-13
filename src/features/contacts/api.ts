import { whatsappService } from '../../services/whatsappService';
import type { Contact } from './types';

export const contactsApi = {
  getContacts: () => whatsappService.getContacts(),
  getContactById: async (id: string): Promise<Contact | undefined> => {
    const contacts = await whatsappService.getContacts();
    return contacts.find((c) => c.id === id);
  },
};

import { whatsappService } from '../../services/whatsappService';

export const inboxApi = {
  getConversations: () => whatsappService.getConversations(),
  getContacts: () => whatsappService.getContacts(),
};

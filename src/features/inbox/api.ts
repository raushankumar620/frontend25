import { conversationService } from '../../services/conversationService';
import { contactService } from '../../services/contactService';

export const inboxApi = {
  getConversations: async () => {
    const res = await conversationService.listConversations();
    return res.conversations || [];
  },
  getContacts: async () => {
    const res = await contactService.listContacts();
    return res.contacts || [];
  },
};

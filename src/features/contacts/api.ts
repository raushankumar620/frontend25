import { contactService } from '../../services/contactService';
import type { Contact } from './types';

export const contactsApi = {
  getContacts: async (): Promise<Contact[]> => {
    const res = await contactService.listContacts();
    return res.contacts;
  },
  getContactById: async (id: string): Promise<Contact | undefined> => {
    return contactService.getContactById(id);
  },
  createContact: contactService.createContact,
  updateContact: contactService.updateContact,
  deleteContact: contactService.deleteContact,
  bulkImport: contactService.bulkImport,
  exportContacts: contactService.exportContacts,
  toggleOptStatus: contactService.toggleOptStatus,
  getTagsSummary: contactService.getTagsSummary,
};

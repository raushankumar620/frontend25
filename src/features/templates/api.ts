import { templateService, type CreateTemplatePayload } from '../../services/templateService';
import type { WhatsAppTemplate } from './types';

export const templatesApi = {
  getTemplates: async (params?: { category?: string; status?: string; search?: string }): Promise<WhatsAppTemplate[]> => {
    try {
      const res = await templateService.getTemplates(params);
      return res.templates || [];
    } catch (error) {
      console.error('Failed to fetch templates from backend:', error);
      return [];
    }
  },

  getTemplateById: async (id: string): Promise<WhatsAppTemplate | undefined> => {
    try {
      const template = await templateService.getTemplateById(id);
      return template || undefined;
    } catch (error) {
      console.error('Failed to fetch template by ID:', error);
      return undefined;
    }
  },

  createTemplate: async (payload: CreateTemplatePayload): Promise<WhatsAppTemplate> => {
    return templateService.createTemplate(payload);
  },

  syncTemplates: async () => {
    return templateService.syncWithMeta();
  },

  deleteTemplate: async (id: string): Promise<boolean> => {
    return templateService.deleteTemplate(id);
  },

  previewTemplate: async (id: string, variables: { body?: string[]; header?: string[] }) => {
    return templateService.previewTemplate(id, variables);
  },
};

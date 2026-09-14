import { templateService, type CreateTemplatePayload } from '../../services/templateService';
import type { WhatsAppTemplate } from './types';
import { MOCK_TEMPLATES } from '../../services/whatsappService';

export const templatesApi = {
  getTemplates: async (params?: { category?: string; status?: string; search?: string }): Promise<WhatsAppTemplate[]> => {
    try {
      const res = await templateService.getTemplates(params);
      if (res.templates.length > 0) {
        return res.templates;
      }
    } catch {
      // Fall back to mock if backend is unreachable
    }
    return MOCK_TEMPLATES;
  },

  getTemplateById: async (id: string): Promise<WhatsAppTemplate | undefined> => {
    try {
      const template = await templateService.getTemplateById(id);
      if (template) return template;
    } catch {
      // Fallback
    }
    const fallback = MOCK_TEMPLATES.find((t) => t.id === id);
    return fallback;
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

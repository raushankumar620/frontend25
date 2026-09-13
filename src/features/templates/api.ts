import { whatsappService } from '../../services/whatsappService';
import type { WhatsAppTemplate } from './types';

export const templatesApi = {
  getTemplates: () => whatsappService.getTemplates(),
  getTemplateById: async (id: string): Promise<WhatsAppTemplate | undefined> => {
    const templates = await whatsappService.getTemplates();
    return templates.find((t) => t.id === id);
  },
  createTemplate: async (template: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate> => {
    await new Promise((res) => setTimeout(res, 800));
    return {
      id: 'tpl_' + Date.now(),
      name: template.name || 'new_template',
      category: template.category || 'MARKETING',
      language: template.language || 'en_US',
      status: 'APPROVED',
      body: template.body || '',
      header: template.header,
      footer: template.footer,
      buttons: template.buttons,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};

import { apiClient } from './apiClient';
import type { WhatsAppTemplate } from '../types/whatsapp';

export interface CreateTemplatePayload {
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  header?: {
    type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    text?: string;
  };
  body: string;
  footer?: string;
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phoneNumber?: string;
  }>;
}

export interface SyncResponse {
  syncedCount: number;
  errors?: string[];
}

export interface PreviewResponse {
  header?: { format?: string; text?: string };
  body: string;
  footer?: string;
  buttons?: any[];
}

function normalizeTemplate(raw: any): WhatsAppTemplate {
  if (!raw) return raw;

  // Extract from components if present
  let header: WhatsAppTemplate['header'] | undefined;
  let body = raw.body || '';
  let footer: string | undefined = raw.footer;
  let buttons: WhatsAppTemplate['buttons'] | undefined = raw.buttons;

  if (Array.isArray(raw.components)) {
    const headerComp = raw.components.find((c: any) => c.type === 'HEADER');
    if (headerComp) {
      header = {
        type: headerComp.format || 'TEXT',
        text: headerComp.text,
      };
    }

    const bodyComp = raw.components.find((c: any) => c.type === 'BODY');
    if (bodyComp && bodyComp.text) {
      body = bodyComp.text;
    }

    const footerComp = raw.components.find((c: any) => c.type === 'FOOTER');
    if (footerComp && footerComp.text) {
      footer = footerComp.text;
    }

    const buttonComp = raw.components.find((c: any) => c.type === 'BUTTONS');
    if (buttonComp && Array.isArray(buttonComp.buttons)) {
      buttons = buttonComp.buttons.map((b: any) => ({
        type: b.type,
        text: b.text,
        url: b.url,
        phoneNumber: b.phone_number || b.phoneNumber,
      }));
    }
  }

  return {
    id: raw.id || raw._id,
    name: raw.name,
    category: raw.category,
    language: raw.language || 'en_US',
    status: raw.status || 'PENDING',
    header,
    body,
    footer,
    buttons,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export const templateService = {
  async getTemplates(params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ templates: WhatsAppTemplate[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'ALL') query.set('category', params.category);
    if (params?.status && params.status !== 'ALL') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    const endpoint = `/templates${qs ? `?${qs}` : ''}`;

    const res = await apiClient.get<any>(endpoint);
    if (res.success && res.data) {
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.templates)
        ? res.data.templates
        : [];
      const total = res.data.pagination?.total ?? list.length;
      return {
        templates: list.map(normalizeTemplate),
        total,
      };
    }
    return { templates: [], total: 0 };
  },

  async getTemplateById(id: string): Promise<WhatsAppTemplate | null> {
    const res = await apiClient.get<any>(`/templates/${id}`);
    if (res.success && res.data) {
      return normalizeTemplate(res.data);
    }
    return null;
  },

  async createTemplate(payload: CreateTemplatePayload): Promise<WhatsAppTemplate> {
    // Transform to Meta components format expected by backend
    const components: any[] = [];

    if (payload.header && payload.header.text) {
      components.push({
        type: 'HEADER',
        format: payload.header.type || 'TEXT',
        text: payload.header.text,
      });
    }

    if (payload.body) {
      components.push({
        type: 'BODY',
        text: payload.body,
      });
    }

    if (payload.footer) {
      components.push({
        type: 'FOOTER',
        text: payload.footer,
      });
    }

    if (payload.buttons && payload.buttons.length > 0) {
      components.push({
        type: 'BUTTONS',
        buttons: payload.buttons.map((b) => ({
          type: b.type,
          text: b.text,
          url: b.url,
          phone_number: b.phoneNumber,
        })),
      });
    }

    const res = await apiClient.post<any>('/templates', {
      name: payload.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      category: payload.category,
      language: payload.language || 'en_US',
      components,
    });

    if (res.success && res.data) {
      return normalizeTemplate(res.data);
    }
    throw new Error(res.message || 'Failed to create template');
  },

  async syncWithMeta(): Promise<SyncResponse> {
    const res = await apiClient.post<SyncResponse>('/templates/sync');
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to sync templates with Meta');
  },

  async deleteTemplate(id: string): Promise<boolean> {
    const res = await apiClient.delete<any>(`/templates/${id}`);
    return !!res.success;
  },

  async previewTemplate(
    id: string,
    variables: { body?: string[]; header?: string[] }
  ): Promise<PreviewResponse> {
    const res = await apiClient.post<PreviewResponse>(`/templates/${id}/preview`, { variables });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to preview template');
  },
};

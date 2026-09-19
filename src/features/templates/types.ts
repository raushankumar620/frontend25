export * from '../../types/whatsapp';

export interface TemplateDraft {
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  headerType: 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  headerText: string;
  headerMediaUrl?: string;
  body: string;
  footer: string;
  buttons: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phoneNumber?: string;
  }>;
}

export * from '../../types/message';
export * from '../../types/contact';

export interface QuickReply {
  id: string;
  title: string;
  content: string;
  shortcut: string;
}

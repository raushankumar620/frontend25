import { aiService } from '../../services/aiService';

export const aiApi = {
  getAgents: aiService.getAgents,
  getKnowledgeDocs: aiService.getKnowledgeDocs,
  createKnowledgeDoc: aiService.createKnowledgeDoc,
  deleteKnowledgeDoc: aiService.deleteKnowledgeDoc,
  reindexKnowledgeDoc: aiService.reindexKnowledgeDoc,
  queryKnowledgeBase: aiService.queryKnowledgeBase,
};

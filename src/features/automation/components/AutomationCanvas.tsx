import React, { useState } from 'react';
import type { WorkflowNode, NodeType } from '../types';
import { TriggerNode } from './TriggerNode';
import { ActionNode } from './ActionNode';
import {
  Plus,
  Bot,
  Send,
  Tag,
  UserCheck,
  Clock,
  Globe,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowDown,
  X,
  Check,
  Play,
} from 'lucide-react';

export interface AutomationCanvasProps {
  nodes: WorkflowNode[];
  onAddNode: (type: NodeType, insertIndex?: number) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNode: (id: string, updatedData: any) => void;
  onSelectNode?: (node: WorkflowNode) => void;
  selectedNodeId?: string | null;
  onRunTest?: () => void;
  isTesting?: boolean;
}

export const AutomationCanvas: React.FC<AutomationCanvasProps> = ({
  nodes,
  onAddNode,
  onDeleteNode,
  onUpdateNode,
  onSelectNode,
  selectedNodeId,
  onRunTest,
  isTesting = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [editingNode, setEditingNode] = useState<WorkflowNode | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.7));
  const handleZoomReset = () => setZoom(1);

  const handleNodeClick = (node: WorkflowNode) => {
    setEditingNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  const handleSaveNodeEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNode) return;
    onUpdateNode(editingNode.id, editingNode.data);
    setEditingNode(null);
  };

  return (
    <div className="w-full bg-[#F6FAF8] border border-[#E2EAE6] rounded-3xl min-h-[580px] flex flex-col relative overflow-hidden shadow-inner">
      {/* Canvas Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #05A222 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Floating Canvas Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#E2EAE6] shadow-xs">
          <span className="text-xs font-bold text-[#14201C] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#05A222] animate-pulse" />
            <span>Flow Canvas</span>
          </span>
          <span className="text-[11px] text-[#5F7069] bg-[#E9F9EE] text-[#006736] font-semibold px-2 py-0.5 rounded-md">
            {nodes.length} Steps
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {onRunTest && (
            <button
              onClick={onRunTest}
              disabled={isTesting}
              className="px-3.5 py-1.5 bg-[#05A222] hover:bg-[#006736] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isTesting ? 'Simulating...' : 'Test Flow'}</span>
            </button>
          )}

          <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-[#E2EAE6] shadow-xs">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-[#5F7069] hover:text-[#14201C] rounded-lg hover:bg-[#F6FAF8] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold text-[#5F7069] px-1.5">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-[#5F7069] hover:text-[#14201C] rounded-lg hover:bg-[#F6FAF8] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1.5 text-[#5F7069] hover:text-[#14201C] rounded-lg hover:bg-[#F6FAF8] transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Flow Graph Area */}
      <div
        className="flex-1 overflow-auto p-12 flex flex-col items-center justify-start relative z-10 transition-transform duration-200"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div className="flex flex-col items-center space-y-2 mt-6 max-w-lg w-full">
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              {/* Render Node */}
              <div className="relative group">
                {node.type === 'trigger' ? (
                  <TriggerNode
                    node={node}
                    selected={selectedNodeId === node.id}
                    onEdit={() => handleNodeClick(node)}
                  />
                ) : (
                  <ActionNode
                    node={node}
                    selected={selectedNodeId === node.id}
                    onDelete={() => onDeleteNode(node.id)}
                    onEdit={() => handleNodeClick(node)}
                  />
                )}
              </div>

              {/* Connecting Path & Add In-Between Step Handle */}
              {index < nodes.length - 1 && (
                <div className="flex flex-col items-center my-0.5 relative group py-1">
                  {/* SVG Connecting Line with Arrow */}
                  <div className="w-0.5 h-8 bg-gradient-to-b from-[#05A222] to-[#006736] relative">
                    <ArrowDown className="w-3.5 h-3.5 text-[#006736] absolute -bottom-2 -left-1.5" />
                  </div>

                  {/* Add Step Hover Button on Connector */}
                  <div className="absolute top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)}
                      className="w-6 h-6 rounded-full bg-white border-2 border-[#05A222] text-[#05A222] hover:bg-[#05A222] hover:text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                      title="Insert step here"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Floating Action Picker Menu */}
                  {activeMenuIndex === index && (
                    <div className="absolute top-10 z-30 bg-white rounded-2xl border border-[#E2EAE6] p-2 shadow-xl w-64 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-[#5F7069] px-2 py-1">Insert Step</div>
                      <button
                        onClick={() => {
                          onAddNode('send_message', index + 1);
                          setActiveMenuIndex(null);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#14201C] hover:bg-[#E9F9EE] hover:text-[#006736] flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5 text-[#05A222]" />
                        <span>WhatsApp Reply</span>
                      </button>
                      <button
                        onClick={() => {
                          onAddNode('ai_agent', index + 1);
                          setActiveMenuIndex(null);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#14201C] hover:bg-[#E9F9EE] hover:text-[#006736] flex items-center gap-2"
                      >
                        <Bot className="w-3.5 h-3.5 text-emerald-600" />
                        <span>AI Smart Agent</span>
                      </button>
                      <button
                        onClick={() => {
                          onAddNode('add_tag', index + 1);
                          setActiveMenuIndex(null);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#14201C] hover:bg-[#E9F9EE] hover:text-[#006736] flex items-center gap-2"
                      >
                        <Tag className="w-3.5 h-3.5 text-purple-600" />
                        <span>Apply Tag</span>
                      </button>
                      <button
                        onClick={() => {
                          onAddNode('assign_agent', index + 1);
                          setActiveMenuIndex(null);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#14201C] hover:bg-[#E9F9EE] hover:text-[#006736] flex items-center gap-2"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Assign Agent</span>
                      </button>
                      <button
                        onClick={() => {
                          onAddNode('delay', index + 1);
                          setActiveMenuIndex(null);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#14201C] hover:bg-[#E9F9EE] hover:text-[#006736] flex items-center gap-2"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Delay Timer</span>
                      </button>
                      <button
                        onClick={() => {
                          onAddNode('webhook', index + 1);
                          setActiveMenuIndex(null);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#14201C] hover:bg-[#E9F9EE] hover:text-[#006736] flex items-center gap-2"
                      >
                        <Globe className="w-3.5 h-3.5 text-teal-600" />
                        <span>HTTP Webhook</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* End Step / Add Next Node Actions */}
          <div className="pt-6 flex flex-col items-center gap-3 w-full">
            <div className="w-0.5 h-6 bg-[#C4EBD0]" />

            <div className="bg-white p-3 rounded-2xl border border-[#C4EBD0] shadow-xs flex flex-wrap items-center justify-center gap-2 max-w-md">
              <span className="text-[11px] font-bold text-[#5F7069] mr-1">+ Next Action:</span>
              <button
                type="button"
                onClick={() => onAddNode('send_message')}
                className="px-2.5 py-1.5 bg-[#E9F9EE] text-[#006736] hover:bg-[#C4EBD0] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp Message</span>
              </button>

              <button
                type="button"
                onClick={() => onAddNode('ai_agent')}
                className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Agent</span>
              </button>

              <button
                type="button"
                onClick={() => onAddNode('add_tag')}
                className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>

              <button
                type="button"
                onClick={() => onAddNode('assign_agent')}
                className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assign Agent</span>
              </button>

              <button
                type="button"
                onClick={() => onAddNode('delay')}
                className="px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Delay</span>
              </button>

              <button
                type="button"
                onClick={() => onAddNode('webhook')}
                className="px-2.5 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Webhook</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over / Modal Node Editor Drawer */}
      {editingNode && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2EAE6] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-[#006736] bg-[#E9F9EE] px-2 py-0.5 rounded-md">
                  {editingNode.type.replace('_', ' ')}
                </span>
                <h3 className="text-sm font-bold text-[#14201C]">{editingNode.title}</h3>
              </div>
              <button onClick={() => setEditingNode(null)} className="text-[#5F7069] hover:text-[#14201C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNodeEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#14201C] mb-1">Step Label</label>
                <input
                  type="text"
                  value={editingNode.title}
                  onChange={(e) => setEditingNode({ ...editingNode, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-[#E2EAE6] rounded-xl focus:border-[#05A222] focus:outline-none"
                />
              </div>

              {/* Node specific editors */}
              {(editingNode.type === 'send_message' || editingNode.type === 'action') && (
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1">WhatsApp Reply Text</label>
                  <textarea
                    rows={4}
                    value={editingNode.data?.text || ''}
                    onChange={(e) =>
                      setEditingNode({
                        ...editingNode,
                        data: { ...editingNode.data, text: e.target.value },
                      })
                    }
                    placeholder="Type WhatsApp message..."
                    className="w-full px-3.5 py-2.5 text-xs border border-[#E2EAE6] rounded-xl focus:border-[#05A222] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#5F7069] mt-1">
                    Variables available: <code className="text-[#05A222]">&#123;&#123;name&#125;&#125;</code>, <code className="text-[#05A222]">&#123;&#123;phone&#125;&#125;</code>
                  </p>
                </div>
              )}

              {editingNode.type === 'ai_agent' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#14201C] mb-1">AI System Prompt / Persona</label>
                  <textarea
                    rows={4}
                    value={editingNode.data?.prompt || ''}
                    onChange={(e) =>
                      setEditingNode({
                        ...editingNode,
                        data: { ...editingNode.data, prompt: e.target.value },
                      })
                    }
                    placeholder="e.g. You are an autonomous sales assistant..."
                    className="w-full px-3.5 py-2.5 text-xs border border-[#E2EAE6] rounded-xl focus:border-[#05A222] focus:outline-none"
                  />
                  <div className="text-[11px] text-[#5F7069]">
                    Model: <strong>GPT-4o-mini</strong> with RAG knowledge base integration.
                  </div>
                </div>
              )}

              {editingNode.type === 'add_tag' && (
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1">Tag Label</label>
                  <input
                    type="text"
                    value={editingNode.data?.tag || ''}
                    onChange={(e) =>
                      setEditingNode({
                        ...editingNode,
                        data: { ...editingNode.data, tag: e.target.value },
                      })
                    }
                    placeholder="e.g. VIP, Pricing-Lead, Hot-Prospect"
                    className="w-full px-3.5 py-2 text-xs border border-[#E2EAE6] rounded-xl focus:border-[#05A222] focus:outline-none"
                  />
                </div>
              )}

              {editingNode.type === 'delay' && (
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1">Delay Duration (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={1440}
                    value={editingNode.data?.delayMinutes || 5}
                    onChange={(e) =>
                      setEditingNode({
                        ...editingNode,
                        data: { ...editingNode.data, delayMinutes: parseInt(e.target.value, 10) || 5 },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-[#E2EAE6] rounded-xl focus:border-[#05A222] focus:outline-none"
                  />
                </div>
              )}

              {editingNode.type === 'webhook' && (
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1">Webhook URL</label>
                  <input
                    type="url"
                    value={editingNode.data?.url || ''}
                    onChange={(e) =>
                      setEditingNode({
                        ...editingNode,
                        data: { ...editingNode.data, url: e.target.value },
                      })
                    }
                    placeholder="https://api.yourdomain.com/webhook"
                    className="w-full px-3.5 py-2 text-xs border border-[#E2EAE6] rounded-xl focus:border-[#05A222] focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2EAE6]">
                <button
                  type="button"
                  onClick={() => setEditingNode(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#5F7069] hover:bg-[#F6FAF8] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#05A222] hover:bg-[#006736] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Node</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationCanvas;

import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Wrench,
  ArrowLeft,
  Plus,
  Play,
  Clock,
  Trash2,
  Code2,
  Globe,
  Shield,
  X,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { aiService } from '../../../services/aiService';
import type { AITool, AIToolLog } from '../types';

export const AITools: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tools' | 'logs'>('tools');
  const [builtInTools, setBuiltInTools] = useState<AITool[]>([]);
  const [customTools, setCustomTools] = useState<AITool[]>([]);
  const [logs, setLogs] = useState<AIToolLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Tool Creation Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newToolName, setNewToolName] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newMethod, setNewMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH'>('POST');
  const [newAuthType, setNewAuthType] = useState<'NONE' | 'BEARER' | 'API_KEY'>('NONE');
  const [newSecretToken, setNewSecretToken] = useState('');
  const [newParamsJson, setNewParamsJson] = useState(
    '{\n  "type": "object",\n  "properties": {\n    "customerId": { "type": "string" }\n  },\n  "required": ["customerId"]\n}'
  );
  const [isCreating, setIsCreating] = useState(false);

  // Test / Execution Modal State
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedToolForTest, setSelectedToolForTest] = useState<AITool | null>(null);
  const [testParamsJson, setTestParamsJson] = useState('{}');
  const [testResult, setTestResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [execLatency, setExecLatency] = useState<number | null>(null);

  const loadTools = async () => {
    try {
      setLoading(true);
      const [toolsData, logsData] = await Promise.all([
        aiService.getTools(),
        aiService.getToolLogs({ limit: 20 }),
      ]);
      setBuiltInTools(toolsData.builtInTools || []);
      setCustomTools(toolsData.customTools || []);
      setLogs(logsData.logs || []);
    } catch (err) {
      console.error('Failed to load AI tools:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const handleOpenTestModal = (tool: AITool) => {
    setSelectedToolForTest(tool);
    let sample: Record<string, any> = {};
    if (tool.name === 'check_order_status') {
      sample = { orderId: 'ORD-10928', phone: '+19998887771' };
    } else if (tool.name === 'check_availability_and_book') {
      sample = { date: '2026-09-25', timeSlot: '11:00 AM', serviceName: 'Product Demo', customerName: 'John Doe' };
    } else if (tool.name === 'update_contact_tags') {
      sample = { phoneNumber: '+19998887771', addTags: ['vip', 'high_intent'], removeTags: ['cold_lead'] };
    } else if (tool.name === 'search_catalog') {
      sample = { query: 'WhatsApp', category: 'Software' };
    } else if (tool.name === 'create_support_ticket') {
      sample = { issueTitle: 'Payment webhook delayed', severity: 'HIGH', description: 'Customer transaction status pending.' };
    } else if (tool.parameters?.properties) {
      Object.keys(tool.parameters.properties).forEach((k) => {
        sample[k] = 'test_value';
      });
    }
    setTestParamsJson(JSON.stringify(sample, null, 2));
    setTestResult(null);
    setExecLatency(null);
    setShowTestModal(true);
  };

  const handleExecuteTest = async () => {
    if (!selectedToolForTest) return;
    try {
      setIsExecuting(true);
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(testParamsJson);
      } catch {
        alert('Invalid JSON input parameters');
        return;
      }

      const start = Date.now();
      const res = await aiService.executeTool({
        toolName: selectedToolForTest.name,
        toolId: selectedToolForTest._id,
        parameters: parsedParams,
      });
      setExecLatency(Date.now() - start);
      setTestResult(res);

      const updatedLogs = await aiService.getToolLogs({ limit: 20 });
      setLogs(updatedLogs.logs || []);
    } catch (err: any) {
      setTestResult({ error: err.message || 'Execution failed' });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCreateCustomTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim() || !newWebhookUrl.trim()) {
      alert('Please provide tool name and webhook URL');
      return;
    }

    let parsedParams = {};
    try {
      parsedParams = JSON.parse(newParamsJson);
    } catch {
      alert('Parameters must be a valid JSON Schema object');
      return;
    }

    try {
      setIsCreating(true);
      const created = await aiService.createTool({
        name: newToolName.trim().toLowerCase().replace(/\s+/g, '_'),
        displayName: newDisplayName.trim() || newToolName.trim(),
        description: newDescription.trim(),
        type: 'CUSTOM_WEBHOOK',
        parameters: parsedParams,
        webhookConfig: {
          url: newWebhookUrl.trim(),
          method: newMethod,
          authType: newAuthType,
          secretToken: newSecretToken.trim() || undefined,
        },
      });

      setCustomTools([created, ...customTools]);
      setShowCreateModal(false);
      setNewToolName('');
      setNewDisplayName('');
      setNewDescription('');
      setNewWebhookUrl('');
      setNewSecretToken('');
    } catch (err: any) {
      alert(`Failed to create tool: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTool = async (tool: AITool) => {
    if (!tool._id) return;
    if (!window.confirm(`Delete custom tool "${tool.displayName}"?`)) return;

    try {
      await aiService.deleteTool(tool._id);
      setCustomTools(customTools.filter((t) => t._id !== tool._id));
    } catch (err: any) {
      alert(`Failed to delete tool: ${err.message}`);
    }
  };

  const totalToolsCount = builtInTools.length + customTools.length;

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.AI_DASHBOARD)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#5F7069] hover:text-[#14201C] mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AI Hub</span>
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[#006736] text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5">
            <Wrench className="w-4 h-4 text-[#05A222]" />
            <span>Autonomous Action & Safe Execution</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">
            AI Tool Calling & Webhook Actions
          </h2>
          <p className="text-sm text-[#5F7069] mt-1 font-medium">
            Allow your WhatsApp AI agents to safely check orders, book appointments, update tags, or invoke external APIs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto text-xs sm:text-sm font-bold bg-[#05A222] hover:bg-[#006736] text-white px-4 py-2.5 rounded-xl shadow-xs"
          >
            Register Custom Tool
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white border border-[#E2EAE6] p-3.5 sm:p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-[#5F7069]">Available Tools</div>
          <div className="text-xl sm:text-2xl font-black text-[#14201C] mt-1">{totalToolsCount}</div>
          <span className="text-[10px] sm:text-[11px] text-[#05A222] font-semibold mt-0.5 inline-block">5 Built-in + {customTools.length} Custom</span>
        </div>
        <div className="bg-white border border-[#E2EAE6] p-3.5 sm:p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-[#5F7069]">Execution Safety</div>
          <div className="text-xs sm:text-sm font-bold text-[#006736] mt-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#05A222]" />
            Strict Schema Enforced
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#8A9993] font-medium mt-0.5 inline-block">Zero code injection</span>
        </div>
        <div className="bg-white border border-[#E2EAE6] p-3.5 sm:p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-[#5F7069]">Timeout Protection</div>
          <div className="text-xs sm:text-sm font-bold font-mono text-[#14201C] mt-2">5,000 ms limit</div>
          <span className="text-[10px] sm:text-[11px] text-[#006736] font-semibold mt-0.5 inline-block">Auto-abort on lag</span>
        </div>
        <div className="bg-white border border-[#E2EAE6] p-3.5 sm:p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-[#5F7069]">Total Audit Invocations</div>
          <div className="text-xl sm:text-2xl font-black text-[#14201C] mt-1">{logs.length}</div>
          <span className="text-[10px] sm:text-[11px] text-[#8A9993] font-medium mt-0.5 inline-block">Recorded runs</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#E2EAE6] mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tools')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tools'
              ? 'border-[#05A222] text-[#006736]'
              : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
          }`}
        >
          Tools Library ({totalToolsCount})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'logs'
              ? 'border-[#05A222] text-[#006736]'
              : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Execution Audit Logs ({logs.length})
        </button>
      </div>

      {/* Tab 1: Tools Library */}
      {activeTab === 'tools' && (
        loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E2EAE6] text-xs text-[#5F7069]">
            Loading AI Tools...
          </div>
        ) : (
        <div className="space-y-8">
          {/* Built-in Tools */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#05A222]" />
                Built-in Safe Action Tools
              </h3>
              <span className="text-xs text-[#5F7069] font-medium">Pre-configured & sandboxed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {builtInTools.map((tool) => (
                <div
                  key={tool.name}
                  className="bg-white border border-[#E2EAE6] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#05A222] transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#14201C] truncate">{tool.displayName}</h4>
                        <span className="text-[10px] font-mono text-[#006736] bg-[#E9F9EE] border border-[#C4EBD0] px-1.5 py-0.5 rounded">
                          {tool.name}
                        </span>
                      </div>
                      <Badge variant="success" size="sm" className="shrink-0">
                        BUILT-IN
                      </Badge>
                    </div>

                    <p className="text-xs text-[#5F7069] mt-2 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="mt-3 p-2.5 bg-[#F6FAF8] rounded-xl text-[11px] font-mono text-[#5F7069] border border-[#E2EAE6]">
                      <div className="text-[10px] uppercase font-bold text-[#14201C] mb-1">Required Parameters:</div>
                      {tool.parameters?.required?.join(', ') || 'None'}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2EAE6]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenTestModal(tool)}
                      className="w-full text-xs font-semibold text-[#006736] border-[#C4EBD0] hover:bg-[#E9F9EE] rounded-xl"
                      leftIcon={<Play className="w-3 h-3 text-[#05A222]" />}
                    >
                      Test Dry-Run Execution
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Webhook Tools */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#05A222]" />
                Custom Webhook Tools ({customTools.length})
              </h3>
              <span className="text-xs text-[#5F7069] font-medium">External REST endpoints</span>
            </div>

            {customTools.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E2EAE6] space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-[#05A222]" />
                </div>
                <h4 className="text-sm font-bold text-[#14201C]">No Custom Webhook Tools Configured</h4>
                <p className="text-xs text-[#5F7069] max-w-sm mx-auto">
                  Connect your internal API endpoints, CRM systems, or ERP services so the AI can execute custom actions.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#05A222] hover:bg-[#006736] text-white font-bold mt-2 rounded-xl"
                >
                  Register Custom Tool
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {customTools.map((tool) => (
                  <div
                    key={tool._id}
                    className="bg-white border border-[#E2EAE6] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#05A222] transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-[#14201C] truncate">{tool.displayName}</h4>
                          <span className="text-[10px] font-mono text-[#006736] bg-[#E9F9EE] border border-[#C4EBD0] px-1.5 py-0.5 rounded">
                            {tool.name}
                          </span>
                        </div>
                        <Badge variant="neutral" size="sm" className="shrink-0 font-bold">
                          {tool.webhookConfig?.method || 'POST'}
                        </Badge>
                      </div>

                      <p className="text-xs text-[#5F7069] mt-2 leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="mt-3 p-2.5 bg-[#F6FAF8] rounded-xl text-[11px] font-mono text-[#5F7069] border border-[#E2EAE6] truncate">
                        <div className="text-[10px] uppercase font-bold text-[#14201C] mb-0.5">Webhook URL:</div>
                        {tool.webhookConfig?.url}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#E2EAE6]">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTestModal(tool)}
                        className="flex-1 text-xs font-semibold text-[#006736] border-[#C4EBD0] hover:bg-[#E9F9EE] rounded-xl"
                        leftIcon={<Play className="w-3 h-3 text-[#05A222]" />}
                      >
                        Test Run
                      </Button>
                      <button
                        onClick={() => handleDeleteTool(tool)}
                        title="Delete Custom Tool"
                        className="p-2 text-[#8A9993] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )
      )}

      {/* Tab 2: Execution Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-[#E2EAE6] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E2EAE6] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#14201C]">Recent Tool Invocations</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={loadTools}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs font-semibold border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE] rounded-xl"
            >
              Refresh
            </Button>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5F7069]">No tool execution logs found yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F6FAF8] border-b border-[#E2EAE6] text-[#5F7069] uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tool Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Parameters</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2EAE6]">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-[#F6FAF8]/70">
                      <td className="py-3 px-4 font-mono font-bold text-[#14201C]">
                        {log.toolName}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            log.executionStatus === 'SUCCESS'
                              ? 'success'
                              : log.executionStatus === 'TIMEOUT'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {log.executionStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#5F7069]">
                        {log.latencyMs} ms
                      </td>
                      <td className="py-3 px-4 font-mono text-[#5F7069] max-w-[200px] truncate">
                        {JSON.stringify(log.inputParameters)}
                      </td>
                      <td className="py-3 px-4 text-[#8A9993]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Test / Dry-Run Modal */}
      {showTestModal && selectedToolForTest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2EAE6] rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#05A222]" />
                <h3 className="text-sm font-bold text-[#14201C]">
                  Execute Sandbox: {selectedToolForTest.displayName}
                </h3>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="p-1 rounded text-[#5F7069] hover:text-[#14201C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                Input Parameters (JSON)
              </label>
              <textarea
                value={testParamsJson}
                onChange={(e) => setTestParamsJson(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-[#E2EAE6] bg-[#013B23] text-[#1CD72C] font-mono text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#05A222]"
              />
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={handleExecuteTest}
              isLoading={isExecuting}
              leftIcon={<Play className="w-3.5 h-3.5" />}
              className="w-full bg-[#05A222] hover:bg-[#006736] text-white font-bold rounded-xl py-2.5"
            >
              Run Execution
            </Button>

            {testResult && (
              <div className="space-y-1.5 pt-2 border-t border-[#E2EAE6]">
                <div className="flex items-center justify-between text-xs font-bold text-[#5F7069]">
                  <span>Execution Output</span>
                  {execLatency !== null && <span className="font-mono text-[#006736]">{execLatency} ms</span>}
                </div>
                <pre className="p-3 bg-[#013B23] text-white rounded-xl text-xs font-mono overflow-x-auto max-h-48 border border-[#05A222]/30">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Custom Tool Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2EAE6] rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#05A222]" />
                <h3 className="text-base font-bold text-[#14201C]">
                  Register Custom Webhook Tool
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded text-[#5F7069] hover:text-[#14201C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomTool} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Unique Tool Name (snake_case)"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  placeholder="e.g. fetch_membership_tier"
                  required
                />
                <Input
                  label="Display Name"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g. VIP Membership Checker"
                  required
                />
              </div>

              <Input
                label="Tool Description (Instructions for LLM)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Lookup membership tier and loyalty points by phone number"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    label="Endpoint Webhook URL"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    placeholder="https://api.yourcrm.com/v1/lookup"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                    HTTP Method
                  </label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-xs p-2.5 font-bold text-[#14201C] focus:outline-none focus:border-[#05A222]"
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                    Authentication
                  </label>
                  <select
                    value={newAuthType}
                    onChange={(e) => setNewAuthType(e.target.value as any)}
                    className="w-full rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-xs p-2.5 font-bold text-[#14201C] focus:outline-none focus:border-[#05A222]"
                  >
                    <option value="NONE">None</option>
                    <option value="BEARER">Bearer Token</option>
                    <option value="API_KEY">X-API-Key Header</option>
                  </select>
                </div>

                {newAuthType !== 'NONE' && (
                  <Input
                    label="Secret Token / Key"
                    type="password"
                    value={newSecretToken}
                    onChange={(e) => setNewSecretToken(e.target.value)}
                    placeholder="secret_token_value"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] mb-1.5">
                  Parameters JSON Schema
                </label>
                <textarea
                  value={newParamsJson}
                  onChange={(e) => setNewParamsJson(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-[#E2EAE6] bg-[#013B23] text-[#1CD72C] font-mono text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#05A222]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2EAE6]">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowCreateModal(false)}
                  className="border-[#E2EAE6] text-[#5F7069] hover:bg-[#F6FAF8] rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isCreating}
                  className="bg-[#05A222] hover:bg-[#006736] text-white font-bold rounded-xl shadow-xs"
                >
                  Register Tool
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

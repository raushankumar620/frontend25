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
    // Generate helpful pre-filled JSON sample based on parameters
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

      // Refresh logs
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
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-5"
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
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] dark:text-white tracking-tight">
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
            className="text-sm font-bold bg-[#05A222] hover:bg-[#006736] text-[#14201C] hover:text-white px-4 py-2.5 rounded-xl shadow-xs"
          >
            Register Custom Tool
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Available Tools</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalToolsCount}</div>
          <span className="text-[11px] text-[#05A222] font-semibold mt-0.5 inline-block">5 Built-in + {customTools.length} Custom</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Execution Safety</div>
          <div className="text-sm font-bold text-emerald-600 mt-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#05A222]" />
            Strict Schema Enforced
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5 inline-block">Zero code injection</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Timeout Protection</div>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-2">5,000 ms limit</div>
          <span className="text-[11px] text-[#006736] font-semibold mt-0.5 inline-block">Auto-abort on lag</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Audit Invocations</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{logs.length}</div>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5 inline-block">Recorded runs</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('tools')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === 'tools'
              ? 'border-[#05A222] text-[#006736] dark:text-[#05A222]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Tools Library ({totalToolsCount})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'logs'
              ? 'border-[#05A222] text-[#006736] dark:text-[#05A222]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Execution Audit Logs ({logs.length})
        </button>
      </div>

      {/* Tab 1: Tools Library */}
      {activeTab === 'tools' && (
        loading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            Loading AI Tools...
          </div>
        ) : (
        <div className="space-y-8">
          {/* Built-in Tools */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#05A222]" />
                Built-in Safe Action Tools
              </h3>
              <span className="text-xs text-slate-400">Pre-configured & sandboxed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {builtInTools.map((tool) => (
                <div
                  key={tool.name}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#05A222]/40 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tool.displayName}</h4>
                        <span className="text-[10px] font-mono text-[#006736] dark:text-[#05A222] bg-[#E9F9EE] dark:bg-[#006736]/30 px-1.5 py-0.5 rounded">
                          {tool.name}
                        </span>
                      </div>
                      <Badge variant="success" size="sm">
                        BUILT-IN
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] font-mono text-slate-500">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Required Parameters:</div>
                      {tool.parameters?.required?.join(', ') || 'None'}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenTestModal(tool)}
                      className="w-full text-xs font-semibold text-[#006736] border-[#C4EBD0] hover:bg-[#E9F9EE]"
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
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#05A222]" />
                Custom Webhook Tools ({customTools.length})
              </h3>
              <span className="text-xs text-slate-400">External REST endpoints</span>
            </div>

            {customTools.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
                  <Code2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Custom Webhook Tools Configured</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Connect your internal API endpoints, CRM systems, or ERP services so the AI can execute custom actions.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-[#05A222] text-[#14201C] font-bold mt-2"
                >
                  Register Custom Tool
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customTools.map((tool) => (
                  <div
                    key={tool._id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#05A222]/40 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tool.displayName}</h4>
                          <span className="text-[10px] font-mono text-[#006736] dark:text-[#05A222] bg-[#E9F9EE] dark:bg-[#006736]/30 px-1.5 py-0.5 rounded">
                            {tool.name}
                          </span>
                        </div>
                        <Badge variant="neutral" size="sm">
                          {tool.webhookConfig?.method || 'POST'}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] font-mono text-slate-500 truncate">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Webhook URL:</div>
                        {tool.webhookConfig?.url}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTestModal(tool)}
                        className="flex-1 text-xs font-semibold text-[#006736] border-[#C4EBD0] hover:bg-[#E9F9EE]"
                        leftIcon={<Play className="w-3 h-3 text-[#05A222]" />}
                      >
                        Test Run
                      </Button>
                      <button
                        onClick={() => handleDeleteTool(tool)}
                        title="Delete Custom Tool"
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Tool Invocations</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={loadTools}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No tool execution logs found yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tool Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Parameters</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
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
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {log.latencyMs} ms
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 max-w-[200px] truncate">
                        {JSON.stringify(log.inputParameters)}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#05A222]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Execute Sandbox: {selectedToolForTest.displayName}
                </h3>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Input Parameters (JSON)
              </label>
              <textarea
                value={testParamsJson}
                onChange={(e) => setTestParamsJson(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-[#05A222] font-mono text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#05A222]"
              />
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={handleExecuteTest}
              isLoading={isExecuting}
              leftIcon={<Play className="w-3.5 h-3.5" />}
              className="w-full bg-[#05A222] hover:bg-[#006736] text-[#14201C] hover:text-white font-bold"
            >
              Run Execution
            </Button>

            {testResult && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Execution Output</span>
                  {execLatency !== null && <span className="font-mono text-emerald-600">{execLatency} ms</span>}
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-48 border border-slate-800">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Custom Tool Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#05A222]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Register Custom Webhook Tool
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
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

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Input
                    label="Endpoint Webhook URL"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    placeholder="https://api.yourcrm.com/v1/lookup"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    HTTP Method
                  </label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs p-2.5 font-bold"
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Authentication
                  </label>
                  <select
                    value={newAuthType}
                    onChange={(e) => setNewAuthType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs p-2.5 font-bold"
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Parameters JSON Schema
                </label>
                <textarea
                  value={newParamsJson}
                  onChange={(e) => setNewParamsJson(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-[#05A222] font-mono text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#05A222]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isCreating}
                  className="bg-[#05A222] hover:bg-[#006736] text-[#14201C] hover:text-white font-bold"
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

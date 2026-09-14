import React, { useState, useEffect, useCallback } from 'react';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Plus,
  Webhook,
  Play,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  History,
  Radio,
  X,
  Send,
  AlertCircle
} from 'lucide-react';
import type {
  WebhookEndpoint,
  WebhookEvent,
  CreateWebhookPayload,
  WebhookDeliveryLog,
  TestPingResponse
} from '../types';
import { developerService } from '../../../services/developerService';

const AVAILABLE_EVENTS: Array<{ id: WebhookEvent; label: string; desc: string }> = [
  { id: '*', label: 'All Events (*)', desc: 'Receive every event in real-time' },
  { id: 'messages.inbound', label: 'Inbound Messages', desc: 'Customer replies, media, and text' },
  { id: 'messages.status', label: 'Message Receipts', desc: 'Sent, Delivered, Read, and Failed updates' },
  { id: 'contacts.created', label: 'Contacts Created', desc: 'New customer profile creation' },
  { id: 'templates.status_update', label: 'Template Approvals', desc: 'Meta HSM approval or rejection updates' },
  { id: 'automations.executed', label: 'Automation Fired', desc: 'Bot and workflow execution alerts' },
];

export const Webhooks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SUBSCRIPTIONS' | 'DELIVERIES'>('SUBSCRIPTIONS');
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDeliveryLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDeliveries, setIsLoadingDeliveries] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Register Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [description, setDescription] = useState('');
  const [customSecret, setCustomSecret] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>(['messages.inbound', 'messages.status']);
  const [formError, setFormError] = useState<string | null>(null);

  // Test Ping Modal State
  const [testingWebhook, setTestingWebhook] = useState<WebhookEndpoint | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestPingResponse | null>(null);

  // Inspect & Replay Delivery Modal
  const [inspectDelivery, setInspectDelivery] = useState<WebhookDeliveryLog | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [deleteTargetWebhook, setDeleteTargetWebhook] = useState<WebhookEndpoint | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchWebhooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await developerService.getWebhooks();
      setWebhooks((data || []).map((w) => ({ ...w, id: w._id || w.id })));
    } catch (err) {
      console.error('Failed to fetch webhooks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDeliveries = useCallback(async () => {
    setIsLoadingDeliveries(true);
    try {
      const data = await developerService.getWebhookDeliveries({ limit: 50 });
      setDeliveries((data.deliveries || []).map((d) => ({ ...d, id: d._id || d.id })));
    } catch (err) {
      console.error('Failed to fetch webhook deliveries:', err);
    } finally {
      setIsLoadingDeliveries(false);
    }
  }, []);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  useEffect(() => {
    if (activeTab === 'DELIVERIES') {
      fetchDeliveries();
    }
  }, [activeTab, fetchDeliveries]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleEvent = (ev: WebhookEvent) => {
    if (ev === '*') {
      setSelectedEvents(selectedEvents.includes('*') ? [] : ['*']);
      return;
    }
    const filtered = selectedEvents.filter((e) => e !== '*');
    if (filtered.includes(ev)) {
      setSelectedEvents(filtered.filter((e) => e !== ev));
    } else {
      setSelectedEvents([...filtered, ev]);
    }
  };

  const handleRegisterWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!endpointUrl.trim()) {
      setFormError('Please enter a target webhook URL');
      return;
    }
    if (selectedEvents.length === 0) {
      setFormError('Please select at least one event');
      return;
    }

    setIsRegistering(true);
    setFormError(null);

    try {
      const payload: CreateWebhookPayload = {
        url: endpointUrl.trim(),
        description: description.trim(),
        secret: customSecret.trim() || undefined,
        events: selectedEvents,
      };

      await developerService.createWebhook(payload);
      setIsRegisterOpen(false);
      setEndpointUrl('');
      setDescription('');
      setCustomSecret('');
      setSelectedEvents(['messages.inbound', 'messages.status']);
      fetchWebhooks();
    } catch (err: any) {
      setFormError(err.message || 'Failed to register webhook endpoint');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSendTestPing = async (webhook: WebhookEndpoint) => {
    setTestingWebhook(webhook);
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await developerService.sendTestPing(webhook._id || (webhook.id as string));
      setTestResult(res);
      fetchWebhooks();
    } catch (err: any) {
      setTestResult({
        success: false,
        statusCode: 0,
        latencyMs: 0,
        errorMessage: err.message || 'Test ping failed',
        deliveryId: '',
        signature: '',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleReplay = async (deliveryLog: WebhookDeliveryLog) => {
    setIsReplaying(true);
    try {
      const res = await developerService.replayDelivery(deliveryLog._id || (deliveryLog.id as string));
      alert(`Event Replayed! Status: ${res.statusCode} (${res.latencyMs}ms)`);
      fetchDeliveries();
      setInspectDelivery(null);
    } catch (err: any) {
      alert(err.message || 'Replay failed');
    } finally {
      setIsReplaying(false);
    }
  };

  const handleDeleteWebhook = async () => {
    if (!deleteTargetWebhook) return;
    setIsDeleting(true);
    try {
      await developerService.deleteWebhook(deleteTargetWebhook._id || (deleteTargetWebhook.id as string));
      setDeleteTargetWebhook(null);
      fetchWebhooks();
    } catch (err: any) {
      alert(err.message || 'Failed to delete webhook');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (webhook: WebhookEndpoint) => {
    try {
      await developerService.updateWebhook(webhook._id || (webhook.id as string), { isActive: !webhook.isActive });
      fetchWebhooks();
    } catch (err: any) {
      alert(err.message || 'Failed to update webhook status');
    }
  };

  const webhookColumns: Column<WebhookEndpoint>[] = [
    {
      header: 'Target Endpoint URL',
      render: (w) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 font-mono text-xs text-[#14201C]">
            <div className="w-7 h-7 rounded-lg bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
              <Webhook className="w-3.5 h-3.5" />
            </div>
            <span className="truncate max-w-sm font-semibold">{w.url}</span>
          </div>
          {w.description && <div className="text-[11px] text-[#5F7069] line-clamp-1">{w.description}</div>}
        </div>
      ),
    },
    {
      header: 'Subscribed Events',
      render: (w) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(w.events || ['*']).map((e) => (
            <span
              key={e}
              className="bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] font-mono text-[10px] font-bold px-2 py-0.5 rounded-md"
            >
              {e}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Signing Secret',
      render: (w) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#14201C] bg-[#F6FAF8] px-2 py-0.5 rounded-md border border-[#E2EAE6]">
            {w.secretMasked || 'whsec_••••••••••••'}
          </span>
          {w.secret && (
            <button
              onClick={() => handleCopy(w._id || (w.id as string), w.secret as string)}
              className="text-[#5F7069] hover:text-[#05A222] p-1 cursor-pointer"
              title="Copy secret"
            >
              {copiedId === (w._id || w.id) ? (
                <Check className="w-3.5 h-3.5 text-[#05A222]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'Health & Delivery',
      render: (w) => {
        if (w.status === 'DISABLED_FAILURES') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
              <XCircle className="w-3 h-3 text-rose-500" /> Circuit Broken ({w.consecutiveFailures} fails)
            </span>
          );
        }
        return (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#006736]">
              <span className="w-2 h-2 rounded-full bg-[#05A222] animate-pulse" />
              <span>{w.isActive ? 'Active & Healthy' : 'Paused'}</span>
            </div>
            <div className="text-[10px] text-[#5F7069]">
              {w.lastSuccessAt
                ? `Last success: ${new Date(w.lastSuccessAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'No deliveries yet'}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      render: (w) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(w)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              w.isActive ? 'bg-[#05A222]' : 'bg-[#C4EBD0]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                w.isActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-[11px] font-bold ${w.isActive ? 'text-[#006736]' : 'text-[#5F7069]'}`}>
            {w.isActive ? 'Active' : 'Paused'}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (w) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSendTestPing(w)}
            leftIcon={<Play className="w-3 h-3 text-[#05A222]" />}
            className="text-xs font-semibold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE]"
          >
            Test Ping
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteTargetWebhook(w)}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
            className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const deliveryColumns: Column<WebhookDeliveryLog>[] = [
    {
      header: 'Event & Target',
      render: (d) => (
        <div className="space-y-0.5 font-mono text-xs">
          <div className="font-bold text-[#14201C] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#05A222]" />
            <span>{d.event}</span>
          </div>
          <div className="text-[11px] text-[#5F7069] truncate max-w-sm">{d.targetUrl}</div>
        </div>
      ),
    },
    {
      header: 'Status Code',
      render: (d) => {
        if (d.responseStatusCode >= 200 && d.responseStatusCode < 300) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006736] bg-[#E9F9EE] border border-[#C4EBD0] px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3 text-[#05A222]" /> {d.responseStatusCode} OK
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
            <XCircle className="w-3 h-3 text-rose-500" /> {d.responseStatusCode || 'Failed'}
          </span>
        );
      },
    },
    {
      header: 'Latency',
      render: (d) => (
        <span
          className={`font-mono text-xs font-semibold ${
            d.latencyMs < 300 ? 'text-[#006736]' : 'text-amber-600'
          }`}
        >
          {d.latencyMs} ms
        </span>
      ),
    },
    {
      header: 'Timestamp',
      render: (d) => (
        <span className="text-[#5F7069] text-xs font-medium">
          {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (d) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setInspectDelivery(d)}
          className="text-xs font-semibold text-[#006736] border-[#E2EAE6] hover:bg-[#E9F9EE]"
        >
          Inspect & Replay
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-[#14201C] tracking-tight">Outbound Webhooks Platform</h3>
          <p className="text-xs text-[#5F7069] mt-1 font-medium">
            Receive real-time signed HTTP POST webhooks on your servers when customer messages, HSM statuses, or delivery events occur.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsRegisterOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-[#05A222] hover:bg-[#006736] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
        >
          Register Webhook Endpoint
        </Button>
      </div>

      {/* Main Tabs (Subscriptions vs Deliveries) */}
      <div className="flex items-center gap-3 border-b border-[#E2EAE6]">
        <button
          onClick={() => setActiveTab('SUBSCRIPTIONS')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'SUBSCRIPTIONS'
              ? 'border-[#05A222] text-[#006736]'
              : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
          }`}
        >
          <Webhook className="w-4 h-4" />
          <span>Webhook Endpoints ({webhooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DELIVERIES')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'DELIVERIES'
              ? 'border-[#05A222] text-[#006736]'
              : 'border-transparent text-[#5F7069] hover:text-[#14201C]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Delivery Audit Logs & Replay</span>
        </button>
      </div>

      {activeTab === 'SUBSCRIPTIONS' ? (
        <Table columns={webhookColumns} data={webhooks} isLoading={isLoading} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#5F7069] font-medium">
              Showing live outbound delivery attempts and HMAC SHA-256 signatures.
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchDeliveries}
              isLoading={isLoadingDeliveries}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              Refresh
            </Button>
          </div>
          <Table columns={deliveryColumns} data={deliveries} isLoading={isLoadingDeliveries} />
        </div>
      )}

      {/* Modal: Register Webhook Endpoint */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-[#E2EAE6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
              <div className="flex items-center gap-2">
                <Webhook className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-lg font-black text-[#14201C]">Register Webhook Endpoint</h3>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="text-[#5F7069] hover:text-[#14201C] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleRegisterWebhook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Payload URL *
                </label>
                <Input
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  placeholder="https://yourserver.com/api/webhooks/whatsapp"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Description (Optional)
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Zapier / Make / Internal Order Dispatcher"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Signing Secret (Optional)
                </label>
                <Input
                  value={customSecret}
                  onChange={(e) => setCustomSecret(e.target.value)}
                  placeholder="Leave empty to auto-generate a secure random secret"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14201C] uppercase tracking-wider mb-1.5">
                  Subscribed Events *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6]">
                  {AVAILABLE_EVENTS.map((ev) => {
                    const checked = selectedEvents.includes(ev.id) || selectedEvents.includes('*');
                    return (
                      <label
                        key={ev.id}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                          checked
                            ? 'bg-[#E9F9EE] border-[#05A222] text-[#006736]'
                            : 'bg-white border-[#E2EAE6] text-[#14201C]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleEvent(ev.id)}
                          className="w-4 h-4 text-[#05A222] rounded mt-0.5"
                        />
                        <div className="text-xs">
                          <div className="font-bold">{ev.label}</div>
                          <div className="text-[10px] text-[#5F7069] leading-tight mt-0.5">{ev.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2EAE6]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRegisterOpen(false)}
                  className="text-[#5F7069]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isRegistering}
                  className="bg-[#05A222] hover:bg-[#006736] text-white font-bold px-5"
                >
                  Save Webhook Endpoint
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Live Test Ping Result */}
      {testingWebhook && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-[#E2EAE6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-lg font-black text-[#14201C]">Webhook Test Ping</h3>
              </div>
              <button
                onClick={() => setTestingWebhook(null)}
                className="text-[#5F7069] hover:text-[#14201C] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#5F7069]">
              Target: <code className="font-mono text-[#14201C] break-all">{testingWebhook.url}</code>
            </div>

            {isTesting ? (
              <div className="p-8 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#05A222] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-[#5F7069]">Sending HTTP POST ping with HMAC-SHA256 signature...</span>
              </div>
            ) : testResult ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#F6FAF8] rounded-2xl border border-[#E2EAE6] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5F7069]">Status</span>
                    <div className="mt-0.5">
                      {testResult.success ? (
                        <span className="text-[#006736] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#05A222]" /> {testResult.statusCode} OK
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> {testResult.statusCode || 'Failed'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5F7069]">Latency</span>
                    <div className="font-mono font-bold text-[#14201C] mt-0.5">{testResult.latencyMs} ms</div>
                  </div>
                </div>

                {testResult.signature && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5F7069]">X-Hub-Signature-256</span>
                    <div className="p-2 bg-[#14201C] text-[#6AEB31] font-mono text-[10px] rounded-xl mt-1 break-all">
                      {testResult.signature}
                    </div>
                  </div>
                )}

                {testResult.responseBody && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5F7069]">Target Response Body</span>
                    <pre className="p-2.5 bg-[#F6FAF8] text-[#14201C] font-mono text-[11px] rounded-xl border border-[#E2EAE6] mt-1 max-h-32 overflow-y-auto">
                      {testResult.responseBody}
                    </pre>
                  </div>
                )}

                {testResult.errorMessage && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                    {testResult.errorMessage}
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setTestingWebhook(null)} className="text-xs font-bold px-5">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Inspect & Replay Delivery */}
      {inspectDelivery && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-[#E2EAE6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2EAE6] pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#05A222]" />
                <h3 className="text-lg font-black text-[#14201C]">Delivery Details & Replay</h3>
              </div>
              <button
                onClick={() => setInspectDelivery(null)}
                className="text-[#5F7069] hover:text-[#14201C] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F6FAF8] rounded-2xl border border-[#E2EAE6] grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F7069]">Event</span>
                  <div className="font-bold text-[#006736] mt-0.5">{inspectDelivery.event}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F7069]">Status</span>
                  <div className="font-bold mt-0.5">{inspectDelivery.responseStatusCode}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5F7069]">Latency</span>
                  <div className="font-mono font-bold mt-0.5">{inspectDelivery.latencyMs} ms</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#5F7069]">Target URL</span>
                <div className="p-2 bg-[#F6FAF8] text-[#14201C] font-mono text-[11px] rounded-xl border border-[#E2EAE6] mt-1 break-all">
                  {inspectDelivery.targetUrl}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#5F7069]">Payload Data</span>
                <pre className="p-2.5 bg-[#14201C] text-[#6AEB31] font-mono text-[10px] rounded-xl max-h-36 overflow-y-auto leading-relaxed">
                  {JSON.stringify(inspectDelivery.requestPayload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2EAE6]">
              <Button size="sm" variant="ghost" onClick={() => setInspectDelivery(null)} className="text-xs text-[#5F7069]">
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleReplay(inspectDelivery)}
                isLoading={isReplaying}
                className="bg-[#05A222] hover:bg-[#006736] text-white font-bold text-xs px-4"
              >
                Replay Event Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Webhook Confirmation */}
      {deleteTargetWebhook && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#E2EAE6] space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-black text-[#14201C]">Delete Webhook</h3>
            </div>
            <p className="text-xs text-[#5F7069] leading-relaxed">
              Are you sure you want to delete this webhook subscription for <strong>{deleteTargetWebhook.url}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeleteTargetWebhook(null)} className="text-[#5F7069]">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeleteWebhook}
                isLoading={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

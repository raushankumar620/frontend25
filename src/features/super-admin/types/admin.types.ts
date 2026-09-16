export interface TenantStats {
  userCount: number;
  activeNumbersCount: number;
  currentMonthMessages: number;
  currentMonthAiTokens: number;
  creditsBalance: number;
}

export interface TenantSubscription {
  planCode: string;
  status: string;
}

export interface TenantOwner {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
  createdAt?: string;
}

export interface TenantLimits {
  maxNumbers: number;
  maxTeamMembers: number;
  monthlyMessages: number;
}

export interface Tenant {
  _id: string;
  id: string;
  name: string;
  slug: string;
  plan: 'FREE_TRIAL' | 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  ownerId?: TenantOwner;
  limits: TenantLimits;
  stats: TenantStats;
  subscription: TenantSubscription;
  createdAt: string;
  updatedAt: string;
}

export interface TenantDetails {
  organization: Tenant;
  users: Array<{
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone?: string;
    isActive: boolean;
    lastLoginAt?: string;
  }>;
  numbers: Array<{
    _id: string;
    id: string;
    displayPhoneNumber: string;
    verifiedName: string;
    qualityRating: string;
    messagingTier: string;
    status: string;
  }>;
  subscription: {
    planCode: string;
    status: string;
    billingCycle?: string;
    currentPeriodEnd?: string;
  } | null;
  usage: {
    month: string;
    messagesSent: number;
    aiTokensUsed: number;
    campaignsCount: number;
    creditsBalance: number;
  };
  activeCampaigns: number;
}

export interface QueueItem {
  name: string;
  title: string;
  status: 'ACTIVE' | 'PAUSED';
  concurrency: number;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  throughputPerSec: number;
}

export interface QueueSummary {
  totalQueues: number;
  activeQueues: number;
  pausedQueues: number;
  totalWaiting: number;
  totalActive: number;
  totalCompleted: number;
  totalFailed: number;
  healthy: boolean;
}

export interface QueuesResponse {
  summary: QueueSummary;
  queues: QueueItem[];
}

export interface AuditLogItem {
  _id: string;
  id: string;
  action: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  organizationId?: {
    _id: string;
    name: string;
    slug: string;
    plan: string;
  };
  createdAt: string;
}

export interface SystemHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  timestamp: string;
  uptime: {
    seconds: number;
    formatted: string;
  };
  services: {
    database: { provider: string; status: string; pingMs: number };
    redis: { provider: string; status: string; pingMs: number };
    metaApi: { provider: string; status: string; latencyMs: number };
    aiEngine: { provider: string; status: string; latencyMs: number };
  };
  system: {
    platform: string;
    arch: string;
    nodeVersion: string;
    cpuCount: number;
    freeMemoryMb: number;
    totalMemoryMb: number;
    processMemoryRssMb: number;
    processMemoryHeapUsedMb: number;
  };
}

export interface AdminMetrics {
  tenants: {
    total: number;
    active: number;
    suspended: number;
    planBreakdown: Record<string, number>;
  };
  users: {
    total: number;
  };
  whatsapp: {
    activeNumbers: number;
  };
  messaging: {
    totalLifetimeMessages: number;
    monthlyMessages: number;
    monthlyAiTokens: number;
  };
  campaigns: {
    total: number;
  };
  finance: {
    totalWalletBalances: number;
    activeSubscriptions: number;
  };
  systemStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface AdminOverviewResponse {
  metrics: AdminMetrics;
  platformVersion: string;
  nodeVersion: string;
}

export interface AdminUserItem {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'AGENT';
  isActive: boolean;
  avatarUrl?: string;
  organizationId?: {
    _id: string;
    id: string;
    name: string;
    slug: string;
    plan: string;
    status: string;
  };
  lastLoginAt?: string;
  createdAt: string;
}

export interface AdminUsersResponse {
  users: AdminUserItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  summary: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    superAdmins: number;
  };
}

export interface AdminUser360 {
  user: AdminUserItem;
  organization?: any;
  stats: {
    sentMessages: number;
    inboundMessages: number;
    sessionsCount: number;
  };
}

export interface WabaAccountItem {
  _id: string;
  id: string;
  name: string;
  wabaId: string;
  businessId?: string;
  appId?: string;
  timezoneId?: string;
  currency?: string;
  messageTemplateNamespace?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISCONNECTED';
  organizationId?: {
    _id: string;
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
  createdAt: string;
}

export interface WhatsAppNumberItem {
  _id: string;
  id: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  codeVerificationStatus: string;
  qualityRating: 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN' | 'NA';
  messagingTier: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISCONNECTED';
  isDefault: boolean;
  wabaAccountId?: {
    _id: string;
    name: string;
    wabaId: string;
    status: string;
  };
  organizationId?: {
    _id: string;
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
  createdAt: string;
}

export interface WhatsAppDebuggerReport {
  phoneNumber: {
    id: string;
    displayPhoneNumber: string;
    verifiedName: string;
    qualityRating: string;
    messagingTier: string;
    status: string;
    pinConfigured: boolean;
    webhookVerified: boolean;
  };
  wabaAccount: {
    id?: string;
    name?: string;
    wabaId?: string;
    appId?: string;
    tokenStatus: string;
  };
  organization: {
    id?: string;
    name?: string;
    slug?: string;
    plan?: string;
    status?: string;
  };
  diagnostics: Array<{
    check: string;
    label: string;
    status: 'PASS' | 'FAIL' | 'WARN' | 'INFO';
    message: string;
    details?: any;
  }>;
  metaHealth: {
    status: string;
    latencyMs: number;
  };
  recentActivity: {
    lastMessageAt: string | null;
    messageCount24h: number;
  };
  overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface AdminMessageItem {
  _id: string;
  id: string;
  wamid?: string;
  direction: 'INBOUND' | 'OUTBOUND';
  type: string;
  status: 'QUEUED' | 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  from: string;
  to: string;
  body?: string;
  mediaUrl?: string;
  errorCode?: string;
  errorMessage?: string;
  retryCount?: number;
  organizationId?: {
    _id: string;
    id: string;
    name: string;
    slug: string;
  };
  phoneNumberId?: {
    _id: string;
    displayPhoneNumber: string;
    verifiedName: string;
  };
  contactId?: {
    _id: string;
    name: string;
    phone: string;
  };
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
}

export interface AdminMessagesResponse {
  messages: AdminMessageItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  summary: {
    totalMessages: number;
    delivered: number;
    read: number;
    failed: number;
    sent: number;
  };
}

export interface MessageTraceStep {
  stepNumber: number;
  stepCode: string;
  name: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING' | 'SKIPPED';
  timestamp?: string;
  description: string;
  metadata?: any;
  isErrorStep?: boolean;
  rootCause?: string;
  fixRecommendation?: string;
}

export interface MessageTraceReport {
  message: {
    id: string;
    wamid?: string;
    direction: string;
    type: string;
    status: string;
    from: string;
    to: string;
    createdAt: string;
    deliveredAt?: string;
    readAt?: string;
    failedAt?: string;
    errorCode?: string;
    errorMessage?: string;
    retryCount?: number;
  };
  organization: {
    id?: string;
    name?: string;
    slug?: string;
    plan?: string;
    status?: string;
  };
  senderPhone: {
    id?: string;
    displayPhoneNumber?: string;
    verifiedName?: string;
    status?: string;
  };
  steps: MessageTraceStep[];
  diagnostics: {
    hasFailed: boolean;
    failedAtStep?: number;
    rootCause?: string;
    fixRecommendation?: string;
    latencyTotalMs?: number;
  };
}

export interface WebhooksSummaryReport {
  metaWebhook: {
    endpoint: string;
    status: string;
    verifyTokenConfigured: boolean;
    pingTimeMs: number;
  };
  customerWebhooks: {
    totalEndpoints: number;
    activeEndpoints: number;
    disabledEndpoints: number;
  };
  recentDeliveries: {
    total24h: number;
    success24h: number;
    failed24h: number;
    successRate: number;
  };
}

export interface CustomerWebhookItem {
  _id: string;
  id: string;
  url: string;
  description?: string;
  events: string[];
  isActive: boolean;
  retryCount: number;
  organizationId?: {
    _id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

export interface WebhookDeliveryLogItem {
  _id: string;
  id: string;
  event: string;
  url: string;
  responseStatus: number;
  responseBody?: string;
  durationMs: number;
  status: 'SUCCESS' | 'FAILED' | 'RETRYING';
  attempt: number;
  maxAttempts: number;
  error?: string;
  organizationId?: {
    _id: string;
    name: string;
  };
  webhookId?: {
    _id: string;
    url: string;
  };
  createdAt: string;
}

export interface OmniSearchResult {
  query: string;
  results: {
    organizations: any[];
    users: any[];
    phoneNumbers: any[];
    messages: any[];
    totalCount: number;
  };
}


import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DeveloperLayout } from '../layouts/DeveloperLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { Home } from '../features/public/pages/Home';
import { Features } from '../features/public/pages/Features';
import { Pricing } from '../features/public/pages/Pricing';
import { Solutions } from '../features/public/pages/Solutions';
import { About } from '../features/public/pages/About';
import { Contact } from '../features/public/pages/Contact';
import { NotFound } from '../features/public/pages/NotFound';

// Auth Pages
import { Login } from '../features/auth/pages/Login';
import { Register } from '../features/auth/pages/Register';
import { ForgotPassword } from '../features/auth/pages/ForgotPassword';
import { ResetPassword } from '../features/auth/pages/ResetPassword';
import { AcceptInvite } from '../features/auth/pages/AcceptInvite';

// Dashboard
import { Dashboard } from '../features/dashboard/pages/Dashboard';

// Inbox
import { Inbox } from '../features/inbox/pages/Inbox';

// Contacts
import { Contacts } from '../features/contacts/pages/Contacts';
import { ContactDetails } from '../features/contacts/pages/ContactDetails';

// WhatsApp
import { WhatsAppNumbers } from '../features/whatsapp/pages/WhatsAppNumbers';
import { ConnectWhatsApp } from '../features/whatsapp/pages/ConnectWhatsApp';
import { WhatsAppDetails } from '../features/whatsapp/pages/WhatsAppDetails';

// Templates
import { Templates } from '../features/templates/pages/Templates';
import { CreateTemplate } from '../features/templates/pages/CreateTemplate';
import { TemplateDetails } from '../features/templates/pages/TemplateDetails';

// Campaigns
import { Campaigns } from '../features/campaigns/pages/Campaigns';
import { CreateCampaign } from '../features/campaigns/pages/CreateCampaign';
import { CampaignDetails } from '../features/campaigns/pages/CampaignDetails';

// Automation
import { Automations } from '../features/automation/pages/Automations';
import { CreateAutomation } from '../features/automation/pages/CreateAutomation';

// AI
import { AIDashboard } from '../features/ai/pages/AIDashboard';
import { AIAgent } from '../features/ai/pages/AIAgent';
import { KnowledgeBase } from '../features/ai/pages/KnowledgeBase';
import { AITools } from '../features/ai/pages/AITools';
import { AIHandoff } from '../features/ai/pages/AIHandoff';
import { AISettings } from '../features/ai/pages/AISettings';

// Analytics
import { Analytics } from '../features/analytics/pages/Analytics';

// Billing
import { Billing } from '../features/billing/pages/Billing';
import { Plans } from '../features/billing/pages/Plans';
import { Invoices } from '../features/billing/pages/Invoices';

// Developers
import { DeveloperDashboard } from '../features/developers/pages/DeveloperDashboard';
import { APIKeys } from '../features/developers/pages/APIKeys';
import { Webhooks } from '../features/developers/pages/Webhooks';
import { APILogs } from '../features/developers/pages/APILogs';
import { Documentation } from '../features/developers/pages/Documentation';

// Team
import { Team } from '../features/team/pages/Team';
import { RolesPermissions } from '../features/team/pages/RolesPermissions';

// Settings
import { AccountSettings } from '../features/settings/pages/AccountSettings';
import { BusinessProfile } from '../features/settings/pages/BusinessProfile';
import { Security } from '../features/settings/pages/Security';

// Notifications
import { Notifications } from '../features/notifications/pages/Notifications';

import { ROUTES } from '../utils/constants';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Marketing Website */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.PUBLIC_FEATURES} element={<Features />} />
        <Route path={ROUTES.PUBLIC_PRICING} element={<Pricing />} />
        <Route path={ROUTES.PUBLIC_SOLUTIONS} element={<Solutions />} />
        <Route path={ROUTES.PUBLIC_ABOUT} element={<About />} />
        <Route path={ROUTES.PUBLIC_CONTACT} element={<Contact />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.ACCEPT_INVITE} element={<AcceptInvite />} />
      </Route>

      {/* Protected Dashboard Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.INBOX} element={<Inbox />} />
          <Route path={ROUTES.CONTACTS} element={<Contacts />} />
          <Route path={ROUTES.CONTACT_DETAILS} element={<ContactDetails />} />
          
          <Route path={ROUTES.WHATSAPP_NUMBERS} element={<WhatsAppNumbers />} />
          <Route path={ROUTES.CONNECT_WHATSAPP} element={<ConnectWhatsApp />} />
          <Route path={ROUTES.WHATSAPP_DETAILS} element={<WhatsAppDetails />} />
          
          <Route path={ROUTES.TEMPLATES} element={<Templates />} />
          <Route path={ROUTES.CREATE_TEMPLATE} element={<CreateTemplate />} />
          <Route path={ROUTES.TEMPLATE_DETAILS} element={<TemplateDetails />} />
          
          <Route path={ROUTES.CAMPAIGNS} element={<Campaigns />} />
          <Route path={ROUTES.CREATE_CAMPAIGN} element={<CreateCampaign />} />
          <Route path={ROUTES.CAMPAIGN_DETAILS} element={<CampaignDetails />} />
          
          <Route path={ROUTES.AUTOMATIONS} element={<Automations />} />
          <Route path={ROUTES.CREATE_AUTOMATION} element={<CreateAutomation />} />
          
          <Route path={ROUTES.AI_DASHBOARD} element={<AIDashboard />} />
          <Route path={ROUTES.AI_AGENT} element={<AIAgent />} />
          <Route path={ROUTES.AI_KNOWLEDGE_BASE} element={<KnowledgeBase />} />
          <Route path={ROUTES.AI_TOOLS} element={<AITools />} />
          <Route path={ROUTES.AI_HANDOFF} element={<AIHandoff />} />
          <Route path={ROUTES.AI_SETTINGS} element={<AISettings />} />
          
          <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
          
          <Route path={ROUTES.BILLING} element={<Billing />} />
          <Route path={ROUTES.BILLING_PLANS} element={<Plans />} />
          <Route path={ROUTES.BILLING_INVOICES} element={<Invoices />} />

          {/* Developer Section with Main Sidebar & Header */}
          <Route element={<DeveloperLayout />}>
            <Route path={ROUTES.DEVELOPERS_DASHBOARD} element={<DeveloperDashboard />} />
            <Route path={ROUTES.DEVELOPERS_API_KEYS} element={<APIKeys />} />
            <Route path={ROUTES.DEVELOPERS_WEBHOOKS} element={<Webhooks />} />
            <Route path={ROUTES.DEVELOPERS_API_LOGS} element={<APILogs />} />
            <Route path={ROUTES.DEVELOPERS_DOCS} element={<Documentation />} />
          </Route>
          
          <Route path={ROUTES.TEAM} element={<Team />} />
          <Route path={ROUTES.ROLES_PERMISSIONS} element={<RolesPermissions />} />
          
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
          <Route path={ROUTES.ACCOUNT_SETTINGS} element={<AccountSettings />} />
          <Route path={ROUTES.BUSINESS_PROFILE} element={<BusinessProfile />} />
          <Route path={ROUTES.SECURITY_SETTINGS} element={<Security />} />
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


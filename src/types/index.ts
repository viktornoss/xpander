export type UserRole = 'pending' | 'client' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  avatar?: string;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  createdAt: string;
  phone?: string;
  apiKey?: string;
  plainPassword?: string;
  status?: 'active' | 'suspended' | 'pending';
  lastLogin?: string;
  notes?: string;
}

export interface AutomationItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'chatbot' | 'support' | 'email' | 'leads' | 'crm' | 'booking' | 'agent';
  status: 'active' | 'paused' | 'error' | 'building';
  trigger: string;
  actionsCount: number;
  lastRun: string;
  totalRuns: number;
  successRate: number;
  nativeWebhookUrl?: string;
  workflowId?: string;
  nextScheduled?: string;
}

export interface ChatbotConfig {
  id: string;
  userId: string;
  name: string;
  status: 'online' | 'offline' | 'training';
  model: 'gpt-4o' | 'gpt-4o-mini' | 'claude-3-5-sonnet';
  systemPrompt: string;
  welcomeMessage: string;
  totalConversations: number;
  avgResponseTime: string;
  satisfactionScore: number;
  knowledgeBaseFilesCount: number;
  accentColor: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: string;
  priceNumeric: number;
  packageType?: string;
  subtitle?: string;
  quantity: number;
}

export interface ServiceOrder {
  id: string;
  userId: string;
  clientName: string;
  clientCompany: string;
  clientEmail?: string;
  clientPhone?: string;
  billingAddress?: string;
  taxNumber?: string;
  paymentMethod?: 'bank_transfer' | 'paypal';
  serviceId: string;
  serviceTitle: string;
  packageType: 'Starter' | 'Growth' | 'Enterprise' | 'Custom';
  price: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paidAt?: string;
  createdAt: string;
  deliveryDate?: string;
  notes?: string;
  assignedEngineer?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AutomationLog {
  id: string;
  automationId: string;
  automationTitle: string;
  status: 'success' | 'failure' | 'running';
  executionTimeMs: number;
  timestamp: string;
  payloadSummary: string;
}

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  heroHeadline: string;
  detailedDesc: string;
  iconName: string;
  badge: string;
  deliverables: string[];
  businessBenefits: string[];
  techStack: string[];
  pricingNote: string;
  demoType: 'chat' | 'flow' | 'crm' | 'lead' | 'email' | 'booking' | 'agent';
  timeSaved?: string;
  setupTime?: string;
}


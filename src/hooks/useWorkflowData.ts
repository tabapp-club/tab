import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface WorkflowData {
  activeWorkflows: number;
  messagesSent: string;
  openRate: string;
  responseRate: string;
  totalRevenue: number;
  costSavings: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "paused";
  steps: any[];
  createdAt: string;
  updatedAt: string;
}

interface Template {
  id: string;
  name: string;
  channel: "whatsapp" | "sms";
  category: string;
  content: string;
  variables: string[];
  isActive: boolean;
  usage: number;
  createdAt: string;
  updatedAt: string;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: "event" | "schedule" | "condition";
    event?: string;
    schedule?: string;
    condition?: string;
  };
  conditions: any[];
  actions: any[];
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

interface Integration {
  id: string;
  name: string;
  type: "whatsapp" | "sms";
  status: "connected" | "disconnected" | "error";
  provider: string;
  config: any;
  lastSync: string;
  messageCount: number;
  errorRate: number;
}

// Mock data for development
const mockWorkflowData: WorkflowData = {
  activeWorkflows: 12,
  messagesSent: "24.5K",
  openRate: "68.2%",
  responseRate: "23.4%",
  totalRevenue: 125000,
  costSavings: 45000
};

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Welcome Series",
    description: "Send welcome messages to new customers",
    status: "active",
    steps: [
      {
        id: "trigger-1",
        type: "trigger",
        title: "New Customer Signup",
        description: "Triggered when a new customer registers",
        config: { event: "customer_signup" }
      },
      {
        id: "action-1",
        type: "action",
        title: "Send Welcome Email",
        description: "Send personalized welcome email",
        config: { template: "welcome_email", channel: "email" }
      }
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  }
];

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Welcome Message - WhatsApp",
    channel: "whatsapp",
    category: "welcome",
    content: "Hi {{customer_name}}! 👋\n\nWelcome to {{company_name}}! We're excited to have you on board. Get started with 20% off your first order using code {{discount_code}}.",
    variables: ["customer_name", "company_name", "discount_code"],
    isActive: true,
    usage: 1250,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  },
  {
    id: "2",
    name: "Welcome Message - SMS",
    channel: "sms",
    category: "welcome",
    content: "Welcome to {{company_name}}! We're excited to have you on board. Get started with 20% off your first order using code {{discount_code}}.",
    variables: ["customer_name", "company_name", "discount_code"],
    isActive: true,
    usage: 890,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-21"
  },
  {
    id: "3",
    name: "Appointment Reminder - WhatsApp",
    channel: "whatsapp",
    category: "reminder",
    content: "Hi {{customer_name}}! 📅\n\nReminder: You have an appointment on {{appointment_date}} at {{appointment_time}}. Please confirm your attendance by replying YES.",
    variables: ["customer_name", "appointment_date", "appointment_time"],
    isActive: true,
    usage: 567,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-22"
  },
  {
    id: "4",
    name: "Appointment Reminder - SMS",
    channel: "sms",
    category: "reminder",
    content: "Reminder: You have an appointment on {{appointment_date}} at {{appointment_time}}. Please confirm your attendance by replying YES.",
    variables: ["customer_name", "appointment_date", "appointment_time"],
    isActive: true,
    usage: 423,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-23"
  },
  {
    id: "5",
    name: "Follow-up Message - WhatsApp",
    channel: "whatsapp",
    category: "followup",
    content: "Hi {{customer_name}}! 😊\n\nHow was your experience with {{product_name}} (Order #{{order_id}})? We'd love to hear your feedback and help with any questions.",
    variables: ["customer_name", "product_name", "order_id"],
    isActive: false,
    usage: 234,
    createdAt: "2024-01-19",
    updatedAt: "2024-01-24"
  },
  {
    id: "6",
    name: "Follow-up Message - SMS",
    channel: "sms",
    category: "followup",
    content: "How was your experience with {{product_name}} (Order #{{order_id}})? We'd love to hear your feedback and help with any questions.",
    variables: ["customer_name", "product_name", "order_id"],
    isActive: false,
    usage: 156,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25"
  }
];

const mockAutomationRules: AutomationRule[] = [
  {
    id: "1",
    name: "Welcome New Customers",
    description: "Send welcome message to new customer signups",
    trigger: {
      type: "event",
      event: "customer_signup"
    },
    conditions: [
      {
        field: "customer_type",
        operator: "equals",
        value: "new"
      }
    ],
    actions: [
      {
        type: "send_message",
        channel: "email",
        template: "welcome_email",
        delay: 0
      }
    ],
    isActive: true,
    priority: 1,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20"
  }
];

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "WhatsApp Business API",
    type: "whatsapp",
    status: "connected",
    provider: "Meta",
    config: {
      apiKey: "wab_****_****_****",
      webhookUrl: "https://api.tabapp.com/webhook/whatsapp",
      phoneNumber: "+91 98765 43210"
    },
    lastSync: "2024-01-20 14:30:00",
    messageCount: 15420,
    errorRate: 0.2
  },
  {
    id: "2",
    name: "SMS Gateway",
    type: "sms",
    status: "connected",
    provider: "TextLocal",
    config: {
      apiKey: "tl_****_****_****",
      senderId: "TABAPP"
    },
    lastSync: "2024-01-20 14:25:00",
    messageCount: 8930,
    errorRate: 0.1
  }
];

// API functions (mock implementations)
const fetchWorkflowData = async (): Promise<WorkflowData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockWorkflowData;
};

const fetchWorkflows = async (): Promise<Workflow[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockWorkflows;
};

const fetchTemplates = async (): Promise<Template[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTemplates;
};

const fetchAutomationRules = async (): Promise<AutomationRule[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAutomationRules;
};

const fetchIntegrations = async (): Promise<Integration[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockIntegrations;
};

const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newWorkflow: Workflow = {
    ...workflow,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  return newWorkflow;
};

const updateWorkflow = async (id: string, updates: Partial<Workflow>): Promise<Workflow> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const existingWorkflow = mockWorkflows.find(w => w.id === id);
  if (!existingWorkflow) {
    throw new Error('Workflow not found');
  }
  const updatedWorkflow: Workflow = {
    ...existingWorkflow,
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  return updatedWorkflow;
};

const deleteWorkflow = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // In real implementation, this would make an API call
};

const createTemplate = async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newTemplate: Template = {
    ...template,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  return newTemplate;
};

const updateTemplate = async (id: string, updates: Partial<Template>): Promise<Template> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const existingTemplate = mockTemplates.find(t => t.id === id);
  if (!existingTemplate) {
    throw new Error('Template not found');
  }
  const updatedTemplate: Template = {
    ...existingTemplate,
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  return updatedTemplate;
};

const deleteTemplate = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // In real implementation, this would make an API call
};

const createAutomationRule = async (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutomationRule> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newRule: AutomationRule = {
    ...rule,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  return newRule;
};

const updateAutomationRule = async (id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const existingRule = mockAutomationRules.find(r => r.id === id);
  if (!existingRule) {
    throw new Error('Automation rule not found');
  }
  const updatedRule: AutomationRule = {
    ...existingRule,
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  return updatedRule;
};

const deleteAutomationRule = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // In real implementation, this would make an API call
};

const updateIntegration = async (id: string, updates: Partial<Integration>): Promise<Integration> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const existingIntegration = mockIntegrations.find(i => i.id === id);
  if (!existingIntegration) {
    throw new Error('Integration not found');
  }
  const updatedIntegration: Integration = {
    ...existingIntegration,
    ...updates,
    lastSync: new Date().toLocaleString()
  };
  return updatedIntegration;
};

// Custom hooks
export const useWorkflowData = () => {
  return useQuery({
    queryKey: ['workflowData'],
    queryFn: fetchWorkflowData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkflows = () => {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: fetchWorkflows,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAutomationRules = () => {
  return useQuery({
    queryKey: ['automationRules'],
    queryFn: fetchAutomationRules,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useIntegrations = () => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: fetchIntegrations,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflowData'] });
    },
  });
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Workflow> }) => 
      updateWorkflow(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflowData'] });
    },
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Template> }) => 
      updateTemplate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useCreateAutomationRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAutomationRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
    },
  });
};

export const useUpdateAutomationRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AutomationRule> }) => 
      updateAutomationRule(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
    },
  });
};

export const useDeleteAutomationRule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAutomationRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationRules'] });
    },
  });
};

export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Integration> }) => 
      updateIntegration(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });
};

// Export types for use in components
export type { WorkflowData, Workflow, Template, AutomationRule, Integration };

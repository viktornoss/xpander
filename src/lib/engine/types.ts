// ============================================================================
// NEXUS NATIVE TYPESCRIPT AUTOMATION ENGINE - TYPE DEFINITIONS
// ============================================================================

export type NodeCategory = 'trigger' | 'ai' | 'logic' | 'action' | 'transform';

export type NodeType =
  // Triggers
  | 'trigger_webhook'
  | 'trigger_schedule'
  | 'trigger_email'
  | 'trigger_form'
  | 'trigger_manual'
  // AI & LLM (OpenAI Powered)
  | 'ai_openai_chat'
  | 'ai_data_extractor'
  | 'ai_sentiment_analyzer'
  | 'ai_lead_qualifier'
  | 'ai_agent_step'
  // Logic & Control Flow
  | 'logic_condition'     // If / Else branching
  | 'logic_delay'         // Wait / Sleep timer
  | 'logic_loop'          // ForEach array iteration
  | 'logic_error_handler' // Try / Catch / Fallback
  // Actions & Integrations
  | 'action_http_request' // Custom REST API / Webhook
  | 'action_send_email'
  | 'action_crm_update'
  | 'action_database_query'
  // Data Transformation
  | 'transform_code'
  | 'transform_filter';

export type HandleType = 'default' | 'true' | 'false' | 'error' | 'loop_item' | 'loop_done';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  category: NodeCategory;
  title: string;
  description: string;
  position: { x: number; y: number };
  config: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: HandleType;
  label?: string;
}

export interface WorkflowDefinition {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  webhookEndpoint?: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalRuns: number;
    successRate: number;
    avgDurationMs: number;
    lastRun?: string;
  };
}

export type StepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

export interface WorkflowRunStep {
  id: string;
  runId: string;
  nodeId: string;
  nodeTitle: string;
  nodeType: NodeType;
  status: StepStatus;
  inputData: any;
  outputData: any;
  durationMs: number;
  errorMessage?: string;
  executedAt: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowName: string;
  userId: string;
  status: 'running' | 'success' | 'failed' | 'paused';
  triggerSource: string;
  initialPayload: any;
  finalOutput?: any;
  steps: WorkflowRunStep[];
  durationMs: number;
  startedAt: string;
  finishedAt?: string;
  errorSummary?: string;
}

export interface ApiConnector {
  id: string;
  userId: string;
  name: string;
  baseUrl: string;
  authType: 'none' | 'bearer' | 'api_key' | 'basic';
  authHeaderKey?: string;
  authSecret?: string;
  defaultHeaders?: Record<string, string>;
  createdAt: string;
}

export interface ExecutionContext {
  workflowId: string;
  runId: string;
  variables: Record<string, any>;
  nodeOutputs: Record<string, any>;
  currentLoopIndex?: number;
  currentLoopItem?: any;
}


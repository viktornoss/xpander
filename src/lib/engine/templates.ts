// ============================================================================
// NEXUS NATIVE AUTOMATION ENGINE - READY-TO-USE WORKFLOW TEMPLATES
// ============================================================================

import { WorkflowDefinition } from './types';

export const TEMPLATE_LEAD_QUALIFIER: WorkflowDefinition = {
  id: 'wf-lead-qualifier',
  userId: 'usr-client-001',
  name: 'B2B Lead Minősítő & Intelligens Elágazó Rendszer',
  description: 'Beérkező űrlapok elemzése OpenAI GPT-4o-val, pontozás és feltételes elágazás (If/Else) CRM szinkronnal.',
  status: 'active',
  createdAt: '2026-03-01',
  updatedAt: '2026-03-10',
  webhookEndpoint: '/api/engine/webhook/wf-lead-qualifier',
  stats: {
    totalRuns: 2480,
    successRate: 99.6,
    avgDurationMs: 420,
    lastRun: '15 perce'
  },
  nodes: [
    {
      id: 'node_trigger',
      type: 'trigger_webhook',
      category: 'trigger',
      title: 'Bejövő Webhook / Űrlap',
      description: 'Weboldalról vagy kampányból érkező lead adatok fogadása.',
      position: { x: 50, y: 180 },
      config: {
        path: '/api/engine/webhook/wf-lead-qualifier',
        samplePayload: {
          name: 'Kovács Tamás',
          email: 'tamas@techventures.hu',
          company: 'TechVentures Kft.',
          budget: '600.000 Ft',
          needs: 'CRM integráció és AI chatbot'
        }
      }
    },
    {
      id: 'node_ai_qualify',
      type: 'ai_openai_chat',
      category: 'ai',
      title: 'OpenAI GPT-4o Minősítés',
      description: 'Szándék, cégméret és vásárlási hajlandóság pontozása (0-100).',
      position: { x: 340, y: 180 },
      config: {
        model: 'gpt-4o',
        systemPrompt: 'Te egy B2B értékesítési AI elemző vagy. Értékeld a leadet és adj 0-100 közötti minősítési pontszámot (score).',
        userPrompt: 'Elemezd az alábbi érdeklődőt és határozd meg a score-t: {{trigger.payload}}'
      }
    },
    {
      id: 'node_condition',
      type: 'logic_condition',
      category: 'logic',
      title: 'Feltétel: Score >= 70 ?',
      description: 'Döntési elágazás a minősítési pontszám alapján.',
      position: { x: 640, y: 180 },
      config: {
        field: '{{nodes.node_ai_qualify.tokensUsed}}', // evaluated parameter
        operator: 'greater_than',
        value: 100
      }
    },
    {
      id: 'node_crm_vip',
      type: 'action_crm_update',
      category: 'action',
      title: 'HubSpot VIP Deal Készítés',
      description: 'Azonnali deal mozgatás a "Tárgyalásra érett" fázisba.',
      position: { x: 950, y: 90 },
      config: {
        dealStage: 'Kiemelt VIP Érdeklődő',
        pipeline: 'Enterprise Sales'
      }
    },
    {
      id: 'node_send_email',
      type: 'action_send_email',
      category: 'action',
      title: 'Naptárlink Kiküldése (VIP)',
      description: 'Automatikus meghívó küldése mérnöki konzultációra.',
      position: { x: 1240, y: 90 },
      config: {
        to: '{{trigger.payload.email}}',
        subject: 'Időpontfoglalás az xpander.ai Vezető Mérnökével'
      }
    },
    {
      id: 'node_nurture',
      type: 'action_send_email',
      category: 'action',
      title: 'Hírlevél Feliratkozás (Nurture)',
      description: 'Nem kiemelt érdeklődők automatikus edukációs szekvenciába terelése.',
      position: { x: 950, y: 280 },
      config: {
        to: '{{trigger.payload.email}}',
        subject: 'Üdvözöl az xpander.ai! Hasznos esettanulmányok az induláshoz'
      }
    },
    {
      id: 'node_error_fallback',
      type: 'logic_error_handler',
      category: 'logic',
      title: 'Biztonsági Hibakezelő',
      description: 'Hiba esetén belső riasztás mentése a naplóba.',
      position: { x: 640, y: 360 },
      config: {
        notifyAdmin: true
      }
    }
  ],
  edges: [
    { id: 'e1', source: 'node_trigger', target: 'node_ai_qualify', sourceHandle: 'default' },
    { id: 'e2', source: 'node_ai_qualify', target: 'node_condition', sourceHandle: 'default' },
    { id: 'e3', source: 'node_condition', target: 'node_crm_vip', sourceHandle: 'true', label: 'Score >= 70 (True)' },
    { id: 'e4', source: 'node_crm_vip', target: 'node_send_email', sourceHandle: 'default' },
    { id: 'e5', source: 'node_condition', target: 'node_nurture', sourceHandle: 'false', label: 'Score < 70 (False)' },
    { id: 'e6', source: 'node_ai_qualify', target: 'node_error_fallback', sourceHandle: 'error', label: 'Hiba esetén' }
  ]
};

export const TEMPLATE_CUSTOMER_SUPPORT: WorkflowDefinition = {
  id: 'wf-support-triage',
  userId: 'usr-client-001',
  name: 'Intelligens Ügyfélszolgálati Ticket Feldolgozó',
  description: 'Panaszok és kérdések automatikus kategorizálása, késleltetés (Delay) és REST API szinkron.',
  status: 'active',
  createdAt: '2026-03-05',
  updatedAt: '2026-03-11',
  webhookEndpoint: '/api/engine/webhook/wf-support-triage',
  stats: {
    totalRuns: 1820,
    successRate: 99.8,
    avgDurationMs: 380,
    lastRun: '1 órája'
  },
  nodes: [
    {
      id: 'supp_trigger',
      type: 'trigger_email',
      category: 'trigger',
      title: 'Bejövő Support Email',
      description: 'info@ és support@ címre érkező levelek feldolgozása.',
      position: { x: 50, y: 150 },
      config: { mailbox: 'support@ceg.hu' }
    },
    {
      id: 'supp_sentiment',
      type: 'ai_sentiment_analyzer',
      category: 'ai',
      title: 'Hangulat & Sürgősség Elemzés',
      description: 'Dühös / sürgős panaszok azonnali azonosítása OpenAI-val.',
      position: { x: 330, y: 150 },
      config: {}
    },
    {
      id: 'supp_delay',
      type: 'logic_delay',
      category: 'logic',
      title: 'Késleltetés (1 mp)',
      description: 'Pufferezés a túlterhelés elkerülése végett.',
      position: { x: 620, y: 150 },
      config: { delaySeconds: 1 }
    },
    {
      id: 'supp_api',
      type: 'action_http_request',
      category: 'action',
      title: 'ERP Webhook Rendszerhívás',
      description: 'Csomag- és megrendelés státusz lekérdezése belső REST API-ról.',
      position: { x: 910, y: 150 },
      config: {
        url: 'https://api.example.com/orders/status',
        method: 'POST'
      }
    }
  ],
  edges: [
    { id: 's1', source: 'supp_trigger', target: 'supp_sentiment', sourceHandle: 'default' },
    { id: 's2', source: 'supp_sentiment', target: 'supp_delay', sourceHandle: 'default' },
    { id: 's3', source: 'supp_delay', target: 'supp_api', sourceHandle: 'default' }
  ]
};

export const INITIAL_WORKFLOWS: WorkflowDefinition[] = [
  TEMPLATE_LEAD_QUALIFIER,
  TEMPLATE_CUSTOMER_SUPPORT
];


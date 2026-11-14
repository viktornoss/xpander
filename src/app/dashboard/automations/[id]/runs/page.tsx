'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  ArrowRight,
  Layers,
  Cpu
} from 'lucide-react';
import { TEMPLATE_LEAD_QUALIFIER, TEMPLATE_CUSTOMER_SUPPORT } from '@/lib/engine/templates';
import { WorkflowRun } from '@/lib/engine/types';

export default function WorkflowRunsPage() {
  const params = useParams();
  const id = params?.id as string;

  const currentWf = id === 'wf-support-triage' ? TEMPLATE_CUSTOMER_SUPPORT : TEMPLATE_LEAD_QUALIFIER;

  const [expandedRunId, setExpandedRunId] = useState<string | null>('run-101');

  // Realistic execution history
  const [runs, setRuns] = useState<WorkflowRun[]>([
    {
      id: 'run-101',
      workflowId: currentWf.id,
      workflowName: currentWf.name,
      userId: 'usr-client-001',
      status: 'success',
      triggerSource: 'Webhook / Űrlap',
      initialPayload: { name: 'Kovács Tamás', email: 'tamas@techventures.hu', score: 85 },
      finalOutput: { vipStatus: true, emailSent: true, dealCreated: true },
      durationMs: 412,
      startedAt: '2026-03-11 14:38:12',
      finishedAt: '2026-03-11 14:38:12',
      steps: [
        {
          id: 's-1',
          runId: 'run-101',
          nodeId: 'node_trigger',
          nodeTitle: 'Bejövő Webhook / Űrlap',
          nodeType: 'trigger_webhook',
          status: 'success',
          inputData: { name: 'Kovács Tamás', email: 'tamas@techventures.hu' },
          outputData: { received: true, timestamp: '14:38:12' },
          durationMs: 8,
          executedAt: '14:38:12'
        },
        {
          id: 's-2',
          runId: 'run-101',
          nodeId: 'node_ai_qualify',
          nodeTitle: 'OpenAI GPT-4o Minősítés',
          nodeType: 'ai_openai_chat',
          status: 'success',
          inputData: { prompt: 'Elemezd az érdeklődőt' },
          outputData: { score: 85, summary: 'Kiemelt érdeklődő, magas szándék' },
          durationMs: 280,
          executedAt: '14:38:12'
        },
        {
          id: 's-3',
          runId: 'run-101',
          nodeId: 'node_condition',
          nodeTitle: 'Feltétel: Score >= 70 ?',
          nodeType: 'logic_condition',
          status: 'success',
          inputData: { evaluated: 85, condition: '>= 70' },
          outputData: { branch: 'true' },
          durationMs: 2,
          executedAt: '14:38:12'
        },
        {
          id: 's-4',
          runId: 'run-101',
          nodeId: 'node_crm_vip',
          nodeTitle: 'HubSpot VIP Deal Készítés',
          nodeType: 'action_crm_update',
          status: 'success',
          inputData: { dealStage: 'VIP' },
          outputData: { dealId: 'deal_9921', status: 'created' },
          durationMs: 122,
          executedAt: '14:38:12'
        }
      ]
    },
    {
      id: 'run-102',
      workflowId: currentWf.id,
      workflowName: currentWf.name,
      userId: 'usr-client-001',
      status: 'success',
      triggerSource: 'Webhook / Űrlap',
      initialPayload: { name: 'Kiss Péter', email: 'peter@pelda.hu', score: 45 },
      finalOutput: { nurtureAdded: true },
      durationMs: 380,
      startedAt: '2026-03-11 12:15:04',
      finishedAt: '2026-03-11 12:15:04',
      steps: [
        {
          id: 's-21',
          runId: 'run-102',
          nodeId: 'node_trigger',
          nodeTitle: 'Bejövő Webhook',
          nodeType: 'trigger_webhook',
          status: 'success',
          inputData: {},
          outputData: {},
          durationMs: 5,
          executedAt: '12:15:04'
        },
        {
          id: 's-22',
          runId: 'run-102',
          nodeId: 'node_ai_qualify',
          nodeTitle: 'OpenAI GPT-4o Minősítés',
          nodeType: 'ai_openai_chat',
          status: 'success',
          inputData: {},
          outputData: { score: 45 },
          durationMs: 260,
          executedAt: '12:15:04'
        },
        {
          id: 's-23',
          runId: 'run-102',
          nodeId: 'node_condition',
          nodeTitle: 'Feltétel: Score >= 70 ?',
          nodeType: 'logic_condition',
          status: 'success',
          inputData: { evaluated: 45 },
          outputData: { branch: 'false' },
          durationMs: 3,
          executedAt: '12:15:04'
        },
        {
          id: 's-24',
          runId: 'run-102',
          nodeId: 'node_nurture',
          nodeTitle: 'Hírlevél Feliratkozás (Nurture)',
          nodeType: 'action_send_email',
          status: 'success',
          inputData: { to: 'peter@pelda.hu' },
          outputData: { emailSent: true },
          durationMs: 112,
          executedAt: '12:15:04'
        }
      ]
    }
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/dashboard/automations" className="hover:text-white">Automatizációk</Link>
            <span>/</span>
            <span className="text-neon-blue">{currentWf.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Futtatási Előzmények & Részletes Telemetria
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Minden végrehajtási ciklus lépésről lépésre, bemeneti és kimeneti JSON payloadokkal naplózva.
          </p>
        </div>

        <Link
          href={`/dashboard/builder/${currentWf.id}`}
          className="px-4 py-2 rounded-xl bg-neon-purple text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-neon-purple/20 shadow-md hover:opacity-90"
        >
          <span>Megnyitás a Szerkesztőben</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Runs List */}
      <div className="space-y-4">
        {runs.map((run) => {
          const isExpanded = expandedRunId === run.id;
          return (
            <div
              key={run.id}
              className="rounded-3xl glass-panel border border-white/10 overflow-hidden transition-all"
            >
              {/* Run summary row */}
              <div
                onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{run.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                        {run.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Trigger: <strong className="text-gray-300">{run.triggerSource}</strong> • Időpont: {run.startedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-400">{run.durationMs} ms</div>
                    <div className="text-[10px] text-gray-400">{run.steps.length} lépés végrehajtva</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Step by step detail */}
              {isExpanded && (
                <div className="p-5 bg-nexus-950/80 border-t border-white/10 space-y-4 animate-in fade-in">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Lépésenkénti Végrehajtási Fa:
                  </div>

                  <div className="space-y-3">
                    {run.steps.map((step, idx) => (
                      <div
                        key={step.id}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-2 font-mono"
                      >
                        <div className="flex items-center justify-between font-sans">
                          <span className="font-bold text-white flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-neon-purple/20 text-neon-purple text-[10px] flex items-center justify-center font-mono">
                              {idx + 1}
                            </span>
                            <span>{step.nodeTitle}</span>
                          </span>
                          <span className="text-emerald-400 font-mono text-[11px] font-bold">
                            {step.durationMs} ms
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                          <div className="p-2 rounded-xl bg-nexus-900 border border-white/5">
                            <span className="text-[9px] uppercase font-bold text-gray-500 font-sans block mb-1">Bemenet (Input Payload):</span>
                            <pre className="text-[10px] text-gray-300 overflow-x-auto max-h-24">
                              {JSON.stringify(step.inputData, null, 2)}
                            </pre>
                          </div>

                          <div className="p-2 rounded-xl bg-nexus-900 border border-white/5">
                            <span className="text-[9px] uppercase font-bold text-neon-blue font-sans block mb-1">Kimenet (Output Data):</span>
                            <pre className="text-[10px] text-neon-cyan overflow-x-auto max-h-24">
                              {JSON.stringify(step.outputData, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}


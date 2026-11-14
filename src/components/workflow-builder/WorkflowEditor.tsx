'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Save, 
  Plus, 
  Trash2, 
  Settings, 
  Zap, 
  Bot, 
  Cpu, 
  Workflow, 
  Clock, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Move, 
  Code2, 
  Mail, 
  Database,
  ArrowRight,
  GitBranch,
  Layers,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { 
  WorkflowDefinition, 
  WorkflowNode, 
  WorkflowEdge, 
  NodeType, 
  NodeCategory, 
  WorkflowRun 
} from '@/lib/engine/types';

interface WorkflowEditorProps {
  initialWorkflow: WorkflowDefinition;
  onSave?: (workflow: WorkflowDefinition) => void;
}

const CATEGORY_COLORS: Record<NodeCategory, { border: string; bg: string; text: string; badge: string }> = {
  trigger: { border: 'border-neon-cyan/60', bg: 'bg-neon-cyan/15', text: 'text-neon-cyan', badge: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30' },
  ai: { border: 'border-neon-purple/60', bg: 'bg-neon-purple/15', text: 'text-neon-purple', badge: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30' },
  logic: { border: 'border-emerald-400/60', bg: 'bg-emerald-400/15', text: 'text-emerald-400', badge: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30' },
  action: { border: 'border-amber-400/60', bg: 'bg-amber-400/15', text: 'text-amber-400', badge: 'bg-amber-400/20 text-amber-400 border-amber-400/30' },
  transform: { border: 'border-indigo-400/60', bg: 'bg-indigo-400/15', text: 'text-indigo-400', badge: 'bg-indigo-400/20 text-indigo-400 border-indigo-400/30' },
};

const NODE_CATALOG: Array<{ type: NodeType; category: NodeCategory; title: string; desc: string; icon: any; defaultConfig: any }> = [
  // Triggers
  { type: 'trigger_webhook', category: 'trigger', title: 'Webhook Trigger', desc: 'Külső HTTP POST kérés fogadása', icon: Zap, defaultConfig: { path: '/api/engine/webhook/custom' } },
  { type: 'trigger_schedule', category: 'trigger', title: 'Időzítő Trigger', desc: 'CRON vagy periódusos futtatás', icon: Clock, defaultConfig: { cron: '0 9 * * 1' } },
  { type: 'trigger_email', category: 'trigger', title: 'Bejövő Email Trigger', desc: 'Új email érkezése a fiókba', icon: Mail, defaultConfig: { mailbox: 'inbox@ceg.hu' } },
  
  // AI Nodes
  { type: 'ai_openai_chat', category: 'ai', title: 'OpenAI GPT-4o Chat', desc: 'Intelligens válasz- és szövegtervezés', icon: Bot, defaultConfig: { model: 'gpt-4o', systemPrompt: 'Te a folyamat asszisztense vagy.', userPrompt: '{{trigger.payload}}' } },
  { type: 'ai_data_extractor', category: 'ai', title: 'AI Adatkinyerő', desc: 'JSON mezők kinyerése nyers szövegből', icon: Cpu, defaultConfig: { schema: 'contact, intent, priority' } },
  { type: 'ai_sentiment_analyzer', category: 'ai', title: 'AI Érzelem & Sürgősség', desc: 'Hangulat- és prioritáselemzés', icon: Sparkles, defaultConfig: {} },

  // Logic & Control
  { type: 'logic_condition', category: 'logic', title: 'Feltétel (If / Else)', desc: 'Kétirányú elágazás feltétel alapján', icon: GitBranch, defaultConfig: { field: '{{trigger.payload.score}}', operator: 'greater_than', value: 70 } },
  { type: 'logic_delay', category: 'logic', title: 'Késleltetés (Delay)', desc: 'Időzített várakoztatás (másodperc)', icon: Clock, defaultConfig: { delaySeconds: 2 } },
  { type: 'logic_loop', category: 'logic', title: 'Ciklus (ForEach Loop)', desc: 'Iteráció tömbelemeken', icon: RotateCw, defaultConfig: { iterateOver: '{{trigger.payload.items}}' } },
  { type: 'logic_error_handler', category: 'logic', title: 'Hibakezelő (Fallback)', desc: 'Megelőzi a folyamat leállását', icon: AlertTriangle, defaultConfig: { notifyAdmin: true } },

  // Actions
  { type: 'action_http_request', category: 'action', title: 'REST API / Webhook Hívás', desc: 'Külső HTTP API végpont megszólítása', icon: Workflow, defaultConfig: { url: 'https://api.example.com/sync', method: 'POST' } },
  { type: 'action_crm_update', category: 'action', title: 'CRM Deal & Kontakt Mentés', desc: 'Kétirányú deal és ügyfélfrissítés', icon: Database, defaultConfig: { dealStage: 'Minősített Érdeklődő' } },
  { type: 'action_send_email', category: 'action', title: 'Email Kiküldése', desc: 'Automata válasz vagy belső értesítés', icon: Mail, defaultConfig: { to: 'ugyfel@ceg.hu', subject: 'Értesítés' } },
];

export default function WorkflowEditor({ initialWorkflow, onSave }: WorkflowEditorProps) {
  const [workflow, setWorkflow] = useState<WorkflowDefinition>(initialWorkflow);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Execution states
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastRun, setLastRun] = useState<WorkflowRun | null>(null);
  const [executingNodeId, setExecutingNodeId] = useState<string | null>(null);
  const [flashingNodeId, setFlashingNodeId] = useState<string | null>(null);
  const [activeEdgeId, setActiveEdgeId] = useState<string | null>(null);
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>([]);
  const [completedEdgeIds, setCompletedEdgeIds] = useState<string[]>([]);
  const [liveExecutionStep, setLiveExecutionStep] = useState<string>('');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Zoom & Pan states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // High performance Dragging refs
  const [activeDraggingId, setActiveDraggingId] = useState<string | null>(null);
  const dragRef = useRef<{
    nodeId: string;
    startX: number;
    startY: number;
    nodeOrigX: number;
    nodeOrigY: number;
  } | null>(null);
  const rafRef = useRef<number | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedNode = workflow.nodes.find(n => n.id === selectedNodeId);

  // BUTTERY SMOOTH 120FPS DRAG IMPLEMENTATION (via RequestAnimationFrame)
  const handleNodePointerDown = (e: React.PointerEvent, node: WorkflowNode) => {
    // Only primary mouse button
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setActiveDraggingId(node.id);

    dragRef.current = {
      nodeId: node.id,
      startX: e.clientX,
      startY: e.clientY,
      nodeOrigX: node.position.x,
      nodeOrigY: node.position.y,
    };

    window.addEventListener('pointermove', onGlobalPointerMove, { passive: true });
    window.addEventListener('pointerup', onGlobalPointerUp);
    window.addEventListener('pointercancel', onGlobalPointerUp);
  };

  const onGlobalPointerMove = useCallback((e: PointerEvent) => {
    if (!dragRef.current) return;

    const { nodeId, startX, startY, nodeOrigX, nodeOrigY } = dragRef.current;
    const dx = (e.clientX - startX) / zoom;
    const dy = (e.clientY - startY) / zoom;

    const nextX = Math.max(10, Math.round(nodeOrigX + dx));
    const nextY = Math.max(10, Math.round(nodeOrigY + dy));

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setWorkflow(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => n.id === nodeId ? { ...n, position: { x: nextX, y: nextY } } : n)
      }));
    });
  }, [zoom]);

  const onGlobalPointerUp = useCallback(() => {
    dragRef.current = null;
    setActiveDraggingId(null);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    window.removeEventListener('pointermove', onGlobalPointerMove);
    window.removeEventListener('pointerup', onGlobalPointerUp);
    window.removeEventListener('pointercancel', onGlobalPointerUp);
  }, [onGlobalPointerMove]);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', onGlobalPointerMove);
      window.removeEventListener('pointerup', onGlobalPointerUp);
      window.removeEventListener('pointercancel', onGlobalPointerUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onGlobalPointerMove, onGlobalPointerUp]);

  // Canvas Pan Handlers
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (e.target !== canvasRef.current && (e.target as HTMLElement).tagName !== 'svg') {
      return;
    }
    setSelectedNodeId(null);
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    window.addEventListener('pointermove', onCanvasPanMove, { passive: true });
    window.addEventListener('pointerup', onCanvasPanUp);
  };

  const onCanvasPanMove = (e: PointerEvent) => {
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    setPan({
      x: panStartRef.current.panX + dx,
      y: panStartRef.current.panY + dy,
    });
  };

  const onCanvasPanUp = () => {
    setIsPanning(false);
    window.removeEventListener('pointermove', onCanvasPanMove);
    window.removeEventListener('pointerup', onCanvasPanUp);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom(z => Math.min(1.8, Number((z + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, Number((z - 0.15).toFixed(2))));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Add new node to canvas
  const handleAddNode = (template: typeof NODE_CATALOG[0]) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: template.type,
      category: template.category,
      title: template.title,
      description: template.desc,
      position: { 
        x: Math.round((-pan.x + 360 + Math.random() * 60) / zoom), 
        y: Math.round((-pan.y + 160 + Math.random() * 80) / zoom) 
      },
      config: { ...template.defaultConfig }
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    setSelectedNodeId(newNode.id);
  };

  // Delete node and its attached edges
  const handleDeleteNode = (nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    }));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // Connect two nodes
  const handleConnectNodes = (sourceId: string, targetId: string, sourceHandle: any = 'default') => {
    if (sourceId === targetId) return;
    const edgeExists = workflow.edges.some(e => e.source === sourceId && e.target === targetId && e.sourceHandle === sourceHandle);
    if (edgeExists) return;

    const newEdge: WorkflowEdge = {
      id: `edge_${Date.now()}`,
      source: sourceId,
      target: targetId,
      sourceHandle,
      label: sourceHandle === 'true' ? 'True' : sourceHandle === 'false' ? 'False' : sourceHandle === 'error' ? 'Hiba' : undefined
    };

    setWorkflow(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge]
    }));
  };

  // Live Test Execution with Real-Time Wire Surge & High-Voltage Node Flashing
  const handleRunTest = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setLastRun(null);
    setCompletedNodeIds([]);
    setCompletedEdgeIds([]);
    setActiveEdgeId(null);
    setExecutingNodeId(null);
    setFlashingNodeId(null);
    setLiveExecutionStep('Áramkör inicializálása...');

    try {
      // 1. Identify start / trigger nodes
      const triggerNodes = workflow.nodes.filter(n => n.category === 'trigger');
      const startNodes = triggerNodes.length > 0 ? triggerNodes : (workflow.nodes[0] ? [workflow.nodes[0]] : []);

      const visitedNodes = new Set<string>();
      const nodeQueue = [...startNodes];

      while (nodeQueue.length > 0) {
        const currentNode = nodeQueue.shift();
        if (!currentNode || visitedNodes.has(currentNode.id)) continue;
        visitedNodes.add(currentNode.id);

        // Flash and execute current node
        setExecutingNodeId(currentNode.id);
        setFlashingNodeId(currentNode.id);
        setLiveExecutionStep(`[${currentNode.category.toUpperCase()}] ${currentNode.title} végrehajtása...`);
        await new Promise(r => setTimeout(r, 450));
        setFlashingNodeId(null);

        // Find outgoing edges from this node
        const outgoing = workflow.edges.filter(e => e.source === currentNode.id);

        for (const edge of outgoing) {
          // Energize cable! Laser current rushes along the wire
          setActiveEdgeId(edge.id);
          const targetNode = workflow.nodes.find(n => n.id === edge.target);
          setLiveExecutionStep(`Adatáramlás: ${currentNode.title} ➔ ${targetNode?.title || 'Következő lépés'}`);
          
          await new Promise(r => setTimeout(r, 650));
          
          setCompletedEdgeIds(prev => [...prev, edge.id]);
          setActiveEdgeId(null);

          if (targetNode && !visitedNodes.has(targetNode.id)) {
            nodeQueue.push(targetNode);
          }
        }

        setCompletedNodeIds(prev => [...prev, currentNode.id]);
      }

      setLiveExecutionStep('Végrehajtás szinkronizálása a natív TypeScript motorral...');

      // Call Engine API for real payload execution
      const res = await fetch('/api/engine/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow,
          inputPayload: {
            testRun: true,
            timestamp: new Date().toISOString(),
            contactName: 'Kovács Tamás',
            email: 'tamas@techventures.hu',
            score: 95,
            intent: 'Autonóm AI Workflow Tesztelés'
          }
        })
      });

      const data = await res.json();
      if (data.run) {
        setLastRun(data.run);
      }
      setLiveExecutionStep('✓ Teszt sikeres! Minden csomópont és kábel stabil.');
    } catch (err) {
      console.error('[Workflow Test Error]:', err);
      setLiveExecutionStep('Hiba a teszt futtatása során.');
    } finally {
      setIsExecuting(false);
      setExecutingNodeId(null);
      setFlashingNodeId(null);
      setActiveEdgeId(null);
    }
  };

  const handleSave = () => {
    onSave?.(workflow);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const copyWebhookUrl = () => {
    const url = `${window.location.origin}${workflow.webhookEndpoint || `/api/engine/webhook/${workflow.id}`}`;
    navigator.clipboard.writeText(url);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  // Node coordinate lookup map for fast SVG wire rendering
  const nodeCoordsMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const n of workflow.nodes) {
      map.set(n.id, n.position);
    }
    return map;
  }, [workflow.nodes]);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-nexus-950 text-foreground overflow-hidden select-none">
      
      {/* Top Action Toolbar */}
      <div className="h-16 border-b border-white/10 bg-nexus-950/95 px-5 flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Workflow title and status */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/automations"
            className="text-xs text-gray-400 hover:text-white font-medium flex items-center gap-1.5 transition-colors"
          >
            ← Vissza
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={workflow.name}
                onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                className="font-bold text-sm text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-neon-purple focus:outline-none px-1"
              />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                {workflow.status}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Zoom and Webhook tools */}
        <div className="flex items-center gap-3">
          {/* Zoom controls */}
          <div className="flex items-center bg-nexus-900 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Kicsinyítés (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-gray-300 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Nagyítás (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 ml-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Nézet visszaállítása"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-2 bg-nexus-900 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
            <Zap className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            <span className="text-gray-400 text-[11px]">Webhook:</span>
            <span className="font-mono text-neon-cyan text-[11px] max-w-[170px] truncate">
              {workflow.webhookEndpoint || `/api/engine/webhook/${workflow.id}`}
            </span>
            <button
              onClick={copyWebhookUrl}
              className="text-gray-400 hover:text-white ml-1"
              title="Webhook URL másolása"
            >
              {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {saveFeedback && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Mentve!
            </span>
          )}

          <button
            onClick={handleRunTest}
            disabled={isExecuting}
            className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all cursor-pointer ${
              isExecuting
                ? 'bg-amber-400 text-black animate-pulse'
                : 'bg-white text-black hover:bg-neutral-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            } disabled:opacity-50`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Áramkör Tesztelése...' : 'Áramköri Teszt Futtatása'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Mentés</span>
          </button>
        </div>

      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Node Catalog */}
        <div className="w-68 border-r border-white/10 bg-nexus-950/90 p-4 overflow-y-auto shrink-0 flex flex-col justify-between z-20">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neon-blue block">
                Csomópontok
              </span>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Kattints az elemre a vászonhoz adáshoz
              </p>
            </div>

            {(['trigger', 'ai', 'logic', 'action'] as NodeCategory[]).map((cat) => {
              const nodesInCat = NODE_CATALOG.filter(n => n.category === cat);
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="text-[9px] uppercase font-bold tracking-wider text-gray-400 px-1">
                    {cat === 'trigger' ? '1. Triggerek' : cat === 'ai' ? '2. OpenAI Intelligencia' : cat === 'logic' ? '3. Logika & Elágazások' : '4. REST API & Műveletek'}
                  </div>

                  {nodesInCat.map((item) => {
                    const colors = CATEGORY_COLORS[item.category];
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}
                        onClick={() => handleAddNode(item)}
                        className={`w-full p-2.5 rounded-xl border border-white/5 hover:${colors.border} bg-white/5 hover:bg-white/10 text-left transition-colors flex items-start gap-2.5`}
                      >
                        <div className={`w-6 h-6 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-[9px] text-gray-400 truncate mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                        <Plus className="w-3 h-3 text-gray-500 hover:text-white shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 text-[10px] text-gray-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-neon-purple" />
            <span>XpanderFlow 120 FPS Motor</span>
          </div>
        </div>

        {/* Central Visual Canvas with Zero-Lag Dragging */}
        <div
          ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          className={`flex-1 bg-grid-pattern relative overflow-hidden bg-nexus-950 ${
            isPanning ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Live Circuit Conduction HUD Indicator */}
          {isExecuting && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full bg-black/95 backdrop-blur-xl border border-white/30 text-xs font-mono font-bold text-white shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3 animate-in fade-in zoom-in-95 pointer-events-none">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <span className="text-white tracking-wide">{liveExecutionStep || '⚡ ÁRAMKÖRI TESZT • ADATOK TOVÁBBÍTÁSA...'}</span>
            </div>
          )}
          {/* Zoomable & Pannable Viewport */}
          <div
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: '0 0',
              willChange: activeDraggingId || isPanning ? 'transform' : 'auto',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-[4000px] h-[4000px] pointer-events-none z-0">
              <defs>
                <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                <linearGradient id="activeLaserWire" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#38bdf8" />
                  <stop offset="70%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>

                {/* High Voltage Glow Filters */}
                <filter id="cableGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <filter id="superFlash" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {workflow.edges.map((edge) => {
                const sourcePos = nodeCoordsMap.get(edge.source);
                const targetPos = nodeCoordsMap.get(edge.target);
                if (!sourcePos || !targetPos) return null;

                const startX = sourcePos.x + 230;
                const startY = sourcePos.y + 44;
                const endX = targetPos.x;
                const endY = targetPos.y + 44;

                const dx = Math.abs(endX - startX) * 0.5;
                const pathData = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

                const isConditionTrue = edge.sourceHandle === 'true';
                const isConditionFalse = edge.sourceHandle === 'false';
                const isError = edge.sourceHandle === 'error';

                const isEdgeActive = activeEdgeId === edge.id;
                const isEdgeCompleted = completedEdgeIds.includes(edge.id);
                const isExecutingGlobal = isExecuting;

                let strokeColor = 'url(#wireGradient)';
                if (isConditionTrue) strokeColor = '#34d399';
                if (isConditionFalse) strokeColor = '#f87171';
                if (isError) strokeColor = '#fb923c';

                return (
                  <g key={edge.id} className="transition-all duration-200">
                    {/* 1. Base Dark Wire Groove */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#141416"
                      strokeWidth="5"
                    />

                    {/* 2. Passive Base Wire */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isEdgeActive ? 'url(#activeLaserWire)' : strokeColor}
                      strokeWidth={isEdgeActive ? '4' : isEdgeCompleted ? '3' : '2'}
                      strokeOpacity={isEdgeActive ? 1 : isEdgeCompleted ? 0.9 : 0.35}
                    />

                    {/* 3. FLOWING CABLE ENERGY: Electric Current Wave */}
                    {(isExecutingGlobal || isEdgeCompleted || isEdgeActive) && (
                      <path
                        d={pathData}
                        fill="none"
                        stroke={isEdgeActive ? '#ffffff' : isEdgeCompleted ? '#34d399' : '#38bdf8'}
                        strokeWidth={isEdgeActive ? '4.5' : '2.5'}
                        strokeDasharray="12 8"
                        className={isEdgeActive ? 'animate-wire-flow-fast' : 'animate-wire-flow'}
                        filter="url(#cableGlow)"
                        strokeOpacity={isEdgeActive ? 1 : 0.85}
                      />
                    )}

                    {/* 4. SUPER LASER FLASH: Surging High-Voltage Arc when activeEdgeId is firing! */}
                    {isEdgeActive && (
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="8"
                        strokeOpacity="0.9"
                        filter="url(#superFlash)"
                        className="animate-cable-flash"
                      />
                    )}

                    {/* 5. TRAVELING ENERGY DATA PACKETS (Moving glowing orbs along path) */}
                    {(isExecutingGlobal || isEdgeActive) && (
                      <>
                        <circle r={isEdgeActive ? '6.5' : '4'} fill={isEdgeActive ? '#ffffff' : '#00f0ff'} filter="url(#superFlash)">
                          <animateMotion 
                            dur={isEdgeActive ? '0.65s' : '1.3s'} 
                            repeatCount="indefinite" 
                            path={pathData} 
                          />
                        </circle>

                        <circle r="3" fill="#ffffff" filter="url(#cableGlow)">
                          <animateMotion 
                            dur={isEdgeActive ? '0.65s' : '1.3s'} 
                            begin="0.25s" 
                            repeatCount="indefinite" 
                            path={pathData} 
                          />
                        </circle>
                      </>
                    )}

                    {/* 6. Socket Connectors */}
                    <circle 
                      cx={startX} 
                      cy={startY} 
                      r={isEdgeActive ? '5' : '3.5'} 
                      fill={isEdgeActive ? '#ffffff' : '#38bdf8'} 
                      filter={isEdgeActive ? 'url(#superFlash)' : undefined} 
                    />
                    <circle 
                      cx={endX} 
                      cy={endY} 
                      r={isEdgeActive ? '6' : isEdgeCompleted ? '4.5' : '3.5'} 
                      fill={isEdgeActive ? '#ffffff' : isEdgeCompleted ? '#34d399' : isConditionFalse ? '#f87171' : '#a855f7'} 
                      filter={isEdgeActive ? 'url(#superFlash)' : undefined} 
                    />

                    {edge.label && (
                      <text
                        x={(startX + endX) / 2}
                        y={(startY + endY) / 2 - 8}
                        fill={isEdgeActive ? '#ffffff' : isConditionTrue ? '#34d399' : isConditionFalse ? '#f87171' : '#cbd5e1'}
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="font-bold drop-shadow"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Canvas Nodes with Direct GPU transform and Zero-Lag */}
            {workflow.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isRunning = executingNodeId === node.id;
              const isFlashing = flashingNodeId === node.id;
              const isCompleted = completedNodeIds.includes(node.id);
              const isCurrentlyDragging = activeDraggingId === node.id;
              const colors = CATEGORY_COLORS[node.category];

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handleNodePointerDown(e, node)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  style={{
                    transform: `translate3d(${node.position.x}px, ${node.position.y}px, 0)`,
                    width: '235px',
                    willChange: isCurrentlyDragging ? 'transform' : 'auto',
                    touchAction: 'none'
                  }}
                  className={`absolute rounded-2xl p-4 border cursor-move select-none z-10 transition-all duration-150 ${
                    isFlashing || isRunning
                      ? 'border-white ring-4 ring-white/80 shadow-[0_0_50px_rgba(255,255,255,0.9)] scale-105 bg-white/20 z-30'
                      : isCompleted
                      ? 'border-emerald-400/80 ring-2 ring-emerald-400/30 bg-emerald-950/20 shadow-emerald-500/20'
                      : isSelected 
                      ? 'border-white ring-2 ring-white/30 shadow-2xl bg-neutral-900' 
                      : isCurrentlyDragging
                      ? 'border-white/50 shadow-2xl bg-neutral-900'
                      : 'border-white/10 hover:border-white/25 bg-neutral-900/90'
                  }`}
                >
                  {/* Pulsing shockwave ring when node is flashing/running */}
                  {(isFlashing || isRunning) && (
                    <div className="absolute -inset-2 rounded-2xl border-2 border-white/60 animate-ping pointer-events-none" />
                  )}

                  {/* Node Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                        : colors.badge
                    }`}>
                      {isCompleted ? '✓ Kész' : isRunning ? '⚡ Végrehajtás...' : node.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      className="text-neutral-500 hover:text-rose-400 transition-colors"
                      title="Törlés"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                    {isRunning && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                    <span>{node.title}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{node.description}</div>

                  {/* Real-time execution status indicator */}
                  {isRunning && (
                    <div className="mt-2 text-[10px] font-mono text-white bg-white/20 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                      <Cpu className="w-3 h-3 animate-spin" />
                      <span>Feldolgozás...</span>
                    </div>
                  )}

                  {/* Ports / Handles */}
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20 -ml-5 border border-white/40" title="Bemenet" />
                    
                    {node.type === 'logic_condition' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-emerald-400 font-mono">True ●</span>
                        <span className="text-[9px] font-bold text-rose-400 font-mono">False ●</span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-gray-500 font-mono">Kimenet</span>
                    )}

                    <span className="w-2.5 h-2.5 rounded-full bg-neon-purple -mr-5 border border-neon-purple/40" title="Kimenet" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty hint */}
          {workflow.nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-gray-400 pointer-events-none">
              <Workflow className="w-12 h-12 text-gray-600 mb-3" />
              <h3 className="text-base font-bold text-white">Üres Automatizációs Vászon</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Válassz ki egy elemet a bal oldali menüből a folyamat indításához!
              </p>
            </div>
          )}
        </div>

        {/* Right Configuration Drawer */}
        {selectedNode && (
          <div className="w-80 border-l border-white/10 bg-nexus-950/95 p-5 overflow-y-auto shrink-0 flex flex-col justify-between z-20 animate-in slide-in-from-right duration-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-neon-blue" />
                  <span className="text-xs font-bold text-white">Csomópont Beállítása</span>
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Desc */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Csomópont Neve</label>
                  <input
                    type="text"
                    value={selectedNode.title}
                    onChange={(e) => {
                      const updated = { ...selectedNode, title: e.target.value };
                      setWorkflow(prev => ({
                        ...prev,
                        nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n)
                      }));
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Leírás</label>
                  <input
                    type="text"
                    value={selectedNode.description}
                    onChange={(e) => {
                      const updated = { ...selectedNode, description: e.target.value };
                      setWorkflow(prev => ({
                        ...prev,
                        nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n)
                      }));
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs focus:outline-none focus:border-neon-blue"
                  />
                </div>

                {/* Specific Config Fields */}
                {selectedNode.type === 'ai_openai_chat' && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="font-semibold text-neon-purple">OpenAI Rendszer Prompt</label>
                    <textarea
                      rows={3}
                      value={selectedNode.config.systemPrompt || ''}
                      onChange={(e) => {
                        const updated = { ...selectedNode, config: { ...selectedNode.config, systemPrompt: e.target.value } };
                        setWorkflow(prev => ({
                          ...prev,
                          nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n)
                        }));
                      }}
                      className="w-full p-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs font-mono"
                    />

                    <label className="font-semibold text-neon-purple mt-2 block">Felhasználói Prompt Sablon</label>
                    <textarea
                      rows={3}
                      value={selectedNode.config.userPrompt || ''}
                      onChange={(e) => {
                        const updated = { ...selectedNode, config: { ...selectedNode.config, userPrompt: e.target.value } };
                        setWorkflow(prev => ({
                          ...prev,
                          nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n)
                        }));
                      }}
                      className="w-full p-2.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                )}

                {selectedNode.type === 'logic_condition' && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="font-semibold text-emerald-400">Vizsgált Változó / Mező</label>
                    <input
                      type="text"
                      value={selectedNode.config.field || ''}
                      onChange={(e) => {
                        const updated = { ...selectedNode, config: { ...selectedNode.config, field: e.target.value } };
                        setWorkflow(prev => ({ ...prev, nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n) }));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs font-mono"
                    />

                    <label className="font-semibold text-emerald-400 mt-2 block">Feltétel Típusa</label>
                    <select
                      value={selectedNode.config.operator || 'greater_than'}
                      onChange={(e) => {
                        const updated = { ...selectedNode, config: { ...selectedNode.config, operator: e.target.value } };
                        setWorkflow(prev => ({ ...prev, nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n) }));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs"
                    >
                      <option value="greater_than">Nagyobb mint (&gt;)</option>
                      <option value="less_than">Kisebb mint (&lt;)</option>
                      <option value="equals">Egyenlő (==)</option>
                      <option value="contains">Tartalmazza (contains)</option>
                    </select>

                    <label className="font-semibold text-emerald-400 mt-2 block">Összehasonlítási Érték</label>
                    <input
                      type="text"
                      value={selectedNode.config.value || ''}
                      onChange={(e) => {
                        const updated = { ...selectedNode, config: { ...selectedNode.config, value: e.target.value } };
                        setWorkflow(prev => ({ ...prev, nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n) }));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                )}

                {selectedNode.type === 'logic_delay' && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="font-semibold text-gray-300">Várakozási Idő (másodperc)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={selectedNode.config.delaySeconds || 2}
                      onChange={(e) => {
                        const updated = { ...selectedNode, config: { ...selectedNode.config, delaySeconds: Number(e.target.value) } };
                        setWorkflow(prev => ({ ...prev, nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n) }));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                )}

                {selectedNode.type === 'action_http_request' && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="font-semibold text-amber-400">Cél URL / REST API</label>
                    <input
                      type="text"
                      value={selectedNode.config.url || ''}
                      onChange={(e) => {
                        const updated = { ...selectedNode, config: { ...selectedNode.config, url: e.target.value } };
                        setWorkflow(prev => ({ ...prev, nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n) }));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs font-mono"
                    />

                    <label className="font-semibold text-amber-400 mt-2 block">HTTP Metódus</label>
                    <select
                      value={selectedNode.config.method || 'POST'}
                      onChange={(e) => {
                        const updated = { ...selectedNode, config: { ...selectedNode.config, method: e.target.value } };
                        setWorkflow(prev => ({ ...prev, nodes: prev.nodes.map(n => n.id === selectedNode.id ? updated : n) }));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-nexus-900 border border-white/10 text-white text-xs"
                    >
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                )}

                {/* Quick Connect */}
                <div className="pt-3 border-t border-white/10 space-y-1.5">
                  <span className="font-semibold text-gray-300 block text-[11px]">Gyors Összekötés Másik Csomóponthoz:</span>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {workflow.nodes.filter(n => n.id !== selectedNode.id).map(other => (
                      <div key={other.id} className="flex items-center justify-between p-1.5 rounded bg-white/5 text-[11px]">
                        <span className="truncate max-w-[130px]">{other.title}</span>
                        <div className="flex gap-1">
                          {selectedNode.type === 'logic_condition' ? (
                            <>
                              <button
                                onClick={() => handleConnectNodes(selectedNode.id, other.id, 'true')}
                                className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold"
                              >
                                True
                              </button>
                              <button
                                onClick={() => handleConnectNodes(selectedNode.id, other.id, 'false')}
                                className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold"
                              >
                                False
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleConnectNodes(selectedNode.id, other.id, 'default')}
                              className="px-2 py-0.5 rounded bg-neon-purple/20 text-neon-purple text-[10px] font-bold"
                            >
                              Kötés →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="w-full py-2 rounded-xl text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Csomópont Törlése</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Telemetry Drawer */}
      {lastRun && (
        <div className="h-60 border-t border-white/10 bg-nexus-950/95 p-4 overflow-y-auto shrink-0 z-30 animate-in slide-in-from-bottom duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">
                Futtatási Eredmény: {lastRun.workflowName}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                {lastRun.status.toUpperCase()} ({lastRun.durationMs} ms)
              </span>
            </div>

            <button
              onClick={() => setLastRun(null)}
              className="text-gray-400 hover:text-white text-xs"
            >
              Bezárás ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {lastRun.steps.map((step, idx) => (
              <div
                key={step.id}
                className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 font-mono text-[11px]"
              >
                <div className="flex items-center justify-between font-sans">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-neon-purple/20 text-neon-purple text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="truncate">{step.nodeTitle}</span>
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px] shrink-0">{step.durationMs} ms</span>
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  Típus: {step.nodeType}
                </div>
                <div className="p-2 rounded bg-nexus-900 border border-white/5 text-[10px] text-gray-300 max-h-20 overflow-y-auto">
                  {JSON.stringify(step.outputData || {}, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

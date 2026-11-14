import { NextResponse } from 'next/server';
import { executeWorkflow } from '@/lib/engine/executor';
import { TEMPLATE_LEAD_QUALIFIER, TEMPLATE_CUSTOMER_SUPPORT } from '@/lib/engine/templates';

export async function POST(
  req: Request,
  { params }: { params: { webhookId: string } }
) {
  try {
    const { webhookId } = params;
    const body = await req.json().catch(() => ({}));

    // Find template matching webhook
    let targetWorkflow = TEMPLATE_LEAD_QUALIFIER;
    if (webhookId === 'wf-support-triage') {
      targetWorkflow = TEMPLATE_CUSTOMER_SUPPORT;
    }

    // Execute through native TypeScript engine
    const runResult = await executeWorkflow(targetWorkflow, body);

    return NextResponse.json({
      success: true,
      message: 'ZentrionFlow Natív Webhook sikeresen feldolgozva.',
      webhookId,
      runId: runResult.id,
      durationMs: runResult.durationMs,
      stepsExecuted: runResult.steps.length,
      finalOutput: runResult.finalOutput
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Webhook feldolgozási hiba.' },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { webhookId: string } }
) {
  return NextResponse.json({
    status: 'online',
    engine: 'zentrion.ai Native TypeScript Automation Gateway',
    webhookId: params.webhookId,
    timestamp: new Date().toISOString()
  });
}


import { NextResponse } from 'next/server';
import { executeWorkflow } from '@/lib/engine/executor';
import { WorkflowDefinition } from '@/lib/engine/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workflow, inputPayload } = body as {
      workflow: WorkflowDefinition;
      inputPayload?: any;
    };

    if (!workflow || !workflow.nodes) {
      return NextResponse.json(
        { error: 'Érvénytelen munkafolyamat struktúra (hiányzó csomópontok).' },
        { status: 400 }
      );
    }

    // Execute through our native TypeScript engine
    const runResult = await executeWorkflow(workflow, inputPayload);

    return NextResponse.json({
      success: runResult.status !== 'failed',
      run: runResult
    });

  } catch (error: any) {
    console.error('[Zentrion Native Engine Execution Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Hiba történt a natív motor futtatása során.' },
      { status: 500 }
    );
  }
}


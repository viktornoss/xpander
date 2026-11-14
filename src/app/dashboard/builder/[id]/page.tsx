'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import WorkflowEditor from '@/components/workflow-builder/WorkflowEditor';
import { TEMPLATE_LEAD_QUALIFIER, TEMPLATE_CUSTOMER_SUPPORT } from '@/lib/engine/templates';
import { WorkflowDefinition } from '@/lib/engine/types';

export default function DynamicWorkflowBuilderPage() {
  const params = useParams();
  const id = params?.id as string;

  const [currentWf, setCurrentWf] = useState<WorkflowDefinition>(() => {
    if (id === 'wf-support-triage') return TEMPLATE_CUSTOMER_SUPPORT;
    return TEMPLATE_LEAD_QUALIFIER;
  });

  const handleSave = (updated: WorkflowDefinition) => {
    setCurrentWf(updated);
    try {
      localStorage.setItem(`nexus_wf_${updated.id}`, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="-m-4 sm:-m-8">
      <WorkflowEditor
        initialWorkflow={currentWf}
        onSave={handleSave}
      />
    </div>
  );
}


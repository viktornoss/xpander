'use client';

import React, { useState } from 'react';
import WorkflowEditor from '@/components/workflow-builder/WorkflowEditor';
import { TEMPLATE_LEAD_QUALIFIER, TEMPLATE_CUSTOMER_SUPPORT } from '@/lib/engine/templates';
import { WorkflowDefinition } from '@/lib/engine/types';

export default function WorkflowBuilderPage() {
  const [currentWf, setCurrentWf] = useState<WorkflowDefinition>(TEMPLATE_LEAD_QUALIFIER);

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


import { NextResponse } from 'next/server';
import { ApiConnector } from '@/lib/engine/types';

const mockConnectors: ApiConnector[] = [
  {
    id: 'conn-hubspot',
    userId: 'usr-client-001',
    name: 'HubSpot CRM REST API',
    baseUrl: 'https://api.hubapi.com/crm/v3',
    authType: 'bearer',
    authHeaderKey: 'Authorization',
    authSecret: 'pat-eu1-99887766-5544-3322-1100',
    defaultHeaders: { 'Content-Type': 'application/json' },
    createdAt: '2026-02-15'
  },
  {
    id: 'conn-erp',
    userId: 'usr-client-001',
    name: 'Belső Vállalati ERP Gateway',
    baseUrl: 'https://erp.techventures.hu/api/v1',
    authType: 'api_key',
    authHeaderKey: 'X-ERP-API-KEY',
    authSecret: 'erp_live_sec_884422',
    defaultHeaders: { 'Accept': 'application/json' },
    createdAt: '2026-02-28'
  },
  {
    id: 'conn-slack',
    userId: 'usr-client-001',
    name: 'Slack Incoming Alerts Webhook',
    baseUrl: 'https://hooks.slack.com/services/T00/B00/XXXX',
    authType: 'none',
    defaultHeaders: { 'Content-Type': 'application/json' },
    createdAt: '2026-03-01'
  }
];

export async function GET() {
  return NextResponse.json({ connectors: mockConnectors });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newConn: ApiConnector = {
      id: `conn_${Date.now()}`,
      userId: data.userId || 'usr-client-001',
      name: data.name || 'Új REST API Kapcsolat',
      baseUrl: data.baseUrl,
      authType: data.authType || 'bearer',
      authHeaderKey: data.authHeaderKey || 'Authorization',
      authSecret: data.authSecret || '',
      defaultHeaders: data.defaultHeaders || { 'Content-Type': 'application/json' },
      createdAt: new Date().toISOString().split('T')[0]
    };

    mockConnectors.push(newConn);
    return NextResponse.json({ success: true, connector: newConn });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


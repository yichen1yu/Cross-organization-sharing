import type {
  TallyReportData,
  InstanceResponse,
  InstanceGuestReport,
  OptInConfig,
  BillingAccountIdInfo,
  SkuCapacityReport,
} from './types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const now = new Date();
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export async function getTallyReport(
  productId: string,
  metricId: string,
  beginning: string,
  ending: string,
): Promise<TallyReportData> {
  await delay(600);

  const productMetrics: Record<string, { value: number; capacity: number; unit: string }> = {
    'rhel-for-x86:Sockets': { value: 75, capacity: 100, unit: 'Sockets' },
    'rhel-for-x86:Cores': { value: 150, capacity: 200, unit: 'Cores' },
    'openshift-container-platform:Cores': { value: 400, capacity: 500, unit: 'Cores' },
    'ansible-automation-platform:Managed Nodes': { value: 1200, capacity: 2000, unit: 'Managed Nodes' },
    'rhel-for-arm:Sockets': { value: 12, capacity: 20, unit: 'Sockets' },
    'openshift-dedicated-metrics:vCPU': { value: 48, capacity: 64, unit: 'vCPU' },
  };

  const key = `${productId}:${metricId}`;
  const metric = productMetrics[key] || { value: 50, capacity: 100, unit: metricId };

  return {
    data: [
      { date: beginning, value: Math.round(metric.value * 0.85), has_data: true },
      { date: daysAgo(20), value: Math.round(metric.value * 0.9), has_data: true },
      { date: daysAgo(10), value: Math.round(metric.value * 0.95), has_data: true },
      { date: ending || now.toISOString(), value: metric.value, has_data: true },
    ],
    meta: {
      count: 4,
      total_monthly: { date: now.toISOString(), value: metric.value, has_data: true },
      product: productId,
      metric_id: metricId,
      granularity: 'Daily',
    },
  };
}

export async function getInstancesByProduct(productId: string): Promise<InstanceResponse> {
  await delay(500);

  const instances: Record<string, InstanceResponse> = {
    'rhel-for-x86': {
      data: [
        { id: 'i-001', instance_id: 'i-abc123', display_name: 'prod-web-01.example.com', billing_provider: 'red hat', billing_account_id: 'ba-001', measurements: [4, 8], last_seen: daysAgo(0.5), number_of_guests: 0, category: 'physical', inventory_id: 'inv-001' },
        { id: 'i-002', instance_id: 'i-abc124', display_name: 'prod-db-01.example.com', billing_provider: 'red hat', billing_account_id: 'ba-001', measurements: [8, 16], last_seen: daysAgo(0.3), number_of_guests: 0, category: 'physical', inventory_id: 'inv-002' },
        { id: 'i-003', instance_id: 'i-abc125', display_name: 'host-esxi-04.datacenter.local', billing_provider: 'red hat', billing_account_id: 'ba-001', measurements: [16, 32], last_seen: daysAgo(0.6), number_of_guests: 5, category: 'hypervisor', inventory_id: 'inv-003' },
        { id: 'i-004', instance_id: 'i-abc126', display_name: 'dev-app-01.example.com', billing_provider: 'red hat', billing_account_id: 'ba-001', measurements: [2, 4], last_seen: daysAgo(1), number_of_guests: 0, category: 'virtual', inventory_id: 'inv-004' },
        { id: 'i-005', instance_id: 'i-aws-001', display_name: 'cloud-rhel-01.us-east-1', billing_provider: 'aws', billing_account_id: 'aws-123456', measurements: [2, 4], last_seen: daysAgo(0.1), number_of_guests: 0, category: 'cloud', cloud_provider: 'aws', inventory_id: 'inv-005' },
      ],
      meta: { count: 5, product: 'rhel-for-x86', measurements: ['Sockets', 'Cores'] },
    },
    'openshift-container-platform': {
      data: [
        { id: 'i-010', instance_id: 'ocp-cluster-01', display_name: 'prod-ocp.example.com', billing_provider: 'red hat', billing_account_id: 'ba-001', measurements: [200], last_seen: daysAgo(0.2), category: 'physical', inventory_id: 'inv-010' },
        { id: 'i-011', instance_id: 'ocp-cluster-02', display_name: 'staging-ocp.example.com', billing_provider: 'red hat', billing_account_id: 'ba-001', measurements: [100], last_seen: daysAgo(0.5), category: 'physical', inventory_id: 'inv-011' },
        { id: 'i-012', instance_id: 'ocp-rosa-01', display_name: 'rosa-prod.us-east-1', billing_provider: 'aws', billing_account_id: 'aws-123456', measurements: [100], last_seen: daysAgo(0.1), category: 'cloud', cloud_provider: 'aws', inventory_id: 'inv-012' },
      ],
      meta: { count: 3, product: 'openshift-container-platform', measurements: ['Cores'] },
    },
  };

  return instances[productId] || { data: [], meta: { count: 0, product: productId, measurements: [] } };
}

export async function getInstanceGuests(instanceId: string): Promise<InstanceGuestReport> {
  await delay(400);

  const guestMap: Record<string, InstanceGuestReport> = {
    'i-003': {
      data: [
        { display_name: 'db-prod-01', hardware_type: 'VIRTUALIZED', last_seen: daysAgo(0.6), inventory_id: 'inv-g01', subscription_manager_id: 'sm-g01', sockets: 2, cores: 4 },
        { display_name: 'app-prod-02', hardware_type: 'VIRTUALIZED', last_seen: daysAgo(0.8), inventory_id: 'inv-g02', subscription_manager_id: 'sm-g02', sockets: 2, cores: 4 },
        { display_name: 'cache-prod-01', hardware_type: 'VIRTUALIZED', last_seen: daysAgo(1.2), inventory_id: 'inv-g03', subscription_manager_id: 'sm-g03', sockets: 1, cores: 2 },
        { display_name: 'web-prod-03', hardware_type: 'VIRTUALIZED', last_seen: daysAgo(0.3), inventory_id: 'inv-g04', subscription_manager_id: 'sm-g04', sockets: 2, cores: 4 },
        { display_name: 'monitor-01', hardware_type: 'VIRTUALIZED', last_seen: daysAgo(2), inventory_id: 'inv-g05', subscription_manager_id: 'sm-g05', sockets: 1, cores: 2 },
      ],
      meta: { count: 5 },
    },
  };

  return guestMap[instanceId] || { data: [], meta: { count: 0 } };
}

export async function getOptInConfig(): Promise<OptInConfig> {
  await delay(300);
  return {
    meta: { org_id: 'org-7891011' },
    data: {
      opt_in_complete: true,
      org: {
        org_id: 'org-7891011',
        opt_in_type: 'API',
        created: '2023-03-15T10:00:00Z',
        last_updated: '2024-11-01T08:30:00Z',
      },
    },
  };
}

export async function fetchBillingAccountIds(orgId: string): Promise<BillingAccountIdInfo[]> {
  await delay(300);
  return [
    { org_id: orgId, product_tag: 'rhel-for-x86', billing_provider: 'red hat', billing_account_id: 'ba-001' },
    { org_id: orgId, product_tag: 'openshift-container-platform', billing_provider: 'red hat', billing_account_id: 'ba-001' },
    { org_id: orgId, product_tag: 'rhel-for-x86', billing_provider: 'aws', billing_account_id: 'aws-123456' },
    { org_id: orgId, product_tag: 'ansible-automation-platform', billing_provider: 'red hat', billing_account_id: 'ba-002' },
  ];
}

export async function getSkuCapacityReport(productId: string): Promise<SkuCapacityReport> {
  await delay(500);

  const reports: Record<string, SkuCapacityReport> = {
    'rhel-for-x86': {
      data: [
        { sku: 'RH00003', product_name: 'Red Hat Enterprise Linux Server, Premium (Sockets)', service_level: 'Premium', usage: 'Production', subscriptions: [{ id: 'sub-001', number: 'SN-12345' }, { id: 'sub-002', number: 'SN-12346' }], billing_provider: 'red hat', next_event_date: daysFromNow(180), next_event_type: 'Subscription End', quantity: 50, capacity: 50, hypervisor_capacity: 50, total_capacity: 100, has_infinite_quantity: false, metric_id: 'Sockets' },
        { sku: 'RH00049', product_name: 'Red Hat Enterprise Linux Server, Standard (Sockets)', service_level: 'Standard', usage: 'Development/Test', subscriptions: [{ id: 'sub-003', number: 'SN-12347' }], billing_provider: 'red hat', next_event_date: daysFromNow(30), next_event_type: 'Subscription End', quantity: 25, capacity: 25, hypervisor_capacity: 0, total_capacity: 25, has_infinite_quantity: false, metric_id: 'Sockets' },
      ],
      meta: { count: 2, product: 'rhel-for-x86', subscription_type: 'Annual' },
    },
    'openshift-container-platform': {
      data: [
        { sku: 'MCT3752', product_name: 'OpenShift Container Platform, Premium (Cores)', service_level: 'Premium', usage: 'Production', subscriptions: [{ id: 'sub-010', number: 'SN-22345' }, { id: 'sub-011', number: 'SN-22346' }], billing_provider: 'red hat', next_event_date: daysFromNow(45), next_event_type: 'Subscription End', quantity: 10, capacity: 250, hypervisor_capacity: 250, total_capacity: 500, has_infinite_quantity: false, metric_id: 'Cores' },
      ],
      meta: { count: 1, product: 'openshift-container-platform', subscription_type: 'Annual' },
    },
    'ansible-automation-platform': {
      data: [
        { sku: 'MCT3695', product_name: 'Red Hat Ansible Automation Platform, Premium (Managed Nodes)', service_level: 'Premium', usage: 'Production', subscriptions: [{ id: 'sub-020', number: 'SN-32345' }], billing_provider: 'red hat', next_event_date: daysFromNow(200), next_event_type: 'Subscription End', quantity: 1, capacity: 2000, hypervisor_capacity: 0, total_capacity: 2000, has_infinite_quantity: false, metric_id: 'Managed Nodes' },
      ],
      meta: { count: 1, product: 'ansible-automation-platform', subscription_type: 'Annual' },
    },
  };

  return reports[productId] || { data: [], meta: { count: 0, product: productId } };
}

export async function getAllProductUsageSummary(): Promise<
  { product: string; used: number; capacity: number; unit: string; utilization: number }[]
> {
  const [rhelTally, ocpTally, ansibleTally] = await Promise.all([
    getTallyReport('rhel-for-x86', 'Sockets', daysAgo(30), now.toISOString()),
    getTallyReport('openshift-container-platform', 'Cores', daysAgo(30), now.toISOString()),
    getTallyReport('ansible-automation-platform', 'Managed Nodes', daysAgo(30), now.toISOString()),
  ]);

  const capacities = { 'rhel-for-x86': 100, 'openshift-container-platform': 500, 'ansible-automation-platform': 2000 };

  return [
    { product: 'Red Hat Enterprise Linux (x86)', used: rhelTally.meta.total_monthly.value, capacity: capacities['rhel-for-x86'], unit: 'sockets', utilization: Math.round((rhelTally.meta.total_monthly.value / capacities['rhel-for-x86']) * 100) },
    { product: 'Red Hat OpenShift Container Platform', used: ocpTally.meta.total_monthly.value, capacity: capacities['openshift-container-platform'], unit: 'cores', utilization: Math.round((ocpTally.meta.total_monthly.value / capacities['openshift-container-platform']) * 100) },
    { product: 'Red Hat Ansible Automation Platform', used: ansibleTally.meta.total_monthly.value, capacity: capacities['ansible-automation-platform'], unit: 'managed nodes', utilization: Math.round((ansibleTally.meta.total_monthly.value / capacities['ansible-automation-platform']) * 100) },
  ];
}

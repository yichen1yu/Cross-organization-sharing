export type GranularityType = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
export type ServiceLevelType = '' | 'Premium' | 'Standard' | 'Self-Support' | '_ANY';
export type UsageType = '' | 'Production' | 'Development/Test' | 'Disaster Recovery' | '_ANY';
export type BillingProviderType = '' | 'red hat' | 'aws' | 'gcp' | 'azure' | 'oracle' | '_ANY';
export type ReportCategory = 'physical' | 'virtual' | 'cloud' | 'hypervisor';
export type SortDirection = 'asc' | 'desc';
export type SubscriptionType = 'On-demand' | 'Annual';
export type SubscriptionEventType = 'Subscription Start' | 'Subscription End';

export interface TallyReportDataPoint {
  date: string;
  value: number;
  has_data: boolean;
}

export interface TallyReportTotalMonthly {
  date: string | null;
  value: number;
  has_data: boolean;
}

export interface TallyReportData {
  data: TallyReportDataPoint[];
  meta: {
    count: number;
    total_monthly: TallyReportTotalMonthly;
    product: string;
    metric_id: string;
    service_level?: ServiceLevelType;
    usage?: UsageType;
    granularity: GranularityType;
    billing_provider?: BillingProviderType;
  };
}

export interface Host {
  inventory_id?: string;
  insights_id?: string;
  display_name: string;
  subscription_manager_id?: string;
  sockets?: number;
  cores?: number;
  hardware_type: string;
  measurement_type?: string;
  number_of_guests?: number;
  last_seen: string;
  is_unmapped_guest?: boolean;
  is_hypervisor?: boolean;
  cloud_provider?: string;
  billing_provider?: BillingProviderType;
  billing_account_id?: string;
}

export interface InstanceData {
  id: string;
  instance_id: string;
  display_name: string;
  billing_provider?: BillingProviderType;
  billing_account_id?: string;
  measurements: (number | null)[];
  last_seen: string;
  last_applied_event_record_date?: string;
  number_of_guests?: number;
  category?: ReportCategory;
  cloud_provider?: string;
  subscription_manager_id?: string;
  inventory_id?: string;
}

export interface InstanceResponse {
  data: InstanceData[];
  meta: {
    count: number;
    product: string;
    service_level?: ServiceLevelType;
    usage?: UsageType;
    billing_provider?: BillingProviderType;
    billing_account_id?: string;
    measurements: string[];
  };
}

export interface InstanceGuestReport {
  data: Host[];
  meta: { count: number };
}

export interface OptInConfig {
  meta: { org_id: string };
  data: {
    opt_in_complete: boolean;
    org?: {
      org_id: string;
      opt_in_type: string;
      created: string;
      last_updated: string;
    };
  };
}

export interface BillingAccountIdInfo {
  org_id: string;
  product_tag: string;
  billing_provider: string;
  billing_account_id: string;
}

export interface SkuCapacitySubscription {
  id: string;
  number: string;
}

export interface SkuCapacity {
  sku: string;
  product_name: string;
  service_level?: ServiceLevelType;
  usage?: UsageType;
  subscriptions: SkuCapacitySubscription[];
  billing_provider?: BillingProviderType;
  next_event_date?: string;
  next_event_type?: SubscriptionEventType;
  quantity: number;
  capacity: number;
  hypervisor_capacity: number;
  total_capacity: number;
  has_infinite_quantity: boolean;
  metric_id: string;
}

export interface SkuCapacityReport {
  data: SkuCapacity[];
  meta: {
    count: number;
    product: string;
    service_level?: ServiceLevelType;
    usage?: UsageType;
    subscription_type?: SubscriptionType;
    report_category?: ReportCategory;
  };
}

export type ScenarioId = 'usage' | 'expiring' | 'notification' | 'hypervisor' | 'multi-month' | 'sca' | 'registration' | 'aws-vm';

export interface ScenarioResult {
  scenarioId: ScenarioId;
  readOnlyResponse: string;
  editPrompt: string;
  citations?: Citation[];
  confidence: 'high' | 'medium' | 'low';
  skillLabel?: string;
}

export interface Citation {
  title: string;
  url: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  citations?: Citation[];
  confidence?: 'high' | 'medium' | 'low';
  isLoading?: boolean;
  scenarioId?: ScenarioId;
  showQuickStarts?: boolean;
  actions?: {
    positive?: { onClick: () => void };
    negative?: { onClick: () => void };
  };
}

export interface EditFollowUpResult {
  message: string;
  stillAwaitingFollowUp: boolean;
}

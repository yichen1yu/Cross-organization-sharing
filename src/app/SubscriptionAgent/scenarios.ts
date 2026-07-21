import type { ScenarioResult, ScenarioId } from './types';
import * as api from './mockSwatchApi';
import { triggerDownload } from './downloadUtils';

const HCC_BASE = 'https://console.redhat.com';

export async function handleScenario(scenarioId: ScenarioId, userMessage: string): Promise<ScenarioResult> {
  switch (scenarioId) {
    case 'usage':
      return handleUsageAvailability();
    case 'expiring':
      return handleExpiringSubscriptions(userMessage);
    case 'notification':
      return handleNotificationSetup(userMessage);
    case 'hypervisor':
      return handleHypervisorLookup(userMessage);
    case 'multi-month':
      return handleMultiMonthUsage(userMessage);
    case 'sca':
      return handleSCA();
    case 'registration':
      return handleSystemRegistration();
    case 'aws-vm':
      return handleAWSVMStartup();
    default:
      return {
        scenarioId,
        readOnlyResponse: "I wasn't able to process that request. Could you rephrase it?",
        editPrompt: '',
        confidence: 'low',
      };
  }
}

async function handleUsageAvailability(): Promise<ScenarioResult> {
  const summary = await api.getAllProductUsageSummary();

  const lines = summary.map(
    (s) => `- **${s.product}**: ${s.used.toLocaleString()} ${s.unit} used / ${(s.capacity - s.used).toLocaleString()} ${s.unit} remaining (${s.utilization}% utilized)`
  );

  return {
    scenarioId: 'usage',
    readOnlyResponse:
      `Here is the current usage and remaining capacity for all active subscriptions across your organization:\n\n${lines.join('\n')}\n\n*Source: Subscription Watch API — verified just now.*`,
    editPrompt:
      'Want me to:\n1. Export this full inventory snapshot as CSV/JSON for your records\n2. Configure an early-warning utilization threshold notification for subscriptions nearing capacity\n3. Both\n\nReply **1**, **2**, **3**, or **no**.',
    citations: [
      { title: 'Subscription Usage — RHEL', url: `${HCC_BASE}/insights/subscriptions/rhel` },
      { title: 'Subscription Usage — OpenShift', url: `${HCC_BASE}/insights/subscriptions/openshift` },
    ],
    confidence: 'high',
    skillLabel: 'Subscription Usage',
  };
}

async function handleExpiringSubscriptions(userMessage: string): Promise<ScenarioResult> {
  const lc = userMessage.toLowerCase();
  let productFilter = '';
  if (lc.includes('openshift') || lc.includes('ocp')) productFilter = 'openshift-container-platform';
  else if (lc.includes('rhel')) productFilter = 'rhel-for-x86';
  else if (lc.includes('ansible')) productFilter = 'ansible-automation-platform';

  const products = productFilter
    ? [productFilter]
    : ['rhel-for-x86', 'openshift-container-platform', 'ansible-automation-platform'];

  const reports = await Promise.all(products.map((p) => api.getSkuCapacityReport(p)));

  const daysMatch = lc.match(/(\d+)\s*days?/);
  const withinDays = daysMatch ? parseInt(daysMatch[1], 10) : 90;
  const cutoff = new Date(Date.now() + withinDays * 86400000);

  const expiring: { name: string; daysLeft: number; sku: string; capacity: number; unit: string }[] = [];
  for (const report of reports) {
    for (const sku of report.data) {
      if (sku.next_event_type === 'Subscription End' && sku.next_event_date) {
        const end = new Date(sku.next_event_date);
        if (end <= cutoff) {
          const daysLeft = Math.ceil((end.getTime() - Date.now()) / 86400000);
          expiring.push({ name: sku.product_name, daysLeft, sku: sku.sku, capacity: sku.total_capacity, unit: sku.metric_id });
        }
      }
    }
  }

  if (expiring.length === 0) {
    return {
      scenarioId: 'expiring',
      readOnlyResponse: `No subscriptions are expiring within the next ${withinDays} days. Your subscriptions are in good standing.`,
      editPrompt: '',
      confidence: 'high',
      skillLabel: 'Subscription Renewals',
    };
  }

  const lines = expiring.map(
    (e) => `- **${e.name}** (SKU: ${e.sku}): expires in **${e.daysLeft} days** — ${e.capacity.toLocaleString()} ${e.unit} total capacity`
  );

  return {
    scenarioId: 'expiring',
    readOnlyResponse:
      `You have ${expiring.length} subscription(s) expiring within ${withinDays} days:\n\n${lines.join('\n')}\n\n*Source: Subscription Watch API — verified just now.*`,
    editPrompt:
      'Want me to:\n1. Export a 6-month usage report and draft a renewal summary with capacity recommendations\n2. Set up a custom utilization threshold notification so you are alerted if usage hits 100%\n3. Both\n\nReply **1**, **2**, **3**, or **no**.',
    citations: [
      { title: 'Subscription Inventory', url: `${HCC_BASE}/insights/subscriptions/inventory` },
    ],
    confidence: 'high',
    skillLabel: 'Subscription Renewals',
  };
}

async function handleNotificationSetup(userMessage: string): Promise<ScenarioResult> {
  const lc = userMessage.toLowerCase();
  let product = 'RHEL x86';
  if (lc.includes('openshift') || lc.includes('ocp')) product = 'OpenShift';
  else if (lc.includes('ansible')) product = 'Ansible';

  const thresholdMatch = lc.match(/(\d+)\s*%/);
  const threshold = thresholdMatch ? parseInt(thresholdMatch[1], 10) : 95;

  return {
    scenarioId: 'notification',
    readOnlyResponse:
      `Your current **${product}** usage has been trending upwards over the past 14 days. Currently, your organization is only configured to receive the baseline alert when utilization exceeds the system-defined threshold of **105%**.\n\nYou requested a threshold of **${threshold}%**.`,
    editPrompt:
      `Want me to:\n1. Configure a custom utilization threshold at **${threshold}%** for ${product} so you receive an early-warning notification\n2. Audit your existing notification settings in the Hybrid Cloud Console to ensure your team is opted-in to receive these alerts\n3. Both\n\nReply **1**, **2**, **3**, or **no**.`,
    citations: [
      { title: 'Notification Settings', url: `${HCC_BASE}/settings/notifications` },
    ],
    confidence: 'medium',
    skillLabel: 'Notification Setup',
  };
}

async function handleHypervisorLookup(userMessage: string): Promise<ScenarioResult> {
  const lc = userMessage.toLowerCase();

  const instances = await api.getInstancesByProduct('rhel-for-x86');
  const hypervisors = instances.data.filter((i) => i.category === 'hypervisor' || (i.number_of_guests && i.number_of_guests > 0));

  const vmNameMatch = lc.match(/(?:vm|guest|find|looking for)\s+([a-z0-9_-]+(?:\.[a-z0-9._-]+)?)/i)
    || lc.match(/([a-z]+-[a-z]+-\d+)/i);
  const searchName = vmNameMatch ? vmNameMatch[1].toLowerCase() : '';

  if (searchName && hypervisors.length > 0) {
    for (const hyp of hypervisors) {
      const guests = await api.getInstanceGuests(hyp.id);
      const found = guests.data.find((g) => g.display_name.toLowerCase().includes(searchName));
      if (found) {
        const hoursAgo = Math.round((Date.now() - new Date(found.last_seen).getTime()) / 3600000);
        return {
          scenarioId: 'hypervisor',
          readOnlyResponse:
            `Found it. VM **${found.display_name}** is a guest machine residing under the parent hypervisor **${hyp.display_name}**. The VM was last seen **${hoursAgo} hours ago**.\n\n| Property | Value |\n|---|---|\n| VM Name | ${found.display_name} |\n| Hypervisor | ${hyp.display_name} |\n| Sockets | ${found.sockets || 'N/A'} |\n| Cores | ${found.cores || 'N/A'} |\n| Last Seen | ${hoursAgo}h ago |`,
          editPrompt:
            'Want me to:\n1. Navigate to the Subscription Usage page and highlight the matching VM under its hypervisor\n2. Generate a host-to-guest mapping report for this cluster\n3. Both\n\nReply **1**, **2**, **3**, or **no**.',
          citations: [
            { title: 'Subscription Usage — RHEL', url: `${HCC_BASE}/insights/subscriptions/rhel` },
          ],
          confidence: 'high',
          skillLabel: 'Hypervisor Lookup',
        };
      }
    }
  }

  const hyperList = hypervisors.map((h) => `- **${h.display_name}** — ${h.number_of_guests || 0} guest VMs`).join('\n');

  return {
    scenarioId: 'hypervisor',
    readOnlyResponse:
      searchName
        ? `I could not find a VM matching "${searchName}" under any known hypervisor. Here are the hypervisors in your estate:\n\n${hyperList}\n\nCould you double-check the VM name?`
        : `Here are the hypervisors in your RHEL estate:\n\n${hyperList}\n\nWhich VM are you looking for? Provide the display name and I'll locate its parent host.`,
    editPrompt: '',
    confidence: searchName ? 'medium' : 'high',
    skillLabel: 'Hypervisor Lookup',
  };
}

async function handleMultiMonthUsage(userMessage: string): Promise<ScenarioResult> {
  const lc = userMessage.toLowerCase();

  let product = 'openshift-container-platform';
  let productLabel = 'OpenShift';
  let metricId = 'Cores';
  if (lc.includes('rhel')) { product = 'rhel-for-x86'; productLabel = 'RHEL'; metricId = 'Sockets'; }
  else if (lc.includes('ansible')) { product = 'ansible-automation-platform'; productLabel = 'Ansible'; metricId = 'Managed Nodes'; }
  else if (lc.includes('advanced cluster') || lc.includes('acm')) { productLabel = 'OpenShift Advanced Cluster Management'; metricId = 'vCPU'; }

  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const yearMatch = lc.match(/20\d{2}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();
  const startMonth = monthNames.findIndex((m) => lc.includes(m));
  let endMonth = -1;
  for (let i = monthNames.length - 1; i >= 0; i--) {
    if (lc.includes(monthNames[i])) { endMonth = i; break; }
  }

  const beg = new Date(year, startMonth >= 0 ? startMonth : 0, 1).toISOString();
  const end = new Date(year, (endMonth >= 0 ? endMonth : 2) + 1, 0).toISOString();
  const monthCount = (endMonth >= 0 ? endMonth : 2) - (startMonth >= 0 ? startMonth : 0) + 1;

  const report = await api.getTallyReport(product, metricId, beg, end);
  const totalUsage = report.data.reduce((sum, dp) => sum + (dp.has_data ? dp.value : 0), 0);

  return {
    scenarioId: 'multi-month',
    readOnlyResponse:
      `During **${monthNames[startMonth >= 0 ? startMonth : 0]?.replace(/^./, (c) => c.toUpperCase()) || 'Jan'} ${year}** to **${monthNames[endMonth >= 0 ? endMonth : 2]?.replace(/^./, (c) => c.toUpperCase()) || 'Mar'} ${year}**, your organization consumed a cumulative total of **${totalUsage.toLocaleString()} ${metricId.toLowerCase()}** of ${productLabel} across ${monthCount} months.\n\nThis data reflects your aggregated usage snapshot for that entire window.\n\n*Source: Subscription Watch API — verified just now.*`,
    editPrompt:
      'Want me to:\n1. Generate a single CSV/JSON file aggregating all data points within this window\n\nReply **1** or **no**.',
    citations: [
      { title: `Subscription Usage — ${productLabel}`, url: `${HCC_BASE}/insights/subscriptions/rhel` },
    ],
    confidence: 'high',
    skillLabel: 'Usage Report',
  };
}

async function handleSCA(): Promise<ScenarioResult> {
  const config = await api.getOptInConfig();

  return {
    scenarioId: 'sca',
    readOnlyResponse:
      `**Simple Content Access (SCA)** simplifies Red Hat entitlement by removing the need to manually attach an entitlement to every individual system in order to download and install Red Hat content.\n\nAs of November 2024, all accounts were transitioned to SCA mode. Your organization (Org ID: \`${config.meta.org_id}\`) currently has **SCA ${config.data.opt_in_complete ? 'enabled' : 'disabled'}**.\n\nThis means systems only need to be **registered** and have their **repositories enabled** to consume content.`,
    editPrompt:
      'Want me to:\n1. Help with enabling Simple Content Access with Red Hat Subscription Management\n2. Help with enabling Simple Content Access with Red Hat Satellite\n3. Both\n\nReply **1**, **2**, **3**, or **no**.',
    citations: [
      { title: 'Simple Content Access Documentation', url: 'https://access.redhat.com/articles/simple-content-access' },
      { title: 'Subscription Management', url: `${HCC_BASE}/insights/subscriptions` },
    ],
    confidence: 'high',
    skillLabel: 'SCA Status',
  };
}

async function handleSystemRegistration(): Promise<ScenarioResult> {
  await api.getOptInConfig();

  return {
    scenarioId: 'registration',
    readOnlyResponse:
      `To register a RHEL system with Red Hat, follow these steps:\n\n1. **Register with subscription-manager:**\n\`\`\`bash\nsudo subscription-manager register --username <your-username> --password <your-password>\n\`\`\`\n\n2. **Set the system purpose** (optional but recommended):\n\`\`\`bash\nsudo subscription-manager syspurpose set-role "Red Hat Enterprise Linux Server"\nsudo subscription-manager syspurpose set-usage "Production"\nsudo subscription-manager syspurpose set-sla "Premium"\n\`\`\`\n\n3. **Verify registration:**\n\`\`\`bash\nsudo subscription-manager identity\n\`\`\`\n\nWith **SCA enabled** on your organization, no manual subscription attachment is needed — repositories are available immediately after registration.`,
    editPrompt:
      'Want me to:\n1. Generate a ready-to-run registration script customized for your organization\n2. Show how to register using an activation key instead of username/password\n\nReply **1**, **2**, or **no**.',
    citations: [
      { title: 'System Registration Guide', url: 'https://access.redhat.com/documentation/en-us/red_hat_subscription_management/2023/html/registering_and_managing_systems' },
    ],
    confidence: 'high',
    skillLabel: 'System Registration',
  };
}

async function handleAWSVMStartup(): Promise<ScenarioResult> {
  const instances = await api.getInstancesByProduct('rhel-for-x86');
  const awsInstances = instances.data.filter((i) => i.cloud_provider === 'aws');

  const awsLines = awsInstances.length > 0
    ? awsInstances.map((i) => `- **${i.display_name}** (${i.instance_id}) — last seen ${Math.round((Date.now() - new Date(i.last_seen).getTime()) / 3600000)}h ago`).join('\n')
    : '- No AWS instances currently tracked.';

  return {
    scenarioId: 'aws-vm',
    readOnlyResponse:
      `Here is how to launch a RHEL instance on AWS with proper subscription tracking:\n\n1. **Launch from the AWS Marketplace** using an official Red Hat AMI (Gold Image)\n2. **Tag the instance** with \`com_redhat_rhel\` cost allocation tag for billing integration\n3. **Verify the instance appears** in Subscription Watch within 24-48 hours\n\nYour current AWS instances in Subscription Watch:\n\n${awsLines}\n\n*Tip: Cloud instances using RHEL PAYG (Pay-As-You-Go) from the AWS Marketplace are automatically metered — no manual subscription attachment is required.*`,
    editPrompt:
      'Want me to:\n1. Show the AWS Gold Images available in your Cloud Inventory\n2. Help configure cost allocation tags on your AWS account\n\nReply **1**, **2**, or **no**.',
    citations: [
      { title: 'Cloud Inventory — Gold Images', url: `${HCC_BASE}/insights/subscriptions/gold-images` },
      { title: 'AWS Integration Guide', url: 'https://access.redhat.com/documentation/en-us/subscription_central/2023/html/getting_started_with_the_subscriptions_service/assembly-config-subs-service' },
    ],
    confidence: 'high',
    skillLabel: 'AWS VM Setup',
  };
}

const scenarioOptions: Record<ScenarioId, Record<string, string>> = {
  'usage': {
    '1': 'Export this full inventory snapshot as CSV/JSON for your records',
    '2': 'Configure an early-warning utilization threshold notification for subscriptions nearing capacity',
  },
  'expiring': {
    '1': 'Export a 6-month usage report with capacity recommendations',
    '2': 'Set up a utilization threshold notification so you are alerted if usage hits 100%',
  },
  'notification': {
    '1': 'Configure the custom utilization threshold',
    '2': 'Audit your existing notification settings to ensure your team is opted-in',
  },
  'hypervisor': {
    '1': 'Navigate to the Subscription Usage page and highlight the matching VM',
    '2': 'Generate a host-to-guest mapping report for this cluster',
  },
  'multi-month': {
    '1': 'Generate a CSV/JSON file aggregating all data points within this window',
  },
  'sca': {
    '1': 'Help with enabling SCA with Red Hat Subscription Management',
    '2': 'Help with enabling SCA with Red Hat Satellite',
  },
  'registration': {
    '1': 'Generate a ready-to-run registration script customized for your organization',
    '2': 'Show how to register using an activation key instead of username/password',
  },
  'aws-vm': {
    '1': 'Show the AWS Gold Images available in your Cloud Inventory',
    '2': 'Help configure cost allocation tags on your AWS account',
  },
};

const completedOptions: Record<string, Set<string>> = {};

function getCompletedKey(scenarioId: ScenarioId): string {
  return scenarioId;
}

function buildRemainingPrompt(scenarioId: ScenarioId): string {
  const options = scenarioOptions[scenarioId];
  if (!options) return '';
  const key = getCompletedKey(scenarioId);
  const done = completedOptions[key] || new Set();
  const remaining = Object.entries(options).filter(([k]) => !done.has(k));
  if (remaining.length === 0) return '';

  const lines = remaining.map(([k, label]) => `${k}. ${label}`);
  return `\n\nWould you also like me to:\n${lines.join('\n')}\n\nReply ${remaining.map(([k]) => `**${k}**`).join(', ')}, or **no** if you're all set.`;
}

async function executeOption(choice: string, scenarioId: ScenarioId): Promise<string | null> {
  if (scenarioId === 'usage') {
    if (choice === '1') {
      const summary = await api.getAllProductUsageSummary();
      const csv = ['Product,Used,Capacity,Unit,Utilization %', ...summary.map((s) => `${s.product},${s.used},${s.capacity},${s.unit},${s.utilization}`)].join('\n');
      triggerDownload('subscription-usage-snapshot.csv', csv);
      return "Your **subscription usage snapshot** has been exported and the download has started.";
    }
    if (choice === '2') return "I've configured an **early-warning threshold at 90%** utilization. You'll receive a notification when any subscription crosses that mark.\n\n*Changes applied to your Notification Settings.*";
  }

  if (scenarioId === 'expiring') {
    if (choice === '1') {
      const reports = await Promise.all([api.getSkuCapacityReport('rhel-for-x86'), api.getSkuCapacityReport('openshift-container-platform'), api.getSkuCapacityReport('ansible-automation-platform')]);
      const rows = reports.flatMap((r) => r.data.map((sku) => `${sku.product_name},${sku.sku},${sku.total_capacity},${sku.metric_id},${sku.next_event_date || ''},${sku.next_event_type || ''},${sku.service_level || ''},${sku.usage || ''}`));
      const csv = ['Product,SKU,Total Capacity,Metric,Next Event Date,Event Type,Service Level,Usage', ...rows].join('\n');
      triggerDownload('renewal-report.csv', csv);
      return "Your **6-month renewal report** has been exported and the download has started.";
    }
    if (choice === '2') return "I've set up a **100% utilization threshold notification** for all expiring subscriptions. You'll be alerted immediately if usage reaches capacity.\n\n*Changes applied to your Notification Settings.*";
  }

  if (scenarioId === 'notification') {
    if (choice === '1') return "**Custom utilization threshold configured.** You will now receive a notification when usage crosses the requested threshold.\n\n*Changes applied to your Notification Settings.*";
    if (choice === '2') return "I've audited your notification settings. Your team's email preferences are currently set to receive **daily digest** notifications. Individual alert opt-in status has been verified for all team members.";
  }

  if (scenarioId === 'hypervisor') {
    if (choice === '1') return "Navigating to the Subscription Usage page. The hypervisor row has been expanded and the VM is highlighted.";
    if (choice === '2') {
      const instances = await api.getInstancesByProduct('rhel-for-x86');
      const hypervisors = instances.data.filter((i) => i.category === 'hypervisor' || (i.number_of_guests && i.number_of_guests > 0));
      const rows: string[] = [];
      for (const hyp of hypervisors) {
        const guests = await api.getInstanceGuests(hyp.id);
        for (const g of guests.data) { rows.push(`${hyp.display_name},${g.display_name},${g.hardware_type},${g.sockets || ''},${g.cores || ''},${g.last_seen}`); }
      }
      const csv = ['Hypervisor,Guest VM,Hardware Type,Sockets,Cores,Last Seen', ...rows].join('\n');
      triggerDownload('hypervisor-guest-mapping.csv', csv);
      return "Your **host-to-guest mapping report** has been exported and the download has started.";
    }
  }

  if (scenarioId === 'multi-month' && choice === '1') {
    const now = new Date();
    const beg = new Date(now.getFullYear(), 0, 1).toISOString();
    const end = new Date(now.getFullYear(), 2, 31).toISOString();
    const report = await api.getTallyReport('openshift-container-platform', 'Cores', beg, end);
    const csv = ['Date,Value (Cores),Has Data', ...report.data.map((dp) => `${dp.date},${dp.value},${dp.has_data}`)].join('\n');
    triggerDownload(`usage-report-q1-${now.getFullYear()}.csv`, csv);
    return "Your **aggregated usage report** has been exported and the download has started.";
  }

  if (scenarioId === 'sca') {
    if (choice === '1') return "Here's how to enable SCA via **Subscription Management**:\n\n1. Go to [access.redhat.com/management](https://access.redhat.com/management)\n2. Select your organization\n3. Click **Simple Content Access** → **Enable**\n4. Verify with: `subscription-manager refresh`";
    if (choice === '2') return "For **Red Hat Satellite**, enable SCA with:\n\n1. Navigate to **Administer → Settings → Content**\n2. Set **Simple Content Access** to **Yes**\n3. Run: `hammer organization update --name 'Your Org' --simple-content-access true`";
  }

  if (scenarioId === 'registration') {
    if (choice === '1') return "Here's a customized registration script for your organization:\n\n```bash\n#!/bin/bash\nsudo subscription-manager register \\\n  --org=org-7891011 \\\n  --activationkey=your-activation-key\nsudo subscription-manager syspurpose set-role \"Red Hat Enterprise Linux Server\"\nsudo subscription-manager syspurpose set-usage \"Production\"\nsudo subscription-manager syspurpose set-sla \"Premium\"\necho \"Registration complete.\"\n```";
    if (choice === '2') return "To register using an **activation key** (recommended for automation):\n\n```bash\nsudo subscription-manager register \\\n  --org=org-7891011 \\\n  --activationkey=<your-key-name>\n```\n\nCreate activation keys at: [access.redhat.com/management/activation_keys](https://access.redhat.com/management/activation_keys)";
  }

  if (scenarioId === 'aws-vm') {
    if (choice === '1') return "Your available **AWS Gold Images** include:\n\n| Image | Version | Region |\n|---|---|---|\n| RHEL 9.3 x86_64 | 9.3.0 | us-east-1 |\n| RHEL 8.9 x86_64 | 8.9.0 | us-east-1 |\n| RHEL 9.3 ARM64 | 9.3.0 | us-west-2 |\n\nView all at: Cloud Inventory → Gold Images.";
    if (choice === '2') return "To configure **cost allocation tags** on AWS:\n\n1. Go to **AWS Billing → Cost Allocation Tags**\n2. Activate tags: `com_redhat_rhel`, `com_redhat_rhel_addon`\n3. Tags become active within 24 hours\n4. Verify in HCC under **Subscription Usage** after 48 hours.";
  }

  return null;
}

export async function handleEditFollowUp(choice: string, scenarioId: ScenarioId): Promise<{ message: string; stillAwaitingFollowUp: boolean }> {
  const c = choice.trim().toLowerCase();

  if (c === 'no' || c === 'n') {
    const key = getCompletedKey(scenarioId);
    delete completedOptions[key];
    return { message: "Understood. Is there anything else I can help with regarding your subscriptions?", stillAwaitingFollowUp: false };
  }

  if (c === '3') {
    const options = scenarioOptions[scenarioId];
    if (options && options['1'] && options['2']) {
      const r1 = await executeOption('1', scenarioId);
      const r2 = await executeOption('2', scenarioId);
      const key = getCompletedKey(scenarioId);
      delete completedOptions[key];
      return { message: `${r1}\n\n${r2}\n\nIs there anything else I can help with regarding your subscriptions?`, stillAwaitingFollowUp: false };
    }
  }

  const result = await executeOption(c, scenarioId);
  if (!result) {
    return { message: "I didn't recognize that option. Please reply with a number from the options above, or **no** if you're all set.", stillAwaitingFollowUp: true };
  }

  const key = getCompletedKey(scenarioId);
  if (!completedOptions[key]) completedOptions[key] = new Set();
  completedOptions[key].add(c);

  const remaining = buildRemainingPrompt(scenarioId);
  if (remaining) {
    return { message: result + remaining, stillAwaitingFollowUp: true };
  }

  delete completedOptions[key];
  return { message: result + '\n\nIs there anything else I can help with regarding your subscriptions?', stillAwaitingFollowUp: false };
}

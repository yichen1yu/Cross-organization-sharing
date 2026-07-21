import type { ScenarioId } from './types';

interface ScenarioPattern {
  id: ScenarioId;
  keywords: string[];
  phrases: string[];
}

const scenarioPatterns: ScenarioPattern[] = [
  {
    id: 'hypervisor',
    keywords: ['hypervisor', 'virt-who', 'esxi'],
    phrases: ['vm ', 'guest vm', 'which host', 'find vm', 'looking for vm', 'guest machine', 'parent host', 'number_of_guests'],
  },
  {
    id: 'multi-month',
    keywords: ['quarterly', 'q1', 'q2', 'q3', 'q4'],
    phrases: ['jan to', 'feb to', 'mar to', 'apr to', 'may to', 'jun to', 'jul to', 'aug to', 'sep to', 'oct to', 'nov to', 'dec to', 'january to', 'february to', 'march to', 'multi-month', 'across months', 'business review', 'aggregat'],
  },
  {
    id: 'expiring',
    keywords: ['expiring', 'renewal', 'renew', 'expire', 'expires', 'budget'],
    phrases: ['expiring soon', 'plan our budget', 'renewal process', 'end date'],
  },
  {
    id: 'notification',
    keywords: ['notification', 'alert', 'threshold', 'notify', 'warning'],
    phrases: ['set up a notification', 'configure alert', 'utilization threshold', 'early warning', 'trending upward'],
  },
  {
    id: 'sca',
    keywords: ['sca', 'entitlement', 'entitlements'],
    phrases: ['simple content access', 'content access', 'legacy entitlement', 'attach subscription'],
  },
  {
    id: 'registration',
    keywords: ['register', 'registration'],
    phrases: ['system registration', 'register a system', 'subscription-manager register', 'register my'],
  },
  {
    id: 'aws-vm',
    keywords: ['ec2', 'ami'],
    phrases: ['aws vm', 'aws instance', 'aws marketplace', 'gold image', 'cloud instance', 'launch rhel on aws', 'aws startup'],
  },
  {
    id: 'usage',
    keywords: ['usage', 'availability', 'capacity', 'utilization', 'consumed', 'remaining'],
    phrases: ['show me the current', 'how much', 'subscription usage', 'active subscription', 'remaining capacity', 'current usage'],
  },
];

export function classifyIntent(message: string): ScenarioId | null {
  const lc = message.toLowerCase().trim();

  for (const pattern of scenarioPatterns) {
    for (const phrase of pattern.phrases) {
      if (lc.includes(phrase)) return pattern.id;
    }
  }

  for (const pattern of scenarioPatterns) {
    for (const keyword of pattern.keywords) {
      if (lc.includes(keyword)) return pattern.id;
    }
  }

  return null;
}

export function isEditFollowUp(message: string): boolean {
  const trimmed = message.trim().toLowerCase();
  return /^[1-3]$/.test(trimmed) || trimmed === 'no' || trimmed === 'n' || trimmed === 'yes' || trimmed === 'both';
}

export const FALLBACK_MESSAGE =
  "I'm your **Red Hat Subscription Agent** and I can help with:\n\n" +
  '- **Subscription usage & availability** — current utilization across RHEL, OpenShift, Ansible\n' +
  '- **Expiring subscriptions** — identify upcoming renewals and plan ahead\n' +
  '- **Notification setup** — configure utilization threshold alerts\n' +
  '- **Hypervisor VM lookup** — find which host a VM belongs to\n' +
  '- **Multi-month usage reports** — aggregate usage across custom date ranges\n' +
  '- **Simple Content Access (SCA)** — check your SCA status and configuration\n' +
  '- **System registration** — register RHEL systems with subscription-manager\n' +
  '- **AWS VM setup** — launch and track RHEL instances on AWS\n\n' +
  'What would you like to know?';

export const WELCOME_TITLE = 'Red Hat Subscription Agent';

export const WELCOME_DESCRIPTION =
  "Hi, I'm your Subscription Agent. I can help you understand your Red Hat subscription usage, find expiring subscriptions, look up VMs, and more.";

export const WELCOME_PROMPTS = [
  {
    title: 'Show subscription usage',
    message: 'Show me the current usage and remaining availability for all of our active Red Hat subscriptions.',
  },
  {
    title: 'Expiring subscriptions',
    message: 'Which of our subscriptions are expiring in the next 90 days?',
  },
  {
    title: 'Find a VM',
    message: 'I am looking for VM db-prod-01 to verify an audit. Which host does it belong to?',
  },
  {
    title: 'Check SCA status',
    message: 'Is Simple Content Access enabled for my organization?',
  },
  {
    title: 'Set up notifications',
    message: 'Can we set up a notification alert when RHEL usage reaches 95%?',
  },
  {
    title: 'Quarterly usage report',
    message: 'I need a summary of our OpenShift usage from Jan 2026 to March 2026.',
  },
  {
    title: 'Register a system',
    message: 'How do I register a RHEL system with Red Hat?',
  },
  {
    title: 'AWS VM setup',
    message: 'How do I launch a RHEL instance on AWS with proper subscription tracking?',
  },
];

export const FOOTNOTE_LABEL = 'Always review AI-generated responses for accuracy.';
export const FOOTNOTE_DESCRIPTION =
  'This agent uses the Subscription Watch API to provide data about your Red Hat subscriptions. Responses are generated based on your organization\'s subscription data and may require verification.';

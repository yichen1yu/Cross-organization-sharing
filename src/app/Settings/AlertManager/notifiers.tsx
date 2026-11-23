import * as React from 'react';
import { EnvelopeIcon, OpenDrawerRightIcon } from '@patternfly/react-icons';
import teamsLogo from '@app/assets/bgimages/microsoft-teams.svg';
import googleChatLogo from '@app/assets/bgimages/google-chat.svg';
import ansibleLogo from '@app/assets/bgimages/event-ansible.svg';
import pagerDutyLogo from '@app/assets/bgimages/pagerduty.svg';
import serviceNowLogo from '@app/assets/bgimages/servicenow.svg';
import splunkLogo from '@app/assets/bgimages/splunk.svg';
import webhooksLogo from '@app/assets/bgimages/webhooks.svg';

export type NotifierKind = 'email' | 'daily-digest' | 'drawer' | 'slack' | 'teams' | 'google-chat' | 'event-ansible' | 'pagerduty' | 'servicenow' | 'splunk' | 'webhooks';
export type ThirdPartyKind = Exclude<NotifierKind, 'email' | 'daily-digest' | 'drawer'>;

const SlackMark: React.FunctionComponent = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#E01E5A" d="M6 15.5A2.5 2.5 0 1 1 3.5 13H6v2.5zM8.5 15.5a2.5 2.5 0 0 1 5 0V21a2.5 2.5 0 1 1-5 0v-5.5z" />
    <path fill="#36C5F0" d="M8.5 6A2.5 2.5 0 1 1 11 3.5V6H8.5zM8.5 8.5a2.5 2.5 0 0 1 0 5H3a2.5 2.5 0 1 1 0-5h5.5z" />
    <path fill="#2EB67D" d="M18 8.5A2.5 2.5 0 1 1 20.5 11H18V8.5zM15.5 8.5a2.5 2.5 0 0 1-5 0V3a2.5 2.5 0 1 1 5 0v5.5z" />
    <path fill="#ECB22E" d="M15.5 18a2.5 2.5 0 1 1-2.5 2.5V18h2.5zM15.5 15.5a2.5 2.5 0 0 1 0-5H21a2.5 2.5 0 1 1 0 5h-5.5z" />
  </svg>
);

const brandIcon = (src: string) => <img src={src} alt="" aria-hidden="true" className="alert-notifier-brand-icon" />;

export const notifierMeta: Record<NotifierKind, { label: string; icon: React.ReactNode }> = {
  email: { label: 'Email', icon: <EnvelopeIcon /> },
  'daily-digest': { label: 'Daily digest', icon: <EnvelopeIcon /> },
  drawer: { label: 'In-console', icon: <OpenDrawerRightIcon /> },
  slack: { label: 'Slack', icon: <SlackMark /> },
  teams: { label: 'Microsoft Teams', icon: brandIcon(teamsLogo) },
  'google-chat': { label: 'Google Chat', icon: brandIcon(googleChatLogo) },
  'event-ansible': { label: 'Event-driven Ansible', icon: brandIcon(ansibleLogo) },
  pagerduty: { label: 'PagerDuty', icon: brandIcon(pagerDutyLogo) },
  servicenow: { label: 'ServiceNow', icon: brandIcon(serviceNowLogo) },
  splunk: { label: 'Splunk', icon: brandIcon(splunkLogo) },
  webhooks: { label: 'Webhooks', icon: brandIcon(webhooksLogo) },
};

export const thirdPartyKinds: ThirdPartyKind[] = ['slack', 'teams', 'google-chat', 'event-ansible', 'pagerduty', 'servicenow', 'splunk', 'webhooks'];

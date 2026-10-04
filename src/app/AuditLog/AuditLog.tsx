import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Label,
  PageSection,
  Title,
  Content,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

type AuditEntry = {
  date: string;
  actor: string;
  actorType: 'agent' | 'user';
  agentLabel?: string;
  action: string;
  resource: string;
  resourceNote?: string;
};

const auditData: AuditEntry[] = [
  {
    date: 'Oct 1, 2026 09:42 AM',
    actor: 'Support Agent',
    actorType: 'agent',
    agentLabel: 'Support Agent',
    action: 'Created support ticket',
    resource: 'CASE-0047',
    resourceNote: 'duplicate',
  },
  {
    date: 'Oct 1, 2026 09:41 AM',
    actor: 'Support Agent',
    actorType: 'agent',
    agentLabel: 'Support Agent',
    action: 'Created support ticket',
    resource: 'CASE-0046',
    resourceNote: 'duplicate',
  },
  {
    date: 'Oct 1, 2026 09:40 AM',
    actor: 'Support Agent',
    actorType: 'agent',
    agentLabel: 'Support Agent',
    action: 'Created support ticket',
    resource: 'CASE-0045',
    resourceNote: 'malformed',
  },
  {
    date: 'Oct 1, 2026 09:38 AM',
    actor: 'Support Agent',
    actorType: 'agent',
    agentLabel: 'Support Agent',
    action: 'Created support ticket',
    resource: 'CASE-0044',
  },
  {
    date: 'Oct 1, 2026 08:15 AM',
    actor: 'priya@acme.com',
    actorType: 'user',
    action: 'Logged in',
    resource: 'Session SES-8821',
  },
  {
    date: 'Sep 30, 2026 05:22 PM',
    actor: 'Insights Advisor',
    actorType: 'agent',
    agentLabel: 'Insights Advisor',
    action: 'Generated remediation plan',
    resource: 'host prod-web-03',
  },
  {
    date: 'Sep 30, 2026 02:05 PM',
    actor: 'alex@acme.com',
    actorType: 'user',
    action: 'Updated role assignment',
    resource: 'Developer → Viewer',
  },
  {
    date: 'Sep 30, 2026 11:30 AM',
    actor: 'Support Agent',
    actorType: 'agent',
    agentLabel: 'Support Agent',
    action: 'Escalated support ticket',
    resource: 'CASE-0042',
  },
  {
    date: 'Sep 30, 2026 10:15 AM',
    actor: 'alex@acme.com',
    actorType: 'user',
    action: 'Created workspace',
    resource: 'Staging Environment',
  },
  {
    date: 'Sep 30, 2026 09:00 AM',
    actor: 'Insights Advisor',
    actorType: 'agent',
    agentLabel: 'Insights Advisor',
    action: 'Generated remediation plan',
    resource: 'host prod-db-01',
  },
  {
    date: 'Sep 29, 2026 04:45 PM',
    actor: 'priya@acme.com',
    actorType: 'user',
    action: 'Added user to group',
    resource: 'DevOps Team',
  },
  {
    date: 'Sep 29, 2026 03:12 PM',
    actor: 'Support Agent',
    actorType: 'agent',
    agentLabel: 'Support Agent',
    action: 'Created support ticket',
    resource: 'CASE-0041',
  },
  {
    date: 'Sep 29, 2026 01:30 PM',
    actor: 'alex@acme.com',
    actorType: 'user',
    action: 'Deleted role',
    resource: 'Legacy Admin',
  },
  {
    date: 'Sep 29, 2026 10:00 AM',
    actor: 'Insights Advisor',
    actorType: 'agent',
    agentLabel: 'Insights Advisor',
    action: 'Scanned systems',
    resource: '47 hosts',
  },
];

const AuditLog: React.FunctionComponent = () => {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Audit Log</BreadcrumbItem>
        </Breadcrumb>
        <Title headingLevel="h1" style={{ marginTop: '16px' }}>Audit Log</Title>
        <Content>
          <p>Track actions performed by users and AI agents across your organization.</p>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <Table aria-label="Audit log table">
          <Thead>
            <Tr>
              <Th width={20}>Date</Th>
              <Th width={20}>Actor</Th>
              <Th width={25}>Action</Th>
              <Th width={35}>Resource</Th>
            </Tr>
          </Thead>
          <Tbody>
            {auditData.map((entry, idx) => (
              <Tr key={idx}>
                <Td dataLabel="Date">{entry.date}</Td>
                <Td dataLabel="Actor">
                  {entry.actorType === 'agent' ? (
                    <Label color="green" isCompact>{entry.agentLabel}</Label>
                  ) : (
                    entry.actor
                  )}
                </Td>
                <Td dataLabel="Action">{entry.action}</Td>
                <Td dataLabel="Resource">
                  {entry.resource}
                  {entry.resourceNote && (
                    <Label
                      color={entry.resourceNote === 'malformed' ? 'red' : entry.resourceNote === 'duplicate' ? 'orange' : 'grey'}
                      isCompact
                      style={{ marginLeft: '8px' }}
                    >
                      {entry.resourceNote}
                    </Label>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
};

export { AuditLog };

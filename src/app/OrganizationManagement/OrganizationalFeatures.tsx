import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Content,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  Icon,
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertVariant,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Switch,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import {
  UsersIcon,
  HandshakeIcon,
  KeyIcon,
  CogIcon,
  UserPlusIcon,
  LockIcon,
  AutomationIcon,
  OutlinedQuestionCircleIcon,
  AngleRightIcon,
} from '@patternfly/react-icons';

type FeatureCard = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  status: 'Available' | 'Locked';
  footnote?: string;
};

const features: FeatureCard[] = [
  {
    id: 'ai-features',
    title: 'AI Features',
    description: 'Allow AI-powered features across your organization — the policy gate, not access itself.',
    icon: <AutomationIcon />,
    iconColor: '#009596',
    status: 'Available',
  },
  {
    id: 'delegated-access',
    title: 'Delegated User Access Administration',
    description: 'Grant selected user groups the ability to manage users, roles, and groups.',
    icon: <UsersIcon />,
    iconColor: '#8481dd',
    status: 'Available',
  },
  {
    id: 'trusted-orgs',
    title: 'Trusted Organizations',
    description: 'Enable cross-org sharing and establish trusted connections with other Red Hat organizations.',
    icon: <HandshakeIcon />,
    iconColor: '#0066cc',
    status: 'Available',
  },
  {
    id: 'service-accounts',
    title: 'Service Accounts',
    description: 'Allow machine identities to authenticate to APIs and services for your organization.',
    icon: <CogIcon />,
    iconColor: '#3e8635',
    status: 'Available',
  },
  {
    id: 'idp-integration',
    title: 'Identity Provider Integration',
    description: 'Establish your corporate SSO as a valid identity provider — SAML 2.0 or OpenID Connect.',
    icon: <KeyIcon />,
    iconColor: '#ec7a08',
    status: 'Available',
  },
  {
    id: 'auto-registration',
    title: 'Auto-User Registration',
    description: 'Register new user accounts with your organization via a shared registration link.',
    icon: <UserPlusIcon />,
    iconColor: '#8481dd',
    status: 'Locked',
    footnote: 'Requires IdP',
  },
  {
    id: 'two-factor',
    title: 'Two-Factor Authentication',
    description: 'Require a password and a one-time code for every login.',
    icon: <LockIcon />,
    iconColor: '#0066cc',
    status: 'Available',
  },
];

type AiAgent = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

const initialAiAgents: AiAgent[] = [
  { id: 'rh-support', name: 'Red Hat Support', description: 'AI-powered support assistant for case management, knowledge base search, and guided resolution.', enabled: true },
  { id: 'ai1', name: 'Ask Red Hat', description: 'Find answers about Red Hat products, error messages, security vulnerabilities, general usage, and other content from product documentation and our knowledge base.', enabled: true },
  { id: 'ai2', name: 'Hybrid Cloud Console', description: 'Learn about the Hybrid Cloud Console and configure settings like your personal information, request access from your admin, show critical vulnerabilities, and more.', enabled: true },
  { id: 'ai3', name: 'RHEL Lightspeed', description: 'Get answers to RHEL-related questions, support with troubleshooting, help understanding log files, ask for recommendations, and more.', enabled: true },
  { id: 'insights-advisor', name: 'Insights Advisor', description: 'Proactive risk analysis and remediation recommendations for RHEL systems.', enabled: true },
  { id: 'ansible-ai', name: 'Ansible Lightspeed', description: 'AI-powered content creation for Ansible Playbooks and roles.', enabled: false },
  { id: 'openshift-ai', name: 'OpenShift AI Assistant', description: 'Contextual guidance for cluster operations, troubleshooting, and workload management.', enabled: false },
  { id: 'image-builder-ai', name: 'Image Builder AI', description: 'Intelligent recommendations for image composition and optimization.', enabled: true },
  { id: 'compliance-ai', name: 'Compliance AI', description: 'Automated compliance posture analysis and policy recommendations.', enabled: false },
];

const agentRbacAccess: Record<string, { role: string; access: string }[]> = {
  'rh-support': [
    { role: 'Support Admin', access: 'Full access to support case management, escalation, and knowledge base configuration' },
    { role: 'Support Viewer', access: 'Read-only access to support cases, case history, and communications' },
  ],
  ai1: [
    { role: 'Ask Red Hat Admin', access: 'Full access to product knowledge configuration and documentation indexing' },
    { role: 'Ask Red Hat User', access: 'Use AI-powered product Q&A, troubleshooting guidance, and documentation search' },
  ],
  ai2: [
    { role: 'Console AI Admin', access: 'Configure console navigation AI, access request workflows, and vulnerability insights' },
    { role: 'Console AI User', access: 'Use AI-assisted console navigation, personal settings, and task guidance' },
  ],
  ai3: [
    { role: 'RHEL Lightspeed Admin', access: 'Full access to RHEL Q&A configuration, log analysis settings, and recommendation policies' },
    { role: 'RHEL Lightspeed User', access: 'Use AI-powered RHEL troubleshooting, log analysis, and command examples' },
  ],
  'insights-advisor': [
    { role: 'Advisor Admin', access: 'Full access to recommendation rules, risk profiles, and remediation playbooks' },
    { role: 'Advisor Analyst', access: 'View and export risk assessments, system health reports, and trend data' },
    { role: 'Advisor Remediator', access: 'Execute remediation actions and manage remediation plans across RHEL systems' },
  ],
  'ansible-ai': [
    { role: 'Ansible AI Admin', access: 'Configure AI model preferences, training data sources, and content policies' },
    { role: 'Ansible AI User', access: 'Generate Playbooks, roles, and task suggestions using AI-powered content creation' },
  ],
  'openshift-ai': [
    { role: 'OpenShift AI Admin', access: 'Full access to cluster AI configuration, model deployments, and resource quotas' },
    { role: 'OpenShift AI Operator', access: 'Manage AI-assisted troubleshooting workflows and workload optimization settings' },
    { role: 'OpenShift AI Viewer', access: 'Read-only access to cluster health insights and AI-generated recommendations' },
  ],
  'image-builder-ai': [
    { role: 'Image Builder AI Admin', access: 'Configure AI composition rules, base image policies, and optimization profiles' },
    { role: 'Image Builder AI User', access: 'Use AI recommendations for image composition, package selection, and optimization' },
  ],
  'compliance-ai': [
    { role: 'Compliance AI Admin', access: 'Full access to compliance policy definitions, AI rule sets, and audit configurations' },
    { role: 'Compliance AI Analyst', access: 'View compliance posture reports, policy violations, and AI-generated remediation steps' },
    { role: 'Compliance AI Auditor', access: 'Read-only access to compliance audit trails and historical posture data' },
  ],
};

const agentCapabilities: Record<string, { title: string; description: string }[]> = {
  'rh-support': [
    { title: 'Read support cases', description: 'View and search existing support cases, case history, and associated communications.' },
    { title: 'Write support tickets', description: 'Create new support tickets and update existing cases with comments and attachments.' },
    { title: 'Escalate support tickets', description: 'Raise the priority or severity of support tickets and request expedited resolution.' },
  ],
  ai1: [
    { title: 'Product knowledge', description: 'Answer questions about Red Hat products, error messages, security vulnerabilities, and general usage.' },
    { title: 'Documentation search', description: 'Surface relevant Red Hat documentation, knowledge base articles, and solution guides.' },
    { title: 'Troubleshooting guidance', description: 'Guide users through diagnostic steps to identify and resolve common issues.' },
    { title: 'Best practices', description: 'Provide recommended configurations and security practices for Red Hat environments.' },
    { title: 'Command examples', description: 'Provide the correct syntax and usage for various Linux and Red Hat commands.' },
  ],
  ai2: [
    { title: 'Console navigation', description: 'Help users find and navigate features within the Hybrid Cloud Console.' },
    { title: 'Personal settings', description: 'Assist with configuring personal information, notifications, and preferences.' },
    { title: 'Access requests', description: 'Guide users through requesting access from their organization administrator.' },
    { title: 'Vulnerability insights', description: 'Surface critical vulnerabilities and security advisories relevant to your environment.' },
    { title: 'Task guidance', description: 'Provide step-by-step guidance for common console tasks and workflows.' },
  ],
  ai3: [
    { title: 'RHEL Q&A', description: 'Answer RHEL-related questions about configuration, administration, and troubleshooting.' },
    { title: 'Troubleshooting support', description: 'Help diagnose and resolve issues with RHEL systems and services.' },
    { title: 'Log analysis', description: 'Help understand log files and identify patterns indicating issues.' },
    { title: 'Recommendations', description: 'Provide recommendations for system optimization and best practices.' },
    { title: 'Command examples', description: 'Provide correct syntax and usage for RHEL-specific commands.' },
  ],
  'insights-advisor': [
    { title: 'Providing detailed information', description: 'Explaining concepts, commands, and procedures related to RHEL and general Linux system administration.' },
    { title: 'Troubleshooting guidance', description: 'Offering steps and resources to help you diagnose and resolve issues.' },
    { title: 'Finding relevant documentation', description: 'Using the Red Hat customer portal to search for official documentation, knowledge base articles, CVEs, and errata.' },
    { title: 'Explaining best practices', description: 'Guiding you on recommended configurations and security practices for RHEL environments.' },
    { title: 'Offering command examples', description: 'Providing the correct syntax and usage for various Linux commands.' },
  ],
  'ansible-ai': [
    { title: 'Playbook generation', description: 'Automatically generate Ansible Playbooks from natural language descriptions of desired automation tasks.' },
    { title: 'Role scaffolding', description: 'Create well-structured Ansible roles with recommended directory layouts and default variables.' },
    { title: 'Task suggestions', description: 'Suggest task sequences and modules based on the automation goal and target infrastructure.' },
    { title: 'Syntax validation', description: 'Validate YAML syntax and Ansible-specific constructs in real time during content creation.' },
  ],
  'openshift-ai': [
    { title: 'Cluster diagnostics', description: 'Analyze cluster health metrics and identify potential issues with nodes, pods, and network connectivity.' },
    { title: 'Workload optimization', description: 'Recommend resource limits, requests, and scaling policies based on observed workload patterns.' },
    { title: 'Upgrade planning', description: 'Provide pre-upgrade checks and migration guidance for OpenShift version upgrades.' },
    { title: 'Security posture review', description: 'Identify misconfigurations, exposed services, and non-compliant security contexts in cluster workloads.' },
  ],
  'image-builder-ai': [
    { title: 'Composition recommendations', description: 'Suggest optimal package sets and configurations based on the target deployment environment.' },
    { title: 'Image optimization', description: 'Identify unnecessary packages and recommend image slimming strategies to reduce footprint.' },
    { title: 'Compliance alignment', description: 'Ensure built images align with organizational security baselines and hardening standards.' },
  ],
  'compliance-ai': [
    { title: 'Policy analysis', description: 'Evaluate system configurations against compliance frameworks such as CIS, DISA STIG, and PCI-DSS.' },
    { title: 'Remediation suggestions', description: 'Generate actionable remediation steps for policy violations with estimated impact assessments.' },
    { title: 'Posture trending', description: 'Track compliance posture over time and highlight regression patterns across managed systems.' },
    { title: 'Audit reporting', description: 'Produce audit-ready compliance reports with evidence mapping and control coverage summaries.' },
  ],
};

type ToastAlert = {
  key: number;
  variant: AlertVariant;
  title: string;
  description?: React.ReactNode;
};

const OrganizationalFeatures: React.FunctionComponent = () => {
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
  const [aiAgents, setAiAgents] = React.useState<AiAgent[]>(initialAiAgents);
  const [savedAgents, setSavedAgents] = React.useState<AiAgent[]>(initialAiAgents);
  const [alerts, setAlerts] = React.useState<ToastAlert[]>([]);
  const [expandedAgents, setExpandedAgents] = React.useState<Set<string>>(new Set());
  const alertIdRef = React.useRef(0);

  const defaultOffCapabilities: Record<string, string[]> = {
    ai1: ['Command examples'],
    ai2: ['Vulnerability insights', 'Task guidance'],
    ai3: ['Log analysis', 'Command examples'],
    'insights-advisor': ['Offering command examples', 'Finding relevant documentation'],
    'ansible-ai': ['Syntax validation', 'Role scaffolding'],
    'openshift-ai': ['Upgrade planning', 'Security posture review'],
    'image-builder-ai': ['Compliance alignment'],
    'compliance-ai': ['Posture trending', 'Audit reporting'],
  };

  const buildInitialCapabilityState = (): Record<string, Record<string, boolean>> => {
    const state: Record<string, Record<string, boolean>> = {};
    for (const [agentId, caps] of Object.entries(agentCapabilities)) {
      state[agentId] = {};
      const offSet = new Set(defaultOffCapabilities[agentId] || []);
      caps.forEach((cap) => {
        state[agentId][cap.title] = !offSet.has(cap.title);
      });
    }
    return state;
  };

  const [capabilityToggles, setCapabilityToggles] = React.useState<Record<string, Record<string, boolean>>>(buildInitialCapabilityState);
  const [savedCapabilityToggles, setSavedCapabilityToggles] = React.useState<Record<string, Record<string, boolean>>>(buildInitialCapabilityState);

  const addAlert = (variant: AlertVariant, title: string, description?: React.ReactNode) => {
    const key = alertIdRef.current++;
    setAlerts((prev) => [...prev, { key, variant, title, description }]);
    setTimeout(() => removeAlert(key), 8000);
  };

  const removeAlert = (key: number) => {
    setAlerts((prev) => prev.filter((a) => a.key !== key));
  };

  const onToggleAgent = (agentId: string) => {
    setAiAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, enabled: !agent.enabled } : agent
      )
    );
  };

  const onToggleCapability = (agentId: string, capTitle: string) => {
    setCapabilityToggles((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        [capTitle]: !prev[agentId]?.[capTitle],
      },
    }));
  };

  const onOpenModal = () => {
    setSavedAgents(aiAgents);
    setSavedCapabilityToggles(JSON.parse(JSON.stringify(capabilityToggles)));
    setIsAiModalOpen(true);
  };

  const onSave = () => {
    const capChanged = JSON.stringify(capabilityToggles) !== JSON.stringify(savedCapabilityToggles);
    const agentChanged = aiAgents.some((a, i) => a.enabled !== savedAgents[i].enabled);

    if (!capChanged && !agentChanged) {
      setIsAiModalOpen(false);
      return;
    }

    const changedAgentNames: string[] = [];
    for (const [agentId, caps] of Object.entries(capabilityToggles)) {
      const saved = savedCapabilityToggles[agentId] || {};
      const current = caps || {};
      if (JSON.stringify(current) !== JSON.stringify(saved)) {
        const agent = aiAgents.find(a => a.id === agentId);
        if (agent) changedAgentNames.push(agent.name);
      }
    }

    addAlert(
      AlertVariant.success,
      'AI feature settings updated successfully',
      <>Capabilities for {changedAgentNames.join(', ')} has updated successfully. This affects all users in your organization.</>
    );

    setSavedAgents(aiAgents);
    setSavedCapabilityToggles(JSON.parse(JSON.stringify(capabilityToggles)));
    setIsAiModalOpen(false);
  };

  const onCancel = () => {
    setAiAgents(savedAgents);
    setCapabilityToggles(JSON.parse(JSON.stringify(savedCapabilityToggles)));
    setIsAiModalOpen(false);
  };

  return (
    <>
      <AlertGroup isToast isLiveRegion>
        {alerts.map((alert) => (
          <Alert
            key={alert.key}
            variant={alert.variant}
            title={alert.title}
            actionClose={<AlertActionCloseButton onClose={() => removeAlert(alert.key)} />}
          >
            {alert.description}
          </Alert>
        ))}
      </AlertGroup>

      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Organization Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Organizational Features</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Organizational Features</Title>
        <Content>
          <p style={{ margin: 0, color: '#6a6e73' }}>
            Manage and configure features available across your organization.
          </p>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Gallery hasGutter minWidths={{ default: '280px' }} maxWidths={{ default: '1fr' }}>
          {features.map((feature) => (
            <GalleryItem key={feature.id}>
              <Card aria-label={feature.title} style={{ height: '100%' }}>
                <CardHeader>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }} style={{ width: '100%' }}>
                    <FlexItem>
                      <Icon size="xl">
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            backgroundColor: `${feature.iconColor}1a`,
                            color: feature.iconColor,
                          }}
                        >
                          {feature.icon}
                        </span>
                      </Icon>
                    </FlexItem>
                    <FlexItem>
                      {feature.status === 'Available' ? (
                        <Label color="green" isCompact>
                          ● Available
                        </Label>
                      ) : (
                        <Label color="grey" isCompact>
                          ● Locked
                        </Label>
                      )}
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 8 }}>
                    {feature.title}{' '}
                    <Tooltip content={feature.description}>
                      <OutlinedQuestionCircleIcon style={{ color: '#6a6e73', fontSize: '0.85em', cursor: 'pointer' }} />
                    </Tooltip>
                  </Title>
                  <Content>
                    <p style={{ margin: 0, color: '#6a6e73', fontSize: '0.875rem' }}>
                      {feature.description}
                    </p>
                  </Content>
                </CardBody>
                <CardFooter>
                  {feature.footnote && (
                    <div style={{ marginBottom: 12 }}>
                      <Label variant="outline" color="grey" isCompact icon={<KeyIcon />}>
                        {feature.footnote}
                      </Label>
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    onClick={feature.id === 'ai-features' ? onOpenModal : undefined}
                  >
                    {feature.id === 'ai-features' ? 'Manage' : 'Enable'}
                  </Button>
                </CardFooter>
              </Card>
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>

      <Modal
        isOpen={isAiModalOpen}
        onClose={onCancel}
        aria-label="AI Features configuration"
        variant="medium"
      >
        <ModalHeader
          title="AI Features"
          description="Enable or disable individual AI agents across your organization. Changes apply to all users."
        />
        <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 0 16px',
            }}
          >
            <Title headingLevel="h4" size="md">All</Title>
            <Switch
              id="ai-agent-toggle-all"
              aria-label="Toggle all AI agents"
              isChecked={aiAgents.every(a => a.enabled)}
              onChange={() => {
                const allOn = aiAgents.every(a => a.enabled);
                setAiAgents(prev => prev.map(a => ({ ...a, enabled: !allOn })));
              }}
            />
          </div>
          {aiAgents.map((agent, idx) => {
            const isExpanded = expandedAgents.has(agent.id);
            return (
            <div
              key={agent.id}
              style={{
                padding: '12px 0',
                borderBottom: idx < aiAgents.length - 1 ? '1px solid var(--pf-v6-global--BorderColor--100, #d2d2d2)' : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
                  <Button
                    variant="plain"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    onClick={() => {
                      setExpandedAgents(prev => {
                        const next = new Set(prev);
                        if (next.has(agent.id)) {
                          next.delete(agent.id);
                        } else {
                          next.add(agent.id);
                        }
                        return next;
                      });
                    }}
                    style={{ padding: '2px', marginTop: '2px' }}
                  >
                    <span style={{ display: 'inline-flex', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      <AngleRightIcon />
                    </span>
                  </Button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Title headingLevel="h4" size="md">{agent.name}</Title>
                      {(() => {
                        const caps = agentCapabilities[agent.id] || [];
                        const total = caps.length;
                        if (total === 0) return null;
                        const enabledCount = caps.filter(cap => capabilityToggles[agent.id]?.[cap.title] ?? true).length;
                        return (
                          <span style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                            ({enabledCount}/{total})
                          </span>
                        );
                      })()}
                    </div>
                    <Content>
                      <p style={{ margin: '4px 0 0', color: '#6a6e73', fontSize: '0.875rem' }}>
                        {agent.description}
                      </p>
                    </Content>
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div style={{ padding: '8px 0 4px 30px' }}>
                  {(agentCapabilities[agent.id] || []).map((cap, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        padding: '6px 0',
                        borderBottom: i < (agentCapabilities[agent.id] || []).length - 1 ? '1px solid var(--pf-v6-global--BorderColor--100, #d2d2d2)' : 'none',
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: 12 }}>
                        <span style={{ fontSize: '0.875rem' }}>{cap.title}</span>
                        <p style={{ margin: '2px 0 0', color: '#6a6e73', fontSize: '0.85rem' }}>
                          {cap.description}
                        </p>
                      </div>
                      <Switch
                        id={`cap-${agent.id}-${i}`}
                        aria-label={`Toggle ${cap.title}`}
                        isChecked={capabilityToggles[agent.id]?.[cap.title] ?? true}
                        onChange={() => onToggleCapability(agent.id, cap.title)}
                        isDisabled={!agent.enabled}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={onSave} isDisabled={
            aiAgents.every((a, i) => a.enabled === savedAgents[i].enabled) &&
            JSON.stringify(capabilityToggles) === JSON.stringify(savedCapabilityToggles)
          }>Save</Button>
          <Button variant="link" onClick={onCancel}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { OrganizationalFeatures };

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
} from '@patternfly/react-icons';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';

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
  { id: 'lightspeed', name: 'Red Hat Lightspeed', description: 'AI assistant for troubleshooting, configuration, and product guidance across the Hybrid Cloud Console.', enabled: true },
  { id: 'insights-advisor', name: 'Insights Advisor', description: 'Proactive risk analysis and remediation recommendations for RHEL systems.', enabled: true },
  { id: 'ansible-ai', name: 'Ansible Lightspeed', description: 'AI-powered content creation for Ansible Playbooks and roles.', enabled: false },
  { id: 'openshift-ai', name: 'OpenShift AI Assistant', description: 'Contextual guidance for cluster operations, troubleshooting, and workload management.', enabled: false },
  { id: 'image-builder-ai', name: 'Image Builder AI', description: 'Intelligent recommendations for image composition and optimization.', enabled: true },
  { id: 'compliance-ai', name: 'Compliance AI', description: 'Automated compliance posture analysis and policy recommendations.', enabled: false },
];

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
  const alertIdRef = React.useRef(0);

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

  const onOpenModal = () => {
    setSavedAgents(aiAgents);
    setIsAiModalOpen(true);
  };

  const onSave = () => {
    const enabled: string[] = [];
    const disabled: string[] = [];

    aiAgents.forEach((agent) => {
      const prev = savedAgents.find((a) => a.id === agent.id);
      if (prev && prev.enabled !== agent.enabled) {
        if (agent.enabled) {
          enabled.push(agent.name);
        } else {
          disabled.push(agent.name);
        }
      }
    });

    if (enabled.length === 0 && disabled.length === 0) {
      setIsAiModalOpen(false);
      return;
    }

    const parts: string[] = [];
    if (enabled.length > 0) {
      parts.push(`Enabled: ${enabled.join(', ')}`);
    }
    if (disabled.length > 0) {
      parts.push(`Disabled: ${disabled.join(', ')}`);
    }

    addAlert(
      AlertVariant.success,
      'AI agent settings updated across all organization',
      <>{parts.join('. ')}. This change affects all users in your organization.</>
    );

    setSavedAgents(aiAgents);
    setIsAiModalOpen(false);
  };

  const onCancel = () => {
    setAiAgents(savedAgents);
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
        <ModalBody>
          {aiAgents.map((agent, idx) => (
            <div
              key={agent.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '16px 0',
                borderBottom: idx < aiAgents.length - 1 ? '1px solid var(--pf-v6-global--BorderColor--100, #d2d2d2)' : 'none',
              }}
            >
              <div style={{ paddingRight: 24 }}>
                <Title headingLevel="h4" size="md">{agent.name}</Title>
                <Content>
                  <p style={{ margin: '4px 0 0', color: '#6a6e73', fontSize: '0.875rem' }}>
                    {agent.description}
                  </p>
                </Content>
              </div>
              <Switch
                id={`ai-agent-${agent.id}`}
                aria-label={`Toggle ${agent.name}`}
                isChecked={agent.enabled}
                onChange={() => onToggleAgent(agent.id)}
              />
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={onSave}>Save</Button>
          <Button variant="link" onClick={onCancel}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { OrganizationalFeatures };

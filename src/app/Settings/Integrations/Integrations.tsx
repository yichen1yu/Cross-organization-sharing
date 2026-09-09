import * as React from 'react';
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  Flex,
  FlexItem,
  Icon,
  PageSection,
  Split,
  SplitItem,
  Tab,
  TabTitleText,
  Tabs,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const IntegrationsIcon: React.FunctionComponent = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#F4E7E7" />
    <path d="M20 12L28 16V24L20 28L12 24V16L20 12Z" stroke="#A30000" strokeWidth="2" fill="none" />
    <circle cx="20" cy="20" r="4" fill="#A30000" />
  </svg>
);

const Integrations: React.FunctionComponent = () => {
  useDocumentTitle('Integrations | Settings');
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/">Red Hat Hybrid Cloud Console</BreadcrumbItem>
          <BreadcrumbItem component={Link} to="/settings/integrations">Settings</BreadcrumbItem>
          <BreadcrumbItem isActive>Integrations</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Split hasGutter>
          <SplitItem>
            <IntegrationsIcon />
          </SplitItem>
          <SplitItem isFilled>
            <Title headingLevel="h1" size="2xl">Integrations</Title>
            <Content component="p" style={{ marginTop: '8px' }}>
              Integrating third-party applications expands the scope of notifications beyond emails and messages, so that you can view and manage Hybrid Cloud Console events from your preferred platform dashboard. Cloud Integrations connect your cloud provider accounts with the Hybrid Cloud Console to collect data, so you can use console services with your cloud providers.
            </Content>
            <Content component="p" style={{ marginTop: '8px' }}>
              <a href="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console" target="_blank" rel="noopener noreferrer">
                Learn more <ExternalLinkAltIcon />
              </a>
            </Content>
          </SplitItem>
          <SplitItem>
            <Button variant="primary">Create Integration</Button>
          </SplitItem>
        </Split>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Tabs activeKey={activeTabKey} onSelect={(_e, tabIndex) => setActiveTabKey(tabIndex)}>
          <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>Cloud</TabTitleText>} />
          <Tab eventKey={2} title={<TabTitleText>Red Hat</TabTitleText>} />
          <Tab eventKey={3} title={<TabTitleText>Communications</TabTitleText>} />
          <Tab eventKey={4} title={<TabTitleText>Reporting &amp; automation</TabTitleText>} />
          <Tab eventKey={5} title={<TabTitleText>Webhooks</TabTitleText>} />
        </Tabs>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <Title headingLevel="h2" size="lg">Get started with Integrations</Title>
            <Content component="p" style={{ marginTop: '8px' }}>
              Notifications and integrations services work together to transmit messages to third-party application endpoints, such as instant messaging platforms and external ticketing systems, when triggering events occur.
            </Content>
            <Title headingLevel="h3" size="md" style={{ marginTop: '16px' }}>Key features</Title>
            <Content component="ul">
              <Content component="li">Create integrations and configure notifications to integrate with third-party applications</Content>
              <Content component="li">Manage your integrations and troubleshoot broken connections</Content>
            </Content>
            <div style={{ marginTop: '16px' }}>
              <Button variant="primary" icon={<span style={{ marginRight: '4px' }}>⊕</span>}>Create integration</Button>
            </div>
          </CardBody>
        </Card>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Alert variant="info" isInline title="Already set up your integrations? As a next step, you can enable the notifications of your choice to alert you via Integrations." />
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h2" size="lg">Integration types</Title>
      </PageSection>
    </>
  );
};

export { Integrations };

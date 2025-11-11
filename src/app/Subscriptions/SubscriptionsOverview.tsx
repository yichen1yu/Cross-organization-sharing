import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  Divider,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  Label,
  LabelGroup,
  PageSection,
  Title
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

const SubscriptionsOverview: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState<string | number>('q1');

  const onToggle = (id: string | number, isExpanded: boolean) => {
    setExpanded(isExpanded ? id : '');
  };

  return (
    <>
      {/* Hero */}
      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Title headingLevel="h1" size="2xl">Welcome to Subscription Services</Title>
                <Content>
                  <p style={{ marginTop: 8, color: '#6a6e73', maxWidth: 920 }}>
                    Empower your buying decisions with data. Subscription Services provide reporting that is designed to
                    make your subscription choices data‑driven.
                  </p>
                </Content>
              </FlexItem>
              {/* Right graphic intentionally omitted per request */}
            </Flex>
          </CardBody>
        </Card>
      </PageSection>

      {/* See all your subscriptions */}
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Card>
          <CardHeader>
            <Title headingLevel="h2" size="lg">See all your subscriptions</Title>
          </CardHeader>
          <Divider />
          <CardBody>
            <Content>
              <Title headingLevel="h3" size="md" style={{ marginTop: 0 }}>Register your RHEL systems</Title>
              <p style={{ marginBottom: 6 }}>
                Get the full value of your RHEL subscriptions, including updates and security patches, through registration.
              </p>
              <ul>
                <li>
                  For a guided registration experience, try the{' '}
                  <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end" component="a" href="#">
                    Registration Assistant
                  </Button>
                </li>
                <li>
                  Review registration alternatives and select the best option for your workflow.{' '}
                  <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end" component="a" href="#">
                    Learn more
                  </Button>
                </li>
              </ul>

              <Title headingLevel="h3" size="md" style={{ marginTop: 16 }}>Activate Subscriptions Usage</Title>
              <p>
                Gain visibility into the usage of your subscriptions against your total capacity over time. Opt in to Subscriptions Usage today!{' '}
                <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end" component="a" href="#">
                  Learn more
                </Button>
              </p>

              <Title headingLevel="h3" size="md">Get the right usage data</Title>
              <p>
                Account‑wide usage reporting relies on multiple data streams to power Subscriptions Usage. Make sure that the right data is
                flowing for accurate reporting.{' '}
                <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end" component="a" href="#">
                  Learn more
                </Button>
              </p>
            </Content>
          </CardBody>
        </Card>
      </PageSection>

      {/* Build your subscription portfolio */}
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Title headingLevel="h2" size="lg" style={{ marginBottom: 12 }}>Build your subscription portfolio</Title>
        <Content>
          <p style={{ marginTop: 0, color: '#6a6e73' }}>Buy subscriptions for your workloads. We give you data that drives your decisions.</p>
        </Content>
        <Gallery hasGutter minWidths={{ default: '320px' }}>
          <GalleryItem>
            <Card onClick={() => navigate('/subscriptions/insights')} style={{ cursor: 'pointer' }}>
              <CardBody>
                <Title headingLevel="h3" size="md">Red Hat Enterprise Linux</Title>
                <LabelGroup style={{ marginTop: 8 }}>
                  <Label color="blue">RHEL</Label>
                </LabelGroup>
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card onClick={() => navigate('/subscriptions/openshift-clusters')} style={{ cursor: 'pointer' }}>
              <CardBody>
                <Title headingLevel="h3" size="md">Red Hat OpenShift</Title>
                <LabelGroup style={{ marginTop: 8 }}>
                  <Label color="blue">OpenShift</Label>
                </LabelGroup>
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card onClick={() => navigate('/subscriptions/automation-hub')} style={{ cursor: 'pointer' }}>
              <CardBody>
                <Title headingLevel="h3" size="md">Red Hat Ansible Automation Platform</Title>
                <LabelGroup style={{ marginTop: 8 }}>
                  <Label color="blue">Ansible</Label>
                </LabelGroup>
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card onClick={() => navigate('/subscriptions')} style={{ cursor: 'pointer' }}>
              <CardBody>
                <Title headingLevel="h3" size="md">View all Red Hat Products</Title>
              </CardBody>
            </Card>
          </GalleryItem>
        </Gallery>
      </PageSection>

      {/* FAQ */}
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Title headingLevel="h2" size="lg" style={{ marginBottom: 12 }}>Have more questions?</Title>
        <Accordion>
          <AccordionItem isExpanded={expanded === 'q1'}>
            <AccordionToggle id="q1-toggle" onClick={() => onToggle('q1', expanded !== 'q1')}>
              How can I see all my subscriptions?
            </AccordionToggle>
            <AccordionContent>
              <div style={{ padding: '12px 16px' }}>
                View details and status information for each of your subscriptions with{' '}
                <Button variant="link" isInline onClick={() => navigate('/subscription-inventory')}>
                  Subscriptions Inventory
                </Button>
                .
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem isExpanded={expanded === 'q2'}>
            <AccordionToggle id="q2-toggle" onClick={() => onToggle('q2', expanded !== 'q2')}>
              What is a manifest?
            </AccordionToggle>
            <AccordionContent>
              <div style={{ padding: '12px 16px' }}>
                A subscription manifest is a file you export from your account to register systems with Red Hat Satellite.
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem isExpanded={expanded === 'q3'}>
            <AccordionToggle id="q3-toggle" onClick={() => onToggle('q3', expanded !== 'q3')}>
              How is Subscriptions Usage counting the usage of my subscriptions?
            </AccordionToggle>
            <AccordionContent>
              <div style={{ padding: '12px 16px' }}>
                Subscriptions Usage aggregates entitlement and reporting data to present usage against capacity over time.
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem isExpanded={expanded === 'q4'}>
            <AccordionToggle id="q4-toggle" onClick={() => onToggle('q4', expanded !== 'q4')}>
              How do I prepare to manage my RHEL subscriptions?
            </AccordionToggle>
            <AccordionContent>
              <div style={{ padding: '12px 16px' }}>
                Register your systems, enable Subscriptions Usage, and ensure required data sources are configured.
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </PageSection>
    </>
  );
};

export { SubscriptionsOverview };



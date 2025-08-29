import * as React from 'react';
import {
  PageSection,
  Title,
  Content,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Button,
  Gallery
} from '@patternfly/react-core';
import { ServiceCard } from '@patternfly/react-component-groups';
import { 
  CogIcon, 
  ServerIcon, 
  LayerGroupIcon, 
  ShieldAltIcon, 
  ChartLineIcon, 
  QuestionCircleIcon 
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageSection>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
          <FlexItem>
            <Content>
              <Title headingLevel="h1" size="2xl">
                Red Hat Hybrid Cloud Console
              </Title>
              <p>
                Welcome to your unified cloud management experience. Access all your cloud services, 
                monitor your infrastructure, and manage your hybrid cloud environment from one central location.
              </p>
              <div style={{ marginTop: '16px' }}>
                <Button variant="link" onClick={() => navigate('/all-services')} style={{ padding: 0 }}>
                  View all services →
                </Button>
              </div>
            </Content>
          </FlexItem>
          
          <FlexItem>
            <Gallery hasGutter minWidths={{
              default: '360px'
            }}>
              <ServiceCard
                icon={<CogIcon style={{ fontSize: '32px', color: 'var(--pf-v6-global--primary-color--100)' }} />}
                title="Settings"
                description="Configure and manage all settings related to eventing, alerting, and data sourcing."
                helperText="Access comprehensive configuration options"
                isFullHeight
                isClickable
                onClick={() => navigate('/overview')}
                footer={
                  <Button variant="primary" onClick={() => navigate('/overview')}>
                    Configure
                  </Button>
                }
              />
              
              <ServiceCard
                icon={<ServerIcon style={{ fontSize: '32px', color: 'var(--pf-v6-global--success-color--100)' }} />}
                title="Infrastructure"
                description="Monitor and manage your cloud infrastructure, resources, and deployments."
                helperText="Coming soon"
                isFullHeight
                footer={
                  <Button variant="secondary" isDisabled>
                    Launch
                  </Button>
                }
              />
              
              <ServiceCard
                icon={<LayerGroupIcon style={{ fontSize: '32px', color: 'var(--pf-v6-global--info-color--100)' }} />}
                title="Applications"
                description="Deploy, manage, and monitor your applications across hybrid cloud environments."
                helperText="Coming soon"
                isFullHeight
                footer={
                  <Button variant="secondary" isDisabled>
                    Launch
                  </Button>
                }
              />
              
              <ServiceCard
                icon={<ShieldAltIcon style={{ fontSize: '32px', color: 'var(--pf-v6-global--warning-color--100)' }} />}
                title="Security"
                description="Manage security policies, compliance, and access controls across your environment."
                helperText="Coming soon"
                isFullHeight
                footer={
                  <Button variant="secondary" isDisabled>
                    Launch
                  </Button>
                }
              />
              
              <ServiceCard
                icon={<ChartLineIcon style={{ fontSize: '32px', color: 'var(--pf-v6-global--palette--purple-400)' }} />}
                title="Analytics"
                description="Gain insights into your cloud usage, performance metrics, and operational data."
                helperText="Coming soon"
                isFullHeight
                footer={
                  <Button variant="secondary" isDisabled>
                    Launch
                  </Button>
                }
              />
              
              <ServiceCard
                icon={<QuestionCircleIcon style={{ fontSize: '32px', color: 'var(--pf-v6-global--Color--200)' }} />}
                title="Support"
                description="Access documentation, support resources, and get help with your cloud journey."
                helperText="Coming soon"
                isFullHeight
                footer={
                  <Button variant="secondary" isDisabled>
                    Launch
                  </Button>
                }
              />
            </Gallery>
          </FlexItem>
          
          <FlexItem>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Button variant="secondary" onClick={() => navigate('/all-services')} size="lg">
                Explore All Services
              </Button>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export { Homepage };

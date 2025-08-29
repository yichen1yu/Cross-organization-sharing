import * as React from 'react';
import { 
  PageSection, 
  Title, 
  Content,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabTitleText
} from '@patternfly/react-core';
import { CogIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

const Dashboard: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Settings</BreadcrumbItem>
          <BreadcrumbItem isActive>Overview</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      
      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div className="pf-m-align-self-center" style={{ minWidth: '40px' }}>
              <CogIcon style={{ fontSize: '32px', color: '#0066cc' }} aria-label="page-header-icon" />
            </div>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
            <div style={{ borderLeft: '1px solid #d2d2d2', height: '100%', marginRight: '16px' }}></div>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Settings overview</Title>
              <Content>
                <p style={{ margin: 0, color: '#6a6e73' }}>Manage all things related to eventing, alerting, and data sourcing.</p>
                <div style={{ marginTop: '12px' }}>
                  <Button
                    variant="link"
                    isInline
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="end"
                    component="a"
                    href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </Button>
                </div>
              </Content>
            </div>
          </FlexItem>

        </Flex>
      </PageSection>
      
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title={<TabTitleText>Dashboard</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Settings Dashboard</Title>
                    <p>
                      Manage all settings related to eventing, alerting, and data sourcing from this central location.
                    </p>
                    
                    <h3>What You Can Configure:</h3>
                    <ul>
                      <li><strong>Events:</strong> Configure event processing and handling preferences</li>
                      <li><strong>Alerts:</strong> Set up alerting rules and notification thresholds</li>
                      <li><strong>Data Sources:</strong> Connect and manage external data integrations</li>
                      <li><strong>Monitoring:</strong> Track system performance and health metrics</li>
                    </ul>
                    
                    <h3>Getting Started:</h3>
                    <p>
                      Use this dashboard to monitor and configure your system settings. Each section provides 
                      detailed options for managing your environment and preferences.
                    </p>
                  </Content>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>About</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">About Settings</Title>
                    <p>Learn more about the settings management system and available features.</p>
                    
                    <h3>System Information:</h3>
                    <ul>
                      <li><strong>Version:</strong> 1.0.0</li>
                      <li><strong>Environment:</strong> Production</li>
                      <li><strong>Last Updated:</strong> January 2024</li>
                    </ul>
                    
                    <h3>Documentation:</h3>
                    <p>
                      For detailed information about configuring and using the settings system, 
                      please refer to the official documentation or contact support.
                    </p>
                  </Content>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { Dashboard };

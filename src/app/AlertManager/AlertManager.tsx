import * as React from 'react';
import {
  PageSection,
  Title,
  Content,
  Card,
  CardBody,
  Badge,
  Grid,
  GridItem,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  Button,
  Tabs,
  Tab,
  TabTitleText
} from '@patternfly/react-core';
import { BellIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

const AlertManager: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem to="/overview">Settings</BreadcrumbItem>
          <BreadcrumbItem isActive>Alert Manager</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      
      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div className="pf-m-align-self-center" style={{ minWidth: '40px' }}>
              <BellIcon style={{ fontSize: '32px', color: '#0066cc' }} aria-label="page-header-icon" />
            </div>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
            <div style={{ borderLeft: '1px solid #d2d2d2', height: '100%', marginRight: '16px' }}></div>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Alert Manager</Title>
              <Content>
                <p style={{ margin: 0, color: '#6a6e73' }}>Monitor and manage alerts across your hybrid cloud infrastructure and configure response workflows.</p>
                <div style={{ marginTop: '12px' }}>
                  <Button
                    variant="link"
                    isInline
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="end"
                    component="a"
                    href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/"
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
                    <Title headingLevel="h2" size="xl">Alert Management Dashboard</Title>
                    <p>
                      Monitor and manage alerts across your hybrid cloud infrastructure. 
                      Configure alert rules, notifications, and response workflows.
                    </p>
                    
                    <Grid hasGutter style={{ marginTop: '24px' }}>
                      <GridItem span={4}>
                        <Card>
                          <CardBody>
                            <Title headingLevel="h3" size="lg">
                              Active Alerts <Badge isRead>3</Badge>
                            </Title>
                            <p>Currently firing alerts requiring attention</p>
                          </CardBody>
                        </Card>
                      </GridItem>
                      <GridItem span={4}>
                        <Card>
                          <CardBody>
                            <Title headingLevel="h3" size="lg">
                              Alert Rules <Badge isRead>12</Badge>
                            </Title>
                            <p>Configured monitoring and alerting rules</p>
                          </CardBody>
                        </Card>
                      </GridItem>
                      <GridItem span={4}>
                        <Card>
                          <CardBody>
                            <Title headingLevel="h3" size="lg">
                              Notification Channels <Badge isRead>5</Badge>
                            </Title>
                            <p>Active notification delivery methods</p>
                          </CardBody>
                        </Card>
                      </GridItem>
                    </Grid>
                  </Content>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Configuration</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Alert Configuration</Title>
                    <p>Configure alert rules, thresholds, and notification settings.</p>
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

export { AlertManager };

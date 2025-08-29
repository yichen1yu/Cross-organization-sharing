import * as React from 'react';
import {
  PageSection,
  Title,
  Content,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  Button,
  Tabs,
  Tab,
  TabTitleText
} from '@patternfly/react-core';
import { BookOpenIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

const LearningResources: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem to="/overview">Settings</BreadcrumbItem>
          <BreadcrumbItem isActive>Learning Resources</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      
      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div className="pf-m-align-self-center" style={{ minWidth: '40px' }}>
              <BookOpenIcon style={{ fontSize: '32px', color: '#0066cc' }} aria-label="page-header-icon" />
            </div>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
            <div style={{ borderLeft: '1px solid #d2d2d2', height: '100%', marginRight: '16px' }}></div>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Learning Resources</Title>
              <Content>
                <p style={{ margin: 0, color: '#6a6e73' }}>Access comprehensive learning materials, tutorials, and training resources to enhance your skills.</p>
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
          <Tab eventKey={0} title={<TabTitleText>Tutorials</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Interactive Tutorials</Title>
                    <p>
                      Step-by-step interactive tutorials covering console features, 
                      cloud services, and best practices for hybrid cloud management.
                    </p>
                    
                    <h3>Available Tutorials:</h3>
                    <ul>
                      <li><strong>Getting Started:</strong> Introduction to the Red Hat Hybrid Cloud Console</li>
                      <li><strong>Service Management:</strong> How to deploy and manage services</li>
                      <li><strong>Monitoring & Alerts:</strong> Setting up monitoring and alert configurations</li>
                      <li><strong>Security Best Practices:</strong> Implementing security across your infrastructure</li>
                    </ul>
                  </Content>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Documentation</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Documentation Library</Title>
                    <p>Comprehensive documentation and guides for all console features and services.</p>
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

export { LearningResources };
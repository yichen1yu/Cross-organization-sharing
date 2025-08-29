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
          <BreadcrumbItem to="/">Settings</BreadcrumbItem>
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
          <Tab eventKey={0} title={<TabTitleText>Resources</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Available Learning Resources</Title>
                    <p>
                      Access comprehensive learning materials, tutorials, and training resources 
                      to enhance your skills with the Red Hat Hybrid Cloud Console.
                    </p>
                    
                    <h3>Available Resources:</h3>
                    <ul>
                      <li><strong>Interactive Tutorials:</strong> Step-by-step guided experiences</li>
                      <li><strong>Video Training:</strong> On-demand video content and webinars</li>
                      <li><strong>Documentation:</strong> Comprehensive guides and API references</li>
                      <li><strong>Best Practices:</strong> Industry-standard implementation patterns</li>
                      <li><strong>Certification Paths:</strong> Structured learning programs</li>
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
                    <Title headingLevel="h2" size="xl">Documentation Hub</Title>
                    <p>Browse comprehensive documentation and technical guides.</p>
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

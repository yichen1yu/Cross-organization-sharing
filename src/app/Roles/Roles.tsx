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
import { UserCheckIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

const Roles: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>IAM</BreadcrumbItem>
          <BreadcrumbItem>User Access</BreadcrumbItem>
          <BreadcrumbItem isActive>Roles</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      
      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div className="pf-m-align-self-center" style={{ minWidth: '40px' }}>
              <UserCheckIcon style={{ fontSize: '32px', color: '#0066cc' }} aria-label="page-header-icon" />
            </div>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
            <div style={{ borderLeft: '1px solid #d2d2d2', height: '100%', marginRight: '16px' }}></div>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Roles</Title>
              <Content>
                <p style={{ margin: 0, color: '#6a6e73' }}>Define and manage user roles with specific permissions and access levels across your organization.</p>
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
          <Tab eventKey={0} title={<TabTitleText>All Roles</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Role Management</Title>
                    <p>
                      Create and manage roles to control access permissions across Red Hat services. 
                      Define granular permissions and assign roles to users and groups for efficient access control.
                    </p>
                    
                    <h3>Role Management Features:</h3>
                    <ul>
                      <li><strong>Role Creation:</strong> Define custom roles with specific permission sets</li>
                      <li><strong>Permission Assignment:</strong> Assign granular permissions to roles</li>
                      <li><strong>Role Templates:</strong> Use predefined role templates for common access patterns</li>
                      <li><strong>Role Inheritance:</strong> Create hierarchical role structures</li>
                      <li><strong>Access Reviews:</strong> Regular reviews of role assignments and permissions</li>
                    </ul>
                  </Content>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Role Assignments</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Role Assignments</Title>
                    <p>View and manage role assignments for users and groups across your organization.</p>
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

export { Roles };

import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  Flex,
  FlexItem,
  PageSection,
  Tab,
  TabTitleText,
  Tabs,
  Title
} from '@patternfly/react-core';
import { ExternalLinkAltIcon, UsersIcon } from '@patternfly/react-icons';

const UsersAndGroups: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = React.useState<string | number>(0);

  const onSelect = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ) => {
    setActiveKey(tabIndex);
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>IAM</BreadcrumbItem>
          <BreadcrumbItem isActive>Users and Groups</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div className="pf-m-align-self-center" style={{ minWidth: '40px' }}>
              <UsersIcon style={{ fontSize: '32px', color: '#0066cc' }} aria-label="page-header-icon" />
            </div>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
            <div style={{ borderLeft: '1px solid #d2d2d2', height: '100%', marginRight: '16px' }}></div>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Users and Groups</Title>
              <Content>
                <p style={{ margin: 0, color: '#6a6e73' }}>
                  Manage users, groups, and related permissions across your organization in one place.
                </p>
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
        <Tabs activeKey={activeKey} onSelect={onSelect}>
          <Tab eventKey={0} title={<TabTitleText>Users</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">User Management</Title>
                    <p>
                      Create, manage, and monitor user accounts. Control access permissions and user roles.
                    </p>
                    <h3>User Features:</h3>
                    <ul>
                      <li><strong>User Creation:</strong> Add new users</li>
                      <li><strong>Account Management:</strong> Edit profiles and settings</li>
                      <li><strong>Permission Assignment:</strong> Assign roles and access levels</li>
                      <li><strong>Status Control:</strong> Enable, disable, or suspend user accounts</li>
                    </ul>
                  </Content>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Groups</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Group Management</Title>
                    <p>
                      Create and manage user groups to streamline permission management across teams.
                    </p>
                    <h3>Group Features:</h3>
                    <ul>
                      <li><strong>Group Creation:</strong> Create groups for teams or roles</li>
                      <li><strong>Member Management:</strong> Add and remove users</li>
                      <li><strong>Permission Sets:</strong> Assign permissions to entire groups</li>
                      <li><strong>Access Templates:</strong> Use templates for common scenarios</li>
                    </ul>
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

export { UsersAndGroups };




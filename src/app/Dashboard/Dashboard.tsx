import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  Divider,
  Flex,
  FlexItem,
  Label,
  PageSection,
  Title
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

const Dashboard: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const recentWorkspaces = [
    { name: 'Cardiac MRI', time: '3:47pm' },
    { name: 'Healthy Hearts', time: '12:30pm' },
    { name: 'Medical Imaging IT', time: 'Yesterday' },
    { name: 'Ultrasound', time: '12/01/24' },
    { name: 'NICU', time: '2 days ago' }
  ];

  const userGroups = [
    { name: 'Spice girls', updated: 'Just now' },
    { name: 'Golden girls', updated: '2 days ago' },
    { name: 'Powerpuff girls', updated: '2 days ago' },
    { name: 'Admin group', updated: '1 month ago' },
    { name: 'Default group', updated: '1 month ago' }
  ];

  const roles = [
    { name: 'Tenant admin', updated: '1 year ago' },
    { name: 'Workspace admin', updated: '1 year ago' },
    { name: 'RHEL DevOps', updated: '1 year ago' },
    { name: 'Cost mgmt role', updated: '1 year ago' },
    { name: 'RHEL inventory viewer', updated: '2 days ago' }
  ];

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Overview</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Title headingLevel="h1" size="xl">Overview</Title>
        <Content>
          <p style={{ margin: 0, color: '#6a6e73' }}>
            Securely manage user access and organize assets within your organization using workspaces.
          </p>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Flex spaceItems={{ default: 'spaceItemsMd' }}>
          {/* Main column */}
          <FlexItem flex={{ default: 'flex_1' }}>
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
              {/* Billing account + Assets side-by-side */}
              <FlexItem>
                <Flex spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Card>
                      <CardHeader>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                          <Title headingLevel="h2" size="lg">Billing account</Title>
                          <Button variant="link" size="sm" onClick={() => navigate('/subscription-inventory/billing-account')}>View details</Button>
                        </Flex>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <Content>
                          <p style={{ marginBottom: 4 }}>Billing account name</p>
                          <Button variant="link" isInline onClick={() => navigate('/subscription-inventory/billing-account')}>
                            Seattle Grace Hospital
                          </Button>
                          <Label color="green" style={{ marginLeft: 8 }}>Active</Label>
                          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 24 }}>
                            <div>
                              <div style={{ color: '#6a6e73' }}>Account number:</div>
                              <div>123456789</div>
                            </div>
                            <div>
                              <div style={{ color: '#6a6e73' }}>Org ID:</div>
                              <div>1234567</div>
                            </div>
                          </div>
                          <div style={{ marginTop: 12 }}>
                            <Button variant="link" isInline onClick={() => navigate('/subscriptions')}>Manage subscriptions</Button>
                          </div>
                        </Content>
                      </CardBody>
                    </Card>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Card>
                      <CardHeader>
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <Title headingLevel="h2" size="lg">Assets</Title>
                          <Button variant="link" size="sm" onClick={() => navigate('/data-integration')}>Manage</Button>
                        </Flex>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <Flex direction={{ default: 'column' }}>
                          {['Pinnacle Corp','Medical Imaging IT','Cardiac MRI','Healthy Hearts','Heart Disease','Ultrasound'].map((a, idx) => (
                            <Flex key={a} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ padding: '4px 0', borderBottom: idx === 5 ? 'none' : '1px solid var(--pf-v6-global--BorderColor--100)' }}>
                              <FlexItem><Button variant="link" isInline onClick={() => navigate('/data-integration')}>{a}</Button></FlexItem>
                              <FlexItem><Label color="grey">{Math.floor(Math.random()*7)+1}</Label></FlexItem>
                            </Flex>
                          ))}
                        </Flex>
                      </CardBody>
                    </Card>
                  </FlexItem>
                </Flex>
              </FlexItem>

              {/* My workspaces */}
              <FlexItem>
                <Card>
                  <CardHeader>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <Title headingLevel="h2" size="lg">My workspaces</Title>
                      <Button variant="link" size="sm" onClick={() => navigate('/workspaces')}>View all</Button>
                    </Flex>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <Table variant="compact">
                      <Thead>
                        <Tr>
                          <Th>Recently visited</Th>
                          <Th> </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {recentWorkspaces.map((w) => (
                          <Tr key={w.name}>
                            <Td>
                              <Button variant="link" isInline onClick={() => navigate('/workspaces')}>{w.name}</Button>
                            </Td>
                            <Td>{w.time}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    <div style={{ marginTop: 8 }}>
                      <Button variant="link" onClick={() => navigate('/workspaces')}>Create a workspace</Button>
                    </div>
                  </CardBody>
                </Card>
              </FlexItem>

              {/* Trusted Organizations + Workspaces event log side-by-side (1/3 : 2/3) */}
              <FlexItem>
                <Flex spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Card>
                      <CardHeader>
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <Title headingLevel="h2" size="lg">Trusted Organizations</Title>
                          <Button variant="link" size="sm" onClick={() => navigate('/organization/trusted-organizations')}>View all</Button>
                        </Flex>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <Button variant="link" onClick={() => navigate('/organization/trusted-organizations')}>
                          Establish a trusted org connection
                        </Button>
                        <div style={{ color: '#6a6e73' }}>You have no trusted org connections.</div>
                      </CardBody>
                    </Card>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_2' }}>
                    <Card>
                      <CardHeader>
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <Title headingLevel="h2" size="lg">Workspaces event log</Title>
                          <Button variant="link" size="sm" onClick={() => navigate('/event-log')}>View event log</Button>
                        </Flex>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <Table variant="compact">
                          <Thead>
                            <Tr>
                              <Th>Time</Th>
                              <Th>Activity</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr><Td>3:47pm</Td><Td>New Ultrasound workspace created</Td></Tr>
                            <Tr><Td>12:30pm</Td><Td>Favorited Cardiac MRI workspace</Td></Tr>
                            <Tr><Td>Yesterday</Td><Td>Created new role</Td></Tr>
                            <Tr><Td>2 days ago</Td><Td>Name of activity</Td></Tr>
                            <Tr><Td>1 week ago</Td><Td>Name of activity</Td></Tr>
                          </Tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </FlexItem>
                </Flex>
              </FlexItem>

              {/* User groups + Roles side-by-side */}
              <FlexItem>
                <Flex spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Card isCompact>
                      <CardHeader>
                        <Title headingLevel="h2" size="lg">User groups</Title>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <Table variant="compact">
                          <Thead>
                            <Tr>
                              <Th width={70}>Name</Th>
                              <Th width={30}>Last updated</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {userGroups.map((g) => (
                              <Tr key={g.name}>
                                <Td>
                                  <Button variant="link" isInline onClick={() => navigate('/users-and-groups')}>{g.name}</Button>
                                </Td>
                                <Td>{g.updated}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Card isCompact>
                      <CardHeader>
                        <Title headingLevel="h2" size="lg">Roles</Title>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <Table variant="compact">
                          <Thead>
                            <Tr>
                              <Th width={70}>Name</Th>
                              <Th width={30}>Last updated</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {roles.map((r) => (
                              <Tr key={r.name}>
                                <Td>
                                  <Button variant="link" isInline onClick={() => navigate('/roles')}>{r.name}</Button>
                                </Td>
                                <Td>{r.updated}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
          </FlexItem>

          {/* End main column */}
        </Flex>
      </PageSection>
    </>
  );
};

export { Dashboard };

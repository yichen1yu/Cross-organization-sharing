import * as React from 'react';
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
import { ExternalLinkAltIcon, UserIcon } from '@patternfly/react-icons';

const MyUserAccess: React.FunctionComponent = () => {
  // Dummy data representing the user's roles and service access
  const myRoles = [
    { name: 'Tenant admin', scope: 'Organization (UXD)', services: ['IAM', 'Billing'], lastUpdated: '1 year ago' },
    { name: 'Workspace admin', scope: 'Workspace A', services: ['Workspaces'], lastUpdated: '8 months ago' },
    { name: 'RHEL inventory viewer', scope: 'Organization (UXD)', services: ['RHEL'], lastUpdated: '2 days ago' }
  ];

  const serviceAccess = [
    { service: 'RHEL', access: 'Viewer' as const },
    { service: 'OpenShift', access: 'None' as const },
    { service: 'Red Hat Insights', access: 'Viewer' as const },
    { service: 'Automation Hub', access: 'Editor' as const }
  ];

  const rhelAssets = [
    { asset: 'RHEL systems', permissions: ['View inventory', 'View errata'] },
    { asset: 'Vulnerability', permissions: ['View vulnerabilities'] },
    { asset: 'Compliance', permissions: ['View reports'] }
  ];

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>My access</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      
      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div className="pf-m-align-self-center" style={{ minWidth: '40px' }}>
              <UserIcon style={{ fontSize: '32px', color: '#0066cc' }} aria-label="page-header-icon" />
            </div>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
            <div style={{ borderLeft: '1px solid #d2d2d2', height: '100%', marginRight: '16px' }}></div>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">My access</Title>
              <Content>
                <p style={{ margin: 0, color: '#6a6e73' }}>
                  View the roles assigned to you and your access across Red Hat services and assets (e.g., RHEL).
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
        {/* Roles and Service access side-by-side */}
        <Flex spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem flex={{ default: 'flex_2' }}>
            <Card>
              <CardHeader>
                <Title headingLevel="h2" size="lg">Roles assigned to me</Title>
              </CardHeader>
              <Divider />
              <CardBody>
                <Table variant="compact">
                  <Thead>
                    <Tr>
                      <Th width={35}>Role</Th>
                      <Th width={35}>Scope</Th>
                      <Th width={20}>Services</Th>
                      <Th width={10}>Last updated</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {myRoles.map((r) => (
                      <Tr key={r.name}>
                        <Td>{r.name}</Td>
                        <Td>{r.scope}</Td>
                        <Td>
                          {r.services.map((s, idx) => (
                            <Label key={s} color="blue" style={{ marginRight: idx < r.services.length - 1 ? 6 : 0 }}>{s}</Label>
                          ))}
                        </Td>
                        <Td>{r.lastUpdated}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </FlexItem>

          <FlexItem flex={{ default: 'flex_1' }}>
            <Card>
              <CardHeader>
                <Title headingLevel="h2" size="lg">Service access</Title>
              </CardHeader>
              <Divider />
              <CardBody>
                <Table variant="compact">
                  <Thead>
                    <Tr>
                      <Th>Service</Th>
                      <Th>Access</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {serviceAccess.map((s) => (
                      <Tr key={s.service}>
                        <Td>{s.service}</Td>
                        <Td>
                          {s.access === 'Editor' && <Label color="blue">Editor</Label>}
                          {s.access === 'Viewer' && <Label color="green">Viewer</Label>}
                          {s.access === 'None' && <Label color="grey">None</Label>}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Card>
          <CardHeader>
            <Title headingLevel="h2" size="lg">RHEL asset access</Title>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table>
              <Thead>
                <Tr>
                  <Th width={40}>Asset</Th>
                  <Th width={60}>Permissions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rhelAssets.map((a) => (
                  <Tr key={a.asset}>
                    <Td>{a.asset}</Td>
                    <Td>
                      {a.permissions.map((p, idx) => (
                        <Label key={p} color="blue" style={{ marginRight: idx < a.permissions.length - 1 ? 6 : 0 }}>{p}</Label>
                      ))}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { MyUserAccess };
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
  MenuToggle,
  MenuToggleElement,
  PageSection,
  Pagination,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem
} from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ExternalLinkAltIcon, ServerIcon } from '@patternfly/react-icons';

const ServiceAccounts: React.FunctionComponent = () => {
  type ServiceAccountRow = {
    id: string;
    name: string;
    description: string;
    clientId: string;
    owner: string;
    created: string;
  };

  const initialRows: ServiceAccountRow[] = [
    { id: 'sa1', name: 'mytestserviceaccount-bkramer', description: 'just a test', clientId: '009e9363-73cc-4a46-8eac-22a61af4d3fd', owner: 'rhn-support-bkramer1', created: '4 months ago' },
    { id: 'sa2', name: 'rhn-support-nreilly', description: 'AAP Service account', clientId: '017b1bd1-2c25-4b66-9dcd-6b00a2b25644', owner: 'rhn-support-nreilly', created: '5 months ago' },
    { id: 'sa3', name: 'insights-sync-checker-01', description: '', clientId: '0249abcc-fe0e-4ad2-9e46-dbb2ffe936f6', owner: 'rhn-support-xiaoxwan', created: '3 years ago' },
    { id: 'sa4', name: 'amarforaap', description: 'amarforaap', clientId: '0276b637-1775-49c5-869e-4b99ea873ba7', owner: 'rhn-support-ahuchcha', created: '9 months ago' },
    { id: 'sa5', name: 'xiaoxwan-insights-mcp-01', description: 'for insights-mcp access', clientId: '035dea85-e8b1-40fe-be6f-0cd892df8886', owner: 'rhn-support-xiaoxwan', created: '2 months ago' },
    { id: 'sa6', name: 'customer-dashboard-insights-sa', description: '', clientId: '049379fd-2b00-47d7-868c-f7b041adcfc2', owner: 'rhn-support-degandhi', created: '2 years ago' },
    { id: 'sa7', name: 'shzhou-insights-mcp-testing', description: 'service account for testing mcp server', clientId: '07ac0bc1-74f1-4065-8b1e-7563e4e91ff0', owner: 'rhn-support-shzhou', created: '3 months ago' },
    { id: 'sa8', name: 'keinveserviceaccount', description: 'another test', clientId: '0864b23e-217a-4663-b947-e48aa22a45a3', owner: 'rhn-support-khurley', created: '2 months ago' },
    { id: 'sa9', name: 'test-rathore', description: 'I want to test if we can create alert with it.', clientId: '09a2d55d-143a-40b2-889a-73e3113f0b4', owner: 'rhn-support-rrathore', created: '5 months ago' },
    { id: 'sa10', name: 'smajmuda-aap', description: 'for aap', clientId: '0ad04bf4-77ef-4cb7-a945-d6f61febd459', owner: 'rhn-support-smajmudar', created: '21 days ago' },
  ];

  const [rows, setRows] = React.useState<ServiceAccountRow[]>(initialRows);
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(50);
  const [openKebabFor, setOpenKebabFor] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => r.name.toLowerCase().includes(q));
  }, [rows, query]);

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageRows = filtered.slice(start, end);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>IAM</BreadcrumbItem>
          <BreadcrumbItem isActive>Service Accounts</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      
      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div className="pf-m-align-self-center" style={{ minWidth: '40px' }}>
              <ServerIcon style={{ fontSize: '32px', color: '#0066cc' }} aria-label="page-header-icon" />
            </div>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
            <div style={{ borderLeft: '1px solid #d2d2d2', height: '100%', marginRight: '16px' }}></div>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Service Accounts</Title>
              <Content>
                <p style={{ margin: 0, color: '#6a6e73' }}>Use service accounts to securely and automatically connect and authenticate services or applications without requiring an end user’s credentials or direct interaction.</p>
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
                    Watch a video to learn more
                  </Button>
                </div>
              </Content>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Card>
          <CardHeader>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <SearchInput
                    placeholder="Filter by name"
                    value={query}
                    onChange={(_, v) => { setQuery(v); setPage(1); }}
                    onClear={() => { setQuery(''); setPage(1); }}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="primary">Create service account</Button>
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    isCompact
                    itemCount={filtered.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_, p) => setPage(p)}
                    onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Service accounts table">
              <Thead>
                <Tr>
                  <Th width={25}>Name</Th>
                  <Th width={25}>Description</Th>
                  <Th width={20}>Client ID</Th>
                  <Th width={15}>Owner</Th>
                  <Th width={10}>Time created</Th>
                  <Th width={10}><span style={{ visibility: 'hidden' }}>Actions</span></Th>
                </Tr>
              </Thead>
              <Tbody>
                {pageRows.map(r => (
                  <Tr key={r.id}>
                    <Td>
                      <Button variant="link" isInline>{r.name}</Button>
                    </Td>
                    <Td>{r.description || <span style={{ color: '#6a6e73' }}>—</span>}</Td>
                    <Td>{r.clientId}</Td>
                    <Td>{r.owner}</Td>
                    <Td>{r.created}</Td>
                    <Td isActionCell>
                      <Dropdown
                        isOpen={openKebabFor === r.id}
                        onOpenChange={(isOpen) => setOpenKebabFor(isOpen ? r.id : null)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle ref={toggleRef} variant="plain" aria-label="Actions" onClick={() => setOpenKebabFor(openKebabFor === r.id ? null : r.id)}>
                            ⋮
                          </MenuToggle>
                        )}
                        popperProps={{ position: 'right' }}
                      >
                        <DropdownList>
                          <DropdownItem>View</DropdownItem>
                          <DropdownItem>Edit</DropdownItem>
                          <DropdownItem>Delete</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination
                itemCount={filtered.length}
                perPage={perPage}
                page={page}
                onSetPage={(_, p) => setPage(p)}
                onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
              />
            </div>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { ServiceAccounts };

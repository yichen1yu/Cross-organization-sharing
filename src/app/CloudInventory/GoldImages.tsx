import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, Content, Flex, FlexItem, PageSection, Title, Button, Card, CardHeader, CardBody, Toolbar, ToolbarContent, ToolbarItem, Pagination, MenuToggle, MenuToggleElement, Label, LabelGroup } from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core';
import { Link, useLocation } from 'react-router-dom';

const GoldImages: React.FunctionComponent = () => {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(50);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterField, setFilterField] = React.useState<'Cloud provider'>('Cloud provider');
  const [isProviderOpen, setIsProviderOpen] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 0, direction: 'desc' });
  
  const setProvider = (provider: string | null) => {
    setSelectedProvider(provider);
    setPage(1);
  };
  type Provider = { id: string; name: string; images: string[] };
  const providers: Provider[] = React.useMemo(() => ([
    {
      id: 'aws',
      name: 'AWS',
      images: [
        'Red Hat Enterprise Linux Server',
        'Red Hat Enterprise Linux Server for SAP',
        'Red Hat Enterprise Linux Atomic',
        'Red Hat JBoss Enterprise Web Server',
        'Red Hat Enterprise Messaging'
      ]
    },
    {
      id: 'azure',
      name: 'Azure',
      images: ['Red Hat Enterprise Linux Server']
    },
    {
      id: 'gcp',
      name: 'Google Cloud',
      images: ['Red Hat Enterprise Linux Server']
    }
  ]), []);

  const location = useLocation();
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const p = params.get('provider');
    if (p && ['AWS', 'Azure', 'Google Cloud'].includes(p)) {
      setProvider(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Cloud Inventory</BreadcrumbItem>
          <BreadcrumbItem isActive>Gold Images</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Gold Images</Title>
              <Content style={{ marginTop: 24 }}>
                <p style={{ margin: 0, color: '#6a6e73' }}>
                  This is a listing of the gold images available to your organization, based on your subscriptions.{' '}
                  <Button variant="link" isInline component="a" href="https://docs.redhat.com" target="_blank" rel="noopener noreferrer">
                    Learn more about gold images
                  </Button>
                  . To see which cloud accounts have gold image access enabled, view the list of your{' '}
                  <Link to="/cloud-inventory/cloud-accounts">
                    cloud accounts
                  </Link>
                  .
                </p>
              </Content>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0, marginTop: 16 }}>
        <Card>
          <CardHeader>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isFilterOpen}
                    onOpenChange={(open) => setIsFilterOpen(open)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        isExpanded={isFilterOpen}
                      >
                        {filterField}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem onClick={() => { setFilterField('Cloud provider'); setIsFilterOpen(false); }}>Cloud provider</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isProviderOpen}
                    onOpenChange={(open) => setIsProviderOpen(open)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsProviderOpen(!isProviderOpen)}
                        isExpanded={isProviderOpen}
                      >
                        {selectedProvider ?? <span style={{ color: '#6a6e73' }}>Filter by cloud provider</span>}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem onClick={() => { setProvider('AWS'); setIsProviderOpen(false); }}>AWS</DropdownItem>
                      <DropdownItem onClick={() => { setProvider('Azure'); setIsProviderOpen(false); }}>Azure</DropdownItem>
                      <DropdownItem onClick={() => { setProvider('Google Cloud'); setIsProviderOpen(false); }}>Google Cloud</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    isCompact
                    itemCount={[...providers]
                      .sort((a, b) => {
                        const cmp = a.name.localeCompare(b.name);
                        return sortBy.direction === 'desc' ? cmp : -cmp;
                      })
                      .filter(p => !selectedProvider || p.name === selectedProvider).length}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_, p) => setPage(p)}
                    onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
                  />
                </ToolbarItem>
              </ToolbarContent>
              {selectedProvider && (
                <ToolbarContent>
                  <ToolbarItem>
                    <LabelGroup>
                      <Label variant="filled" color="grey" onClose={() => setSelectedProvider(null)}>
                        Cloud provider: {selectedProvider}
                      </Label>
                    </LabelGroup>
                  </ToolbarItem>
                </ToolbarContent>
              )}
            </Toolbar>
          </CardHeader>
          <CardBody>
            <Table aria-label="Gold images by cloud provider">
              <Thead>
                <Tr>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 0
                    }}
                  >
                    Cloud provider
                  </Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {[...providers]
                  .sort((a, b) => {
                    const cmp = a.name.localeCompare(b.name);
                    return sortBy.direction === 'desc' ? cmp : -cmp;
                  })
                  .filter(p => !selectedProvider || p.name === selectedProvider)
                  .slice((page - 1) * perPage, (page - 1) * perPage + perPage)
                  .map((p) => (
                    <Tr key={p.id}>
                      <Td dataLabel="Cloud provider">
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{p.name}</div>
                        <div>
                          {p.images.map((img, idx) => (
                            <div key={idx} style={{ padding: '4px 0' }}>{img}</div>
                          ))}
                        </div>
                      </Td>
                      <Td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                        <Link to={`/cloud-inventory/cloud-accounts?provider=${encodeURIComponent(p.name)}`}>
                          View cloud accounts
                        </Link>
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

export { GoldImages };


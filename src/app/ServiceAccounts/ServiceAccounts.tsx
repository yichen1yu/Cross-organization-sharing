import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  Pagination,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { EllipsisVIcon, ExternalLinkAltIcon, FilterIcon } from '@patternfly/react-icons';

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
    { id: 'sa1', name: 'iqe-rbac-on-rbac', description: 'RBAC on RBAC tests. DO NOT REMOVE!', clientId: '9e6729e3-2c31-4b45-90af-2e88ed654c0f', owner: 'iqe_rbac_v2_admin', created: '3 months ago' },
    { id: 'sa2', name: 'iqe-rbac-on-rbac-read', description: 'RBAC on RBAC tests. DO NOT REMOVE!', clientId: 'b43b9c00-0107-43be-afa7-4ce45006b51c', owner: 'iqe_rbac_v2_admin', created: '3 months ago' },
    { id: 'sa3', name: 'iqe-rbac-v2-e2e-service-account', description: 'DO NOT DELETE. This is an empty service account using during E2E testing', clientId: '6dfb7d72-cf19-40eb-9920-0e8de3d2bb40', owner: 'iqe_rbac_v2_admin', created: '4 months ago' },
    { id: 'sa4', name: 'iqe-rbac-v2-service-account', description: 'DO NOT REMOVE! SA for RBAC Tests', clientId: '7fb2272f-2844-4fd0-bab3-dbdb0d85a91f', owner: 'iqe_rbac_v2_admin', created: '3 months ago' },
    { id: 'sa5', name: 'libord', description: 'libord', clientId: 'f54cbb0-82e3-4f70-82be-a6f343746804', owner: 'iqe_rbac_v2_admin', created: '1 month ago' },
    { id: 'sa6', name: 'SA for RBAC', description: 'DO NOT REMOVE! SA for RBAC Tests', clientId: 'd807b762-31c3-45d0-bffe-7f498b709c66', owner: 'iqe_rbac_v2_admin', created: '3 months ago' },
    { id: 'sa7', name: 'SA Permissions for RBAC', description: 'DO NOT REMOVE! SA with Permissions for RBAC Tests', clientId: 'fe466d70-2aeb-4de7-6eb3-d48ff4729e62', owner: 'iqe_rbac_v2_admin', created: '2 months ago' },
    { id: 'sa8', name: 'test405', description: 'test405', clientId: 'ab434b20-2276-4846-afdd-b0c/4ecba2f0', owner: 'iqe_rbac_v2_admin', created: '1 month ago' },
    { id: 'sa9', name: 'testlibor', description: 'testlibor', clientId: 'cc9a0d3f-07dd-43a5-990b-d5a21d6d90a8', owner: 'iqe_rbac_v2_admin', created: '2 months ago' },
  ];

  const [rows] = React.useState<ServiceAccountRow[]>(initialRows);
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(50);
  const [openKebabFor, setOpenKebabFor] = React.useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [sortIndex, setSortIndex] = React.useState<number | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => r.name.toLowerCase().includes(q));
  }, [rows, query]);

  const sorted = React.useMemo(() => {
    if (sortIndex === null) return filtered;
    const keys: (keyof ServiceAccountRow)[] = ['name', 'description', 'clientId', 'owner', 'created'];
    const key = keys[sortIndex];
    if (!key) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[key]).toLowerCase();
      const bVal = String(b[key]).toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortIndex, sortDirection]);

  const start = (page - 1) * perPage;
  const pageRows = sorted.slice(start, start + perPage);

  const getSortParams = (idx: number) => ({
    sort: {
      sortBy: { index: sortIndex ?? undefined, direction: sortDirection },
      onSort: (_e: React.MouseEvent, index: number, dir: 'asc' | 'desc') => { setSortIndex(index); setSortDirection(dir); },
      columnIndex: idx,
    },
  });

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Service Accounts</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Service Accounts</Title>
        <Content>
          <p style={{ margin: 0, color: '#6a6e73' }}>Use service accounts to securely and automatically connect and authenticate services or applications without requiring an end user's credentials or direct interaction.</p>
          <div style={{ marginTop: '8px' }}>
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
      </PageSection>

      <PageSection hasBodyWrapper={false} isFilled style={{ paddingTop: 0 }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <Dropdown
                  isOpen={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle ref={toggleRef} onClick={() => setIsFilterOpen(!isFilterOpen)} icon={<FilterIcon />}>
                      Name
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => setIsFilterOpen(false)}>Name</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <SearchInput
                  placeholder="Filter by name"
                  value={query}
                  onChange={(_, v) => { setQuery(v); setPage(1); }}
                  onClear={() => { setQuery(''); setPage(1); }}
                />
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarItem>
              <Button variant="primary">Create service account</Button>
            </ToolbarItem>
            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Pagination
                isCompact
                itemCount={sorted.length}
                perPage={perPage}
                page={page}
                onSetPage={(_, p) => setPage(p)}
                onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Service accounts table">
          <Thead>
            <Tr>
              <Th width={20} {...getSortParams(0)}>Name</Th>
              <Th width={25} {...getSortParams(1)}>Description</Th>
              <Th width={20}>Client ID</Th>
              <Th width={15}>Owner</Th>
              <Th width={10} {...getSortParams(4)}>Time created</Th>
              <Th width={10}><span style={{ visibility: 'hidden' }}>Actions</span></Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageRows.map(r => (
              <Tr key={r.id}>
                <Td>
                  <Button variant="link" isInline>{r.name}</Button>
                </Td>
                <Td>{r.description || <span style={{ color: '#6a6e73' }}>&mdash;</span>}</Td>
                <Td>{r.clientId}</Td>
                <Td>{r.owner}</Td>
                <Td>{r.created}</Td>
                <Td isActionCell>
                  <Dropdown
                    isOpen={openKebabFor === r.id}
                    onOpenChange={(isOpen) => setOpenKebabFor(isOpen ? r.id : null)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle ref={toggleRef} variant="plain" aria-label="Actions" onClick={() => setOpenKebabFor(openKebabFor === r.id ? null : r.id)}>
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                    popperProps={{ position: 'right' }}
                  >
                    <DropdownList>
                      <DropdownItem>Reset credentials</DropdownItem>
                      <DropdownItem>Delete service account</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            itemCount={sorted.length}
            perPage={perPage}
            page={page}
            onSetPage={(_, p) => setPage(p)}
            onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
          />
        </div>
      </PageSection>
    </>
  );
};

export { ServiceAccounts };

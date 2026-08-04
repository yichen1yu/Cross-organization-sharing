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

const AIAgents: React.FunctionComponent = () => {
  type AIAgentRow = {
    id: string;
    name: string;
    description: string;
    lastRelease: string;
  };

  const initialRows: AIAgentRow[] = [
    { id: 'ai1', name: 'Red Hat Insights Assistant', description: 'AI agent for Insights', lastRelease: '3 months ago' },
    { id: 'ai2', name: 'HCC Virtual Assistant', description: 'Helper agent across Hybrid Cloud Console', lastRelease: '3 months ago' },
    { id: 'ai3', name: 'Red Hat Lightspeed Agent', description: 'AI agent for Red Hat Lightspeed', lastRelease: '4 months ago' },
  ];

  const [rows] = React.useState<AIAgentRow[]>(initialRows);
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
    const keys: (keyof AIAgentRow)[] = ['name', 'description', 'lastRelease'];
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
          <BreadcrumbItem isActive>AI Agents</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">AI Agents</Title>
        <Content>
          <p style={{ margin: 0, color: '#6a6e73' }}>Use AI agents to securely connect AI-powered services and applications to your organization's resources without requiring an end user's credentials or direct interaction.</p>
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

        <Table aria-label="AI agents table">
          <Thead>
            <Tr>
              <Th width={25} {...getSortParams(0)}>Name</Th>
              <Th width={45} {...getSortParams(1)}>Description</Th>
              <Th width={15} {...getSortParams(2)}>Last release</Th>
              <Th width={5}><span style={{ visibility: 'hidden' }}>Actions</span></Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageRows.map(r => (
              <Tr key={r.id}>
                <Td>{r.name}</Td>
                <Td>{r.description || <span style={{ color: '#6a6e73' }}>&mdash;</span>}</Td>
                <Td>{r.lastRelease}</Td>
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
                      <DropdownItem>View details</DropdownItem>
                      <DropdownItem>Delete AI agent</DropdownItem>
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

export { AIAgents };

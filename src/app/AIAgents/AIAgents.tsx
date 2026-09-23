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
  Switch,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Tooltip,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr, ExpandableRowContent } from '@patternfly/react-table';
import { EllipsisVIcon, ExternalLinkAltIcon, FilterIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

type AIAgentRow = {
  id: string;
  name: string;
  description: string;
  lastRelease: string;
};

const agentCapabilities: Record<string, { title: string; roles: string[] }[]> = {
  ai1: [
    { title: 'Product knowledge', roles: ['Inventory administrator', 'Compliance administrator'] },
    { title: 'Documentation search', roles: ['Inventory Hosts viewer', 'Compliance viewer'] },
    { title: 'Troubleshooting guidance', roles: ['Remediations administrator', 'Inventory administrator'] },
    { title: 'Best practices', roles: ['Compliance viewer', 'Compliance administrator'] },
    { title: 'Command examples', roles: ['Remediations viewer'] },
  ],
  ai2: [
    { title: 'Console navigation', roles: ['User Access viewer'] },
    { title: 'Personal settings', roles: ['User Access administrator', 'Notifications administrator'] },
    { title: 'Access requests', roles: ['User Access administrator'] },
    { title: 'Vulnerability insights', roles: ['Compliance viewer', 'Malware detection viewer'] },
    { title: 'Task guidance', roles: ['Inventory administrator', 'Notifications administrator'] },
  ],
  ai3: [
    { title: 'RHEL Q&A', roles: ['Inventory Hosts viewer', 'Compliance viewer'] },
    { title: 'Troubleshooting support', roles: ['Remediations administrator', 'Inventory administrator'] },
    { title: 'Log analysis', roles: ['Inventory Hosts viewer'] },
    { title: 'Recommendations', roles: ['Compliance viewer', 'Remediations viewer'] },
    { title: 'Command examples', roles: ['Remediations administrator'] },
  ],
};

const initialRows: AIAgentRow[] = [
  { id: 'ai1', name: 'Ask Red Hat', description: 'Find answers about Red Hat products, error messages, security vulnerabilities, general usage, and other content from product documentation and our knowledge base.', lastRelease: '3 months ago' },
  { id: 'ai2', name: 'Hybrid Cloud Console', description: 'Learn about the Hybrid Cloud Console and configure settings like your personal information, request access from your admin, show critical vulnerabilities, and more.', lastRelease: '3 months ago' },
  { id: 'ai3', name: 'RHEL Lightspeed', description: 'Get answers to RHEL-related questions, support with troubleshooting, help understanding log files, ask for recommendations, and more.', lastRelease: '4 months ago' },
];

const userRoles = new Set([
  'Inventory administrator',
  'Compliance viewer',
  'Remediations viewer',
  'User Access viewer',
  'Inventory Hosts viewer',
]);

const AIAgents: React.FunctionComponent = () => {
  const [rows, setRows] = React.useState<AIAgentRow[]>(initialRows);
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  const userHasAccess = (roles: string[]) => roles.some(r => userRoles.has(r));

  const buildDefaultAccess = () => {
    const map: Record<string, Record<number, boolean>> = {};
    for (const row of initialRows) {
      const caps = agentCapabilities[row.id] || [];
      map[row.id] = {};
      caps.forEach((cap, i) => {
        map[row.id][i] = userHasAccess(cap.roles);
      });
    }
    return map;
  };
  const [capabilityAccess, setCapabilityAccess] = React.useState<Record<string, Record<number, boolean>>>(buildDefaultAccess);

  const toggleCapabilityAccess = (agentId: string, capIndex: number) => {
    const caps = agentCapabilities[agentId] || [];
    const cap = caps[capIndex];
    if (!cap || !userHasAccess(cap.roles)) return;
    const agent = rows.find(r => r.id === agentId);
    const currentlyOn = capabilityAccess[agentId]?.[capIndex] ?? false;
    setCapabilityAccess(prev => ({
      ...prev,
      [agentId]: { ...prev[agentId], [capIndex]: !prev[agentId]?.[capIndex] },
    }));
    addAlert(
      AlertVariant.info,
      `"${cap.title}" capability for ${agent?.name} has been ${currentlyOn ? 'disabled' : 'enabled'}.`
    );
  };

  const [alerts, setAlerts] = React.useState<{ key: number; variant: AlertVariant; title: string }[]>([]);
  const alertKeyRef = React.useRef(0);

  const addAlert = (variant: AlertVariant, title: string) => {
    const key = alertKeyRef.current++;
    setAlerts(prev => [...prev, { key, variant, title }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.key !== key)), 5000);
  };

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
      <AlertGroup isToast isLiveRegion>
        {alerts.map(({ key, variant, title }) => (
          <Alert
            key={key}
            variant={variant}
            title={title}
            actionClose={<AlertActionCloseButton onClose={() => setAlerts(prev => prev.filter(a => a.key !== key))} />}
          />
        ))}
      </AlertGroup>

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

              <Table aria-label="AI agents table" isExpandable>
                <Thead>
                  <Tr>
                    <Th screenReaderText="Expand" />
                    <Th width={30} {...getSortParams(0)}>Name</Th>
                    <Th width={45} {...getSortParams(1)}>Description</Th>
                    <Th width={15} {...getSortParams(2)}>Last release</Th>
                    <Th width={10}><span style={{ visibility: 'hidden' }}>Actions</span></Th>
                  </Tr>
                </Thead>
                {pageRows.map((r, rowIndex) => (
                  <Tbody key={r.id} isExpanded={expandedRows.has(r.id)}>
                    <Tr>
                      <Td
                        expand={{
                          rowIndex,
                          isExpanded: expandedRows.has(r.id),
                          onToggle: () => {
                            setExpandedRows(prev => {
                              const next = new Set(prev);
                              if (next.has(r.id)) next.delete(r.id);
                              else next.add(r.id);
                              return next;
                            });
                          },
                        }}
                      />
                      <Td>{r.name}</Td>
                      <Td>
                        <Tooltip content={r.description} maxWidth="400px">
                          <span style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {r.description}
                          </span>
                        </Tooltip>
                      </Td>
                      <Td>{r.lastRelease}</Td>
                      <Td isActionCell onClick={(e) => e.stopPropagation()}>
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
                    {expandedRows.has(r.id) && (
                      <Tr isExpanded>
                        <Td colSpan={5}>
                          <ExpandableRowContent>
                            <Table aria-label={`${r.name} capabilities`} variant="compact" borders={false}>
                              <Thead>
                                <Tr>
                                  <Th width={30}>Capability</Th>
                                  <Th width={50}>Role(s)</Th>
                                  <Th width={20}>
                                    User&apos;s access{' '}
                                    <Tooltip
                                      content="AI agent access cannot exceed your own permissions. Capabilities unavailable to you will also be unavailable to the agent. To request additional access, contact your organization administrator."
                                    >
                                      <OutlinedQuestionCircleIcon style={{ marginLeft: 6, color: '#6a6e73', cursor: 'pointer' }} />
                                    </Tooltip>
                                  </Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {(agentCapabilities[r.id] || []).map((cap, i) => {
                                  const hasAccess = userHasAccess(cap.roles);
                                  return (
                                  <Tr key={i}>
                                    <Td dataLabel="Capability">{cap.title}</Td>
                                    <Td dataLabel="Role(s)">{cap.roles.join(', ')}</Td>
                                    <Td dataLabel="User's default access">
                                      {hasAccess ? (
                                        <Switch
                                          id={`cap-access-${r.id}-${i}`}
                                          aria-label={`Toggle default access for ${cap.title}`}
                                          isChecked={capabilityAccess[r.id]?.[i] ?? false}
                                          onChange={() => toggleCapabilityAccess(r.id, i)}
                                        />
                                      ) : (
                                        <Tooltip content="You don't have the required role(s) for this capability. Contact your organization admin to request access.">
                                          <Switch
                                            id={`cap-access-${r.id}-${i}`}
                                            aria-label={`Toggle default access for ${cap.title}`}
                                            isChecked={false}
                                            isDisabled
                                          />
                                        </Tooltip>
                                      )}
                                    </Td>
                                  </Tr>
                                  );
                                })}
                              </Tbody>
                            </Table>
                          </ExpandableRowContent>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                ))}
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

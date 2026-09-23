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
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ExternalLinkAltIcon, FilterIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

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

const initialAgents: AIAgentRow[] = [
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

type FlatCapabilityRow = {
  key: string;
  capability: string;
  agentId: string;
  agentName: string;
  roles: string[];
  capIndex: number;
};

const buildFlatRows = (): FlatCapabilityRow[] => {
  const rows: FlatCapabilityRow[] = [];
  for (const agent of initialAgents) {
    const caps = agentCapabilities[agent.id] || [];
    caps.forEach((cap, i) => {
      rows.push({
        key: `${agent.id}-${i}`,
        capability: cap.title,
        agentId: agent.id,
        agentName: agent.name,
        roles: cap.roles,
        capIndex: i,
      });
    });
  }
  return rows;
};

const AIAgentsVersionB: React.FunctionComponent = () => {
  const allRows = React.useMemo(() => buildFlatRows(), []);

  const userHasAccess = (roles: string[]) => roles.some((r) => userRoles.has(r));

  const buildDefaultAccess = () => {
    const map: Record<string, boolean> = {};
    for (const row of allRows) {
      map[row.key] = userHasAccess(row.roles);
    }
    return map;
  };

  const [capabilityAccess, setCapabilityAccess] = React.useState<Record<string, boolean>>(buildDefaultAccess);

  const toggleAccess = (row: FlatCapabilityRow) => {
    if (!userHasAccess(row.roles)) return;
    const currentlyOn = capabilityAccess[row.key] ?? false;
    setCapabilityAccess((prev) => ({ ...prev, [row.key]: !prev[row.key] }));
    addAlert(
      AlertVariant.info,
      `"${row.capability}" capability for ${row.agentName} has been ${currentlyOn ? 'disabled' : 'enabled'}.`
    );
  };

  const [alerts, setAlerts] = React.useState<{ key: number; variant: AlertVariant; title: string }[]>([]);
  const alertKeyRef = React.useRef(0);
  const addAlert = (variant: AlertVariant, title: string) => {
    const key = alertKeyRef.current++;
    setAlerts((prev) => [...prev, { key, variant, title }]);
    setTimeout(() => setAlerts((prev) => prev.filter((a) => a.key !== key)), 5000);
  };

  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(50);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [sortIndex, setSortIndex] = React.useState<number | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter(
      (r) => r.capability.toLowerCase().includes(q) || r.agentName.toLowerCase().includes(q)
    );
  }, [allRows, query]);

  const sorted = React.useMemo(() => {
    if (sortIndex === null) return filtered;
    const keyFns: ((r: FlatCapabilityRow) => string)[] = [
      (r) => r.capability,
      (r) => r.agentName,
      (r) => r.roles.join(', '),
    ];
    const fn = keyFns[sortIndex];
    if (!fn) return filtered;
    return [...filtered].sort((a, b) => {
      const cmp = fn(a).toLowerCase().localeCompare(fn(b).toLowerCase());
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortIndex, sortDirection]);

  const start = (page - 1) * perPage;
  const pageRows = sorted.slice(start, start + perPage);

  const getSortParams = (idx: number) => ({
    sort: {
      sortBy: { index: sortIndex ?? undefined, direction: sortDirection },
      onSort: (_e: React.MouseEvent, index: number, dir: 'asc' | 'desc') => {
        setSortIndex(index);
        setSortDirection(dir);
      },
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
            actionClose={<AlertActionCloseButton onClose={() => setAlerts((prev) => prev.filter((a) => a.key !== key))} />}
          />
        ))}
      </AlertGroup>

      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>AI Agents Version B</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">AI Agents — Version B</Title>
        <Content>
          <p style={{ margin: 0, color: '#6a6e73' }}>
            All AI agent capabilities surfaced in a single flat table. Each row represents one capability with its associated agent.
          </p>
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
                  placeholder="Filter by capability or agent"
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

        <Table aria-label="AI agent capabilities table">
          <Thead>
            <Tr>
              <Th width={25} {...getSortParams(0)}>Capability</Th>
              <Th width={20} {...getSortParams(1)}>Agent</Th>
              <Th width={35} {...getSortParams(2)}>Role(s)</Th>
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
            {pageRows.map((row) => {
              const hasAccess = userHasAccess(row.roles);
              return (
                <Tr key={row.key}>
                  <Td dataLabel="Capability">{row.capability}</Td>
                  <Td dataLabel="Agent">{row.agentName}</Td>
                  <Td dataLabel="Role(s)">{row.roles.join(', ')}</Td>
                  <Td dataLabel="User's access">
                    {hasAccess ? (
                      <Switch
                        id={`cap-access-b-${row.key}`}
                        aria-label={`Toggle access for ${row.capability}`}
                        isChecked={capabilityAccess[row.key] ?? false}
                        onChange={() => toggleAccess(row)}
                      />
                    ) : (
                      <Tooltip content="You don't have the required role(s) for this capability. Contact your organization admin to request access.">
                        <Switch
                          id={`cap-access-b-${row.key}`}
                          aria-label={`Toggle access for ${row.capability}`}
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

export { AIAgentsVersionB };

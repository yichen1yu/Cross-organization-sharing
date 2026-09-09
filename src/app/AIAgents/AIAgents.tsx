import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Pagination,
  SearchInput,
  Switch,
  Tab,
  TabTitleText,
  Tabs,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { EllipsisVIcon, ExternalLinkAltIcon, FilterIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

type AIAgentRow = {
  id: string;
  name: string;
  description: string;
  inheritAccess: boolean;
  lastRelease: string;
  workspaces: string[];
};

const initialRows: AIAgentRow[] = [
  { id: 'ai1', name: 'Red Hat Insights Assistant', description: 'AI agent for Insights', inheritAccess: true, lastRelease: '3 months ago', workspaces: ['Default', 'Production US-East', 'Production EU-West', 'Staging'] },
  { id: 'ai2', name: 'HCC Virtual Assistant', description: 'Helper agent across Hybrid Cloud Console', inheritAccess: false, lastRelease: '3 months ago', workspaces: ['Default', 'Staging'] },
  { id: 'ai3', name: 'Red Hat Lightspeed Agent', description: 'AI agent for Red Hat Lightspeed', inheritAccess: true, lastRelease: '4 months ago', workspaces: ['Default', 'Production US-East', 'Development', 'Preview'] },
];

const workspaceSlugMap: Record<string, string> = {
  'Default': 'workspace-default',
  'Production US-East': 'workspace-a',
  'Production EU-West': 'workspace-b',
  'Preview': 'workspace-c',
  'Staging': 'workspace-a',
  'Development': 'workspace-default',
};

const AIAgents: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState<AIAgentRow[]>(initialRows);
  const [selectedAgent, setSelectedAgent] = React.useState<AIAgentRow | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const [pendingToggleId, setPendingToggleId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [alerts, setAlerts] = React.useState<{ key: number; variant: AlertVariant; title: string }[]>([]);
  const alertKeyRef = React.useRef(0);

  const addAlert = (variant: AlertVariant, title: string) => {
    const key = alertKeyRef.current++;
    setAlerts(prev => [...prev, { key, variant, title }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.key !== key)), 5000);
  };

  const onToggleClick = (id: string) => {
    setPendingToggleId(id);
    setIsModalOpen(true);
  };

  const onConfirmToggle = () => {
    if (pendingToggleId) {
      const agent = rows.find(r => r.id === pendingToggleId);
      const newState = !agent?.inheritAccess;
      setRows(prev => prev.map(r => r.id === pendingToggleId ? { ...r, inheritAccess: !r.inheritAccess } : r));
      addAlert(
        AlertVariant.success,
        `Inherit user's access has been ${newState ? 'enabled' : 'disabled'} for ${agent?.name}`
      );
    }
    setIsModalOpen(false);
    setPendingToggleId(null);
  };

  const onCancelToggle = () => {
    setIsModalOpen(false);
    setPendingToggleId(null);
  };

  const pendingAgent = rows.find(r => r.id === pendingToggleId);

  const onAgentRowClick = (agent: AIAgentRow) => {
    setSelectedAgent(agent);
    setIsDrawerOpen(true);
  };

  const onCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAgent(null);
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

  const [drawerKebabOpen, setDrawerKebabOpen] = React.useState(false);
  const [drawerTabKey, setDrawerTabKey] = React.useState(0);
  const [drawerWsPage, setDrawerWsPage] = React.useState(1);
  const drawerWsPerPage = 5;

  const drawerWorkspaces = selectedAgent?.workspaces || [];
  const drawerWsPageRows = drawerWorkspaces.slice((drawerWsPage - 1) * drawerWsPerPage, drawerWsPage * drawerWsPerPage);

  const drawerPanel = selectedAgent ? (
    <DrawerPanelContent defaultSize="400px" style={{ display: 'flex', flexDirection: 'column' }}>
      <DrawerHead>
        <Title headingLevel="h2" size="lg">{selectedAgent.name}</Title>
        <DrawerActions>
          <Dropdown
            isOpen={drawerKebabOpen}
            onOpenChange={setDrawerKebabOpen}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle ref={toggleRef} variant="plain" aria-label="Agent actions" onClick={() => setDrawerKebabOpen(!drawerKebabOpen)}>
                <EllipsisVIcon />
              </MenuToggle>
            )}
            popperProps={{ position: 'right' }}
          >
            <DropdownList>
              <DropdownItem onClick={() => setDrawerKebabOpen(false)}>Edit</DropdownItem>
              <DropdownItem onClick={() => setDrawerKebabOpen(false)}>Remove</DropdownItem>
            </DropdownList>
          </Dropdown>
          <DrawerCloseButton onClick={onCloseDrawer} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody>
        <Tabs activeKey={drawerTabKey} onSelect={(_e, key) => { setDrawerTabKey(key as number); setDrawerWsPage(1); }}>
          <Tab eventKey={0} title={<TabTitleText>Workspaces</TabTitleText>}>
            <div style={{ padding: '16px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8, paddingRight: 4 }}>
                <Pagination
                  isCompact
                  itemCount={drawerWorkspaces.length}
                  perPage={drawerWsPerPage}
                  page={drawerWsPage}
                  onSetPage={(_, p) => setDrawerWsPage(p)}
                  onPerPageSelect={() => {}}
                  variant="top"
                />
              </div>
              <Table aria-label="Agent workspace access" variant="compact">
                <Thead>
                  <Tr>
                    <Th>Workspace</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {drawerWsPageRows.map((ws, i) => (
                    <Tr key={i}>
                      <Td>
                        <Button
                          variant="link"
                          isInline
                          onClick={() => {
                            onCloseDrawer();
                            navigate(`/workspaces/${workspaceSlugMap[ws] || ws.toLowerCase().replace(/\s+/g, '-')}`);
                          }}
                        >
                          {ws}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>
      </DrawerContentBody>
    </DrawerPanelContent>
  ) : undefined;

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

      <Modal
        isOpen={isModalOpen}
        onClose={onCancelToggle}
        variant="small"
        aria-label="Confirm inherit access toggle"
      >
        <ModalHeader title={`${pendingAgent?.inheritAccess ? 'Disable' : 'Enable'} inherit user's access`} />
        <ModalBody>
          Are you sure you want to {pendingAgent?.inheritAccess ? 'disable' : 'enable'} inherit user&apos;s access for <strong>{pendingAgent?.name}</strong>?{' '}
          {pendingAgent?.inheritAccess
            ? 'Once confirmed, you will need to re-configure the access permissions for this agent.'
            : 'Once confirmed, the current access configuration will be overridden and this agent will inherit the user\'s access instead.'
          }
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={onConfirmToggle}>Confirm</Button>
          <Button variant="link" onClick={onCancelToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>

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
        <Drawer isExpanded={isDrawerOpen}>
          <DrawerContent panelContent={drawerPanel}>
            <DrawerContentBody>
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
                    <Th width={35} {...getSortParams(1)}>Description</Th>
                    <Th width={15}>Inherit user's access</Th>
                    <Th width={15} {...getSortParams(2)}>Last release</Th>
                    <Th width={10}><span style={{ visibility: 'hidden' }}>Actions</span></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pageRows.map(r => (
                    <Tr
                      key={r.id}
                      isClickable
                      isRowSelected={selectedAgent?.id === r.id}
                      onRowClick={() => onAgentRowClick(r)}
                    >
                      <Td>{r.name}</Td>
                      <Td>{r.description || <span style={{ color: '#6a6e73' }}>&mdash;</span>}</Td>
                      <Td onClick={(e) => e.stopPropagation()}>
                        <Switch
                          id={`inherit-access-${r.id}`}
                          aria-label={`Inherit user's access for ${r.name}`}
                          isChecked={r.inheritAccess}
                          onChange={() => onToggleClick(r.id)}
                        />
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
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </>
  );
};

export { AIAgents };

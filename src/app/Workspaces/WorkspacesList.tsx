import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Content,
  DatePicker,
  FormGroup,
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  PageSection,
  Popover,
  Radio,
  Tab,
  Tabs,
  TabTitleText,
  TextInput,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Pagination,
  Wizard,
  WizardStep,
  WizardHeader,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ThProps, TreeRowWrapper, ExpandableRowContent } from '@patternfly/react-table';
import { EllipsisVIcon, AngleRightIcon, AngleDownIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';
import { allRoles as sharedRoles } from '@app/utils/rolesData';

type WorkspaceNode = {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentId?: string;
  level: number;
};

const allWorkspaces: WorkspaceNode[] = [
  { id: 'uxd', slug: 'uxd', name: 'Pinnacle Corp', description: 'This is the root workspace.', level: 0 },
  { id: 'ws-default', slug: 'workspace-default', name: 'Workspace default', description: 'This is a description of Workspace default.', parentId: 'uxd', level: 1 },
  { id: 'ws-ungrouped', slug: 'workspace-ungrouped-hosts', name: 'Workspace Ungrouped Hosts', description: 'Where ungrouped systems will go.', parentId: 'ws-default', level: 2 },
  { id: 'ws-a', slug: 'workspace-a', name: 'Production', description: 'Workspace consisted of systems in the production environment.', parentId: 'ws-default', level: 2 },
  { id: 'ws-b', slug: 'workspace-b', name: 'Sandbox', description: 'Workspace consisted of systems in the sandbox environment.', parentId: 'ws-default', level: 2 },
  { id: 'ws-c', slug: 'workspace-c', name: 'Preview', description: 'Workspace consisted of systems in the preview environment.', parentId: 'ws-default', level: 2 },
];

const WorkspacesList: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [topTab, setTopTab] = React.useState<string | number>(0);
  const [searchValue, setSearchValue] = React.useState('');
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(['uxd', 'ws-default']));
  const [openKebab, setOpenKebab] = React.useState<string | null>(null);

  // Request access wizard state
  const [isRequestWizardOpen, setIsRequestWizardOpen] = React.useState(false);
  const [requestWhere, setRequestWhere] = React.useState<'within' | 'outside' | null>(null);
  const [isPermanent, setIsPermanent] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [selectedTrustedOrg, setSelectedTrustedOrg] = React.useState<string | null>(null);
  const [isTrustedOrgDropdownOpen, setIsTrustedOrgDropdownOpen] = React.useState(false);
  const [requestRoleFilter, setRequestRoleFilter] = React.useState('');
  const [selectedRequestRoles, setSelectedRequestRoles] = React.useState<Set<string>>(new Set());
  const [requestRolesPage, setRequestRolesPage] = React.useState(1);
  const [requestRolesPerPage, setRequestRolesPerPage] = React.useState(10);

  const myOrgName = 'Pinnacle Corp';
  const trustedOrgNames = ['Initech', 'Soylent', 'Acme Corp', 'Stark Industries', 'Massive Dynamic', 'Dunder Mifflin'];

  const [sharedSearch, setSharedSearch] = React.useState('');
  const [sharedView, setSharedView] = React.useState<'list' | 'byOrg'>('list');
  const [expandedOrgs, setExpandedOrgs] = React.useState<Set<string>>(new Set());
  const [sharedSortIndex, setSharedSortIndex] = React.useState<number>(3);
  const [sharedSortDirection, setSharedSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const sharedSortableColumns = ['name', 'organization', 'roles', 'sharedDate'] as const;
  const getSharedSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: { index: sharedSortIndex, direction: sharedSortDirection },
    onSort: (_event, index, direction) => {
      setSharedSortIndex(index);
      setSharedSortDirection(direction);
    },
    columnIndex,
  });

  const [orgSortIndex, setOrgSortIndex] = React.useState<number>(2);
  const [orgSortDirection, setOrgSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const getOrgSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: { index: orgSortIndex, direction: orgSortDirection },
    onSort: (_event, index, direction) => {
      setOrgSortIndex(index);
      setOrgSortDirection(direction);
    },
    columnIndex,
  });

  const toggleOrgExpand = (org: string) => {
    setExpandedOrgs(prev => {
      const next = new Set(prev);
      if (next.has(org)) next.delete(org); else next.add(org);
      return next;
    });
  };

  // Shared workspaces data
  type SharedWorkspace = {
    name: string;
    organization: string;
    roles: { name: string; description: string; permissions: number }[];
    sharedDate: string;
  };
  const sharedWorkspaces: SharedWorkspace[] = [
    {
      name: 'Production', organization: 'Initech', sharedDate: '2025-09-12',
      roles: [
        { name: 'Viewer', description: 'Read-only access to workspace resources', permissions: 3 },
        { name: 'Operator', description: 'Manage day-to-day operations within the workspace', permissions: 8 },
      ],
    },
    {
      name: 'QA Environment', organization: 'Initech', sharedDate: '2025-08-20',
      roles: [
        { name: 'Editor', description: 'Create, edit, and delete resources in the workspace', permissions: 10 },
      ],
    },
    {
      name: 'Staging', organization: 'Acme Corp', sharedDate: '2025-09-01',
      roles: [
        { name: 'Viewer', description: 'Read-only access to workspace resources', permissions: 3 },
      ],
    },
    {
      name: 'CI/CD Pipeline', organization: 'Acme Corp', sharedDate: '2025-07-15',
      roles: [
        { name: 'Operator', description: 'Manage day-to-day operations within the workspace', permissions: 8 },
        { name: 'Viewer', description: 'Read-only access to workspace resources', permissions: 3 },
      ],
    },
    {
      name: 'Sandbox', organization: 'Acme Corp', sharedDate: '2025-06-28',
      roles: [
        { name: 'Administrator', description: 'Full administrative access to the workspace', permissions: 15 },
      ],
    },
    {
      name: 'Development', organization: 'Dunder Mifflin', sharedDate: '2025-06-10',
      roles: [
        { name: 'Administrator', description: 'Full administrative access to the workspace', permissions: 15 },
        { name: 'Editor', description: 'Create, edit, and delete resources in the workspace', permissions: 10 },
        { name: 'Viewer', description: 'Read-only access to workspace resources', permissions: 3 },
      ],
    },
    {
      name: 'Demo', organization: 'Dunder Mifflin', sharedDate: '2025-05-22',
      roles: [
        { name: 'Viewer', description: 'Read-only access to workspace resources', permissions: 3 },
      ],
    },
  ];

  // Drawer state for shared workspace roles
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerWorkspace, setDrawerWorkspace] = React.useState<SharedWorkspace | null>(null);

  const openRolesDrawer = (ws: SharedWorkspace) => {
    setDrawerWorkspace(ws);
    setDrawerOpen(true);
  };

  // Toast state
  const [toasts, setToasts] = React.useState<{ key: number; title: string }[]>([]);
  const addToast = (title: string) => {
    const key = Date.now();
    setToasts(prev => [...prev, { key, title }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.key !== key)), 5000);
  };
  const removeToast = (key: number) => setToasts(prev => prev.filter(t => t.key !== key));

  const requestFilteredRoles = React.useMemo(
    () => sharedRoles.filter(r => r.name.toLowerCase().includes(requestRoleFilter.trim().toLowerCase())),
    [requestRoleFilter]
  );
  const requestRolesStart = (requestRolesPage - 1) * requestRolesPerPage;
  const requestRolesPageRows = requestFilteredRoles.slice(requestRolesStart, requestRolesStart + requestRolesPerPage);
  const requestRolesAllSelected = requestFilteredRoles.length > 0 && requestFilteredRoles.every(r => selectedRequestRoles.has(r.name));

  const onToggleAllRequestRoles = (checked: boolean) => {
    if (checked) setSelectedRequestRoles(new Set(requestFilteredRoles.map(r => r.name)));
    else setSelectedRequestRoles(new Set());
  };
  const onToggleRequestRoleRow = (name: string, checked: boolean) => {
    setSelectedRequestRoles(prev => {
      const next = new Set(prev);
      if (checked) next.add(name); else next.delete(name);
      return next;
    });
  };

  const openRequestWizard = () => {
    setRequestWhere(null);
    setIsPermanent(false);
    setStartDate('');
    setEndDate('');
    setSelectedTrustedOrg(null);
    setRequestRoleFilter('');
    setSelectedRequestRoles(new Set());
    setRequestRolesPage(1);
    setIsRequestWizardOpen(true);
  };

  const getChildren = (id: string) => allWorkspaces.filter((w) => w.parentId === id);
  const hasChildren = (id: string) => allWorkspaces.some((w) => w.parentId === id);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isVisible = (node: WorkspaceNode): boolean => {
    if (!node.parentId) return true;
    if (!expanded.has(node.parentId)) return false;
    const parent = allWorkspaces.find((w) => w.id === node.parentId);
    return parent ? isVisible(parent) : true;
  };

  const visibleWorkspaces = allWorkspaces.filter((w) => {
    if (!isVisible(w)) return false;
    if (searchValue.trim()) {
      return w.name.toLowerCase().includes(searchValue.trim().toLowerCase());
    }
    return true;
  });

  const handleWorkspaceClick = (ws: WorkspaceNode) => {
    navigate(`/workspaces/${ws.slug}`);
  };

  return (
    <>
      <AlertGroup isToast isLiveRegion>
        {toasts.map(t => (
          <Alert key={t.key} variant="success" title={t.title} actionClose={<AlertActionCloseButton onClose={() => removeToast(t.key)} />} />
        ))}
      </AlertGroup>

      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem>User Access</BreadcrumbItem>
          <BreadcrumbItem isActive>Workspaces</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title headingLevel="h1" size="2xl">Workspaces</Title>
            <Content>
              <p>
                Workspaces provide a flexible, hierarchical, approach to organizing your assets and streamlining access management. Configure workspaces to fit your organizational structure.
              </p>
              <p><a href="#">Learn more about workspaces <span style={{ fontSize: '0.75em' }}>↗</span></a></p>
            </Content>
          </div>
          <Button variant="secondary" style={{ marginRight: 16 }} onClick={openRequestWizard}>Request access</Button>
        </div>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Tabs activeKey={topTab} onSelect={(_e, key) => setTopTab(key)} usePageInsets>
          <Tab eventKey={0} title={<TabTitleText>Owned by my organization</TabTitleText>}>
            <PageSection hasBodyWrapper={false} isFilled>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <SearchInput
                      aria-label="Find by name"
                      placeholder="Find by name"
                      value={searchValue}
                      onChange={(_e, value) => setSearchValue(value)}
                      onClear={() => setSearchValue('')}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="primary">Create workspace</Button>
                  </ToolbarItem>
                  <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                    <Pagination
                      itemCount={allWorkspaces.length}
                      perPage={10}
                      page={1}
                      onSetPage={() => {}}
                      onPerPageSelect={() => {}}
                      isCompact
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              <Table aria-label="Workspaces table" isTreeTable>
                <Thead>
                  <Tr>
                    <Th width={40}>Name</Th>
                    <Th>Description</Th>
                    <Th aria-label="Row actions" />
                  </Tr>
                </Thead>
                <Tbody>
                  {visibleWorkspaces.map((ws) => {
                    const isExpandable = hasChildren(ws.id);
                    const isExpanded = expanded.has(ws.id);
                    const paddingLeft = ws.level * 40 + 16;

                    return (
                      <Tr key={ws.id}>
                        <Td dataLabel="Name" style={{ paddingLeft }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            {isExpandable ? (
                              <Button
                                variant="plain"
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                                onClick={() => toggleExpand(ws.id)}
                                style={{ padding: 0 }}
                              >
                                {isExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                              </Button>
                            ) : (
                              <span style={{ width: 24 }} />
                            )}
                            <Button variant="link" isInline onClick={() => handleWorkspaceClick(ws)}>
                              {ws.name}
                            </Button>
                          </span>
                        </Td>
                        <Td dataLabel="Description">{ws.description}</Td>
                        <Td isActionCell>
                          <Dropdown
                            isOpen={openKebab === ws.id}
                            onSelect={() => setOpenKebab(null)}
                            onOpenChange={(isOpen) => setOpenKebab(isOpen ? ws.id : null)}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                aria-label={`Actions for ${ws.name}`}
                                variant="plain"
                                onClick={() => setOpenKebab(openKebab === ws.id ? null : ws.id)}
                                isExpanded={openKebab === ws.id}
                              >
                                <EllipsisVIcon />
                              </MenuToggle>
                            )}
                            popperProps={{ position: 'right' }}
                          >
                            <DropdownList>
                              <DropdownItem>Edit</DropdownItem>
                              <DropdownItem>Move workspace</DropdownItem>
                              <DropdownItem onClick={() => navigate(`/workspaces/${ws.slug}?grantAccess=true`)}>Grant access</DropdownItem>
                              <DropdownItem>Create subworkspace</DropdownItem>
                              <DropdownItem style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>Delete</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Shared with me</TabTitleText>}>
            <Drawer isExpanded={drawerOpen} onExpand={() => {}} style={{ minHeight: 'calc(100vh - 200px)' }}>
              <DrawerContent
                panelContent={
                  drawerWorkspace ? (
                    <DrawerPanelContent widths={{ default: 'width_33' }}>
                      <DrawerHead>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                          <Title headingLevel="h3" size="lg">{drawerWorkspace.name}</Title>
                          <DrawerActions>
                            <DrawerCloseButton onClick={() => setDrawerOpen(false)} />
                          </DrawerActions>
                        </div>
                      </DrawerHead>
                      <div style={{ padding: '0 24px 24px' }}>
                        <Title headingLevel="h4" size="md" style={{ marginBottom: 8 }}>Roles</Title>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <Pagination
                            itemCount={drawerWorkspace.roles.length}
                            perPage={10}
                            page={1}
                            onSetPage={() => {}}
                            onPerPageSelect={() => {}}
                            isCompact
                          />
                        </div>
                        {drawerWorkspace.roles.map((role) => (
                          <div key={role.name} style={{ padding: '8px 0', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                            <Button variant="link" isInline>{role.name}</Button>
                          </div>
                        ))}
                      </div>
                    </DrawerPanelContent>
                  ) : undefined
                }
              >
                <DrawerContentBody>
                  <PageSection hasBodyWrapper={false} isFilled>
                    <Toolbar>
                      <ToolbarContent>
                        <ToolbarItem>
                          <SearchInput
                            aria-label="Filter by name"
                            placeholder="Filter by name"
                            value={sharedSearch}
                            onChange={(_e, value) => setSharedSearch(value)}
                            onClear={() => setSharedSearch('')}
                          />
                        </ToolbarItem>
                        <ToolbarItem>
                          <ToggleGroup>
                            <ToggleGroupItem
                              key="list"
                              text="List"
                              isSelected={sharedView === 'list'}
                              onChange={() => setSharedView('list')}
                            />
                            <ToggleGroupItem
                              key="byOrg"
                              text="By organization"
                              isSelected={sharedView === 'byOrg'}
                              onChange={() => setSharedView('byOrg')}
                            />
                          </ToggleGroup>
                        </ToolbarItem>
                        <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                          <Pagination
                            itemCount={sharedWorkspaces.filter(ws => !sharedSearch.trim() || ws.name.toLowerCase().includes(sharedSearch.trim().toLowerCase()) || ws.organization.toLowerCase().includes(sharedSearch.trim().toLowerCase())).length}
                            perPage={10}
                            page={1}
                            onSetPage={() => {}}
                            onPerPageSelect={() => {}}
                            isCompact
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>

                    {sharedView === 'list' ? (
                      <Table aria-label="Shared workspaces table">
                        <Thead>
                          <Tr>
                            <Th sort={getSharedSortParams(0)} width={30}>Workspace name</Th>
                            <Th sort={getSharedSortParams(1)} width={30}>Organization</Th>
                            <Th width={20}>Roles</Th>
                            <Th sort={getSharedSortParams(3)} width={20}>Shared date</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {sharedWorkspaces.filter(ws => !sharedSearch.trim() || ws.name.toLowerCase().includes(sharedSearch.trim().toLowerCase()) || ws.organization.toLowerCase().includes(sharedSearch.trim().toLowerCase())).sort((a, b) => {
                            const key = sharedSortableColumns[sharedSortIndex];
                            const aVal = key === 'roles' ? a.roles.length : a[key];
                            const bVal = key === 'roles' ? b.roles.length : b[key];
                            const cmp = typeof aVal === 'number' && typeof bVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
                            return sharedSortDirection === 'asc' ? cmp : -cmp;
                          }).map((ws) => (
                            <Tr key={`${ws.name}-${ws.organization}`}>
                              <Td dataLabel="Workspace name">{ws.name}</Td>
                              <Td dataLabel="Organization">{ws.organization}</Td>
                              <Td dataLabel="Roles">
                                <Button variant="link" isInline onClick={() => openRolesDrawer(ws)}>
                                  {ws.roles.length}
                                </Button>
                              </Td>
                              <Td dataLabel="Shared date">{ws.sharedDate}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    ) : (
                      (() => {
                        const filtered = sharedWorkspaces.filter(ws => !sharedSearch.trim() || ws.name.toLowerCase().includes(sharedSearch.trim().toLowerCase()) || ws.organization.toLowerCase().includes(sharedSearch.trim().toLowerCase()));
                        const orgMap = new Map<string, SharedWorkspace[]>();
                        filtered.forEach(ws => {
                          if (!orgMap.has(ws.organization)) orgMap.set(ws.organization, []);
                          orgMap.get(ws.organization)!.push(ws);
                        });
                        const orgEntries = Array.from(orgMap.entries());
                        orgEntries.sort((a, b) => {
                          let cmp = 0;
                          if (orgSortIndex === 0) {
                            cmp = a[0].localeCompare(b[0]);
                          } else if (orgSortIndex === 1) {
                            cmp = a[1].length - b[1].length;
                          } else {
                            const dateA = a[1].reduce((latest, ws) => ws.sharedDate > latest ? ws.sharedDate : latest, '');
                            const dateB = b[1].reduce((latest, ws) => ws.sharedDate > latest ? ws.sharedDate : latest, '');
                            cmp = dateA.localeCompare(dateB);
                          }
                          return orgSortDirection === 'asc' ? cmp : -cmp;
                        });
                        return (
                          <Table aria-label="Shared workspaces by organization">
                            <Thead>
                              <Tr>
                                <Th />
                                <Th sort={getOrgSortParams(0)} width={40}>Organization</Th>
                                <Th sort={getOrgSortParams(1)} width={25}>Workspaces</Th>
                                <Th sort={getOrgSortParams(2)} width={25}>Last shared date</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {orgEntries.map(([org, workspaces], idx) => {
                                const isExpanded = expandedOrgs.has(org);
                                const latestDate = workspaces.reduce((latest, ws) => ws.sharedDate > latest ? ws.sharedDate : latest, '');
                                return (
                                  <React.Fragment key={org}>
                                    <Tr>
                                      <Td
                                        expand={{
                                          rowIndex: idx,
                                          isExpanded,
                                          onToggle: () => toggleOrgExpand(org),
                                        }}
                                      />
                                      <Td dataLabel="Organization">{org}</Td>
                                      <Td dataLabel="Workspaces">{workspaces.length}</Td>
                                      <Td dataLabel="Last shared date">{latestDate}</Td>
                                    </Tr>
                                    <Tr isExpanded={isExpanded}>
                                      <Td />
                                      <Td colSpan={3} noPadding>
                                        <ExpandableRowContent>
                                          <Table aria-label={`Workspaces from ${org}`} variant="compact" borders={false}>
                                            <Thead>
                                              <Tr>
                                                <Th style={{ width: '44.44%' }}>Workspace name</Th>
                                                <Th style={{ width: '27.78%' }}>Roles</Th>
                                                <Th style={{ width: '27.78%' }}>Shared date</Th>
                                              </Tr>
                                            </Thead>
                                            <Tbody>
                                              {workspaces.map(ws => (
                                                <Tr key={ws.name}>
                                                  <Td dataLabel="Workspace name">{ws.name}</Td>
                                                  <Td dataLabel="Roles">
                                                    <Button variant="link" isInline onClick={() => openRolesDrawer(ws)}>
                                                      {ws.roles.length}
                                                    </Button>
                                                  </Td>
                                                  <Td dataLabel="Shared date">{ws.sharedDate}</Td>
                                                </Tr>
                                              ))}
                                            </Tbody>
                                          </Table>
                                        </ExpandableRowContent>
                                      </Td>
                                    </Tr>
                                  </React.Fragment>
                                );
                              })}
                            </Tbody>
                          </Table>
                        );
                      })()
                    )}
                  </PageSection>
                </DrawerContentBody>
              </DrawerContent>
            </Drawer>
          </Tab>
        </Tabs>
      </PageSection>

      {isRequestWizardOpen && (
        <Modal isOpen onClose={() => setIsRequestWizardOpen(false)} variant="large" aria-label="Request access wizard" className="trusted-wizard-modal">
          <Wizard
            onClose={() => setIsRequestWizardOpen(false)}
            onSave={() => {
              setIsRequestWizardOpen(false);
              addToast('Your access request has been submitted successfully.');
            }}
            header={
              <WizardHeader
                title="Request access"
                description="Submit a request for workspace access."
                onClose={() => setIsRequestWizardOpen(false)}
              />
            }
            startIndex={1}
          >
            <WizardStep
              id="request-step-1"
              name="Where are you requesting access?"
              footer={{ isBackHidden: true, isNextDisabled: requestWhere === null || (requestWhere === 'outside' && !selectedTrustedOrg) || (!isPermanent && (!startDate || !endDate)) }}
            >
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Where are you requesting access?</Title>
                <p style={{ marginTop: 8 }}>Select where you wish to request access.</p>
                <div style={{ marginTop: 16 }}>
                  <Radio
                    id="request-where-within"
                    name="request-where"
                    isChecked={requestWhere === 'within'}
                    onChange={() => { setRequestWhere('within'); setSelectedTrustedOrg(null); }}
                    label={`Within ${myOrgName} organization`}
                  />
                  <Radio
                    id="request-where-outside"
                    name="request-where"
                    isChecked={requestWhere === 'outside'}
                    onChange={() => setRequestWhere('outside')}
                    label="Outside of this organization"
                    style={{ marginTop: 0 }}
                  />
                </div>

                <div style={{ marginTop: 16 }}>
                  <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>Select a trusted organization</Title>
                  <div style={{ marginTop: 8 }}>
                    <Dropdown
                      isOpen={isTrustedOrgDropdownOpen}
                      onOpenChange={setIsTrustedOrgDropdownOpen}
                      onSelect={(_e, itemId) => {
                        const name = String(itemId ?? '');
                        if (name) setSelectedTrustedOrg(name);
                        setIsTrustedOrgDropdownOpen(false);
                      }}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          isExpanded={isTrustedOrgDropdownOpen}
                          isDisabled={requestWhere !== 'outside'}
                          style={{ width: '100%', justifyContent: 'space-between' }}
                          onClick={() => requestWhere === 'outside' && setIsTrustedOrgDropdownOpen(prev => !prev)}
                        >
                          {selectedTrustedOrg || 'Choose an organization'}
                        </MenuToggle>
                      )}
                      popperProps={{ appendTo: () => document.body }}
                    >
                      <DropdownList>
                        {trustedOrgNames.map((name) => (
                          <DropdownItem key={name} itemId={name} isSelected={selectedTrustedOrg === name}>
                            {name}
                          </DropdownItem>
                        ))}
                      </DropdownList>
                    </Dropdown>
                  </div>
                  <p style={{ marginTop: 8, color: 'var(--pf-v6-global--palette--black-700)' }}>
                    Don&apos;t see the trusted org you need?{' '}
                    <a href="/organization/trusted-organizations">Check the pending trusted organization connection requests.</a>
                  </p>
                </div>

                <div style={{ marginTop: 24 }}>
                  <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>Access duration</Title>
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FormGroup label="Start date" fieldId="request-start-date">
                      <TextInput
                        id="request-start-date"
                        type="date"
                        value={startDate}
                        onChange={(_e, value) => setStartDate(value)}
                        isDisabled={isPermanent}
                      />
                    </FormGroup>
                    <span style={{ paddingTop: 20 }}>to</span>
                    <FormGroup label="End date" fieldId="request-end-date">
                      <TextInput
                        id="request-end-date"
                        type="date"
                        value={endDate}
                        onChange={(_e, value) => setEndDate(value)}
                        isDisabled={isPermanent}
                      />
                    </FormGroup>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Checkbox
                      id="request-permanent"
                      label="Permanent access"
                      isChecked={isPermanent}
                      onChange={(_e, checked) => setIsPermanent(checked)}
                    />
                  </div>
                </div>
              </div>
            </WizardStep>

            <WizardStep
              id="request-step-2"
              name="Select role(s)"
              isDisabled={requestWhere === null}
              footer={{ isNextDisabled: selectedRequestRoles.size === 0 }}
            >
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Select role(s)</Title>
                <p style={{ marginTop: 8 }}>Select one or more roles you want to request access to.</p>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <SearchInput
                    aria-label="Filter by role name"
                    placeholder="Filter by role name"
                    value={requestRoleFilter}
                    onChange={(_e, v) => setRequestRoleFilter(v)}
                    onClear={() => setRequestRoleFilter('')}
                  />
                  <Pagination
                    itemCount={requestFilteredRoles.length}
                    perPage={requestRolesPerPage}
                    page={requestRolesPage}
                    onSetPage={(_e, p) => setRequestRolesPage(p)}
                    onPerPageSelect={(_e, pp) => { setRequestRolesPerPage(pp); setRequestRolesPage(1); }}
                    variant="top"
                    isCompact
                    style={{ marginLeft: 'auto' }}
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <Table aria-label="Select roles table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox
                            id="request-roles-select-all"
                            aria-label="Select all roles"
                            isChecked={requestRolesAllSelected}
                            onChange={(_e, checked) => onToggleAllRequestRoles(!!checked)}
                          />
                        </Th>
                        <Th width={20}>Name</Th>
                        <Th width={50}>Description</Th>
                        <Th width={15}>Permissions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {requestRolesPageRows.map((role) => (
                        <Tr key={role.name} style={{ verticalAlign: 'middle' }}>
                          <Td>
                            <Checkbox
                              id={`request-role-${role.name}`}
                              aria-label={`Select ${role.name}`}
                              isChecked={selectedRequestRoles.has(role.name)}
                              onChange={(_e, checked) => onToggleRequestRoleRow(role.name, !!checked)}
                            />
                          </Td>
                          <Td>{role.name}</Td>
                          <Td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{role.description}</Td>
                          <Td>
                            <Popover
                              headerContent={`Permissions for ${role.name}`}
                              bodyContent={
                                <div>
                                  {role.permissionDetails.map((p, i) => (
                                    <div key={i} style={{ padding: '4px 0' }}>{p.application}:{p.resourceType}:{p.operation}</div>
                                  ))}
                                </div>
                              }
                            >
                              <Button variant="link" isInline>{role.permissions}</Button>
                            </Popover>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </WizardStep>

            <WizardStep
              id="request-step-3"
              name="Review"
              isDisabled={requestWhere === null || selectedRequestRoles.size === 0}
              footer={{ nextButtonText: 'Submit' }}
            >
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Review</Title>
                <p style={{ marginTop: 8 }}>Review your access request before submitting.</p>
                <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '200px 1fr', rowGap: 12 }}>
                  <div style={{ fontWeight: 700 }}>Requesting access</div>
                  <div>{requestWhere === 'outside' ? 'Outside of this organization' : `Within ${myOrgName} organization`}</div>
                  {requestWhere === 'outside' && selectedTrustedOrg && (
                    <>
                      <div style={{ fontWeight: 700 }}>Trusted organization</div>
                      <div>{selectedTrustedOrg}</div>
                    </>
                  )}
                  <div style={{ fontWeight: 700 }}>Access duration</div>
                  <div>{isPermanent ? 'Permanent' : `${startDate} to ${endDate}`}</div>
                  <div style={{ fontWeight: 700 }}>Role(s)</div>
                  <div>{Array.from(selectedRequestRoles).join(', ')}</div>
                </div>
              </div>
            </WizardStep>
          </Wizard>
        </Modal>
      )}
    </>
  );
};

export { WorkspacesList };

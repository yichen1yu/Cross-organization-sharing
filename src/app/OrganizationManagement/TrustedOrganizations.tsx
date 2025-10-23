import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  PageSection,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Pagination,
  Label,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Checkbox,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useLocation } from 'react-router-dom';
import { TreeView, TreeViewDataItem } from '@patternfly/react-core';
import { EllipsisVIcon, FilterIcon, CheckCircleIcon, ExclamationCircleIcon, SyncAltIcon, ExclamationTriangleIcon, BellIcon } from '@patternfly/react-icons';
import { Wizard, WizardStep, WizardHeader, Modal, Radio, TextInput, TextArea, AlertGroup, Alert, AlertActionCloseButton } from '@patternfly/react-core';

const TrustedOrganizations: React.FunctionComponent = () => {
  const location = useLocation();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  type TrustedOrg = {
    organizationName: string;
    orgId: string;
    status: 'Accepted' | 'Severed' | 'Acceptance pending' | 'Rejected';
    lastModified: string; // ISO-like string for simple lexicographic sort
  };

  const [textFilter, setTextFilter] = React.useState('');
  const [selectedFilterField, setSelectedFilterField] = React.useState<'Org ID' | 'Organization name'>('Org ID');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' | undefined }>({ index: 3, direction: 'desc' });
  const [openKebabKey, setOpenKebabKey] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [detailsKebabOpen, setDetailsKebabOpen] = React.useState(false);
  const [selectedOrg, setSelectedOrg] = React.useState<TrustedOrg | null>(null);
  const [detailsTabKey, setDetailsTabKey] = React.useState<string | number>(1); // default to User groups
  const [isPendingWizardOpen, setIsPendingWizardOpen] = React.useState(false);
  const [pendingWizardOrg, setPendingWizardOrg] = React.useState<TrustedOrg | null>(null);
  const [pendingRequesterName, setPendingRequesterName] = React.useState<string>('');
  const [pendingRequesterEmail, setPendingRequesterEmail] = React.useState<string>('');
  const [acceptChoice, setAcceptChoice] = React.useState<'accept' | 'reject' | null>(null);
  const [verifyEmail, setVerifyEmail] = React.useState<string>('');
  const [configureChoice, setConfigureChoice] = React.useState<'yes' | 'no' | null>(null);
  const [requestTrustedChoice, setRequestTrustedChoice] = React.useState<'yes' | 'no' | null>(null);
  const [requestDescription, setRequestDescription] = React.useState<string>('');
  const [isRemoveModalOpen, setIsRemoveModalOpen] = React.useState(false);
  const [removeTargetOrg, setRemoveTargetOrg] = React.useState<TrustedOrg | null>(null);
  const [removeSource, setRemoveSource] = React.useState<'outgoing' | 'incoming' | null>(null);

  // Auto-close side panel when navigating or switching tabs
  React.useEffect(() => {
    if (isDetailsOpen) {
      setIsDetailsOpen(false);
      setDetailsKebabOpen(false);
    }
  }, [location.pathname, activeTabKey]);
  const [toasts, setToasts] = React.useState<Array<{ key: number; title: string; description?: React.ReactNode; variant?: 'success' | 'info' | 'warning' | 'danger' }>>([]);
  const addToast = (title: string, description?: React.ReactNode, variant: 'success' | 'info' | 'warning' | 'danger' = 'success') =>
    setToasts((prev) => [...prev, { key: Date.now(), title, description, variant }]);
  const removeToast = (key: number) => setToasts((prev) => prev.filter((t) => t.key !== key));
  // Workspaces tree (simple 2-level + one grandchild example)
  type WorkspaceNode = { id: string; name: string; parentId?: string };
  const [workspaceNodes] = React.useState<WorkspaceNode[]>([
    { id: 'w1', name: 'Workspace 1' },
    { id: 'w1-1', name: 'Workspace 1-1', parentId: 'w1' },
    { id: 'w1-1-1', name: 'Workspace 1-1-1', parentId: 'w1-1' },
    { id: 'w1-2', name: 'Workspace 1-2', parentId: 'w1' },
    { id: 'w2', name: 'Workspace 2' },
    { id: 'w2-1', name: 'Workspace 2-1', parentId: 'w2' },
    { id: 'w2-2', name: 'Workspace 2-2', parentId: 'w2' },
    { id: 'w3', name: 'Workspace 3' },
    { id: 'w3-1', name: 'Workspace 3-1', parentId: 'w3' },
    { id: 'w3-1-1', name: 'Workspace 3-1-1', parentId: 'w3-1' },
    { id: 'w3-2', name: 'Workspace 3-2', parentId: 'w3' },
    { id: 'w4', name: 'Workspace 4' },
    { id: 'w4-1', name: 'Workspace 4-1', parentId: 'w4' },
    { id: 'w4-1-1', name: 'Workspace 4-1-1', parentId: 'w4-1' },
    { id: 'w4-2', name: 'Workspace 4-2', parentId: 'w4' },
  ]);
  const [expandedWorkspaces, setExpandedWorkspaces] = React.useState<Set<string>>(new Set());
  const [selectedWorkspaces, setSelectedWorkspaces] = React.useState<Set<string>>(() => new Set(workspaceNodes.map((n) => n.id)));
  const [originalSelectedWorkspaces, setOriginalSelectedWorkspaces] = React.useState<Set<string>>(new Set());

  const toggleExpandWorkspace = (id: string) => {
    setExpandedWorkspaces((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const getChildren = (id: string) => workspaceNodes.filter((n) => n.parentId === id).map((n) => n.id);
  const getDescendants = (id: string): string[] => getChildren(id).flatMap((cid) => [cid, ...getDescendants(cid)]);
  const getParent = (id: string) => workspaceNodes.find((n) => n.id === id)?.parentId;
  const getAncestors = (id: string): string[] => {
    const p = getParent(id);
    return p ? [p, ...getAncestors(p)] : [];
  };
  const toggleSelectWorkspace = (id: string, checked: boolean) => {
    setSelectedWorkspaces((prev) => {
      const next = new Set(prev);
      const all = [id, ...getDescendants(id)];
      if (checked) {
        all.forEach((nid) => next.add(nid));
      } else {
        all.forEach((nid) => next.delete(nid));
      }
      return next;
    });
  };
  const isVisible = (node: WorkspaceNode): boolean => {
    if (!node.parentId) return true;
    if (!expandedWorkspaces.has(node.parentId)) return false;
    const parent = workspaceNodes.find((n) => n.id === node.parentId);
    return parent ? isVisible(parent) : true;
  };
  // Wizard uses internal navigation; no custom index needed

  const generateRandomRequester = React.useCallback((org: TrustedOrg) => {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Jamie'];
    const lastNames = ['Smith', 'Johnson', 'Lee', 'Brown', 'Garcia', 'Williams', 'Miller', 'Davis'];
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${first} ${last}`;
    const domain = (org.organizationName || 'example')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 24);
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@${domain || 'org'}.com`;
    return { fullName, email };
  }, []);

  type GroupRow = { id: string; name: string; members: number; };
  const [groupRows, setGroupRows] = React.useState<GroupRow[]>([
    { id: 'all-users', name: 'All users', members: 11 },
    { id: 'administrators', name: 'Administrators', members: 3 },
    { id: 'powerpuff-girls', name: 'Powerpuff Girs', members: 5 },
    { id: 'spice-girls', name: 'Spice Girls', members: 7 },
    { id: 'golden-girls', name: 'Golden Girls', members: 2 },
    { id: 'seattle-grace-admins', name: 'Seattle Grace admins', members: 1 },
  ]);
  const [selectedGroups, setSelectedGroups] = React.useState<Set<string>>(new Set(groupRows.map((g) => g.id)));
  const [originalSelectedGroups, setOriginalSelectedGroups] = React.useState<Set<string>>(new Set(selectedGroups));

  // Utility to generate pseudo-random groups based on org id
  const generateGroupsForOrg = React.useCallback((org: TrustedOrg): GroupRow[] => {
    const seeds = [
      ['All users', 'Core admins', 'Developers', 'QA team', 'Finance', 'HR'],
      ['All members', 'Operators', 'Site Reliability', 'Security', 'Platform', 'Data science'],
      ['Everyone', 'Admins', 'Read-only', 'Product', 'Marketing', 'Sales'],
      ['Contributors', 'Maintainers', 'Owners', 'Partners', 'Guests', 'Support'],
    ];
    const memberRanges = [1, 3, 5, 7, 9, 11];
    // Basic hash from orgId to pick a seed set
    const orgIdStr = String(org.orgId);
    let hash = 0;
    for (let i = 0; i < orgIdStr.length; i++) {
      hash += orgIdStr.charCodeAt(i);
    }
    const setIdx = hash % seeds.length;
    const base = seeds[setIdx];
    const rows = base.map((name, idx) => ({
      id: `${orgIdStr}-${idx}`,
      name,
      members: memberRanges[(hash + idx * 3) % memberRanges.length],
    }));
    return rows;
  }, []);

  // Workspace rows for the Outgoing drawer Workspaces tab (compact table with selection)
  type WorkspaceTableRow = { id: string; name: string; members: number };
  const [workspaceTableRows, setWorkspaceTableRows] = React.useState<WorkspaceTableRow[]>([]);
  const [selectedWorkspaceRows, setSelectedWorkspaceRows] = React.useState<Set<string>>(new Set());
  const generateWorkspaceRowsForOrg = React.useCallback((org: TrustedOrg): WorkspaceTableRow[] => {
    // Use the root workspaces as rows and seed a member count based on org id
    const roots = workspaceNodes.filter((n) => !n.parentId);
    const orgIdStr = String(org.orgId);
    let hash = 0; for (let i = 0; i < orgIdStr.length; i++) hash += orgIdStr.charCodeAt(i);
    return roots.map((root, idx) => ({
      id: `${root.id}`,
      name: root.name,
      members: (hash + idx * 7) % 20 + 1
    }));
  }, [workspaceNodes]);
  const onToggleAllWorkspaceRows = (checked: boolean) => {
    if (checked) setSelectedWorkspaceRows(new Set(workspaceTableRows.map(w => w.id)));
    else setSelectedWorkspaceRows(new Set());
  };
  const onToggleWorkspaceRow = (rowId: string, checked: boolean) => {
    setSelectedWorkspaceRows((prev) => {
      const next = new Set(prev);
      if (checked) next.add(rowId); else next.delete(rowId);
      return next;
    });
  };

  // (Removed workspace-specific save tracking per user request)

  const isDirty = React.useMemo(() => {
    if (originalSelectedGroups.size !== selectedGroups.size) return true;
    for (const id of originalSelectedGroups) {
      if (!selectedGroups.has(id)) return true;
    }
    if (originalSelectedWorkspaces.size !== selectedWorkspaces.size) return true;
    for (const id of originalSelectedWorkspaces) {
      if (!selectedWorkspaces.has(id)) return true;
    }
    return false;
  }, [originalSelectedGroups, selectedGroups, originalSelectedWorkspaces, selectedWorkspaces]);

  const [outgoingData, setOutgoingData] = React.useState<TrustedOrg[]>([
    { organizationName: 'Acme Corp', orgId: '100001', status: 'Accepted', lastModified: '2025-09-01' },
    { organizationName: 'Globex', orgId: '200045', status: 'Acceptance pending', lastModified: '2025-08-22' },
    { organizationName: 'Initech', orgId: '300123', status: 'Accepted', lastModified: '2025-09-12' },
    { organizationName: 'Umbrella', orgId: '400789', status: 'Severed', lastModified: '2025-07-19' },
    { organizationName: 'Soylent', orgId: '500567', status: 'Accepted', lastModified: '2025-09-05' },
  ]);

  // Create incoming data: half same as outgoing, half different names with different IDs
  const [incomingData, setIncomingData] = React.useState<TrustedOrg[]>(() => {
    const sameCount = Math.floor(outgoingData.length / 2);
    const same = outgoingData.slice(0, sameCount);

    const candidateNames = [
      'Stark Industries',
      'Wonka Factory',
      'Hooli',
      'Pied Piper',
      'Vehement Capital Partners',
      'Massive Dynamic',
      'Tyrell Corporation',
      'Vandelay Industries',
      'Dunder Mifflin',
      'Oscorp',
    ];

    const existingNames = new Set(outgoingData.map((o) => o.organizationName));
    const uniqueNames = candidateNames.filter((n) => !existingNames.has(n));

    function randomId(): string {
      // ensure 6-digit style IDs not colliding with outgoing
      let id = '';
      do {
        id = String(Math.floor(100000 + Math.random() * 900000));
      } while (outgoingData.some((o) => o.orgId === id));
      return id;
    }

    const statuses: TrustedOrg['status'][] = ['Accepted', 'Rejected', 'Acceptance pending'];
    function randomStatus(): TrustedOrg['status'] {
      return statuses[Math.floor(Math.random() * statuses.length)];
    }

    function randomDate(): string {
      const now = new Date('2025-09-15');
      const past = new Date('2025-06-01');
      const time = past.getTime() + Math.random() * (now.getTime() - past.getTime());
      const d = new Date(time);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${mm}-${dd}`;
    }

    const differentNeeded = outgoingData.length - sameCount;
    const generated: TrustedOrg[] = Array.from({ length: differentNeeded }).map((_, idx) => ({
      organizationName: uniqueNames[idx % uniqueNames.length] ?? `Org ${idx + 1}`,
      orgId: randomId(),
      status: randomStatus(),
      lastModified: randomDate(),
    }));

    // Assemble and enforce specific demo rules (e.g., Hooli should be Rejected, Stark remains Accepted)
    const result: TrustedOrg[] = [...same, ...generated];
    result.forEach((item) => {
      if (item.organizationName === 'Hooli') {
        item.status = 'Rejected';
      }
      if (item.organizationName === 'Stark Industries' && item.status === 'Rejected') {
        item.status = 'Accepted';
      }
    });
    // Remove only the Wonka Factory row as requested
    return result.filter((item) => item.organizationName !== 'Wonka Factory');
  });

  const filteredAndSortedData = React.useMemo(() => {
    const value = textFilter.trim().toLowerCase();
    const filtered = outgoingData.filter((row) => {
      if (!value) return true;
      if (selectedFilterField === 'Org ID') {
        return row.orgId.toLowerCase().includes(value);
      }
      return row.organizationName.toLowerCase().includes(value);
    });
    const sorted = [...filtered].sort((a, b) => {
      const dir = sortBy.direction === 'desc' ? -1 : 1;
      switch (sortBy.index) {
        case 0:
          return a.organizationName.localeCompare(b.organizationName) * dir;
        case 1:
          return a.orgId.localeCompare(b.orgId) * dir;
        case 2:
          return a.status.localeCompare(b.status) * dir;
        case 3:
          return a.lastModified.localeCompare(b.lastModified) * dir;
        default:
          return 0;
      }
    });
    return sorted;
  }, [outgoingData, textFilter, selectedFilterField, sortBy]);

  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredAndSortedData.slice(start, start + perPage);
  }, [filteredAndSortedData, page, perPage]);

  // Incoming page: apply same filter/sort/pagination but to incomingData
  const incomingFilteredAndSortedData = React.useMemo(() => {
    const value = textFilter.trim().toLowerCase();
    const filtered = incomingData.filter((row) => {
      if (!value) return true;
      if (selectedFilterField === 'Org ID') {
        return row.orgId.toLowerCase().includes(value);
      }
      return row.organizationName.toLowerCase().includes(value);
    });
    const sorted = [...filtered].sort((a, b) => {
      const dir = sortBy.direction === 'desc' ? -1 : 1;
      switch (sortBy.index) {
        case 0:
          return a.organizationName.localeCompare(b.organizationName) * dir;
        case 1:
          return a.orgId.localeCompare(b.orgId) * dir;
        case 2:
          return a.status.localeCompare(b.status) * dir;
        case 3:
          return a.lastModified.localeCompare(b.lastModified) * dir;
        default:
          return 0;
      }
    });
    return sorted;
  }, [incomingData, textFilter, selectedFilterField, sortBy]);

  const incomingPaginatedData = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return incomingFilteredAndSortedData.slice(start, start + perPage);
  }, [incomingFilteredAndSortedData, page, perPage]);

  const onSetPage = (_evt: React.SyntheticEvent, newPage: number) => setPage(newPage);
  const onPerPageSelect = (_evt: React.SyntheticEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  const onSort = (_event: React.SyntheticEvent, columnIndex: number, direction: 'asc' | 'desc') => {
    setSortBy({ index: columnIndex, direction });
  };

  const openPendingWizard = (org: TrustedOrg) => {
    setPendingWizardOrg(org);
    const gen = generateRandomRequester(org);
    setPendingRequesterName(gen.fullName);
    setPendingRequesterEmail(gen.email);
    // Initialize User groups data for this org in the wizard
    const rows = generateGroupsForOrg(org);
    setGroupRows(rows);
    const allSelected = new Set(rows.map((g) => g.id));
    setSelectedGroups(allSelected);
    setOriginalSelectedGroups(new Set(allSelected));
    // Reset wizard-specific state
    setAcceptChoice(null);
    setVerifyEmail('');
    setConfigureChoice(null);
    setRequestTrustedChoice(null);
    // Ensure any open menus are closed before opening modal to avoid aria-hidden focus trap
    setOpenKebabKey(null);
    window.setTimeout(() => setIsPendingWizardOpen(true), 100);
  };
  const closePendingWizard = () => {
    setIsPendingWizardOpen(false);
    setPendingWizardOrg(null);
  };

  const openDetails = (org: TrustedOrg) => {
    setSelectedOrg(org);
    // Generate groups unique to org
    const rows = generateGroupsForOrg(org);
    setGroupRows(rows);
    const allSelected = new Set(rows.map((g) => g.id));
    setSelectedGroups(allSelected);
    setOriginalSelectedGroups(new Set(allSelected));
    // Generate workspace rows for this org and select all by default
    const wRows = generateWorkspaceRowsForOrg(org);
    setWorkspaceTableRows(wRows);
    const allW = new Set(wRows.map(w => w.id));
    setSelectedWorkspaceRows(allW);
    // Baseline for TreeView workspaces equals current TreeView selection
    setOriginalSelectedWorkspaces(new Set(selectedWorkspaces));
    setIsDetailsOpen(true);
  };
  const closeDetails = () => {
    setIsDetailsOpen(false);
    setDetailsKebabOpen(false);
  };

  const onToggleAllGroups = (_checked: boolean) => {
    if (_checked) {
      const all = new Set(groupRows.map((g) => g.id));
      setSelectedGroups(all);
    } else {
      setSelectedGroups(new Set());
    }
  };

  const onToggleGroup = (groupId: string, checked: boolean) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(groupId);
      } else {
        next.delete(groupId);
      }
      return next;
    });
  };

  const onSaveGroups = () => {
    // Persist selection (mock)
    setOriginalSelectedGroups(new Set(selectedGroups));
    setOriginalSelectedWorkspaces(new Set(selectedWorkspaces));
  };

  // Derived state for group selection
  const areAllGroupsSelected = groupRows.length > 0 && selectedGroups.size === groupRows.length;
  const areSomeGroupsSelected = selectedGroups.size > 0 && selectedGroups.size < groupRows.length;
  const hasChanges = selectedGroups.size !== originalSelectedGroups.size || 
    ![...selectedGroups].every(id => originalSelectedGroups.has(id));

  const onSelectAllGroups = (isSelecting: boolean) => {
    if (isSelecting) {
      setSelectedGroups(new Set(groupRows.map(g => g.id)));
    } else {
      setSelectedGroups(new Set());
    }
  };

  // Lock background scroll when drawer is open
  React.useEffect(() => {
    if (isDetailsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDetailsOpen]);

  return (
    <>
      <AlertGroup isToast isLiveRegion aria-live="assertive" style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
        {toasts.map((t) => (
          <Alert
            key={t.key}
            variant={t.variant || 'success'}
            title={t.title}
            actionClose={<AlertActionCloseButton onClose={() => removeToast(t.key)} />}
            timeout={6000}
            onTimeout={() => removeToast(t.key)}
          >
            {t.description}
          </Alert>
        ))}
      </AlertGroup>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Organization Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Trusted Organizations</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Content>
          <Title headingLevel="h1" size="2xl">Trusted Organizations</Title>
          <p>Manage cross-organization trust relationships and federation settings.</p>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title={<TabTitleText>Outgoing</TabTitleText>}>
            <PageSection hasBodyWrapper={false}>
              <Drawer isExpanded={isDetailsOpen} position="right" isInline={false}>
                <DrawerContent
                  panelContent={
                    <DrawerPanelContent
                      defaultSize="560px"
                      style={{
                        height: 'calc(100vh - var(--pf-v6-c-page__main-section--PaddingTop, 0px) - 32px)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                      }}
                    >
                      <DrawerHead>
                        <div>
                          <Title headingLevel="h2" size="lg">{selectedOrg?.organizationName ?? 'Organization'}</Title>
                          <div style={{ marginTop: 16, color: 'var(--pf-v6-global--Color--100)' }}>
                            This is a panel description. It is helpful.
                          </div>
                        </div>
                        <DrawerActions>
                          <Dropdown
                            isOpen={detailsKebabOpen}
                            onOpenChange={setDetailsKebabOpen}
                            onSelect={() => setDetailsKebabOpen(false)}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                aria-label="More actions"
                                variant="plain"
                                onClick={() => setDetailsKebabOpen(!detailsKebabOpen)}
                                isExpanded={detailsKebabOpen}
                              >
                                <EllipsisVIcon />
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem>View details</DropdownItem>
                              <DropdownItem>Edit</DropdownItem>
                              <DropdownItem>Remove trust</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                          <DrawerCloseButton onClick={closeDetails} />
                        </DrawerActions>
                      </DrawerHead>
                      <DrawerContentBody style={{ flex: '1 1 auto', overflow: 'auto' }}>
                        <Tabs activeKey={detailsTabKey} onSelect={(_e, key) => setDetailsTabKey(key)}>
                          <Tab eventKey={0} title={<TabTitleText>Workspaces</TabTitleText>}>
                            <div style={{ padding: '16px' }}>
                              <TreeView
                                aria-label="Workspace tree"
                                variant="compact"
                                hasCheckboxes
                                data={[
                                  {
                                    id: 'w1',
                                    name: 'Workspace 1',
                                    hasCheckbox: true,
                                    defaultExpanded: false,
                                    checkProps: { checked: (() => {
                                      const ids = ['w1', ...getDescendants('w1')];
                                      const total = ids.length;
                                      const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                      return selected === 0 ? false : selected === total ? true : null;
                                    })(), onChange: (e: any) => toggleSelectWorkspace('w1', (e?.target as HTMLInputElement).checked) },
                                    children: [
                                      {
                                        id: 'w1-1',
                                        name: 'Workspace 1-1',
                                        hasCheckbox: true,
                                        defaultExpanded: false,
                                        checkProps: { checked: (() => {
                                          const ids = ['w1-1', ...getDescendants('w1-1')];
                                          const total = ids.length;
                                          const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                          return selected === 0 ? false : selected === total ? true : null;
                                        })(), onChange: (e: any) => toggleSelectWorkspace('w1-1', (e?.target as HTMLInputElement).checked) },
                                        children: [
                                          {
                                            id: 'w1-1-1',
                                            name: 'Workspace 1-1-1',
                                            hasCheckbox: true,
                                            checkProps: { checked: selectedWorkspaces.has('w1-1-1'), onChange: (e: any) => toggleSelectWorkspace('w1-1-1', (e?.target as HTMLInputElement).checked) }
                                          }
                                        ]
                                      },
                                      {
                                        id: 'w1-2',
                                        name: 'Workspace 1-2',
                                        hasCheckbox: true,
                                        checkProps: { checked: selectedWorkspaces.has('w1-2'), onChange: (e: any) => toggleSelectWorkspace('w1-2', (e?.target as HTMLInputElement).checked) }
                                      }
                                    ]
                                  },
                                  {
                                    id: 'w2',
                                    name: 'Workspace 2',
                                    hasCheckbox: true,
                                    defaultExpanded: false,
                                    checkProps: { checked: (() => {
                                      const ids = ['w2', ...getDescendants('w2')];
                                      const total = ids.length;
                                      const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                      return selected === 0 ? false : selected === total ? true : null;
                                    })(), onChange: (e: any) => toggleSelectWorkspace('w2', (e?.target as HTMLInputElement).checked) },
                                    children: [
                                      {
                                        id: 'w2-1',
                                        name: 'Workspace 2-1',
                                        hasCheckbox: true,
                                        checkProps: { checked: selectedWorkspaces.has('w2-1'), onChange: (e: any) => toggleSelectWorkspace('w2-1', (e?.target as HTMLInputElement).checked) }
                                      },
                                      {
                                        id: 'w2-2',
                                        name: 'Workspace 2-2',
                                        hasCheckbox: true,
                                        checkProps: { checked: selectedWorkspaces.has('w2-2'), onChange: (e: any) => toggleSelectWorkspace('w2-2', (e?.target as HTMLInputElement).checked) }
                                      }
                                    ]
                                  },
                                  {
                                    id: 'w3',
                                    name: 'Workspace 3',
                                    hasCheckbox: true,
                                    defaultExpanded: false,
                                    checkProps: { checked: (() => {
                                      const ids = ['w3', ...getDescendants('w3')];
                                      const total = ids.length;
                                      const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                      return selected === 0 ? false : selected === total ? true : null;
                                    })(), onChange: (e: any) => toggleSelectWorkspace('w3', (e?.target as HTMLInputElement).checked) },
                                    children: [
                                      {
                                        id: 'w3-1',
                                        name: 'Workspace 3-1',
                                        hasCheckbox: true,
                                        defaultExpanded: false,
                                        checkProps: { checked: selectedWorkspaces.has('w3-1'), onChange: (e: any) => toggleSelectWorkspace('w3-1', (e?.target as HTMLInputElement).checked) },
                                        children: [
                                          {
                                            id: 'w3-1-1',
                                            name: 'Workspace 3-1-1',
                                            hasCheckbox: true,
                                            checkProps: { checked: selectedWorkspaces.has('w3-1-1'), onChange: (e: any) => toggleSelectWorkspace('w3-1-1', (e?.target as HTMLInputElement).checked) }
                                          }
                                        ]
                                      },
                                      {
                                        id: 'w3-2',
                                        name: 'Workspace 3-2',
                                        hasCheckbox: true,
                                        checkProps: { checked: selectedWorkspaces.has('w3-2'), onChange: (e: any) => toggleSelectWorkspace('w3-2', (e?.target as HTMLInputElement).checked) }
                                      }
                                    ]
                                  },
                                  {
                                    id: 'w4',
                                    name: 'Workspace 4',
                                    hasCheckbox: true,
                                    defaultExpanded: false,
                                    checkProps: { checked: (() => {
                                      const ids = ['w4', ...getDescendants('w4')];
                                      const total = ids.length;
                                      const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                      return selected === 0 ? false : selected === total ? true : null;
                                    })(), onChange: (e: any) => toggleSelectWorkspace('w4', (e?.target as HTMLInputElement).checked) },
                                    children: [
                                      {
                                        id: 'w4-1',
                                        name: 'Workspace 4-1',
                                        hasCheckbox: true,
                                        defaultExpanded: false,
                                        checkProps: { checked: (() => {
                                          const ids = ['w4-1', ...getDescendants('w4-1')];
                                          const total = ids.length;
                                          const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                          return selected === 0 ? false : selected === total ? true : null;
                                        })(), onChange: (e: any) => toggleSelectWorkspace('w4-1', (e?.target as HTMLInputElement).checked) },
                                        children: [
                                          {
                                            id: 'w4-1-1',
                                            name: 'Workspace 4-1-1',
                                            hasCheckbox: true,
                                            checkProps: { checked: selectedWorkspaces.has('w4-1-1'), onChange: (e: any) => toggleSelectWorkspace('w4-1-1', (e?.target as HTMLInputElement).checked) }
                                          }
                                        ]
                                      },
                                      {
                                        id: 'w4-2',
                                        name: 'Workspace 4-2',
                                        hasCheckbox: true,
                                        checkProps: { checked: selectedWorkspaces.has('w4-2'), onChange: (e: any) => toggleSelectWorkspace('w4-2', (e?.target as HTMLInputElement).checked) }
                                      }
                                    ]
                                  }
                                ]}
                              />
                            </div>
                          </Tab>
                          <Tab eventKey={1} title={<TabTitleText>User groups</TabTitleText>}>
                            <Table aria-label="User groups table">
                              <Thead>
                                <Tr>
                                  <Th>
                                    <Checkbox
                                      aria-label="Select all groups"
                                      isChecked={selectedGroups.size === groupRows.length}
                                      onChange={(_event, checked) => onToggleAllGroups(checked)}
                                      isCheckedMixed={selectedGroups.size > 0 && selectedGroups.size < groupRows.length}
                                    />
                                  </Th>
                                  <Th sort={{ sortBy: { index: 0, direction: undefined }, onSort: () => {}, columnIndex: 0 }}>User group name</Th>
                                  <Th sort={{ sortBy: { index: 1, direction: undefined }, onSort: () => {}, columnIndex: 1 }}>Members</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {groupRows.map((g) => (
                                  <Tr key={g.id}>
                                    <Td>
                                      <Checkbox
                                        aria-label={`Select ${g.name}`}
                                        isChecked={selectedGroups.has(g.id)}
                                      onChange={(_event, checked) => onToggleGroup(g.id, checked)}
                                      />
                                    </Td>
                                    <Td dataLabel="User group name">{g.name}</Td>
                                    <Td dataLabel="Members">
                                      <Button variant="link" isInline>{g.members}</Button>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </Tab>
                          <Tab eventKey={2} title={<TabTitleText>Users</TabTitleText>}>
                            <Content>
                              <p>Users associated through this trust relationship.</p>
                            </Content>
                          </Tab>
                        </Tabs>
                        <div style={{ position: 'sticky', bottom: 0, padding: '16px', background: 'var(--pf-v6-global--BackgroundColor--100)', boxShadow: '0 -1px 0 var(--pf-v6-global--BorderColor--100)' }}>
                          <Button isDisabled={!isDirty} variant="secondary" onClick={onSaveGroups}>Save changes</Button>
                        </div>
                      </DrawerContentBody>
                    </DrawerPanelContent>
                  }
                >
                  <DrawerContentBody>
                    <Toolbar id="trusted-orgs-outgoing-toolbar">
                      <ToolbarContent>
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isFilterDropdownOpen}
                      onOpenChange={setIsFilterDropdownOpen}
                      onSelect={(_e, item) => {
                        const text = (item as any)?.text || 'Org ID';
                        setSelectedFilterField(text as 'Org ID' | 'Organization name');
                        setIsFilterDropdownOpen(false);
                      }}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                          isExpanded={isFilterDropdownOpen}
                          icon={<FilterIcon />}
                        >
                          {selectedFilterField}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem>Org ID</DropdownItem>
                        <DropdownItem>Organization name</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  <ToolbarItem>
                    <SearchInput
                      aria-label={`Filter by ${selectedFilterField}`}
                      placeholder={`Filter by ${selectedFilterField}`}
                      value={textFilter}
                      onChange={(_event, value) => setTextFilter(value)}
                      onClear={() => setTextFilter('')}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="primary">Establish a trusted org</Button>
                  </ToolbarItem>
                  <ToolbarItem variant="pagination">
                    <Pagination
                      itemCount={filteredAndSortedData.length}
                      perPage={perPage}
                      page={page}
                      onSetPage={onSetPage}
                      onPerPageSelect={onPerPageSelect}
                      isCompact={false}
                    />
                  </ToolbarItem>
                </ToolbarContent>
                    </Toolbar>
                    <Table aria-label="Outgoing trusted organizations table">
                <Thead>
                  <Tr>
                    <Th sort={{ sortBy, onSort, columnIndex: 0 }} width={45}>Organization name</Th>
                    <Th sort={{ sortBy, onSort, columnIndex: 1 }} width={25}>Org ID</Th>
                    <Th sort={{ sortBy, onSort, columnIndex: 2 }} width={15}>Status</Th>
                    <Th sort={{ sortBy, onSort, columnIndex: 3 }} width={15}>Last modified</Th>
                    <Th aria-label="Row actions"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedData.map((row) => (
                    <Tr key={row.orgId}>
                      <Td dataLabel="Organization name" style={{ paddingRight: '32px' }}>
                        <Button variant="link" isInline onClick={() => openDetails(row)}>
                          {row.organizationName}
                        </Button>
                      </Td>
                      <Td dataLabel="Org ID">{row.orgId}</Td>
                      <Td dataLabel="Status" style={{ paddingRight: '8px' }}>
                        {row.status === 'Accepted' && (
                          <Label variant="status" color="green" icon={<CheckCircleIcon />}>Accepted</Label>
                        )}
                        {row.status === 'Severed' && (
                          <Label variant="status" color="red" icon={<ExclamationCircleIcon />}>Severed</Label>
                        )}
                        {row.status === 'Acceptance pending' && (
                          <Label variant="status" color="cyan" icon={<SyncAltIcon />}>Acceptance pending</Label>
                        )}
                      </Td>
                      <Td dataLabel="Last modified">{row.lastModified}</Td>
                      <Td isActionCell>
                        <Dropdown
                          isOpen={openKebabKey === `out-${row.orgId}`}
                          onSelect={() => setOpenKebabKey(null)}
                          onOpenChange={(isOpen) => setOpenKebabKey(isOpen ? `out-${row.orgId}` : null)}
                          toggle={(toggleRef) => (
                            <MenuToggle
                              ref={toggleRef}
                              aria-label={`Row actions for ${row.organizationName}`}
                              variant="plain"
                              onClick={() => setOpenKebabKey(openKebabKey === `out-${row.orgId}` ? null : `out-${row.orgId}`)}
                              isExpanded={openKebabKey === `out-${row.orgId}`}
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                          popperProps={{ position: 'right' }}
                        >
                          <DropdownList>
                            {row.status === 'Accepted' && (
                              <DropdownItem
                                onClick={() => {
                                  setOpenKebabKey(null);
                                  setRemoveTargetOrg(row);
                                  setIsRemoveModalOpen(true);
                                  setRemoveSource('outgoing');
                                }}
                              >
                                Remove connection
                              </DropdownItem>
                            )}
                            {row.status === 'Acceptance pending' && (
                              <>
                                <DropdownItem>Send reminder</DropdownItem>
                                <DropdownItem>Cancel request</DropdownItem>
                              </>
                            )}
                            {row.status !== 'Accepted' && row.status !== 'Acceptance pending' && (
                              <>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem>View details</DropdownItem>
                                <DropdownItem>Delete</DropdownItem>
                              </>
                            )}
                          </DropdownList>
                        </Dropdown>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                    </Table>
                  </DrawerContentBody>
                </DrawerContent>
              </Drawer>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Incoming</TabTitleText>}>
            <PageSection>
              <Drawer isExpanded={isDetailsOpen} isInline={false} hasNoBackgroundScroll={true}>
                <DrawerContent
                  panelContent={
                    <DrawerPanelContent
                      isResizable
                      defaultSize="600px"
                      minSize="400px"
                      style={{
                        height: 'calc(100vh - var(--pf-v6-c-page__main-section--PaddingTop) - 32px)',
                        overflow: 'auto'
                      }}
                    >
                      <DrawerHead>
                        <Title headingLevel="h2" size="xl">
                          {selectedOrg?.organizationName || 'Organization Details'}
                        </Title>
                        <div style={{ color: 'black', marginTop: '16px' }}>
                          View and manage user group access for this trusted organization
                        </div>
                        <DrawerActions>
                          <Dropdown
                            isOpen={detailsKebabOpen}
                            onSelect={() => setDetailsKebabOpen(false)}
                            onOpenChange={(isOpen) => setDetailsKebabOpen(isOpen)}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                aria-label="Drawer actions"
                                variant="plain"
                                onClick={() => setDetailsKebabOpen(!detailsKebabOpen)}
                              >
                                <EllipsisVIcon />
                              </MenuToggle>
                            )}
                            popperProps={{ position: 'right' }}
                          >
                            <DropdownList>
                              <DropdownItem>Remove connection</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                          <DrawerCloseButton onClick={() => setIsDetailsOpen(false)} />
                        </DrawerActions>
                      </DrawerHead>
                      <DrawerContentBody style={{ overflow: 'auto' }}>
                        <Tabs activeKey={detailsTabKey} onSelect={(e, tabIndex) => setDetailsTabKey(tabIndex)}>
                          <Tab eventKey={0} title={<TabTitleText>Workspaces</TabTitleText>}>
                            <div style={{ padding: '16px' }}>Workspaces content goes here</div>
                          </Tab>
                          <Tab eventKey={1} title={<TabTitleText>User groups</TabTitleText>}>
                            <div style={{ padding: '16px' }}>
                              <Table variant="compact">
                                <Thead>
                                  <Tr>
                                    <Th
                                      select={{
                                        onSelect: (_event, isSelecting) => onSelectAllGroups(isSelecting),
                                        isSelected: areAllGroupsSelected,
                                        isIndeterminate: areSomeGroupsSelected && !areAllGroupsSelected,
                                      }}
                                    />
                                    <Th>User group name</Th>
                                    <Th>Members</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {groupRows.map((group) => (
                                    <Tr key={group.id}>
                                      <Td
                                        select={{
                                          rowIndex: group.id,
                                          onSelect: (_event, isSelecting) => onToggleGroup(group.id, isSelecting),
                                          isSelected: selectedGroups.has(group.id),
                                        }}
                                      />
                                      <Td>{group.name}</Td>
                                      <Td>
                                        <Button variant="link" isInline>
                                          {group.members}
                                        </Button>
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                              {hasChanges && (
                                <div style={{
                                  position: 'sticky',
                                  bottom: 0,
                                  backgroundColor: 'white',
                                  padding: '16px',
                                  borderTop: '1px solid var(--pf-v6-global--BorderColor--100)',
                                  marginTop: '16px'
                                }}>
                                  <Button variant="primary" onClick={onSaveGroups}>
                                    Save changes
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Tab>
                          <Tab eventKey={2} title={<TabTitleText>Users</TabTitleText>}>
                            <div style={{ padding: '16px' }}>Users content goes here</div>
                          </Tab>
                        </Tabs>
                      </DrawerContentBody>
                    </DrawerPanelContent>
                  }
                >
                  <DrawerContentBody>
                    <Toolbar>
                      <ToolbarContent>
                        <ToolbarItem style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Dropdown
                            isOpen={isFilterDropdownOpen}
                            onOpenChange={setIsFilterDropdownOpen}
                            onSelect={(_e, item) => {
                              const text = (item as any)?.text || 'Org ID';
                              setSelectedFilterField(text as 'Org ID' | 'Organization name');
                              setIsFilterDropdownOpen(false);
                            }}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                isExpanded={isFilterDropdownOpen}
                                icon={<FilterIcon />}
                                style={{ minWidth: '150px' }}
                              >
                                {selectedFilterField}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem>Org ID</DropdownItem>
                              <DropdownItem>Organization name</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                          <SearchInput
                            aria-label={`Filter by ${selectedFilterField}`}
                            placeholder={`Filter by ${selectedFilterField}`}
                            value={textFilter}
                            onChange={(_event, value) => setTextFilter(value)}
                            onClear={() => setTextFilter('')}
                          />
                        </ToolbarItem>
                        <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                          <Pagination
                            itemCount={incomingFilteredAndSortedData.length}
                            perPage={perPage}
                            page={page}
                            onSetPage={onSetPage}
                            onPerPageSelect={onPerPageSelect}
                            widgetId="pagination-options-menu-incoming"
                            isCompact
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>
                    <Table aria-label="Incoming trusted organizations table">
                      <Thead>
                        <Tr>
                          <Th 
                            sort={{
                              sortBy: sortBy,
                              onSort: onSort,
                              columnIndex: 0
                            }}
                            width={25}
                          >
                            Organization name
                          </Th>
                          <Th 
                            sort={{
                              sortBy: sortBy,
                              onSort: onSort,
                              columnIndex: 1
                            }}
                            width={15}
                          >
                            Org ID
                          </Th>
                          <Th 
                            sort={{
                              sortBy: sortBy,
                              onSort: onSort,
                              columnIndex: 2
                            }}
                            width={15}
                          >
                            Status
                          </Th>
                          <Th 
                            sort={{
                              sortBy: sortBy,
                              onSort: onSort,
                              columnIndex: 3
                            }}
                            width={20}
                          >
                            Last modified
                          </Th>
                          <Th />
                        </Tr>
                      </Thead>
                      <Tbody>
                        {incomingPaginatedData.map((row, idx) => (
                          <Tr key={idx}>
                            <Td>{row.organizationName}</Td>
                            <Td>{row.orgId}</Td>
                            <Td>
                              {row.status === 'Accepted' && (
                                <Label variant="filled" color="green" icon={<CheckCircleIcon />}>Accepted</Label>
                              )}
                              {row.status === 'Rejected' && (
                                <Label
                                  variant="filled"
                                  color="gold"
                                  icon={<ExclamationTriangleIcon />}
                                  style={{
                                    backgroundColor: 'var(--pf-v6-global--warning-color--100)',
                                    borderColor: 'var(--pf-v6-global--warning-color--100)',
                                    color: 'var(--pf-v6-global--palette--black-900)'
                                  }}
                                >
                                  Rejected
                                </Label>
                              )}
                              {row.status === 'Acceptance pending' && (
                                <Label
                                  variant="filled"
                                  color="blue"
                                  icon={<BellIcon />}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openPendingWizard(row)}
                                >
                                  View pending request
                                </Label>
                              )}
                            </Td>
                            <Td>{row.lastModified}</Td>
                            <Td isActionCell>
                              <Dropdown
                                isOpen={openKebabKey === `in-${row.orgId}`}
                                onSelect={() => setOpenKebabKey(null)}
                                onOpenChange={(isOpen) => setOpenKebabKey(isOpen ? `in-${row.orgId}` : null)}
                                toggle={(toggleRef) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    aria-label="Actions"
                                    variant="plain"
                                    onClick={() => setOpenKebabKey(openKebabKey === `in-${row.orgId}` ? null : `in-${row.orgId}`)}
                                  >
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                                popperProps={{ position: 'right' }}
                              >
                                <DropdownList>
                                  {row.status === 'Accepted' ? (
                                    <DropdownItem
                                      onClick={() => {
                                        setOpenKebabKey(null);
                                        setRemoveTargetOrg(row);
                                        setIsRemoveModalOpen(true);
                                        setRemoveSource('incoming');
                                      }}
                                    >
                                      Remove connection
                                    </DropdownItem>
                                  ) : (
                                    <>
                                      <DropdownItem>Edit</DropdownItem>
                                      <DropdownItem>View details</DropdownItem>
                                      <DropdownItem>Delete</DropdownItem>
                                    </>
                                  )}
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </DrawerContentBody>
                </DrawerContent>
              </Drawer>
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>

      {isPendingWizardOpen && pendingWizardOrg && (
        <Modal isOpen onClose={closePendingWizard} variant="large" showClose={false} aria-label="Review trusted organization request wizard" className="trusted-wizard-modal">
          <Wizard
            onClose={closePendingWizard}
            header={
              <WizardHeader
                title={`Review trusted organization request from ${pendingWizardOrg.organizationName}`}
                description="Review and manage this pending trust request."
                onClose={closePendingWizard}
              />
            }
            startIndex={1}
            onSave={() => {
              // toast
              addToast(
                `You are successfully a trusted org with ${pendingWizardOrg.organizationName}.`,
                <span>To learn more about what you can do as a trusted org, <a href="#">click here</a>.</span>
              );
              // update incoming status to Accepted
              setIncomingData((prev) =>
                prev.map((row) =>
                  row.orgId === pendingWizardOrg.orgId ? { ...row, status: 'Accepted' } : row
                )
              );
              closePendingWizard();
            }}
          >
            <WizardStep id="step-1" name="Review request">
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">You have a request to become a trusted organization. Review the request info below:</Title>
                <p style={{ marginTop: 8 }}>
                  Accepting to become a trusted org to {pendingWizardOrg.organizationName} will allow them to see your organization.
                  For more information about trusted organizations, <a href="#">click here</a>.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    columnGap: 32,
                    rowGap: 16,
                    marginTop: 16,
                  }}
                >
                  <div>
                    <Title headingLevel="h4" size="sm" style={{ fontWeight: 700 }}>Organization name</Title>
                    <div style={{ marginTop: 4 }}>{pendingWizardOrg.organizationName}</div>
                  </div>
                  <div>
                    <Title headingLevel="h4" size="sm" style={{ fontWeight: 700 }}>Organization ID</Title>
                    <div style={{ marginTop: 4 }}>{pendingWizardOrg.orgId}</div>
                  </div>
                  <div>
                    <Title headingLevel="h4" size="sm" style={{ marginTop: 8, fontWeight: 700 }}>Requester name</Title>
                    <div style={{ marginTop: 4 }}>{pendingRequesterName}</div>
                  </div>
                  <div>
                    <Title headingLevel="h4" size="sm" style={{ marginTop: 8, fontWeight: 700 }}>Requester email</Title>
                    <div style={{ marginTop: 4 }}>{pendingRequesterEmail}</div>
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Title headingLevel="h4" size="sm" style={{ fontWeight: 700 }}>Request description</Title>
                  <p style={{ marginTop: 8 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </p>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>
                    Do you accept the request from {pendingWizardOrg.organizationName} to be a trusted organization? <span aria-hidden="true" style={{ color: 'var(--pf-v6-global--danger-color--100)' }}>*</span>
                  </Title>
                  <div style={{ marginTop: 12 }}>
                    <Radio
                      id="accept-request-yes"
                      name="accept-request"
                      isChecked={acceptChoice === 'accept'}
                      onChange={() => setAcceptChoice('accept')}
                      label={`I accept this request to become a trusted org to ${pendingWizardOrg.organizationName}`}
                    />
                    <Radio
                      id="accept-request-no"
                      name="accept-request"
                      isChecked={acceptChoice === 'reject'}
                      onChange={() => setAcceptChoice('reject')}
                      label={`I DO NOT accept this request to become a trusted org to ${pendingWizardOrg.organizationName}`}
                      style={{ marginTop: 0 }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>Please verify your email address</Title>
                  <div style={{ marginTop: 8, maxWidth: 420 }}>
                    <TextInput
                      id="verify-email-input"
                      name="verify-email-input"
                      type="email"
                      value={verifyEmail}
                      onChange={(_event, value) => setVerifyEmail(value)}
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              </div>
            </WizardStep>
            <WizardStep
              id="step-2"
              name="Configure"
              isDisabled={false}
              isExpandable
              steps={[
                (
                  <WizardStep id="config-preference" name="Preference" key="config-preference">
                    <div style={{ padding: 16 }}>
                      <Title headingLevel="h3" size="lg">
                        Do yo wish to configure what to allow {pendingWizardOrg.organizationName} to see from your organization?
                      </Title>
                      <div style={{ marginTop: 12 }}>
                        <Radio
                          id="configure-yes"
                          name="configure-choice"
                          isChecked={configureChoice === 'yes'}
                          onChange={() => setConfigureChoice('yes')}
                          label="Yes, I want to specify what is shown"
                        />
                        <Radio
                          id="configure-no"
                          name="configure-choice"
                          isChecked={configureChoice === 'no'}
                          onChange={() => setConfigureChoice('no')}
                          label="No, skip this step"
                          style={{ marginTop: 0 }}
                        />
                      </div>
                    </div>
                  </WizardStep>
                ),
                (
                  <WizardStep id="config-workspaces" name="Workspaces" key="config-workspaces" isHidden={configureChoice !== 'yes'}>
                    <div style={{ padding: 16 }}>
                      <Title headingLevel="h3" size="lg">Configure what you allow {pendingWizardOrg.organizationName} to see from your organization</Title>
                      <p style={{ marginTop: 8 }}>Select which workspace(s) {pendingWizardOrg.organizationName} will be able to see:</p>
                      <div style={{ marginTop: 12 }}>
                        <TreeView
                          aria-label="Workspace tree"
                          variant="compact"
                          hasCheckboxes
                          data={[
                            {
                              id: 'w1',
                              name: 'Workspace 1',
                              hasCheckbox: true,
                              defaultExpanded: false,
                              checkProps: { checked: (() => {
                                const ids = ['w1', ...getDescendants('w1')];
                                const total = ids.length;
                                const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                return selected === 0 ? false : selected === total ? true : null;
                              })(), onChange: (e: any) => toggleSelectWorkspace('w1', (e?.target as HTMLInputElement).checked) },
                              children: [
                                {
                                  id: 'w1-1',
                                  name: 'Workspace 1-1',
                                  hasCheckbox: true,
                                  defaultExpanded: false,
                                  checkProps: { checked: (() => {
                                    const ids = ['w1-1', ...getDescendants('w1-1')];
                                    const total = ids.length;
                                    const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                    return selected === 0 ? false : selected === total ? true : null;
                                  })(), onChange: (e: any) => toggleSelectWorkspace('w1-1', (e?.target as HTMLInputElement).checked) },
                                  children: [
                                    {
                                      id: 'w1-1-1',
                                      name: 'Workspace 1-1-1',
                                      hasCheckbox: true,
                                      checkProps: { checked: selectedWorkspaces.has('w1-1-1'), onChange: (e: any) => toggleSelectWorkspace('w1-1-1', (e?.target as HTMLInputElement).checked) }
                                    }
                                  ]
                                },
                                {
                                  id: 'w1-2',
                                  name: 'Workspace 1-2',
                                  hasCheckbox: true,
                                  checkProps: { checked: selectedWorkspaces.has('w1-2'), onChange: (e: any) => toggleSelectWorkspace('w1-2', (e?.target as HTMLInputElement).checked) }
                                }
                              ]
                            },
                            {
                              id: 'w2',
                              name: 'Workspace 2',
                              hasCheckbox: true,
                              defaultExpanded: false,
                              checkProps: { checked: (() => {
                                const ids = ['w2', ...getDescendants('w2')];
                                const total = ids.length;
                                const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                return selected === 0 ? false : selected === total ? true : null;
                              })(), onChange: (e: any) => toggleSelectWorkspace('w2', (e?.target as HTMLInputElement).checked) },
                              children: [
                                {
                                  id: 'w2-1',
                                  name: 'Workspace 2-1',
                                  hasCheckbox: true,
                                  checkProps: { checked: selectedWorkspaces.has('w2-1'), onChange: (e: any) => toggleSelectWorkspace('w2-1', (e?.target as HTMLInputElement).checked) }
                                },
                                {
                                  id: 'w2-2',
                                  name: 'Workspace 2-2',
                                  hasCheckbox: true,
                                  checkProps: { checked: selectedWorkspaces.has('w2-2'), onChange: (e: any) => toggleSelectWorkspace('w2-2', (e?.target as HTMLInputElement).checked) }
                                }
                              ]
                            },
                            {
                              id: 'w3',
                              name: 'Workspace 3',
                              hasCheckbox: true,
                              defaultExpanded: false,
                              checkProps: { checked: (() => {
                                const ids = ['w3', ...getDescendants('w3')];
                                const total = ids.length;
                                const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                return selected === 0 ? false : selected === total ? true : null;
                              })(), onChange: (e: any) => toggleSelectWorkspace('w3', (e?.target as HTMLInputElement).checked) },
                              children: [
                                {
                                  id: 'w3-1',
                                  name: 'Workspace 3-1',
                                  hasCheckbox: true,
                                  defaultExpanded: false,
                                  checkProps: { checked: selectedWorkspaces.has('w3-1'), onChange: (e: any) => toggleSelectWorkspace('w3-1', (e?.target as HTMLInputElement).checked) },
                                  children: [
                                    {
                                      id: 'w3-1-1',
                                      name: 'Workspace 3-1-1',
                                      hasCheckbox: true,
                                      checkProps: { checked: selectedWorkspaces.has('w3-1-1'), onChange: (e: any) => toggleSelectWorkspace('w3-1-1', (e?.target as HTMLInputElement).checked) }
                                    }
                                  ]
                                },
                                {
                                  id: 'w3-2',
                                  name: 'Workspace 3-2',
                                  hasCheckbox: true,
                                  checkProps: { checked: selectedWorkspaces.has('w3-2'), onChange: (e: any) => toggleSelectWorkspace('w3-2', (e?.target as HTMLInputElement).checked) }
                                }
                              ]
                            },
                            {
                              id: 'w4',
                              name: 'Workspace 4',
                              hasCheckbox: true,
                              defaultExpanded: true,
                              checkProps: { checked: (() => {
                                const ids = ['w4', ...getDescendants('w4')];
                                const total = ids.length;
                                const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                return selected === 0 ? false : selected === total ? true : null;
                              })(), onChange: (e: any) => toggleSelectWorkspace('w4', (e?.target as HTMLInputElement).checked) },
                              children: [
                                {
                                  id: 'w4-1',
                                  name: 'Workspace 4-1',
                                  hasCheckbox: true,
                                  defaultExpanded: true,
                                  checkProps: { checked: (() => {
                                    const ids = ['w4-1', ...getDescendants('w4-1')];
                                    const total = ids.length;
                                    const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
                                    return selected === 0 ? false : selected === total ? true : null;
                                  })(), onChange: (e: any) => toggleSelectWorkspace('w4-1', (e?.target as HTMLInputElement).checked) },
                                  children: [
                                    {
                                      id: 'w4-1-1',
                                      name: 'Workspace 4-1-1',
                                      hasCheckbox: true,
                                      checkProps: { checked: selectedWorkspaces.has('w4-1-1'), onChange: (e: any) => toggleSelectWorkspace('w4-1-1', (e?.target as HTMLInputElement).checked) }
                                    }
                                  ]
                                },
                                {
                                  id: 'w4-2',
                                  name: 'Workspace 4-2',
                                  hasCheckbox: true,
                                  checkProps: { checked: selectedWorkspaces.has('w4-2'), onChange: (e: any) => toggleSelectWorkspace('w4-2', (e?.target as HTMLInputElement).checked) }
                                }
                              ]
                            }
                          ]}
                        />
                      </div>
                    </div>
                  </WizardStep>
                ),
                (
                  <WizardStep id="config-groups" name="User groups" key="config-groups" isHidden={configureChoice !== 'yes'}>
                    <div style={{ padding: 16 }}>
                      <Title headingLevel="h3" size="lg">Configure what you allow {pendingWizardOrg.organizationName} to see from your organization</Title>
                      <p style={{ marginTop: 8 }}>Select which user group(s) {pendingWizardOrg.organizationName} will be able to see:</p>
                      <div style={{ marginTop: 16 }}>
                        <Toolbar>
                          <ToolbarContent>
                            <ToolbarItem style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <Dropdown
                                isOpen={isFilterDropdownOpen}
                                onOpenChange={setIsFilterDropdownOpen}
                                onSelect={(_e, item) => {
                                  const text = (item as any)?.text || 'Org ID';
                                  setSelectedFilterField(text as 'Org ID' | 'Organization name');
                                  setIsFilterDropdownOpen(false);
                                }}
                                toggle={(toggleRef) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                    isExpanded={isFilterDropdownOpen}
                                    icon={<FilterIcon />}
                                    style={{ minWidth: '220px' }}
                                  >
                                    {'User group name'}
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  <DropdownItem>User group name</DropdownItem>
                                  <DropdownItem>Org ID</DropdownItem>
                                </DropdownList>
                              </Dropdown>
                              <SearchInput
                                aria-label={'Filter by User group name'}
                                placeholder={'Filter by User group name'}
                                value={textFilter}
                                onChange={(_event, value) => setTextFilter(value)}
                                onClear={() => setTextFilter('')}
                              />
                            </ToolbarItem>
                            <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                              <Pagination
                                itemCount={groupRows.length}
                                perPage={perPage}
                                page={page}
                                onSetPage={onSetPage}
                                onPerPageSelect={onPerPageSelect}
                                widgetId="pagination-options-menu-config-groups"
                                isCompact
                              />
                            </ToolbarItem>
                          </ToolbarContent>
                        </Toolbar>
                        <div style={{ marginTop: 12 }}>
                          <Table aria-label="Wizard user groups table" variant="compact">
                            <Thead>
                              <Tr>
                                <Th aria-label="Select all user groups column">
                                  <Checkbox
                                    aria-label="Select all user groups"
                                    isChecked={selectedGroups.size === groupRows.length}
                                    isCheckedMixed={selectedGroups.size > 0 && selectedGroups.size < groupRows.length}
                                    onChange={(_event, checked) => onToggleAllGroups(checked)}
                                  />
                                </Th>
                                <Th aria-label="User group name column">User group name</Th>
                                <Th aria-label="Members column">Members</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {groupRows.map((g) => (
                                <Tr key={g.id}>
                                  <Td>
                                    <Checkbox
                                      aria-label={`Select ${g.name}`}
                                      isChecked={selectedGroups.has(g.id)}
                                      onChange={(_event, checked) => onToggleGroup(g.id, checked)}
                                    />
                                  </Td>
                                  <Td>{g.name}</Td>
                                  <Td>
                                    <Button variant="link" isInline>{g.members}</Button>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </WizardStep>
                ),
                (
                  <WizardStep id="config-users" name="Users" key="config-users" isHidden>
                    <div style={{ padding: 16 }}>
                      <Title headingLevel="h3" size="lg">Configure what you allow {pendingWizardOrg.organizationName} to see from your organization</Title>
                      <p style={{ marginTop: 8 }}>Select which user(s) {pendingWizardOrg.organizationName} will be able to see:</p>
                    </div>
                  </WizardStep>
                )
              ]}
            />
            <WizardStep id="step-3" name="Request to be a trusted organization" isDisabled={false} footer={{ nextButtonText: 'Submit' }}>
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Would you like to request to become a trusted org of {pendingWizardOrg.organizationName}?</Title>
                <p style={{ marginTop: 8 }}>This will allow them to see and grant access to your organization.</p>
                <div style={{ marginTop: 12 }}>
                  <Radio
                    id="request-trusted-yes"
                    name="request-trusted-choice"
                    isChecked={requestTrustedChoice === 'yes'}
                    onChange={() => setRequestTrustedChoice('yes')}
                    label={`Yes, request to become a trusted org of ${pendingWizardOrg.organizationName}`}
                  />
                  {requestTrustedChoice === 'yes' && (
                    <div style={{ marginTop: 16 }}>
                  <Title headingLevel="h4" size="sm" style={{ fontWeight: 700 }}>Request description</Title>
                      <div style={{ marginTop: 8, maxWidth: 560 }}>
                        <TextArea
                          id="request-description"
                          name="request-description"
                          value={requestDescription}
                          onChange={(_event, value) => setRequestDescription(value)}
                          resizeOrientation="vertical"
                          placeholder="Provide any details for your request"
                        />
                      </div>
                    </div>
                  )}
                  <Radio
                    id="request-trusted-no"
                    name="request-trusted-choice"
                    isChecked={requestTrustedChoice === 'no'}
                    onChange={() => setRequestTrustedChoice('no')}
                    label={`No, I DO NOT wish to request to be a trusted org of ${pendingWizardOrg.organizationName}`}
                    style={{ marginTop: 0 }}
                  />
                </div>
              </div>
            </WizardStep>
          </Wizard>
        </Modal>
      )}

      {/* Standard modal for removing a trusted connection (outgoing) */}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        title={removeTargetOrg ? `Are you sure you want to remove ${removeTargetOrg.organizationName} as a trusted connection?` : 'Are you sure you want to remove this organization as a trusted connection?'}
        variant="medium"
      >
        <div style={{ minHeight: 180, paddingTop: 24, paddingLeft: 24 }}>
          <Title headingLevel="h3" size="lg">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <ExclamationTriangleIcon style={{ color: 'var(--pf-v6-global--palette--gold-400)' }} />
              {removeTargetOrg ? `Are you sure you want to remove ${removeTargetOrg.organizationName} as a trusted connection?` : 'Are you sure you want to remove this organization as a trusted connection?'}
            </span>
          </Title>
          <p style={{ marginTop: 8, color: 'var(--pf-v6-global--palette--black-500)', fontSize: '0.875rem' }}>Subtitle goes here</p>
          <p style={{ marginTop: 12 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, marginBottom: 24 }}>
            <Button
              variant="primary"
              onClick={() => {
                if (removeTargetOrg) {
                  // Remove from both lists to reflect across tabs
                  setOutgoingData((prev) => prev.filter((row) => row.orgId !== removeTargetOrg.orgId));
                  setIncomingData((prev) => prev.filter((row) => row.orgId !== removeTargetOrg.orgId));
                  addToast(
                    `${removeTargetOrg.organizationName} has been removed as a trusted organization.`,
                    <span>
                      You can view all requests <a href={removeSource === 'incoming' ? '/organization/trusted-organizations?tab=incoming' : '/organization/trusted-organizations'}>here</a>.
                    </span>,
                    'info'
                  );
                }
                setIsRemoveModalOpen(false);
                setRemoveTargetOrg(null);
                setRemoveSource(null);
              }}
            >
              Remove
            </Button>
            <Button variant="link" onClick={() => setIsRemoveModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

    </>
  );
};

export { TrustedOrganizations };



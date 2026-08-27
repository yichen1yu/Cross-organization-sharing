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
import { TreeView } from '@patternfly/react-core';
import { EllipsisVIcon, FilterIcon, CheckCircleIcon, ExclamationCircleIcon, SyncAltIcon, ExclamationTriangleIcon, ArrowRightIcon, ArrowLeftIcon, HistoryIcon } from '@patternfly/react-icons';
import { Wizard, WizardStep, WizardHeader, Modal, ModalHeader, ModalBody, ModalFooter, Radio, TextInput, AlertGroup, Alert, AlertActionCloseButton, Form, FormGroup, FormGroupLabelHelp, Popover, HelperText, HelperTextItem, EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateActions, ToggleGroup, ToggleGroupItem, ExpandableSection } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const TrustedOrganizations: React.FunctionComponent = () => {
  const location = useLocation();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const handleTabClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  // ── Types ──────────────────────────────────────────────────────────────

  type Connection = {
    organizationName: string;
    orgId: string;
    status: 'Connected' | 'Revoked' | 'Rejected';
    connectedDate: string;
  };

  type PendingRequest = {
    organizationName: string;
    orgId: string;
    direction: 'Incoming' | 'Outgoing';
    requestedDate: string;
    requester: string;
  };

  type ChangeLogEntry = {
    id: string;
    timestamp: string;
    action: 'Connection established' | 'Connection revoked' | 'Sharing updated' | 'Request sent' | 'Request accepted' | 'Request rejected' | 'Request cancelled';
    resource: string;
    description: string;
    performedBy: string;
  };

  // ── Shared UI state ────────────────────────────────────────────────────

  const [textFilter, setTextFilter] = React.useState('');
  const [selectedFilterField, setSelectedFilterField] = React.useState<'Org ID' | 'Organization name'>('Org ID');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' | undefined }>({ index: 3, direction: 'desc' });
  const [openKebabKey, setOpenKebabKey] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Drawer state
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [selectedOrg, setSelectedOrg] = React.useState<Connection | null>(null);
  const [detailsTabKey, setDetailsTabKey] = React.useState<string | number>(1);

  // Pending wizard state
  const [isPendingWizardOpen, setIsPendingWizardOpen] = React.useState(false);
  const [pendingWizardComplete, setPendingWizardComplete] = React.useState(false);
  const [pendingWizardRequest, setPendingWizardRequest] = React.useState<PendingRequest | null>(null);
  const [acceptChoice, setAcceptChoice] = React.useState<'accept' | 'reject' | null>(null);
  const [verifyEmail, setVerifyEmail] = React.useState<string>('');
  const [configureChoice, setConfigureChoice] = React.useState<'yes' | 'no' | null>(null);

  // Revoke modal state
  const [isRevokeModalOpen, setIsRevokeModalOpen] = React.useState(false);
  const [revokeTargetOrg, setRevokeTargetOrg] = React.useState<Connection | null>(null);
  const [revokeConfirmText, setRevokeConfirmText] = React.useState('');

  // Establish wizard state
  const [isEstablishModalOpen, setIsEstablishModalOpen] = React.useState(false);
  const [establishOrgId, setEstablishOrgId] = React.useState('');
  const [establishDescription, setEstablishDescription] = React.useState('');
  const [establishSelectedGroups, setEstablishSelectedGroups] = React.useState<Set<string>>(new Set());
  const [establishGroupSearch, setEstablishGroupSearch] = React.useState('');
  const [establishGroupShowSelected, setEstablishGroupShowSelected] = React.useState(false);
  const [establishGroupPage, setEstablishGroupPage] = React.useState(1);
  const [establishGroupPerPage, setEstablishGroupPerPage] = React.useState(10);

  // Auto-close side panel when navigating or switching tabs
  React.useEffect(() => {
    if (isDetailsOpen) {
      setIsDetailsOpen(false);
    }
  }, [location.pathname, activeTabKey]);

  // Toasts
  const [toasts, setToasts] = React.useState<Array<{ key: number; title: string; description?: React.ReactNode; variant?: 'success' | 'info' | 'warning' | 'danger' }>>([]);
  const addToast = (title: string, description?: React.ReactNode, variant: 'success' | 'info' | 'warning' | 'danger' = 'success') =>
    setToasts((prev) => [...prev, { key: Date.now(), title, description, variant }]);
  const removeToast = (key: number) => setToasts((prev) => prev.filter((t) => t.key !== key));

  // ── Workspace tree for drawer ──────────────────────────────────────────

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
  const [selectedWorkspaces, setSelectedWorkspaces] = React.useState<Set<string>>(() => new Set());

  const getChildren = (id: string) => workspaceNodes.filter((n) => n.parentId === id).map((n) => n.id);
  const getDescendants = (id: string): string[] => getChildren(id).flatMap((cid) => [cid, ...getDescendants(cid)]);
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

  const buildTreeCheckProps = (nodeId: string) => {
    const ids = [nodeId, ...getDescendants(nodeId)];
    const total = ids.length;
    const selected = ids.filter((nid) => selectedWorkspaces.has(nid)).length;
    const checked = selected === 0 ? false : selected === total ? true : null;
    return { checked, onChange: (e: any) => toggleSelectWorkspace(nodeId, (e?.target as HTMLInputElement).checked) };
  };

  // ── Drawer: "User groups you shared" (Tab 1) ───────────────────────────

  type GroupRow = { id: string; name: string; members: number };

  const allOrgGroups: GroupRow[] = React.useMemo(() => [
    { id: 'ug-administrators', name: 'Administrators', members: 3 },
    { id: 'ug-dev-ops', name: 'DevOps Engineers', members: 8 },
    { id: 'ug-security', name: 'Security Team', members: 5 },
    { id: 'ug-platform', name: 'Platform Engineers', members: 12 },
    { id: 'ug-sre', name: 'SRE Team', members: 6 },
    { id: 'ug-compliance', name: 'Compliance Auditors', members: 4 },
    { id: 'ug-network', name: 'Network Admins', members: 3 },
    { id: 'ug-database', name: 'Database Admins', members: 5 },
    { id: 'ug-qa', name: 'QA Engineers', members: 9 },
    { id: 'ug-frontend', name: 'Frontend Developers', members: 11 },
    { id: 'ug-backend', name: 'Backend Developers', members: 14 },
    { id: 'ug-data-science', name: 'Data Science Team', members: 7 },
    { id: 'ug-product', name: 'Product Managers', members: 4 },
    { id: 'ug-design', name: 'UX Designers', members: 6 },
    { id: 'ug-support', name: 'Support Engineers', members: 8 },
    { id: 'ug-cloud', name: 'Cloud Architects', members: 3 },
    { id: 'ug-mobile', name: 'Mobile Developers', members: 5 },
    { id: 'ug-infra', name: 'Infrastructure Team', members: 10 },
  ], []);

  const [selectedGroups, setSelectedGroups] = React.useState<Set<string>>(new Set());
  const [originalSelectedGroups, setOriginalSelectedGroups] = React.useState<Set<string>>(new Set());
  const [sharedGroupSearch, setSharedGroupSearch] = React.useState('');
  const [sharedGroupShowSelected, setSharedGroupShowSelected] = React.useState(false);
  const [sharedGroupPage, setSharedGroupPage] = React.useState(1);
  const [sharedGroupPerPage, setSharedGroupPerPage] = React.useState(10);

  const generateSelectedGroupsForOrg = React.useCallback((orgId: string): Set<string> => {
    let hash = 0;
    for (let i = 0; i < orgId.length; i++) hash += orgId.charCodeAt(i);
    const count = 3 + (hash % 4);
    const selected = new Set<string>();
    for (let i = 0; i < count; i++) {
      selected.add(allOrgGroups[(hash + i * 3) % allOrgGroups.length].id);
    }
    return selected;
  }, [allOrgGroups]);

  const sharedGroupsFiltered = React.useMemo(() => {
    const search = sharedGroupSearch.trim().toLowerCase();
    let list = allOrgGroups;
    if (sharedGroupShowSelected) {
      list = list.filter((g) => selectedGroups.has(g.id));
    }
    if (search) {
      list = list.filter((g) => g.name.toLowerCase().includes(search));
    }
    return list;
  }, [allOrgGroups, sharedGroupSearch, sharedGroupShowSelected, selectedGroups]);

  const sharedGroupsPaginated = React.useMemo(() => {
    const start = (sharedGroupPage - 1) * sharedGroupPerPage;
    return sharedGroupsFiltered.slice(start, start + sharedGroupPerPage);
  }, [sharedGroupsFiltered, sharedGroupPage, sharedGroupPerPage]);

  const onToggleGroup = (groupId: string, checked: boolean) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (checked) next.add(groupId); else next.delete(groupId);
      return next;
    });
  };

  const isDirty = React.useMemo(() => {
    if (originalSelectedGroups.size !== selectedGroups.size) return true;
    for (const id of Array.from(originalSelectedGroups)) {
      if (!selectedGroups.has(id)) return true;
    }
    return false;
  }, [originalSelectedGroups, selectedGroups]);

  const onCancelGroups = () => {
    setSelectedGroups(new Set(originalSelectedGroups));
  };

  const onSaveGroups = () => {
    setOriginalSelectedGroups(new Set(selectedGroups));
    addToast('Sharing settings saved successfully.');
  };

  // ── Drawer: "User groups they shared with you" (Tab 2) ────────────────

  type ForeignGroupRow = { id: string; name: string; members: number };
  const [foreignGroups, setForeignGroups] = React.useState<ForeignGroupRow[]>([]);
  const [foreignGroupSearch, setForeignGroupSearch] = React.useState('');

  const generateForeignGroupsForOrg = React.useCallback((orgId: string): ForeignGroupRow[] => {
    const names = [
      'Engineering', 'Operations', 'Cloud Services', 'Data Platform',
      'Security Ops', 'DevOps', 'Analytics', 'Infrastructure',
    ];
    let hash = 0;
    for (let i = 0; i < orgId.length; i++) hash += orgId.charCodeAt(i);
    const count = 2 + (hash % 4);
    return Array.from({ length: count }).map((_, idx) => ({
      id: `fg-${orgId}-${idx}`,
      name: names[(hash + idx * 2) % names.length],
      members: 2 + ((hash + idx) % 10),
    }));
  }, []);

  const foreignGroupsFiltered = React.useMemo(() => {
    const search = foreignGroupSearch.trim().toLowerCase();
    if (!search) return foreignGroups;
    return foreignGroups.filter((g) => g.name.toLowerCase().includes(search));
  }, [foreignGroups, foreignGroupSearch]);

  // ── Connections data ───────────────────────────────────────────────────

  const [connectionsData, setConnectionsData] = React.useState<Connection[]>([
    { organizationName: 'Acme Corp', orgId: '100001', status: 'Connected', connectedDate: '2025-09-01' },
    { organizationName: 'Initech', orgId: '300123', status: 'Connected', connectedDate: '2025-09-12' },
    { organizationName: 'Soylent', orgId: '500567', status: 'Connected', connectedDate: '2025-09-05' },
    { organizationName: 'Stark Industries', orgId: '600234', status: 'Connected', connectedDate: '2025-08-15' },
    { organizationName: 'Massive Dynamic', orgId: '700456', status: 'Connected', connectedDate: '2025-07-20' },
    { organizationName: 'Dunder Mifflin', orgId: '800321', status: 'Connected', connectedDate: '2025-06-10' },
    { organizationName: 'Umbrella', orgId: '400789', status: 'Revoked', connectedDate: '2025-07-19' },
    { organizationName: 'Hooli', orgId: '500100', status: 'Rejected', connectedDate: '2025-05-15' },
  ]);

  // ── Pending requests data ──────────────────────────────────────────────

  const [pendingData, setPendingData] = React.useState<PendingRequest[]>([
    { organizationName: 'Wayne Enterprises', orgId: '200099', direction: 'Outgoing', requestedDate: '2025-08-22', requester: 'You' },
    { organizationName: 'Globell', orgId: '200045', direction: 'Incoming', requestedDate: '2025-08-22', requester: 'Alex Smith' },
    { organizationName: 'Pied Piper', orgId: '700891', direction: 'Incoming', requestedDate: '2025-09-10', requester: 'Jordan Lee' },
    { organizationName: 'Vandelay Industries', orgId: '900112', direction: 'Outgoing', requestedDate: '2025-09-08', requester: 'You' },
  ]);

  // ── Change log data ────────────────────────────────────────────────────

  const [changeLogData, setChangeLogData] = React.useState<ChangeLogEntry[]>([
    { id: 'cl1', timestamp: '2025-09-12T14:30:00', action: 'Connection established', resource: 'Trusted org', description: 'Trust with Initech (300123) accepted \u2014 no groups shared at acceptance', performedBy: 'admin@myorg.com' },
    { id: 'cl2', timestamp: '2025-09-10T11:15:00', action: 'Request sent', resource: 'Trusted org', description: 'Trust request received from Pied Piper (700891)', performedBy: 'jordan.lee@piedpiper.com' },
    { id: 'cl3', timestamp: '2025-09-08T09:00:00', action: 'Request sent', resource: 'Trusted org', description: 'Trust request sent to Vandelay Industries (900112)', performedBy: 'admin@myorg.com' },
    { id: 'cl4', timestamp: '2025-09-05T09:15:00', action: 'Connection established', resource: 'Trusted org', description: 'Trust with Soylent (500567) accepted \u2014 shared "Engineering"', performedBy: 'admin@myorg.com' },
    { id: 'cl5', timestamp: '2025-09-01T11:00:00', action: 'Connection established', resource: 'Trusted org', description: 'Trust with Acme Corp (100001) accepted \u2014 shared "Administrators", "DevOps Engineers"', performedBy: 'admin@myorg.com' },
    { id: 'cl6', timestamp: '2025-08-25T16:45:00', action: 'Sharing updated', resource: 'User group', description: 'Group "Administrators" shared with Acme Corp', performedBy: 'user1@myorg.com' },
    { id: 'cl7', timestamp: '2025-08-22T10:00:00', action: 'Request sent', resource: 'Trusted org', description: 'Trust request sent to Wayne Enterprises (200099)', performedBy: 'admin@myorg.com' },
    { id: 'cl8', timestamp: '2025-08-22T08:30:00', action: 'Request sent', resource: 'Trusted org', description: 'Trust request received from Globell (200045)', performedBy: 'alex.smith@globell.com' },
    { id: 'cl9', timestamp: '2025-08-15T08:30:00', action: 'Connection established', resource: 'Trusted org', description: 'Trust with Stark Industries accepted \u2014 shared "Bad Bunnies"', performedBy: 'admin@myorg.com' },
    { id: 'cl10', timestamp: '2025-07-20T13:20:00', action: 'Connection established', resource: 'Trusted org', description: 'Trust with Massive Dynamic (700456) accepted \u2014 shared "Cloud Architects"', performedBy: 'admin@myorg.com' },
    { id: 'cl11', timestamp: '2025-07-19T13:20:00', action: 'Connection revoked', resource: 'Trusted org', description: 'Trust with Umbrella (400789) revoked \u2014 4 role bindings invalidated in 12s', performedBy: 'admin@myorg.com' },
    { id: 'cl12', timestamp: '2025-06-10T10:00:00', action: 'Connection established', resource: 'Trusted org', description: 'Trust with Dunder Mifflin (800321) accepted \u2014 shared "SRE Team", "Network Admins"', performedBy: 'admin@myorg.com' },
    { id: 'cl13', timestamp: '2025-05-15T14:00:00', action: 'Request rejected', resource: 'Trusted org', description: 'Trust request from Hooli (500100) rejected', performedBy: 'admin@myorg.com' },
    { id: 'cl14', timestamp: '2025-05-10T09:00:00', action: 'Sharing updated', resource: 'User group', description: 'Stopped sharing group "Golden Girls" with Globell \u2014 removed from all existing role bindings, Globell notified', performedBy: 'admin@myorg.com' },
  ]);

  // ── Establish wizard computed values ──────────────────────────────────

  const establishOrgIdInvalid = establishOrgId.trim() !== '' && (
    connectionsData.some((c) => c.orgId === establishOrgId.trim() && c.status === 'Connected') ||
    pendingData.some((p) => p.orgId === establishOrgId.trim())
  );

  const establishGroupsFiltered = React.useMemo(() => {
    let list = allOrgGroups;
    if (establishGroupShowSelected) {
      list = list.filter((g) => establishSelectedGroups.has(g.id));
    }
    if (establishGroupSearch.trim()) {
      const term = establishGroupSearch.toLowerCase();
      list = list.filter((g) => g.name.toLowerCase().includes(term));
    }
    return list;
  }, [allOrgGroups, establishGroupSearch, establishGroupShowSelected, establishSelectedGroups]);

  const establishGroupsPaginated = React.useMemo(() => {
    const start = (establishGroupPage - 1) * establishGroupPerPage;
    return establishGroupsFiltered.slice(start, start + establishGroupPerPage);
  }, [establishGroupsFiltered, establishGroupPage, establishGroupPerPage]);

  // ── Connections filtering/sorting/pagination ───────────────────────────

  const connectionsFilteredAndSorted = React.useMemo(() => {
    const value = textFilter.trim().toLowerCase();
    const filtered = connectionsData.filter((row) => {
      if (!value) return true;
      if (selectedFilterField === 'Org ID') return row.orgId.toLowerCase().includes(value);
      return row.organizationName.toLowerCase().includes(value);
    });
    return [...filtered].sort((a, b) => {
      const dir = sortBy.direction === 'desc' ? -1 : 1;
      switch (sortBy.index) {
        case 0: return a.organizationName.localeCompare(b.organizationName) * dir;
        case 1: return a.orgId.localeCompare(b.orgId) * dir;
        case 2: return a.status.localeCompare(b.status) * dir;
        case 3: return a.connectedDate.localeCompare(b.connectedDate) * dir;
        default: return 0;
      }
    });
  }, [connectionsData, textFilter, selectedFilterField, sortBy]);

  const connectionsPaginated = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return connectionsFilteredAndSorted.slice(start, start + perPage);
  }, [connectionsFilteredAndSorted, page, perPage]);

  // ── Pending subtabs and filtering/sorting ─────────────────────────────

  const [pendingSubTab, setPendingSubTab] = React.useState<string | number>(0);

  // Received (Incoming) filtering
  const [receivedSortBy, setReceivedSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' | undefined }>({ index: 3, direction: 'desc' });
  const [receivedPage, setReceivedPage] = React.useState(1);
  const [receivedPerPage, setReceivedPerPage] = React.useState(10);
  const [receivedTextFilter, setReceivedTextFilter] = React.useState('');

  const receivedData = React.useMemo(() => pendingData.filter((r) => r.direction === 'Incoming'), [pendingData]);

  const receivedFilteredAndSorted = React.useMemo(() => {
    const value = receivedTextFilter.trim().toLowerCase();
    const filtered = receivedData.filter((row) => {
      if (!value) return true;
      return row.organizationName.toLowerCase().includes(value) || row.orgId.toLowerCase().includes(value);
    });
    return [...filtered].sort((a, b) => {
      const dir = receivedSortBy.direction === 'desc' ? -1 : 1;
      switch (receivedSortBy.index) {
        case 0: return a.organizationName.localeCompare(b.organizationName) * dir;
        case 1: return a.orgId.localeCompare(b.orgId) * dir;
        case 2: return a.requester.localeCompare(b.requester) * dir;
        case 3: return a.requestedDate.localeCompare(b.requestedDate) * dir;
        default: return 0;
      }
    });
  }, [receivedData, receivedTextFilter, receivedSortBy]);

  const receivedPaginated = React.useMemo(() => {
    const start = (receivedPage - 1) * receivedPerPage;
    return receivedFilteredAndSorted.slice(start, start + receivedPerPage);
  }, [receivedFilteredAndSorted, receivedPage, receivedPerPage]);

  const onReceivedSort = (_event: any, columnIndex: number, direction: 'asc' | 'desc') => setReceivedSortBy({ index: columnIndex, direction });

  // Sent (Outgoing) filtering
  const [sentSortBy, setSentSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' | undefined }>({ index: 2, direction: 'desc' });
  const [sentPage, setSentPage] = React.useState(1);
  const [sentPerPage, setSentPerPage] = React.useState(10);
  const [sentTextFilter, setSentTextFilter] = React.useState('');

  const sentData = React.useMemo(() => pendingData.filter((r) => r.direction === 'Outgoing'), [pendingData]);

  const sentFilteredAndSorted = React.useMemo(() => {
    const value = sentTextFilter.trim().toLowerCase();
    const filtered = sentData.filter((row) => {
      if (!value) return true;
      return row.organizationName.toLowerCase().includes(value) || row.orgId.toLowerCase().includes(value);
    });
    return [...filtered].sort((a, b) => {
      const dir = sentSortBy.direction === 'desc' ? -1 : 1;
      switch (sentSortBy.index) {
        case 0: return a.organizationName.localeCompare(b.organizationName) * dir;
        case 1: return a.orgId.localeCompare(b.orgId) * dir;
        case 2: return a.requestedDate.localeCompare(b.requestedDate) * dir;
        default: return 0;
      }
    });
  }, [sentData, sentTextFilter, sentSortBy]);

  const sentPaginated = React.useMemo(() => {
    const start = (sentPage - 1) * sentPerPage;
    return sentFilteredAndSorted.slice(start, start + sentPerPage);
  }, [sentFilteredAndSorted, sentPage, sentPerPage]);

  const onSentSort = (_event: any, columnIndex: number, direction: 'asc' | 'desc') => setSentSortBy({ index: columnIndex, direction });

  // ── Change log sorting/pagination ──────────────────────────────────────

  const [logPage, setLogPage] = React.useState(1);
  const [logPerPage, setLogPerPage] = React.useState(10);
  const [logTextFilter, setLogTextFilter] = React.useState('');

  const logFilteredAndSorted = React.useMemo(() => {
    const value = logTextFilter.trim().toLowerCase();
    const filtered = changeLogData.filter((row) => {
      if (!value) return true;
      return row.description.toLowerCase().includes(value) ||
        row.action.toLowerCase().includes(value) ||
        row.resource.toLowerCase().includes(value) ||
        row.performedBy.toLowerCase().includes(value);
    });
    return [...filtered].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [changeLogData, logTextFilter]);

  const logPaginated = React.useMemo(() => {
    const start = (logPage - 1) * logPerPage;
    return logFilteredAndSorted.slice(start, start + logPerPage);
  }, [logFilteredAndSorted, logPage, logPerPage]);

  // ── Handlers ───────────────────────────────────────────────────────────

  const onSetPage = (_event: any, newPage: number) => setPage(newPage);
  const onPerPageSelect = (_event: any, newPerPage: number) => { setPerPage(newPerPage); setPage(1); };
  const onSort = (_event: any, columnIndex: number, direction: 'asc' | 'desc') => setSortBy({ index: columnIndex, direction });

  const openDetails = (org: Connection) => {
    setSelectedOrg(org);
    const sel = generateSelectedGroupsForOrg(org.orgId);
    setSelectedGroups(sel);
    setOriginalSelectedGroups(new Set(sel));
    setSharedGroupSearch('');
    setSharedGroupShowSelected(false);
    setSharedGroupPage(1);
    setForeignGroups(generateForeignGroupsForOrg(org.orgId));
    setForeignGroupSearch('');
    setDetailsTabKey(0);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  const [wizardSelectedGroups, setWizardSelectedGroups] = React.useState<Set<string>>(new Set());
  const [wizardGroupSearch, setWizardGroupSearch] = React.useState('');
  const [wizardGroupShowSelected, setWizardGroupShowSelected] = React.useState(false);
  const [wizardGroupPage, setWizardGroupPage] = React.useState(1);
  const [wizardGroupPerPage, setWizardGroupPerPage] = React.useState(10);
  const [wizardForeignGroups, setWizardForeignGroups] = React.useState<ForeignGroupRow[]>([]);
  const [wizardForeignGroupsExpanded, setWizardForeignGroupsExpanded] = React.useState(false);

  const wizardGroupsFiltered = React.useMemo(() => {
    let list = allOrgGroups;
    if (wizardGroupShowSelected) {
      list = list.filter((g) => wizardSelectedGroups.has(g.id));
    }
    if (wizardGroupSearch.trim()) {
      const term = wizardGroupSearch.toLowerCase();
      list = list.filter((g) => g.name.toLowerCase().includes(term));
    }
    return list;
  }, [allOrgGroups, wizardGroupSearch, wizardGroupShowSelected, wizardSelectedGroups]);

  const wizardGroupsPaginated = React.useMemo(() => {
    const start = (wizardGroupPage - 1) * wizardGroupPerPage;
    return wizardGroupsFiltered.slice(start, start + wizardGroupPerPage);
  }, [wizardGroupsFiltered, wizardGroupPage, wizardGroupPerPage]);

  const openPendingWizard = (req: PendingRequest) => {
    setPendingWizardRequest(req);
    setWizardSelectedGroups(new Set());
    setWizardGroupSearch('');
    setWizardGroupShowSelected(false);
    setWizardGroupPage(1);
    setWizardForeignGroups(generateForeignGroupsForOrg(req.orgId));
    setWizardForeignGroupsExpanded(false);
    setAcceptChoice(null);
    setVerifyEmail('');
    setPendingWizardComplete(false);
    setOpenKebabKey(null);
    window.setTimeout(() => setIsPendingWizardOpen(true), 100);
  };

  const closePendingWizard = () => {
    setIsPendingWizardOpen(false);
    setPendingWizardRequest(null);
  };

  const addChangeLogEntry = (action: ChangeLogEntry['action'], description: string, by: string, resource = 'Trusted org') => {
    setChangeLogData((prev) => [{
      id: `cl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      resource,
      description,
      performedBy: by,
    }, ...prev]);
  };

  // Lock background scroll when drawer is open
  React.useEffect(() => {
    if (isDetailsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDetailsOpen]);

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' +
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const actionLabel = (action: ChangeLogEntry['action']) => {
    switch (action) {
      case 'Connection established': return { color: 'green' as const, icon: <CheckCircleIcon /> };
      case 'Connection revoked': return { color: 'red' as const, icon: <ExclamationCircleIcon /> };
      case 'Sharing updated': return { color: 'blue' as const, icon: <SyncAltIcon /> };
      case 'Request sent': return { color: 'blue' as const, icon: <ArrowRightIcon /> };
      case 'Request accepted': return { color: 'green' as const, icon: <CheckCircleIcon /> };
      case 'Request rejected': return { color: 'orange' as const, icon: <ExclamationTriangleIcon /> };
      case 'Request cancelled': return { color: 'grey' as const, icon: <ExclamationCircleIcon /> };
      default: return { color: 'grey' as const, icon: <HistoryIcon /> };
    }
  };

  // ── Tree data builder ──────────────────────────────────────────────────

  const buildWorkspaceTreeData = () => {
    const buildNode = (nodeId: string): any => {
      const node = workspaceNodes.find((n) => n.id === nodeId)!;
      const children = workspaceNodes.filter((n) => n.parentId === nodeId);
      return {
        id: node.id,
        name: node.name,
        hasCheckbox: true,
        defaultExpanded: false,
        checkProps: buildTreeCheckProps(node.id),
        ...(children.length > 0 ? { children: children.map((c) => buildNode(c.id)) } : {}),
      };
    };
    return workspaceNodes.filter((n) => !n.parentId).map((n) => buildNode(n.id));
  };

  // ── Render ─────────────────────────────────────────────────────────────

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

          {/* ────────────────── TAB 0: Connections ────────────────── */}
          <Tab eventKey={0} title={<TabTitleText>Connections</TabTitleText>}>
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
                        overflow: 'hidden',
                      }}
                    >
                      <DrawerHead>
                        <div>
                          <Title headingLevel="h2" size="lg">{selectedOrg?.organizationName ?? 'Organization'}</Title>
                          <div style={{ marginTop: 16, color: 'var(--pf-v6-global--Color--100)' }}>
                            User groups shared between your organization and {selectedOrg?.organizationName}
                          </div>
                        </div>
                        <DrawerActions>
                          <DrawerCloseButton onClick={closeDetails} />
                        </DrawerActions>
                      </DrawerHead>
                      <DrawerContentBody style={{ flex: '1 1 auto', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <Tabs activeKey={detailsTabKey} onSelect={(_e, key) => setDetailsTabKey(key)} isSubtab usePageInsets>
                          <Tab eventKey={0} title={<TabTitleText>Shared with {selectedOrg?.organizationName}</TabTitleText>}>
                            <div style={{ padding: '16px 16px 0' }}>
                              <Toolbar>
                                <ToolbarContent>
                                  <ToolbarItem>
                                    <SearchInput
                                      aria-label="Search your shared user groups"
                                      placeholder="Search by group name"
                                      value={sharedGroupSearch}
                                      onChange={(_event, value) => { setSharedGroupSearch(value); setSharedGroupPage(1); }}
                                      onClear={() => { setSharedGroupSearch(''); setSharedGroupPage(1); }}
                                    />
                                  </ToolbarItem>
                                  <ToolbarItem>
                                    <ToggleGroup aria-label="Filter by selection">
                                      <ToggleGroupItem
                                        text="All"
                                        isSelected={!sharedGroupShowSelected}
                                        onChange={() => { setSharedGroupShowSelected(false); setSharedGroupPage(1); }}
                                      />
                                      <ToggleGroupItem
                                        text="Selected"
                                        isSelected={sharedGroupShowSelected}
                                        onChange={() => { setSharedGroupShowSelected(true); setSharedGroupPage(1); }}
                                      />
                                    </ToggleGroup>
                                  </ToolbarItem>
                                  <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                                    <Pagination
                                      itemCount={sharedGroupsFiltered.length}
                                      perPage={sharedGroupPerPage}
                                      page={sharedGroupPage}
                                      onSetPage={(_e, p) => setSharedGroupPage(p)}
                                      onPerPageSelect={(_e, pp) => { setSharedGroupPerPage(pp); setSharedGroupPage(1); }}
                                      isCompact
                                    />
                                  </ToolbarItem>
                                </ToolbarContent>
                              </Toolbar>
                              <Table aria-label="User groups you shared" variant="compact">
                                <Thead>
                                  <Tr>
                                    <Th
                                      select={{
                                        onSelect: (_event, isSelecting) => {
                                          if (isSelecting) {
                                            setSelectedGroups(new Set(allOrgGroups.map((g) => g.id)));
                                          } else {
                                            setSelectedGroups(new Set());
                                          }
                                        },
                                        isSelected: allOrgGroups.length > 0 && selectedGroups.size === allOrgGroups.length,
                                      }}
                                    />
                                    <Th>User group name</Th>
                                    <Th>Members</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {sharedGroupsPaginated.map((g) => (
                                    <Tr key={g.id}>
                                      <Td
                                        select={{
                                          rowIndex: allOrgGroups.findIndex((r) => r.id === g.id),
                                          onSelect: (_event, isSelecting) => onToggleGroup(g.id, isSelecting),
                                          isSelected: selectedGroups.has(g.id),
                                        }}
                                      />
                                      <Td dataLabel="User group name">{g.name}</Td>
                                      <Td dataLabel="Members">
                                        {g.members}
                                      </Td>
                                    </Tr>
                                  ))}
                                  {sharedGroupsPaginated.length === 0 && (
                                    <Tr>
                                      <Td colSpan={3} style={{ textAlign: 'center', padding: 24, color: 'var(--pf-v6-global--Color--200)' }}>
                                        {sharedGroupShowSelected ? 'No groups are currently selected.' : 'No groups match your search.'}
                                      </Td>
                                    </Tr>
                                  )}
                                </Tbody>
                              </Table>
                              {isDirty && (
                                <div style={{ position: 'sticky', bottom: 0, padding: '16px', background: 'var(--pf-v6-global--BackgroundColor--100)', boxShadow: '0 -1px 0 var(--pf-v6-global--BorderColor--100)', display: 'flex', gap: '8px' }}>
                                  <Button variant="primary" onClick={onSaveGroups}>Save changes</Button>
                                  <Button variant="link" onClick={onCancelGroups}>Cancel</Button>
                                </div>
                              )}
                            </div>
                          </Tab>
                          <Tab eventKey={1} title={<TabTitleText>{selectedOrg?.organizationName} shared with you</TabTitleText>}>
                            <div style={{ padding: '16px 16px 0' }}>
                              <Toolbar>
                                <ToolbarContent>
                                  <ToolbarItem style={{ flex: 1 }}>
                                    <SearchInput
                                      aria-label="Search their shared user groups"
                                      placeholder="Search by group name"
                                      value={foreignGroupSearch}
                                      onChange={(_event, value) => setForeignGroupSearch(value)}
                                      onClear={() => setForeignGroupSearch('')}
                                    />
                                  </ToolbarItem>
                                  <ToolbarItem>
                                    <Button variant="secondary" style={{ whiteSpace: 'nowrap' }}>Grant workspace access</Button>
                                  </ToolbarItem>
                                </ToolbarContent>
                              </Toolbar>
                              <Table aria-label="User groups shared with you" variant="compact">
                                <Thead>
                                  <Tr>
                                    <Th>User group name</Th>
                                    <Th>Members</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {foreignGroupsFiltered.map((g) => (
                                    <Tr key={g.id}>
                                      <Td dataLabel="User group name">{g.name}</Td>
                                      <Td dataLabel="Members">
                                        {g.members}
                                      </Td>
                                    </Tr>
                                  ))}
                                  {foreignGroupsFiltered.length === 0 && (
                                    <Tr>
                                      <Td colSpan={2} style={{ textAlign: 'center', padding: 24, color: 'var(--pf-v6-global--Color--200)' }}>
                                        No groups match your search.
                                      </Td>
                                    </Tr>
                                  )}
                                </Tbody>
                              </Table>
                            </div>
                          </Tab>
                        </Tabs>
                      </DrawerContentBody>
                    </DrawerPanelContent>
                  }
                >
                  <DrawerContentBody>
                    <Toolbar id="trusted-orgs-connections-toolbar">
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
                          <Button variant="primary" onClick={() => { setEstablishOrgId(''); setEstablishDescription(''); setEstablishSelectedGroups(new Set()); setEstablishGroupSearch(''); setEstablishGroupShowSelected(false); setEstablishGroupPage(1); setIsEstablishModalOpen(true); }}>Establish a trusted org</Button>
                        </ToolbarItem>
                        <ToolbarItem variant="pagination">
                          <Pagination
                            itemCount={connectionsFilteredAndSorted.length}
                            perPage={perPage}
                            page={page}
                            onSetPage={onSetPage}
                            onPerPageSelect={onPerPageSelect}
                            isCompact={false}
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>
                    <Table aria-label="Trusted organization connections table">
                      <Thead>
                        <Tr>
                          <Th sort={{ sortBy, onSort, columnIndex: 0 }} width={35}>Organization name</Th>
                          <Th sort={{ sortBy, onSort, columnIndex: 1 }} width={20}>Org ID</Th>
                          <Th sort={{ sortBy, onSort, columnIndex: 2 }} width={15}>Status</Th>
                          <Th sort={{ sortBy, onSort, columnIndex: 3 }} width={20}>Connected date</Th>
                          <Th aria-label="Row actions" />
                        </Tr>
                      </Thead>
                      <Tbody>
                        {connectionsPaginated.map((row) => (
                          <Tr key={row.orgId}>
                            <Td dataLabel="Organization name">
                              {row.status === 'Connected' ? (
                                <Button variant="link" isInline onClick={() => openDetails(row)}>
                                  {row.organizationName}
                                </Button>
                              ) : (
                                <span>{row.organizationName}</span>
                              )}
                            </Td>
                            <Td dataLabel="Org ID">{row.orgId}</Td>
                            <Td dataLabel="Status">
                              {row.status === 'Connected' && (
                                <Label color="green" icon={<CheckCircleIcon />}>Connected</Label>
                              )}
                              {row.status === 'Revoked' && (
                                <Label color="red" icon={<ExclamationCircleIcon />}>Revoked</Label>
                              )}
                              {row.status === 'Rejected' && (
                                <Label color="yellow" icon={<ExclamationTriangleIcon />}>Rejected</Label>
                              )}
                            </Td>
                            <Td dataLabel="Connected date">{row.connectedDate}</Td>
                            <Td isActionCell>
                              <Dropdown
                                isOpen={openKebabKey === `conn-${row.orgId}`}
                                onSelect={() => setOpenKebabKey(null)}
                                onOpenChange={(isOpen) => setOpenKebabKey(isOpen ? `conn-${row.orgId}` : null)}
                                toggle={(toggleRef) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    aria-label={`Row actions for ${row.organizationName}`}
                                    variant="plain"
                                    onClick={() => setOpenKebabKey(openKebabKey === `conn-${row.orgId}` ? null : `conn-${row.orgId}`)}
                                    isExpanded={openKebabKey === `conn-${row.orgId}`}
                                  >
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                                popperProps={{ position: 'right' }}
                              >
                                <DropdownList>
                                  {row.status === 'Connected' && (
                                    <>
                                      <DropdownItem
                                        onClick={() => {
                                          setOpenKebabKey(null);
                                          openDetails(row);
                                        }}
                                      >
                                        Manage sharing
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={() => {
                                          setOpenKebabKey(null);
                                          setRevokeTargetOrg(row);
                                          setRevokeConfirmText('');
                                          setIsRevokeModalOpen(true);
                                        }}
                                      >
                                        Revoke connection
                                      </DropdownItem>
                                    </>
                                  )}
                                  {(row.status === 'Revoked' || row.status === 'Rejected') && (
                                    <>
                                      <DropdownItem
                                        onClick={() => {
                                          setOpenKebabKey(null);
                                          setEstablishOrgId(row.orgId);
                                          setEstablishDescription('');
                                          setEstablishSelectedGroups(new Set());
                                          setEstablishGroupSearch('');
                                          setEstablishGroupShowSelected(false);
                                          setEstablishGroupPage(1);
                                          setIsEstablishModalOpen(true);
                                        }}
                                      >
                                        Re-establish connection
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={() => {
                                          setOpenKebabKey(null);
                                          setConnectionsData((prev) => prev.filter((c) => c.orgId !== row.orgId));
                                          addToast(
                                            `${row.organizationName} has been deleted from your connections.`,
                                            undefined,
                                            'info'
                                          );
                                        }}
                                      >
                                        Delete
                                      </DropdownItem>
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

          {/* ────────────────── TAB 1: Pending requests ────────────────── */}
          <Tab eventKey={1} title={<TabTitleText>Pending requests</TabTitleText>}>
            <Tabs activeKey={pendingSubTab} onSelect={(_e, key) => setPendingSubTab(key)} isSubtab usePageInsets>
              {/* ── Received (Incoming) ── */}
              <Tab eventKey={0} title={<TabTitleText>Received</TabTitleText>}>
                <PageSection hasBodyWrapper={false}>
                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarItem>
                        <SearchInput
                          aria-label="Filter received requests"
                          placeholder="Filter by name or Org ID"
                          value={receivedTextFilter}
                          onChange={(_event, value) => { setReceivedTextFilter(value); setReceivedPage(1); }}
                          onClear={() => { setReceivedTextFilter(''); setReceivedPage(1); }}
                        />
                      </ToolbarItem>
                      <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                        <Pagination
                          itemCount={receivedFilteredAndSorted.length}
                          perPage={receivedPerPage}
                          page={receivedPage}
                          onSetPage={(_e, p) => setReceivedPage(p)}
                          onPerPageSelect={(_e, pp) => { setReceivedPerPage(pp); setReceivedPage(1); }}
                          isCompact
                        />
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>
                  <Table aria-label="Received trusted organization requests table">
                    <Thead>
                      <Tr>
                        <Th sort={{ sortBy: receivedSortBy, onSort: onReceivedSort, columnIndex: 0 }} width={25}>Organization name</Th>
                        <Th sort={{ sortBy: receivedSortBy, onSort: onReceivedSort, columnIndex: 1 }} width={15}>Org ID</Th>
                        <Th sort={{ sortBy: receivedSortBy, onSort: onReceivedSort, columnIndex: 2 }} width={20}>Requester</Th>
                        <Th sort={{ sortBy: receivedSortBy, onSort: onReceivedSort, columnIndex: 3 }} width={20}>Requested date</Th>
                        <Th aria-label="Row actions" />
                      </Tr>
                    </Thead>
                    <Tbody>
                      {receivedPaginated.map((row) => (
                        <Tr key={row.orgId}>
                          <Td dataLabel="Organization name">{row.organizationName}</Td>
                          <Td dataLabel="Org ID">{row.orgId}</Td>
                          <Td dataLabel="Requester">{row.requester}</Td>
                          <Td dataLabel="Requested date">{row.requestedDate}</Td>
                          <Td isActionCell>
                            <Button variant="secondary" size="sm" onClick={() => openPendingWizard(row)}>
                              Review request
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                      {receivedPaginated.length === 0 && (
                        <Tr>
                          <Td colSpan={5}>
                            <EmptyState headingLevel="h3" titleText="No received requests" isFullHeight>
                              <EmptyStateBody>There are no incoming trusted organization requests at this time.</EmptyStateBody>
                            </EmptyState>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </PageSection>
              </Tab>

              {/* ── Sent (Outgoing) ── */}
              <Tab eventKey={1} title={<TabTitleText>Sent</TabTitleText>}>
                <PageSection hasBodyWrapper={false}>
                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarItem>
                        <SearchInput
                          aria-label="Filter sent requests"
                          placeholder="Filter by name or Org ID"
                          value={sentTextFilter}
                          onChange={(_event, value) => { setSentTextFilter(value); setSentPage(1); }}
                          onClear={() => { setSentTextFilter(''); setSentPage(1); }}
                        />
                      </ToolbarItem>
                      <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                        <Pagination
                          itemCount={sentFilteredAndSorted.length}
                          perPage={sentPerPage}
                          page={sentPage}
                          onSetPage={(_e, p) => setSentPage(p)}
                          onPerPageSelect={(_e, pp) => { setSentPerPage(pp); setSentPage(1); }}
                          isCompact
                        />
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>
                  <Table aria-label="Sent trusted organization requests table">
                    <Thead>
                      <Tr>
                        <Th sort={{ sortBy: sentSortBy, onSort: onSentSort, columnIndex: 0 }} width={30}>Organization name</Th>
                        <Th sort={{ sortBy: sentSortBy, onSort: onSentSort, columnIndex: 1 }} width={20}>Org ID</Th>
                        <Th width={20}>Status</Th>
                        <Th sort={{ sortBy: sentSortBy, onSort: onSentSort, columnIndex: 2 }} width={20}>Requested date</Th>
                        <Th aria-label="Row actions" />
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sentPaginated.map((row) => (
                        <Tr key={row.orgId}>
                          <Td dataLabel="Organization name">{row.organizationName}</Td>
                          <Td dataLabel="Org ID">{row.orgId}</Td>
                          <Td dataLabel="Status">
                            <Label color="blue">Pending</Label>
                          </Td>
                          <Td dataLabel="Requested date">{row.requestedDate}</Td>
                          <Td isActionCell>
                            <Dropdown
                              isOpen={openKebabKey === `sent-${row.orgId}`}
                              onSelect={() => setOpenKebabKey(null)}
                              onOpenChange={(isOpen) => setOpenKebabKey(isOpen ? `sent-${row.orgId}` : null)}
                              toggle={(toggleRef) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  aria-label={`Actions for ${row.organizationName}`}
                                  variant="plain"
                                  onClick={() => setOpenKebabKey(openKebabKey === `sent-${row.orgId}` ? null : `sent-${row.orgId}`)}
                                >
                                  <EllipsisVIcon />
                                </MenuToggle>
                              )}
                              popperProps={{ position: 'right' }}
                            >
                              <DropdownList>
                                <DropdownItem onClick={() => {
                                  setOpenKebabKey(null);
                                  addToast(`A reminder has been sent to ${row.organizationName}.`);
                                }}>
                                  Send reminder
                                </DropdownItem>
                                <DropdownItem onClick={() => {
                                  setOpenKebabKey(null);
                                  setPendingData((prev) => prev.filter((p) => !(p.orgId === row.orgId && p.direction === 'Outgoing')));
                                  addChangeLogEntry('Request cancelled', `Trust request to ${row.organizationName} (${row.orgId}) cancelled`, 'admin@myorg.com');
                                  addToast(
                                    `The outgoing request to ${row.organizationName} has been cancelled.`,
                                    undefined,
                                    'info'
                                  );
                                }}>
                                  Cancel request
                                </DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </Td>
                        </Tr>
                      ))}
                      {sentPaginated.length === 0 && (
                        <Tr>
                          <Td colSpan={5}>
                            <EmptyState headingLevel="h3" titleText="No sent requests" isFullHeight>
                              <EmptyStateBody>You have not sent any trusted organization requests.</EmptyStateBody>
                            </EmptyState>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </PageSection>
              </Tab>
            </Tabs>
          </Tab>

          {/* ────────────────── TAB 2: Change log ────────────────── */}
          <Tab eventKey={2} title={<TabTitleText>Change log</TabTitleText>}>
            <PageSection hasBodyWrapper={false}>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <SearchInput
                      aria-label="Filter change log"
                      placeholder="Filter by name, action, or user"
                      value={logTextFilter}
                      onChange={(_event, value) => setLogTextFilter(value)}
                      onClear={() => setLogTextFilter('')}
                    />
                  </ToolbarItem>
                  <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                    <Pagination
                      itemCount={logFilteredAndSorted.length}
                      perPage={logPerPage}
                      page={logPage}
                      onSetPage={(_e, p) => setLogPage(p)}
                      onPerPageSelect={(_e, pp) => { setLogPerPage(pp); setLogPage(1); }}
                      isCompact
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
              <Table aria-label="Trusted organizations change log table">
                <Thead>
                  <Tr>
                    <Th width={15}>Date</Th>
                    <Th width={20}>Action</Th>
                    <Th width={35}>Description</Th>
                    <Th width={15}>Resource</Th>
                    <Th width={15}>Requestor</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {logPaginated.map((entry) => {
                    const { color, icon } = actionLabel(entry.action);
                    return (
                      <Tr key={entry.id}>
                        <Td dataLabel="Date">{formatTimestamp(entry.timestamp)}</Td>
                        <Td dataLabel="Action">
                          <Label color={color} icon={icon}>{entry.action}</Label>
                        </Td>
                        <Td dataLabel="Description">{entry.description}</Td>
                        <Td dataLabel="Resource">{entry.resource}</Td>
                        <Td dataLabel="Requestor">{entry.performedBy}</Td>
                      </Tr>
                    );
                  })}
                  {logPaginated.length === 0 && (
                    <Tr>
                      <Td colSpan={5}>
                        <EmptyState headingLevel="h3" titleText="No activity" isFullHeight>
                          <EmptyStateBody>No change log entries match your filter.</EmptyStateBody>
                        </EmptyState>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </PageSection>
          </Tab>

        </Tabs>
      </PageSection>

      {/* ────────────────── Pending request wizard (incoming) ────────────────── */}
      {isPendingWizardOpen && pendingWizardRequest && (
        <Modal isOpen onClose={closePendingWizard} variant="large" aria-label="Review trusted organization request wizard" className="trusted-wizard-modal">
          {!pendingWizardComplete && (
            <Wizard
              onClose={closePendingWizard}
              header={
                <WizardHeader
                  title={`Review trusted organization request from ${pendingWizardRequest.organizationName}`}
                  description="Review and manage this pending trust request."
                  onClose={closePendingWizard}
                />
              }
              startIndex={1}
              onStepChange={(_e, _current, prev) => {
                if (prev.id === 'step-1' && acceptChoice === 'reject') {
                  setPendingData((p) => p.filter((row) => row.orgId !== pendingWizardRequest.orgId));
                  addChangeLogEntry('Request rejected', `Trust request from ${pendingWizardRequest.organizationName} (${pendingWizardRequest.orgId}) rejected`, 'admin@myorg.com');
                  setPendingWizardComplete(true);
                }
              }}
              onSave={() => {
                if (acceptChoice === 'accept') {
                  setPendingData((prev) => prev.filter((row) => row.orgId !== pendingWizardRequest.orgId));
                  setConnectionsData((prev) => [...prev, {
                    organizationName: pendingWizardRequest.organizationName,
                    orgId: pendingWizardRequest.orgId,
                    status: 'Connected',
                    connectedDate: new Date().toISOString().slice(0, 10),
                  }]);
                  const sharedNames = allOrgGroups.filter((g) => wizardSelectedGroups.has(g.id)).map((g) => g.name);
                  const sharedSuffix = sharedNames.length > 0 ? ` \u2014 shared "${sharedNames.join('", "')}"` : ' \u2014 no groups shared at acceptance';
                  addChangeLogEntry('Connection established', `Trust with ${pendingWizardRequest.organizationName} (${pendingWizardRequest.orgId}) accepted${sharedSuffix}`, 'admin@myorg.com');
                } else {
                  setPendingData((prev) => prev.filter((row) => row.orgId !== pendingWizardRequest.orgId));
                  addChangeLogEntry('Request rejected', `Trust request from ${pendingWizardRequest.organizationName} (${pendingWizardRequest.orgId}) rejected`, 'admin@myorg.com');
                }
                setPendingWizardComplete(true);
              }}
            >
              <WizardStep id="step-1" name="Review request" footer={{ isBackHidden: true, isNextDisabled: acceptChoice === null || !verifyEmail.trim(), nextButtonText: acceptChoice === 'reject' ? 'Submit' : 'Next' }}>
                <div style={{ padding: 16 }}>
                  <Title headingLevel="h3" size="lg">You have a request to become a trusted organization. Review the request info below:</Title>
                  <p style={{ marginTop: 8 }}>
                    Accepting to become a trusted org to {pendingWizardRequest.organizationName} will allow them to see your organization.
                    For more information about trusted organizations, <a href="#">click here</a>.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 32, rowGap: 16, marginTop: 16 }}>
                    <div>
                      <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>Organization name</Title>
                      <div style={{ marginTop: 4 }}>{pendingWizardRequest.organizationName}</div>
                    </div>
                    <div>
                      <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>Organization ID</Title>
                      <div style={{ marginTop: 4 }}>{pendingWizardRequest.orgId}</div>
                    </div>
                    <div>
                      <Title headingLevel="h4" size="md" style={{ marginTop: 8, fontWeight: 700 }}>Requester name</Title>
                      <div style={{ marginTop: 4 }}>{pendingWizardRequest.requester}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>Request description</Title>
                    <p style={{ marginTop: 8 }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat.
                    </p>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <ExpandableSection
                      toggleText={wizardForeignGroupsExpanded
                        ? `Hide user groups shared by ${pendingWizardRequest.organizationName}`
                        : `View user groups shared by ${pendingWizardRequest.organizationName} (${wizardForeignGroups.length})`}
                      isExpanded={wizardForeignGroupsExpanded}
                      onToggle={(_e, expanded) => setWizardForeignGroupsExpanded(expanded)}
                    >
                      {wizardForeignGroups.length > 0 ? (
                        <Table aria-label="Foreign org shared user groups" variant="compact" style={{ marginTop: 8 }}>
                          <Thead>
                            <Tr>
                              <Th>User group name</Th>
                              <Th>Members</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {wizardForeignGroups.map((g) => (
                              <Tr key={g.id}>
                                <Td dataLabel="User group name">{g.name}</Td>
                                <Td dataLabel="Members">{g.members}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <p style={{ marginTop: 8, color: 'var(--pf-v6-global--Color--200)' }}>
                          {pendingWizardRequest.organizationName} has not shared any user groups.
                        </p>
                      )}
                    </ExpandableSection>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>
                      Do you accept the request from {pendingWizardRequest.organizationName} to be a trusted organization? <span aria-hidden="true" style={{ color: 'var(--pf-v6-global--danger-color--100)' }}>*</span>
                    </Title>
                    <div style={{ marginTop: 12 }}>
                      <Radio
                        id="accept-request-yes"
                        name="accept-request"
                        isChecked={acceptChoice === 'accept'}
                        onChange={() => setAcceptChoice('accept')}
                        label={`I accept this request to become a trusted org to ${pendingWizardRequest.organizationName}`}
                      />
                      <Radio
                        id="accept-request-no"
                        name="accept-request"
                        isChecked={acceptChoice === 'reject'}
                        onChange={() => setAcceptChoice('reject')}
                        label={`I DO NOT accept this request to become a trusted org to ${pendingWizardRequest.organizationName}`}
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
                name="User groups"
                isDisabled={acceptChoice === null || !verifyEmail.trim()}
                isHidden={acceptChoice === 'reject'}
              >
                <div style={{ padding: 16 }}>
                  <Title headingLevel="h3" size="lg">Share user groups with {pendingWizardRequest.organizationName}</Title>
                  <Content component="p" style={{ marginTop: 8, marginBottom: 16 }}>
                    Optionally share user groups with {pendingWizardRequest.organizationName} now. Shared groups become identities their administrators can grant roles to on their workspaces, nothing in your org is affected. You can change this anytime.
                  </Content>
                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarItem>
                        <SearchInput
                          aria-label="Search user groups"
                          placeholder="Search by group name"
                          value={wizardGroupSearch}
                          onChange={(_event, value) => { setWizardGroupSearch(value); setWizardGroupPage(1); }}
                          onClear={() => { setWizardGroupSearch(''); setWizardGroupPage(1); }}
                        />
                      </ToolbarItem>
                      <ToolbarItem>
                        <ToggleGroup aria-label="Filter by selection">
                          <ToggleGroupItem
                            text="All"
                            isSelected={!wizardGroupShowSelected}
                            onChange={() => { setWizardGroupShowSelected(false); setWizardGroupPage(1); }}
                          />
                          <ToggleGroupItem
                            text="Selected"
                            isSelected={wizardGroupShowSelected}
                            onChange={() => { setWizardGroupShowSelected(true); setWizardGroupPage(1); }}
                          />
                        </ToggleGroup>
                      </ToolbarItem>
                      <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                        <Pagination
                          itemCount={wizardGroupsFiltered.length}
                          perPage={wizardGroupPerPage}
                          page={wizardGroupPage}
                          onSetPage={(_e, p) => setWizardGroupPage(p)}
                          onPerPageSelect={(_e, pp) => { setWizardGroupPerPage(pp); setWizardGroupPage(1); }}
                          isCompact
                        />
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>
                  <Table aria-label="Wizard user groups table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th
                          select={{
                            onSelect: (_event, isSelecting) => {
                              if (isSelecting) setWizardSelectedGroups(new Set(allOrgGroups.map((g) => g.id)));
                              else setWizardSelectedGroups(new Set());
                            },
                            isSelected: allOrgGroups.length > 0 && wizardSelectedGroups.size === allOrgGroups.length,
                          }}
                        />
                        <Th>User group name</Th>
                        <Th>Members</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {wizardGroupsPaginated.map((g) => (
                        <Tr key={g.id}>
                          <Td
                            select={{
                              rowIndex: allOrgGroups.indexOf(g),
                              onSelect: (_event, isSelecting) => {
                                setWizardSelectedGroups((prev) => {
                                  const next = new Set(prev);
                                  if (isSelecting) next.add(g.id); else next.delete(g.id);
                                  return next;
                                });
                              },
                              isSelected: wizardSelectedGroups.has(g.id),
                            }}
                          />
                          <Td dataLabel="User group name">{g.name}</Td>
                          <Td dataLabel="Members">{g.members}</Td>
                        </Tr>
                      ))}
                      {wizardGroupsPaginated.length === 0 && (
                        <Tr>
                          <Td colSpan={3} style={{ textAlign: 'center', padding: 24, color: 'var(--pf-v6-global--Color--200)' }}>
                            {wizardGroupShowSelected ? 'No groups are currently selected.' : 'No groups match your search.'}
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </div>
              </WizardStep>
              <WizardStep id="step-3" name="Review" isDisabled={acceptChoice === null || !verifyEmail.trim()} isHidden={acceptChoice === 'reject'} footer={{ nextButtonText: 'Submit' }}>
                <div style={{ padding: 16 }}>
                  <Title headingLevel="h3" size="lg">Review</Title>
                  <p style={{ marginTop: 8 }}>
                    Accepting trusted organization request from {pendingWizardRequest.organizationName}
                  </p>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', rowGap: 12 }}>
                      <div style={{ fontWeight: 700 }}>Organization name</div>
                      <div>{pendingWizardRequest.organizationName}</div>
                      <div style={{ fontWeight: 700 }}>Organization ID</div>
                      <div>{pendingWizardRequest.orgId}</div>
                      <div style={{ fontWeight: 700 }}>User groups to share ({wizardSelectedGroups.size})</div>
                      <div>{wizardSelectedGroups.size > 0 ? allOrgGroups.filter((g) => wizardSelectedGroups.has(g.id)).map((g) => g.name).join(', ') : 'None'}</div>
                    </div>
                  </div>
                </div>
              </WizardStep>
            </Wizard>
          )}
          {pendingWizardComplete && (
            <Wizard
              className="pf-m-finished"
              onClose={closePendingWizard}
              header={
                <WizardHeader
                  title={`Review trusted organization request from ${pendingWizardRequest.organizationName}`}
                  description="Review and manage this pending trust request."
                  onClose={closePendingWizard}
                />
              }
            >
              <WizardStep id="step-complete" name="" footer={<div style={{ display: 'none' }} />} isHidden={!pendingWizardComplete}>
                {acceptChoice === 'accept' ? (
                  <EmptyState
                    headingLevel="h2"
                    titleText={`You are now a trusted organization of ${pendingWizardRequest.organizationName}`}
                    status="success"
                    isFullHeight
                  >
                    <EmptyStateBody>
                      You have accepted the request from {pendingWizardRequest.organizationName} and you can now see each other's shared user groups.
                    </EmptyStateBody>
                    <EmptyStateFooter>
                      <EmptyStateActions>
                        <Button variant="primary" component="a" href="/workspaces">
                          Grant workspace access
                        </Button>
                      </EmptyStateActions>
                      <EmptyStateActions>
                        <Button variant="link" onClick={() => closePendingWizard()}>
                          Close
                        </Button>
                      </EmptyStateActions>
                    </EmptyStateFooter>
                  </EmptyState>
                ) : (
                  <EmptyState
                    headingLevel="h2"
                    titleText={`You have rejected the request from ${pendingWizardRequest.organizationName}`}
                    status="warning"
                    isFullHeight
                  >
                    <EmptyStateBody>
                      You have declined to become a trusted organization of {pendingWizardRequest.organizationName}. They will not be able to see your organization.
                    </EmptyStateBody>
                    <EmptyStateFooter>
                      <EmptyStateActions>
                        <Button variant="primary" onClick={() => closePendingWizard()}>
                          Close
                        </Button>
                      </EmptyStateActions>
                    </EmptyStateFooter>
                  </EmptyState>
                )}
              </WizardStep>
            </Wizard>
          )}
        </Modal>
      )}

      {/* ────────────────── Establish a trusted org wizard ────────────────── */}
      {isEstablishModalOpen && (
        <Modal isOpen onClose={() => setIsEstablishModalOpen(false)} variant="large" aria-label="Establish a trusted organization wizard" className="trusted-wizard-modal">
          <Wizard
            onClose={() => setIsEstablishModalOpen(false)}
            onSave={() => {
              const trimmedId = establishOrgId.trim();
              const existingConn = connectionsData.find((c) => c.orgId === trimmedId);
              const orgName = existingConn ? existingConn.organizationName : (trimmedId === '547289' ? 'Beta Corp' : `Org ${establishOrgId}`);
              if (existingConn && (existingConn.status === 'Revoked' || existingConn.status === 'Rejected')) {
                setConnectionsData((prev) => prev.filter((c) => c.orgId !== trimmedId));
              }
              setPendingData((prev) => [...prev, {
                organizationName: orgName,
                orgId: trimmedId,
                direction: 'Outgoing',
                requestedDate: new Date().toISOString().slice(0, 10),
                requester: 'You',
              }]);
              addChangeLogEntry('Request sent', `Trust request sent to ${orgName} (${trimmedId})`, 'admin@myorg.com');
              addToast(
                `You have successfully sent a trusted org request to ${orgName}`,
                <span>You can view your pending requests in the Pending requests tab.</span>
              );
              setIsEstablishModalOpen(false);
            }}
            header={
              <WizardHeader
                title="Establish a trusted organization"
                description="Build a trusted organization connection with another organization"
                onClose={() => setIsEstablishModalOpen(false)}
              />
            }
          >
          <WizardStep id="establish-org-info" name="Organization info" footer={{ isNextDisabled: !establishOrgId.trim() || establishOrgIdInvalid, isBackHidden: true }}>
            <div style={{ padding: 16 }}>
              <Content component="p" style={{ marginBottom: 24 }}>
                When establishing a trusted org, you are requesting access to their organization and assets. The organization will review your request and have to accept it in order for you to have access. You can review the status of all outgoing requests in the Pending requests tab.
              </Content>
              <Form>
                <FormGroup
                  label="Organization ID"
                  isRequired
                  fieldId="establish-org-id"
                  labelHelp={
                    <Popover bodyContent="The unique identifier for the organization you want to establish trust with.">
                      <FormGroupLabelHelp aria-label="More info for Organization ID" />
                    </Popover>
                  }
                >
                  <TextInput
                    isRequired
                    id="establish-org-id"
                    name="establish-org-id"
                    value={establishOrgId}
                    onChange={(_event, value) => setEstablishOrgId(value)}
                    placeholder="123456"
                    validated={establishOrgIdInvalid ? 'error' : 'default'}
                  />
                  <HelperText>
                    {establishOrgIdInvalid ? (
                      <HelperTextItem variant="error">
                        This organization already has an existing connection or pending request.
                      </HelperTextItem>
                    ) : (
                      <HelperTextItem>
                        <a href="#">Here is how to find the org ID</a>
                      </HelperTextItem>
                    )}
                  </HelperText>
                </FormGroup>
                <FormGroup
                  label="Request description"
                  fieldId="establish-description"
                  labelHelp={
                    <Popover bodyContent="Provide additional context about your request.">
                      <FormGroupLabelHelp aria-label="More info for Request description" />
                    </Popover>
                  }
                >
                  <TextInput
                    id="establish-description"
                    name="establish-description"
                    value={establishDescription}
                    onChange={(_event, value) => setEstablishDescription(value)}
                    placeholder="Please do not include any PII or sensitive information in the description."
                  />
                </FormGroup>
              </Form>
            </div>
          </WizardStep>
          <WizardStep id="establish-sharing-groups" name="Sharing user groups">
            <div style={{ padding: 16 }}>
              <Title headingLevel="h3" size="lg">Select user groups to share with this organization</Title>
              <Content component="p" style={{ marginTop: 8, marginBottom: 16 }}>
                Optionally share user groups with organization {establishOrgId.trim() || 'this organization'} now. Shared groups become identities their administrators can grant roles to on their workspaces, nothing in your org is affected. You can change this anytime.
              </Content>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <SearchInput
                      aria-label="Search user groups"
                      placeholder="Search by group name"
                      value={establishGroupSearch}
                      onChange={(_event, value) => { setEstablishGroupSearch(value); setEstablishGroupPage(1); }}
                      onClear={() => { setEstablishGroupSearch(''); setEstablishGroupPage(1); }}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <ToggleGroup aria-label="Filter by selection">
                      <ToggleGroupItem
                        text="All"
                        isSelected={!establishGroupShowSelected}
                        onChange={() => { setEstablishGroupShowSelected(false); setEstablishGroupPage(1); }}
                      />
                      <ToggleGroupItem
                        text="Selected"
                        isSelected={establishGroupShowSelected}
                        onChange={() => { setEstablishGroupShowSelected(true); setEstablishGroupPage(1); }}
                      />
                    </ToggleGroup>
                  </ToolbarItem>
                  <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                    <Pagination
                      itemCount={establishGroupsFiltered.length}
                      perPage={establishGroupPerPage}
                      page={establishGroupPage}
                      onSetPage={(_e, p) => setEstablishGroupPage(p)}
                      onPerPageSelect={(_e, pp) => { setEstablishGroupPerPage(pp); setEstablishGroupPage(1); }}
                      isCompact
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
              <Table aria-label="Select user groups to share" variant="compact">
                <Thead>
                  <Tr>
                    <Th
                      select={{
                        onSelect: (_event, isSelecting) => {
                          if (isSelecting) setEstablishSelectedGroups(new Set(allOrgGroups.map((g) => g.id)));
                          else setEstablishSelectedGroups(new Set());
                        },
                        isSelected: allOrgGroups.length > 0 && establishSelectedGroups.size === allOrgGroups.length,
                      }}
                    />
                    <Th>User group name</Th>
                    <Th>Members</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {establishGroupsPaginated.map((g) => (
                    <Tr key={g.id}>
                      <Td
                        select={{
                          rowIndex: allOrgGroups.indexOf(g),
                          onSelect: (_event, isSelecting) => {
                            setEstablishSelectedGroups((prev) => {
                              const next = new Set(prev);
                              if (isSelecting) next.add(g.id);
                              else next.delete(g.id);
                              return next;
                            });
                          },
                          isSelected: establishSelectedGroups.has(g.id),
                        }}
                      />
                      <Td dataLabel="User group name">{g.name}</Td>
                      <Td dataLabel="Members">{g.members}</Td>
                    </Tr>
                  ))}
                  {establishGroupsPaginated.length === 0 && (
                    <Tr>
                      <Td colSpan={3} style={{ textAlign: 'center', padding: 24, color: 'var(--pf-v6-global--Color--200)' }}>
                        {establishGroupShowSelected ? 'No groups are currently selected.' : 'No groups match your search.'}
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </div>
          </WizardStep>
          <WizardStep id="establish-review" name="Review" footer={{ nextButtonText: 'Send request', isNextDisabled: !establishOrgId.trim() || establishOrgIdInvalid }}>
            <div style={{ padding: 16 }}>
              <Title headingLevel="h3" size="lg">Review your request</Title>
              <Content component="p" style={{ marginTop: 8, marginBottom: 24 }}>
                Confirm the details below before sending the trusted organization request.
              </Content>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Organization ID</div>
                  <div>{establishOrgId}</div>
                </div>
                {establishDescription && (
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Request description</div>
                    <div>{establishDescription}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>User groups to share ({establishSelectedGroups.size})</div>
                  <div>{establishSelectedGroups.size > 0 ? allOrgGroups.filter((g) => establishSelectedGroups.has(g.id)).map((g) => g.name).join(', ') : 'None'}</div>
                </div>
              </div>
            </div>
          </WizardStep>
        </Wizard>
        </Modal>
      )}

      {/* ────────────────── Revoke connection modal ────────────────── */}
      <Modal
        isOpen={isRevokeModalOpen}
        onClose={() => { setIsRevokeModalOpen(false); setRevokeConfirmText(''); }}
        variant="medium"
        aria-label="Revoke trust confirmation"
      >
        <ModalHeader
          title={
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--default)" />
              {revokeTargetOrg ? `Revoke trust with ${revokeTargetOrg.organizationName}?` : 'Revoke trust?'}
            </span>
          }
        />
        <ModalBody>
          <p>
            This ends the trust connection. All access between the two organizations is removed, in both directions. This cannot be undone — trust would need to be re-established from scratch.
          </p>
          {revokeTargetOrg && (() => {
            const yourSharedGroups = allOrgGroups.filter((g) => generateSelectedGroupsForOrg(revokeTargetOrg.orgId).has(g.id));
            const theirSharedGroups = generateForeignGroupsForOrg(revokeTargetOrg.orgId);
            const affectedWorkspaces = [
              { name: 'Production', roles: 2 },
              { name: 'Staging', roles: 1 },
              ...(parseInt(revokeTargetOrg.orgId) % 2 === 0 ? [{ name: 'Development', roles: 3 }] : []),
            ];
            return (
              <div style={{ marginTop: 16 }}>
                <ExpandableSection toggleText={`User groups you shared with ${revokeTargetOrg.organizationName} (${yourSharedGroups.length})`} isIndented>
                  {yourSharedGroups.length > 0 ? (
                    <Table aria-label="Your shared groups" variant="compact" borders={false}>
                      <Thead><Tr><Th>Group name</Th><Th>Members</Th></Tr></Thead>
                      <Tbody>
                        {yourSharedGroups.map((g) => (
                          <Tr key={g.id}><Td>{g.name}</Td><Td>{g.members}</Td></Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <p style={{ color: 'var(--pf-v6-global--Color--200)' }}>No groups shared.</p>
                  )}
                </ExpandableSection>
                <ExpandableSection toggleText={`User groups ${revokeTargetOrg.organizationName} shared with you (${theirSharedGroups.length})`} isIndented>
                  {theirSharedGroups.length > 0 ? (
                    <Table aria-label="Their shared groups" variant="compact" borders={false}>
                      <Thead><Tr><Th>Group name</Th><Th>Members</Th></Tr></Thead>
                      <Tbody>
                        {theirSharedGroups.map((g) => (
                          <Tr key={g.id}><Td>{g.name}</Td><Td>{g.members}</Td></Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <p style={{ color: 'var(--pf-v6-global--Color--200)' }}>No groups shared.</p>
                  )}
                </ExpandableSection>
                <ExpandableSection toggleText={`Affected workspaces (${affectedWorkspaces.length})`} isIndented>
                  <Table aria-label="Affected workspaces" variant="compact" borders={false}>
                    <Thead><Tr><Th>Workspace</Th><Th>Role bindings removed</Th></Tr></Thead>
                    <Tbody>
                      {affectedWorkspaces.map((ws) => (
                        <Tr key={ws.name}><Td>{ws.name}</Td><Td>{ws.roles}</Td></Tr>
                      ))}
                    </Tbody>
                  </Table>
                </ExpandableSection>
              </div>
            );
          })()}
          <FormGroup
            label={`Type ${revokeTargetOrg?.organizationName || 'the organization name'} to confirm`}
            fieldId="revoke-confirm-input"
            style={{ marginTop: 16 }}
          >
            <TextInput
              id="revoke-confirm-input"
              value={revokeConfirmText}
              onChange={(_e, value) => setRevokeConfirmText(value)}
              placeholder={revokeTargetOrg?.organizationName || ''}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="danger"
            isDisabled={!revokeTargetOrg || revokeConfirmText !== revokeTargetOrg.organizationName}
            onClick={() => {
              if (revokeTargetOrg) {
                setConnectionsData((prev) => prev.map((row) =>
                  row.orgId === revokeTargetOrg.orgId ? { ...row, status: 'Revoked' as const } : row
                ));
                addChangeLogEntry('Connection revoked', `Trust with ${revokeTargetOrg.organizationName} (${revokeTargetOrg.orgId}) revoked`, 'admin@myorg.com');
                addToast(
                  `The connection with ${revokeTargetOrg.organizationName} has been revoked.`,
                  <span>You can view the activity in the <a href="#" onClick={(e) => { e.preventDefault(); setActiveTabKey(2); }}>Change log</a>.</span>,
                  'info'
                );
              }
              setIsRevokeModalOpen(false);
              setRevokeTargetOrg(null);
              setRevokeConfirmText('');
            }}
          >
            Revoke connection
          </Button>
          <Button variant="link" onClick={() => { setIsRevokeModalOpen(false); setRevokeConfirmText(''); }}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { TrustedOrganizations };

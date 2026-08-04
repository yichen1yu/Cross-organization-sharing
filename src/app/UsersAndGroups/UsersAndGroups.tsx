import * as React from 'react';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
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
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleCheckbox,
  MenuToggleElement,
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
  ToolbarItem
} from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { EllipsisVIcon, FilterIcon, OutlinedQuestionCircleIcon, PencilAltIcon, UsersIcon } from '@patternfly/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { addGroup as addGroupToStore, getGroupMembers, type GroupMemberUser as StoreMemberUser, type GroupMemberSA as StoreMemberSA, type GroupMemberAgent as StoreMemberAgent } from '@app/utils/groupsStore';

type UserRow = {
  id: string;
  isAdmin: boolean;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
};

type GroupRow = {
  id: string;
  name: string;
  description: string;
  users: string;
  aiAccess: boolean;
  lastModified: string;
};

const initialUsers: UserRow[] = [
  { id: 'u1', isAdmin: false, username: 'doejoe', email: 'lpichler@redhat.com', firstName: 'Joe', lastName: 'Doe', active: true },
  { id: 'u2', isAdmin: true, username: 'iqe_rbac_v2_admin', email: 'platform-accessmanagement+iqe_rbac_v2_admin+stage@redhat.com', firstName: 'RBAC Admin', lastName: 'For V2', active: true },
  { id: 'u3', isAdmin: false, username: 'iqe_rbac_v2_normal', email: 'platform-accessmanagement+iqe_rbac_v2_normal+stage@redhat.com', firstName: 'RBAC Normal', lastName: 'For V2', active: true },
  { id: 'u4', isAdmin: false, username: 'iqe_rbac_v2_rbac', email: 'platform-accessmanagement+iqe_rbac_v2_rbac+stage@redhat.com', firstName: 'RBAC RBAC', lastName: 'For V2', active: true },
  { id: 'u5', isAdmin: false, username: 'iqe_rbac_v2_viewer', email: 'platform-accessmanagement+iqe_rbac_v2_viewer+stage@redhat.com', firstName: 'RBAC Viewer', lastName: 'For V2', active: true },
  { id: 'u6', isAdmin: false, username: 'iqe_rbac_v2_workspaces', email: 'platform-accessmanagement+iqe_rbac_v2_workspaces+stage@redhat.com', firstName: 'RBAC Workspaces', lastName: 'For V2', active: true },
];

const initialGroups: GroupRow[] = [
  { id: 'g1', name: '405', description: 'HTTP error code reference group', users: '0', aiAccess: true, lastModified: '1 month ago' },
  { id: 'g2', name: 'abc', description: 'Alphabetical test group', users: '0', aiAccess: true, lastModified: '23 Mar 2026' },
  { id: 'g3', name: 'Automation Something', description: 'Automated pipeline runners', users: '2', aiAccess: false, lastModified: '10 days ago' },
  { id: 'g4', name: 'Compliance Admins', description: 'Manages compliance policies and audit...', users: '1', aiAccess: true, lastModified: '2 months ago' },
  { id: 'g5', name: 'Compliance Auditors', description: 'Reviews audit logs and compliance rep...', users: '1', aiAccess: true, lastModified: '3 months ago' },
  { id: 'g6', name: 'Default access', description: 'This group contains all users in your...', users: 'All users', aiAccess: true, lastModified: '06 May 2021' },
  { id: 'g7', name: 'Default admin access', description: 'This group contains all org admin use...', users: 'All org admins', aiAccess: false, lastModified: '28 Mar 2022' },
  { id: 'g8', name: 'demo-local-v2__Child Group', description: 'Group for child workspace testing', users: '0', aiAccess: true, lastModified: '08 Apr 2026' },
  { id: 'g9', name: 'demo-local-v2__E2E_Lifecycle_1775655748250', description: 'E2E lifecycle test group', users: '0', aiAccess: true, lastModified: '09 Apr 2026' },
  { id: 'g10', name: 'demo-local-v2__Seeded Group', description: 'Controlled test group for search and ...', users: '0', aiAccess: true, lastModified: '08 Apr 2026' },
  { id: 'g11', name: 'Development Team Alpha', description: 'Front-end and back-end developers', users: '1', aiAccess: false, lastModified: '26 Mar 2026' },
  { id: 'g12', name: 'Group For V2 Test - RBAC on RBAC - ADMIN', description: 'Group For V2 Test for RBAC on RBAC AD...', users: '1', aiAccess: true, lastModified: '12 Mar 2026' },
  { id: 'g13', name: 'Group For V2 Test - RBAC on RBAC VIEWER', description: 'Group For V2 Test for RBAC on RBAC VI...', users: '1', aiAccess: true, lastModified: '12 Mar 2026' },
  { id: 'g14', name: 'Engineering Leads', description: 'Technical leads across all squads', users: '3', aiAccess: true, lastModified: '15 Jan 2026' },
  { id: 'g15', name: 'EnvironmentTesters', description: 'Staging and pre-prod environment testers', users: '5', aiAccess: false, lastModified: '22 Feb 2026' },
  { id: 'g16', name: 'Global Admins', description: 'Admin group for global operations', users: '2', aiAccess: true, lastModified: '01 Jun 2025' },
  { id: 'g17', name: 'IAM-Reviewers', description: 'Identity and access management reviewers', users: '4', aiAccess: false, lastModified: '10 Dec 2025' },
  { id: 'g18', name: 'Insights-PNQ', description: 'Insights product team members in PNQ', users: '13', aiAccess: true, lastModified: '07 Apr 2022' },
  { id: 'g19', name: 'OCM-Test-Group', description: 'Test group for OCM integration', users: '1', aiAccess: true, lastModified: '30 Nov 2025' },
  { id: 'g20', name: 'Platform-SRE', description: 'Site reliability engineering team', users: '7', aiAccess: true, lastModified: '18 Mar 2026' },
  { id: 'g21', name: 'QA-Automation', description: 'Automated quality assurance runners', users: '6', aiAccess: false, lastModified: '25 May 2026' },
];

type GroupMemberUser = { username: string; email: string; firstName: string; lastName: string };
type GroupMemberSA = { name: string; clientId: string; owner: string };
type GroupMemberAgent = { name: string; description: string };
type GroupRole = { name: string; description: string };

const _u = {
  doejoe: { username: 'doejoe', email: 'lpichler@redhat.com', firstName: 'Joe', lastName: 'Doe' },
  admin: { username: 'iqe_rbac_v2_admin', email: 'platform-accessmanagement+iqe_rbac_v2_admin+stage@redhat.com', firstName: 'RBAC Admin', lastName: 'For V2' },
  normal: { username: 'iqe_rbac_v2_normal', email: 'platform-accessmanagement+iqe_rbac_v2_normal+stage@redhat.com', firstName: 'RBAC Normal', lastName: 'For V2' },
  rbac: { username: 'iqe_rbac_v2_rbac', email: 'platform-accessmanagement+iqe_rbac_v2_rbac+stage@redhat.com', firstName: 'RBAC RBAC', lastName: 'For V2' },
  viewer: { username: 'iqe_rbac_v2_viewer', email: 'platform-accessmanagement+iqe_rbac_v2_viewer+stage@redhat.com', firstName: 'RBAC Viewer', lastName: 'For V2' },
  ws: { username: 'iqe_rbac_v2_workspaces', email: 'platform-accessmanagement+iqe_rbac_v2_workspaces+stage@redhat.com', firstName: 'RBAC Workspaces', lastName: 'For V2' },
};

const groupMemberUsers: Record<string, GroupMemberUser[]> = {
  g1: [_u.rbac],
  g2: [_u.viewer, _u.normal],
  g3: [_u.doejoe, _u.admin],
  g4: [_u.rbac],
  g5: [_u.viewer],
  g6: [_u.doejoe, _u.admin, _u.normal, _u.rbac, _u.viewer, _u.ws],
  g7: [_u.admin],
  g8: [_u.ws],
  g9: [_u.normal],
  g10: [_u.viewer, _u.rbac],
  g11: [_u.doejoe],
  g12: [_u.admin],
  g13: [_u.viewer],
  g14: [_u.doejoe, _u.admin, _u.normal],
  g15: [_u.rbac, _u.viewer, _u.normal, _u.ws, _u.doejoe],
  g16: [_u.admin, _u.ws],
  g17: [_u.doejoe, _u.rbac, _u.viewer, _u.normal],
  g18: [_u.doejoe, _u.admin, _u.normal, _u.rbac, _u.viewer, _u.ws],
  g19: [_u.normal],
  g20: [_u.admin, _u.doejoe, _u.rbac, _u.viewer, _u.normal, _u.ws],
  g21: [_u.rbac, _u.viewer, _u.normal, _u.doejoe, _u.admin, _u.ws],
};

const groupMemberSAs: Record<string, GroupMemberSA[]> = {
  g1: [{ name: 'test405', clientId: 'ab434b20-2276-4846-afdd-b0c4ecba2f0', owner: 'iqe_rbac_v2_admin' }],
  g3: [{ name: 'iqe-rbac-v2-service-account', clientId: '7fb2272f-2844-4fd0-bab3-dbdb0d85a91f', owner: 'iqe_rbac_v2_admin' }],
  g6: [{ name: 'SA for RBAC', clientId: 'd807b762-31c3-45d0-bffe-7f498b709c66', owner: 'iqe_rbac_v2_admin' }],
  g8: [{ name: 'iqe-rbac-on-rbac-read', clientId: 'b43b9c00-0107-43be-afa7-4ce45006b51c', owner: 'iqe_rbac_v2_admin' }],
  g12: [{ name: 'iqe-rbac-on-rbac', clientId: '9e6729e3-2c31-4b45-90af-2e88ed654c0f', owner: 'iqe_rbac_v2_admin' }],
  g15: [{ name: 'iqe-rbac-v2-e2e-service-account', clientId: '6dfb7d72-cf19-40eb-9920-0e8de3d2bb40', owner: 'iqe_rbac_v2_admin' }],
  g16: [{ name: 'SA for RBAC', clientId: 'd807b762-31c3-45d0-bffe-7f498b709c66', owner: 'iqe_rbac_v2_admin' }],
  g18: [
    { name: 'libord', clientId: 'f54cbb0-82e3-4f70-82be-a6f343746804', owner: 'iqe_rbac_v2_admin' },
    { name: 'SA Permissions for RBAC', clientId: 'fe466d70-2aeb-4de7-6eb3-d48ff4729e62', owner: 'iqe_rbac_v2_admin' },
  ],
  g20: [{ name: 'testlibor', clientId: 'cc9a0d3f-07dd-43a5-990b-d5a21d6d90a8', owner: 'iqe_rbac_v2_admin' }],
  g21: [{ name: 'iqe-rbac-v2-service-account', clientId: '7fb2272f-2844-4fd0-bab3-dbdb0d85a91f', owner: 'iqe_rbac_v2_admin' }],
};

const groupMemberAgents: Record<string, GroupMemberAgent[]> = {
  g2: [{ name: 'HCC Virtual Assistant', description: 'Helper agent across Hybrid Cloud Console' }],
  g3: [{ name: 'Red Hat Insights Assistant', description: 'AI agent for Insights' }],
  g6: [{ name: 'Red Hat Insights Assistant', description: 'AI agent for Insights' }, { name: 'HCC Virtual Assistant', description: 'Helper agent across Hybrid Cloud Console' }],
  g9: [{ name: 'Red Hat Lightspeed Agent', description: 'AI agent for Red Hat Lightspeed' }],
  g10: [{ name: 'HCC Virtual Assistant', description: 'Helper agent across Hybrid Cloud Console' }],
  g14: [{ name: 'Red Hat Insights Assistant', description: 'AI agent for Insights' }],
  g17: [{ name: 'Red Hat Lightspeed Agent', description: 'AI agent for Red Hat Lightspeed' }],
  g20: [{ name: 'Red Hat Insights Assistant', description: 'AI agent for Insights' }, { name: 'Red Hat Lightspeed Agent', description: 'AI agent for Red Hat Lightspeed' }],
};

const groupAssignedRoles: Record<string, GroupRole[]> = {
  g1: [{ name: 'Cost Price List Viewer', description: 'View cost and price list data' }],
  g3: [{ name: 'Automation Operator', description: 'Run and manage automation jobs' }],
  g4: [{ name: 'Compliance Viewer', description: 'View compliance policies' }],
  g5: [{ name: 'Compliance Auditor', description: 'Review audit logs and reports' }],
  g6: [{ name: 'Default access', description: 'Standard platform access for all users' }],
  g7: [{ name: 'Organization Administrator', description: 'Full admin privileges across the org' }],
  g11: [{ name: 'Developer', description: 'Access to dev tooling and repos' }],
  g14: [{ name: 'Engineering Lead', description: 'Technical leadership role' }, { name: 'Repository Admin', description: 'Admin access to source repositories' }],
  g16: [{ name: 'Organization Administrator', description: 'Full admin privileges across the org' }],
  g17: [{ name: 'IAM Reviewer', description: 'Review identity and access configurations' }],
  g19: [{ name: 'OCM Cluster Owner', description: 'Own and manage OCM clusters' }],
  g20: [{ name: 'SRE Operator', description: 'Operate SRE tooling and dashboards' }, { name: 'Cluster Admin', description: 'Manage OpenShift clusters' }],
  g21: [{ name: 'QA Engineer', description: 'Run and review QA test suites' }],
};

const UsersAndGroups: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = React.useState<string | number>(0);

  // --- Users tab state ---
  const [users, setUsers] = React.useState<UserRow[]>(initialUsers);
  const [selectedUserIds, setSelectedUserIds] = React.useState<Set<string>>(new Set());

  const [isUserFilterOpen, setIsUserFilterOpen] = React.useState(false);
  const [userFilterField, setUserFilterField] = React.useState<'Username' | 'Email'>('Username');
  const [filterValue, setFilterValue] = React.useState('');
  const [isUserKebabOpen, setIsUserKebabOpen] = React.useState(false);
  const [openUserKebabFor, setOpenUserKebabFor] = React.useState<string | null>(null);
  const [userSortIndex, setUserSortIndex] = React.useState<number>(0);
  const [userSortDirection, setUserSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const filteredUsers = React.useMemo(() => {
    const fv = filterValue.trim().toLowerCase();
    if (!fv) return users;
    return users.filter(u => {
      if (userFilterField === 'Username') return u.username.toLowerCase().includes(fv);
      return u.email.toLowerCase().includes(fv);
    });
  }, [users, userFilterField, filterValue]);

  const sortedUsers = React.useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      const aVal = a.username.toLowerCase();
      const bVal = b.username.toLowerCase();
      return userSortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return sorted;
  }, [filteredUsers, userSortDirection]);

  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const pagedUsers = sortedUsers.slice((page - 1) * perPage, page * perPage);

  const areAllUsersSelected = sortedUsers.length > 0 && selectedUserIds.size === sortedUsers.length;
  const areSomeUsersSelected = selectedUserIds.size > 0 && selectedUserIds.size < sortedUsers.length;

  const onSelectAll = (checked: boolean) => {
    setSelectedUserIds(checked ? new Set(sortedUsers.map(u => u.id)) : new Set());
  };

  const onSelectRow = (id: string, checked: boolean) => {
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

  const onToggleActive = (id: string, value: boolean) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: value } : u));
  };

  const onToggleAdmin = (id: string, value: boolean) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isAdmin: value } : u));
  };

  const onUserSort = (_event: React.MouseEvent, index: number, direction: 'asc' | 'desc') => {
    setUserSortIndex(index);
    setUserSortDirection(direction);
  };

  // --- Toast alerts ---
  type ToastAlert = { id: number; variant: AlertVariant; title: string };
  const [alerts, setAlerts] = React.useState<ToastAlert[]>([]);
  const alertIdRef = React.useRef(0);

  const addAlert = (variant: AlertVariant, title: string) => {
    const id = alertIdRef.current++;
    setAlerts(prev => [...prev, { id, variant, title }]);
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // --- Groups tab state ---
  const [groups, setGroups] = React.useState<GroupRow[]>(initialGroups);

  const newGroupHandled = React.useRef(false);
  React.useEffect(() => {
    const state = location.state as {
      newGroup?: {
        name: string; description: string; users: string;
        selectedUsers?: StoreMemberUser[];
        selectedSAs?: StoreMemberSA[];
        selectedAgents?: StoreMemberAgent[];
      };
    } | null;
    if (state?.newGroup && !newGroupHandled.current) {
      newGroupHandled.current = true;
      const { name, description, users, selectedUsers: su, selectedSAs: ssa, selectedAgents: sa } = state.newGroup;
      const storeId = addGroupToStore(name, description || '', Number(users) || 0, su, ssa, sa);
      const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      setGroups(prev => [...prev, { id: storeId, name, description: description || '', users, aiAccess: true, lastModified: today }]);
      setActiveKey(1);
      addAlert(AlertVariant.success, `User group "${name}" created successfully.`);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onToggleAiAccess = (groupId: string, checked: boolean) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, aiAccess: checked } : g));
    const group = groups.find(g => g.id === groupId);
    addAlert(
      AlertVariant.success,
      `AI agent access has been ${checked ? 'enabled' : 'disabled'} for user group ${group?.name}`
    );
  };
  const [selectedGroupIds, setSelectedGroupIds] = React.useState<Set<string>>(new Set());
  const [groupQuery, setGroupQuery] = React.useState('');
  const [pageG, setPageG] = React.useState(1);
  const [perPageG, setPerPageG] = React.useState(20);
  const [openKebabFor, setOpenKebabFor] = React.useState<string | null>(null);
  const [isGroupFilterOpen, setIsGroupFilterOpen] = React.useState(false);
  const [groupFilterField, setGroupFilterField] = React.useState('Name');
  const [isGroupKebabOpen, setIsGroupKebabOpen] = React.useState(false);
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const filteredGroups = React.useMemo(() => {
    const q = groupQuery.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(g => g.name.toLowerCase().includes(q));
  }, [groups, groupQuery]);

  const sortedGroups = React.useMemo(() => {
    const sorted = [...filteredGroups];
    sorted.sort((a, b) => {
      const aVal = a.name.toLowerCase();
      const bVal = b.name.toLowerCase();
      return activeSortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return sorted;
  }, [filteredGroups, activeSortDirection]);

  const areAllGroupsSelected = sortedGroups.length > 0 && selectedGroupIds.size === sortedGroups.length;
  const areSomeGroupsSelected = selectedGroupIds.size > 0 && selectedGroupIds.size < sortedGroups.length;
  const pageRowsG = sortedGroups.slice((pageG - 1) * perPageG, pageG * perPageG);

  const onSelectAllGroups = (checked: boolean) => {
    setSelectedGroupIds(checked ? new Set(sortedGroups.map(g => g.id)) : new Set());
  };

  const onSelectGroupRow = (id: string, checked: boolean) => {
    setSelectedGroupIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

  // --- Group drawer state ---
  const [isGroupDrawerOpen, setIsGroupDrawerOpen] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState<GroupRow | null>(null);
  const [drawerTabKey, setDrawerTabKey] = React.useState<string | number>(0);
  const [drawerUserPage, setDrawerUserPage] = React.useState(1);
  const [drawerSaPage, setDrawerSaPage] = React.useState(1);
  const [drawerAgentPage, setDrawerAgentPage] = React.useState(1);
  const [drawerRolePage, setDrawerRolePage] = React.useState(1);
  const drawerPerPage = 5;

  const onGroupRowClick = (g: GroupRow) => {
    setSelectedGroup(g);
    setDrawerTabKey(0);
    setDrawerUserPage(1);
    setDrawerSaPage(1);
    setDrawerAgentPage(1);
    setDrawerRolePage(1);
    setIsGroupDrawerOpen(true);
  };

  const _storeMembers = selectedGroup ? getGroupMembers(selectedGroup.id) : null;
  const drawerUsers = selectedGroup
    ? (groupMemberUsers[selectedGroup.id] || (_storeMembers?.users) || [])
    : [];
  const drawerSAs = selectedGroup
    ? (groupMemberSAs[selectedGroup.id] || (_storeMembers?.serviceAccounts) || [])
    : [];
  const drawerAgents = selectedGroup
    ? (groupMemberAgents[selectedGroup.id] || (_storeMembers?.agents) || [])
    : [];
  const drawerRoles = selectedGroup ? (groupAssignedRoles[selectedGroup.id] || []) : [];

  const drawerUserPageRows = drawerUsers.slice((drawerUserPage - 1) * drawerPerPage, drawerUserPage * drawerPerPage);
  const drawerSaPageRows = drawerSAs.slice((drawerSaPage - 1) * drawerPerPage, drawerSaPage * drawerPerPage);
  const drawerAgentPageRows = drawerAgents.slice((drawerAgentPage - 1) * drawerPerPage, drawerAgentPage * drawerPerPage);
  const drawerRolePageRows = drawerRoles.slice((drawerRolePage - 1) * drawerPerPage, drawerRolePage * drawerPerPage);

  const onSort = (_event: React.MouseEvent, index: number, direction: 'asc' | 'desc') => {
    setActiveSortIndex(index);
    setActiveSortDirection(direction);
  };

  const onTabSelect = (
    _event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ) => {
    setActiveKey(tabIndex);
  };

  return (
    <>
      <AlertGroup isToast isLiveRegion>
        {alerts.map(a => (
          <Alert
            key={a.id}
            variant={a.variant}
            title={a.title}
            timeout={4000}
            onTimeout={() => removeAlert(a.id)}
            actionClose={<AlertActionCloseButton onClose={() => removeAlert(a.id)} />}
          />
        ))}
      </AlertGroup>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity &amp; Access Management</BreadcrumbItem>
          <BreadcrumbItem>Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Users and Groups</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Users and User Groups</Title>
        <Content>
          <p style={{ margin: 0, color: '#6a6e73' }}>
            These are all of the users in your Red Hat organization. Create User Groups to define access across your workspaces.
          </p>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Tabs activeKey={activeKey} onSelect={onTabSelect}>
          {/* ======================== Users tab ======================== */}
          <Tab eventKey={0} title={<TabTitleText>Users</TabTitleText>}>
            <PageSection>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <MenuToggle
                      splitButtonItems={[
                        <MenuToggleCheckbox
                          id="users-bulk-select"
                          key="users-bulk-select"
                          aria-label="Select all"
                          isChecked={areAllUsersSelected ? true : areSomeUsersSelected ? null : false}
                          onChange={(checked) => onSelectAll(checked)}
                        />
                      ]}
                      aria-label="Select"
                    />
                  </ToolbarItem>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isUserFilterOpen}
                        onSelect={(_, v) => { setUserFilterField(v as 'Username' | 'Email'); setIsUserFilterOpen(false); }}
                        onOpenChange={setIsUserFilterOpen}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsUserFilterOpen(prev => !prev)}
                            icon={<FilterIcon />}
                          >
                            {userFilterField}
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem key="Username" value="Username">Username</DropdownItem>
                          <DropdownItem key="Email" value="Email">Email</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </ToolbarItem>
                    <ToolbarItem>
                      <SearchInput
                        placeholder={`Filter by ${userFilterField.toLowerCase()}`}
                        value={filterValue}
                        onChange={(_, v) => { setFilterValue(v); setPage(1); }}
                        onClear={() => { setFilterValue(''); setPage(1); }}
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarItem>
                    <Button variant="primary">Add to user group</Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isUserKebabOpen}
                      onOpenChange={setIsUserKebabOpen}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          variant="plain"
                          aria-label="Toolbar actions"
                          onClick={() => setIsUserKebabOpen(prev => !prev)}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem>Delete</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                    <Pagination
                      isCompact
                      itemCount={sortedUsers.length}
                      perPage={perPage}
                      page={page}
                      onSetPage={(_, p) => setPage(p)}
                      onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              <Table aria-label="Users table">
                <Thead>
                  <Tr>
                    <Th
                      select={{
                        onSelect: (_e, isSelected) => onSelectAll(isSelected as boolean),
                        isSelected: areAllUsersSelected,
                      }}
                    />
                    <Th>Org. Administrator</Th>
                    <Th
                      sort={{
                        sortBy: { index: userSortIndex, direction: userSortDirection },
                        onSort: onUserSort,
                        columnIndex: 0,
                      }}
                    >
                      Username
                    </Th>
                    <Th>Email</Th>
                    <Th>First name</Th>
                    <Th>Last name</Th>
                    <Th>Status</Th>
                    <Th screenReaderText="Actions" />
                  </Tr>
                </Thead>
                <Tbody>
                  {pagedUsers.map(u => (
                    <Tr key={u.id}>
                      <Td
                        select={{
                          rowIndex: 0,
                          onSelect: (_e, isSelected) => onSelectRow(u.id, isSelected as boolean),
                          isSelected: selectedUserIds.has(u.id),
                        }}
                      />
                      <Td>
                        <Switch
                          id={`user-admin-${u.id}`}
                          isChecked={u.isAdmin}
                          onChange={(_e, checked) => onToggleAdmin(u.id, checked)}
                          aria-label="Org. Administrator"
                        />
                      </Td>
                      <Td>{u.username}</Td>
                      <Td>{u.email}</Td>
                      <Td>{u.firstName}</Td>
                      <Td>{u.lastName}</Td>
                      <Td>
                        <Switch
                          id={`user-active-${u.id}`}
                          isChecked={u.active}
                          onChange={(_e, checked) => onToggleActive(u.id, checked)}
                          aria-label="Status"
                        />
                      </Td>
                      <Td isActionCell>
                        <Dropdown
                          isOpen={openUserKebabFor === u.id}
                          onOpenChange={(isOpen) => setOpenUserKebabFor(isOpen ? u.id : null)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              variant="plain"
                              aria-label="Row actions"
                              onClick={() => setOpenUserKebabFor(openUserKebabFor === u.id ? null : u.id)}
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                          popperProps={{ position: 'right' }}
                        >
                          <DropdownList>
                            <DropdownItem>Edit</DropdownItem>
                            <DropdownItem>Remove</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination
                  itemCount={sortedUsers.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={(_, p) => setPage(p)}
                  onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
                />
              </div>
            </PageSection>
          </Tab>

          {/* ======================== User groups tab ======================== */}
          <Tab eventKey={1} title={<TabTitleText>User groups</TabTitleText>}>
            <Drawer isExpanded={isGroupDrawerOpen} isInline>
              <DrawerContent panelContent={
                selectedGroup ? (
                  <DrawerPanelContent widths={{ default: 'width_33' }} style={{ borderLeft: '1px solid var(--pf-t--global--border--color--default)' }}>
                    <DrawerHead>
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                          <Title headingLevel="h2" size="lg">{selectedGroup.name}</Title>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="link" icon={<PencilAltIcon />}>Edit user group</Button>
                        </FlexItem>
                      </Flex>
                      <DrawerActions>
                        <DrawerCloseButton onClick={() => { setIsGroupDrawerOpen(false); setSelectedGroup(null); }} />
                      </DrawerActions>
                    </DrawerHead>
                    <div style={{ padding: '0 16px 16px' }}>
                      <Tabs activeKey={drawerTabKey} onSelect={(_e, k) => { setDrawerTabKey(k); setDrawerUserPage(1); setDrawerSaPage(1); setDrawerAgentPage(1); setDrawerRolePage(1); }}>
                        <Tab eventKey={0} title={<TabTitleText>Users</TabTitleText>}>
                          {drawerUsers.length > 0 ? (
                            <div style={{ marginTop: 8 }}>
                              <Pagination
                                isCompact
                                itemCount={drawerUsers.length}
                                perPage={drawerPerPage}
                                page={drawerUserPage}
                                onSetPage={(_, p) => setDrawerUserPage(p)}
                                onPerPageSelect={() => {}}
                                variant="top"
                              />
                              <Table aria-label="Group users" variant="compact" style={{ marginTop: 8 }}>
                                <Thead>
                                  <Tr>
                                    <Th>Username</Th>
                                    <Th>Email</Th>
                                    <Th>First name</Th>
                                    <Th>Last name</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {drawerUserPageRows.map((u, i) => (
                                    <Tr key={i}>
                                      <Td>{u.username}</Td>
                                      <Td>{u.email}</Td>
                                      <Td>{u.firstName}</Td>
                                      <Td>{u.lastName}</Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                              <Pagination
                                itemCount={drawerUsers.length}
                                perPage={drawerPerPage}
                                page={drawerUserPage}
                                onSetPage={(_, p) => setDrawerUserPage(p)}
                                onPerPageSelect={() => {}}
                                style={{ marginTop: 8 }}
                              />
                            </div>
                          ) : (
                            <EmptyState variant="lg" titleText="No users found" headingLevel="h3" icon={UsersIcon}>
                              <EmptyStateBody>This group currently has no users assigned to it.</EmptyStateBody>
                            </EmptyState>
                          )}
                        </Tab>
                        <Tab eventKey={1} title={<TabTitleText>Service accounts</TabTitleText>}>
                          {drawerSAs.length > 0 ? (
                            <div style={{ marginTop: 8 }}>
                              <Pagination
                                isCompact
                                itemCount={drawerSAs.length}
                                perPage={drawerPerPage}
                                page={drawerSaPage}
                                onSetPage={(_, p) => setDrawerSaPage(p)}
                                onPerPageSelect={() => {}}
                                variant="top"
                              />
                              <Table aria-label="Group service accounts" variant="compact" style={{ marginTop: 8 }}>
                                <Thead>
                                  <Tr>
                                    <Th>Name</Th>
                                    <Th>Client ID</Th>
                                    <Th>Owner</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {drawerSaPageRows.map((sa, i) => (
                                    <Tr key={i}>
                                      <Td>{sa.name}</Td>
                                      <Td>{sa.clientId}</Td>
                                      <Td>{sa.owner}</Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                              <Pagination
                                itemCount={drawerSAs.length}
                                perPage={drawerPerPage}
                                page={drawerSaPage}
                                onSetPage={(_, p) => setDrawerSaPage(p)}
                                onPerPageSelect={() => {}}
                                style={{ marginTop: 8 }}
                              />
                            </div>
                          ) : (
                            <EmptyState variant="lg" titleText="No service accounts found" headingLevel="h3" icon={UsersIcon}>
                              <EmptyStateBody>This group currently has no service accounts assigned to it.</EmptyStateBody>
                            </EmptyState>
                          )}
                        </Tab>
                        <Tab eventKey={2} title={<TabTitleText>AI agents</TabTitleText>}>
                          {drawerAgents.length > 0 ? (
                            <div style={{ marginTop: 8 }}>
                              <Pagination
                                isCompact
                                itemCount={drawerAgents.length}
                                perPage={drawerPerPage}
                                page={drawerAgentPage}
                                onSetPage={(_, p) => setDrawerAgentPage(p)}
                                onPerPageSelect={() => {}}
                                variant="top"
                              />
                              <Table aria-label="Group AI agents" variant="compact" style={{ marginTop: 8 }}>
                                <Thead>
                                  <Tr>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {drawerAgentPageRows.map((a, i) => (
                                    <Tr key={i}>
                                      <Td>{a.name}</Td>
                                      <Td>{a.description}</Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                              <Pagination
                                itemCount={drawerAgents.length}
                                perPage={drawerPerPage}
                                page={drawerAgentPage}
                                onSetPage={(_, p) => setDrawerAgentPage(p)}
                                onPerPageSelect={() => {}}
                                style={{ marginTop: 8 }}
                              />
                            </div>
                          ) : (
                            <EmptyState variant="lg" titleText="No AI agents found" headingLevel="h3" icon={UsersIcon}>
                              <EmptyStateBody>This group currently has no AI agents assigned to it.</EmptyStateBody>
                            </EmptyState>
                          )}
                        </Tab>
                      </Tabs>
                    </div>
                  </DrawerPanelContent>
                ) : undefined
              }>
                <DrawerContentBody>
                  <PageSection>
                    <Toolbar>
                      <ToolbarContent>
                        <ToolbarItem>
                          <MenuToggle
                            splitButtonItems={[
                              <MenuToggleCheckbox
                                id="groups-bulk-select"
                                key="groups-bulk-select"
                                aria-label="Select all"
                                isChecked={areAllGroupsSelected ? true : areSomeGroupsSelected ? null : false}
                                onChange={(checked) => onSelectAllGroups(checked)}
                              />
                            ]}
                            aria-label="Select"
                          />
                        </ToolbarItem>
                        <ToolbarGroup variant="filter-group">
                          <ToolbarItem>
                            <Dropdown
                              isOpen={isGroupFilterOpen}
                              onSelect={(_, v) => { setGroupFilterField(v as string); setIsGroupFilterOpen(false); }}
                              onOpenChange={setIsGroupFilterOpen}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setIsGroupFilterOpen(prev => !prev)}
                                  icon={<FilterIcon />}
                                >
                                  {groupFilterField}
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                <DropdownItem key="Name" value="Name">Name</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </ToolbarItem>
                          <ToolbarItem>
                            <SearchInput
                              placeholder="Filter by name"
                              value={groupQuery}
                              onChange={(_, v) => { setGroupQuery(v); setPageG(1); }}
                              onClear={() => { setGroupQuery(''); setPageG(1); }}
                            />
                          </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarItem>
                          <Button variant="primary" onClick={() => navigate('/users-and-groups/create')}>Create user group</Button>
                        </ToolbarItem>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isGroupKebabOpen}
                            onOpenChange={setIsGroupKebabOpen}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                variant="plain"
                                aria-label="Toolbar actions"
                                onClick={() => setIsGroupKebabOpen(prev => !prev)}
                              >
                                <EllipsisVIcon />
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem>Delete</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                          <Pagination
                            isCompact
                            itemCount={sortedGroups.length}
                            perPage={perPageG}
                            page={pageG}
                            onSetPage={(_, p) => setPageG(p)}
                            onPerPageSelect={(_, n) => { setPerPageG(n); setPageG(1); }}
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>

                    <Table aria-label="User groups table">
                      <Thead>
                        <Tr>
                          <Th
                            select={{
                              onSelect: (_e, isSelected) => onSelectAllGroups(isSelected as boolean),
                              isSelected: areAllGroupsSelected,
                            }}
                          />
                          <Th
                            width={25}
                            sort={{
                              sortBy: { index: activeSortIndex, direction: activeSortDirection },
                              onSort,
                              columnIndex: 0,
                            }}
                          >
                            Name
                          </Th>
                          <Th width={25}>Description</Th>
                          <Th width={15}>AI Agent access</Th>
                          <Th width={10}>Users</Th>
                          <Th width={15}>Last modified</Th>
                          <Th width={10} screenReaderText="Actions" />
                        </Tr>
                      </Thead>
                      <Tbody>
                        {pageRowsG.map(g => (
                          <Tr
                            key={g.id}
                            isClickable
                            isRowSelected={selectedGroup?.id === g.id}
                            onRowClick={() => onGroupRowClick(g)}
                          >
                            <Td
                              select={{
                                rowIndex: 0,
                                onSelect: (_e, isSelected) => onSelectGroupRow(g.id, isSelected as boolean),
                                isSelected: selectedGroupIds.has(g.id),
                              }}
                            />
                            <Td>{g.name}</Td>
                            <Td>{g.description}</Td>
                            <Td>
                              <Switch
                                id={`ai-access-${g.id}`}
                                isChecked={g.aiAccess}
                                onChange={(_e, checked) => { onToggleAiAccess(g.id, checked); }}
                                onClick={(e) => e.stopPropagation()}
                                aria-label="AI Agent access"
                              />
                            </Td>
                            <Td>{g.users}</Td>
                            <Td>{g.lastModified}</Td>
                            <Td isActionCell onClick={(e) => e.stopPropagation()}>
                              <Dropdown
                                isOpen={openKebabFor === g.id}
                                onOpenChange={(isOpen) => setOpenKebabFor(isOpen ? g.id : null)}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    variant="plain"
                                    aria-label="Row actions"
                                    onClick={() => setOpenKebabFor(openKebabFor === g.id ? null : g.id)}
                                  >
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                                popperProps={{ position: 'right' }}
                              >
                                <DropdownList>
                                  <DropdownItem>Edit user group</DropdownItem>
                                  <DropdownItem>Delete user group</DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </PageSection>
                </DrawerContentBody>
              </DrawerContent>
            </Drawer>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { UsersAndGroups };

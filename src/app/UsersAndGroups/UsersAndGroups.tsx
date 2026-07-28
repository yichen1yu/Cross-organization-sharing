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
import { EllipsisVIcon, FilterIcon } from '@patternfly/react-icons';

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

const UsersAndGroups: React.FunctionComponent = () => {
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
                    <Button variant="primary">Create user group</Button>
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
                    <Tr key={g.id}>
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
                          onChange={(_e, checked) => onToggleAiAccess(g.id, checked)}
                          aria-label="AI Agent access"
                        />
                      </Td>
                      <Td>{g.users}</Td>
                      <Td>{g.lastModified}</Td>
                      <Td isActionCell>
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
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { UsersAndGroups };

import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  Divider,
  Flex,
  FlexItem,
  MenuToggle,
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
  ToolbarItem
} from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core/dist/esm/components/Dropdown';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ExternalLinkAltIcon, UsersIcon } from '@patternfly/react-icons';

const UsersAndGroups: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = React.useState<string | number>(0);

  // Users tab state
  type UserRow = {
    id: string;
    isAdmin: boolean;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
  };

  const [users, setUsers] = React.useState<UserRow[]>([
    { id: 'u1', isAdmin: true, username: 'rhn-support-jeder', email: 'jeder@redhat.com', firstName: 'Jeremy', lastName: 'Eder', active: true },
    { id: 'u2', isAdmin: true, username: 'rhn-support-tasander', email: 'tasander@redhat.com', firstName: 'Taft', lastName: 'Sanders', active: true },
    { id: 'u3', isAdmin: true, username: 'rhn-support-jsenkyri', email: 'jsenkyri@redhat.com', firstName: 'Jan', lastName: 'Senkyri', active: true },
    { id: 'u4', isAdmin: false, username: 'rhn-support-nagetsum', email: 'nagetsum@redhat.com', firstName: 'Norito', lastName: 'Agetsuma', active: true },
    { id: 'u5', isAdmin: false, username: 'aabugosh1@redhat.com', email: 'aabugosh@redhat.com', firstName: 'Amal', lastName: 'Abu Gosh', active: true },
    { id: 'u6', isAdmin: false, username: 'aali@redhat.com', email: 'aali@redhat.com', firstName: 'Azam', lastName: 'Ali', active: true },
    { id: 'u7', isAdmin: false, username: 'abenjamie1@redhat.com', email: 'abenjamie@redhat.com', firstName: 'Ashor', lastName: 'Benjamin', active: true },
    { id: 'u8', isAdmin: false, username: 'abjoshi@redhat.com', email: 'abjoshi@redhat.com', firstName: 'Abhijeet', lastName: 'Joshi', active: true },
    { id: 'u9', isAdmin: false, username: 'abshukla@redhat.com', email: 'abshukla@redhat.com', firstName: 'Abhishek', lastName: 'Shukla', active: true },
    { id: 'u10', isAdmin: false, username: 'abugosh@redhat.com', email: 'abugosh@redhat.com', firstName: 'Amal', lastName: 'Gosh', active: true }
  ]);

  const [selectedUserIds, setSelectedUserIds] = React.useState<Set<string>>(new Set());
  const areAllSelected = users.length > 0 && selectedUserIds.size === users.length;
  const areSomeSelected = selectedUserIds.size > 0 && selectedUserIds.size < users.length;

  // Toolbar filter
  const [isFilterFieldOpen, setIsFilterFieldOpen] = React.useState(false);
  const [filterField, setFilterField] = React.useState<'Username' | 'Email'>('Username');
  const [filterValue, setFilterValue] = React.useState('');

  const filteredUsers = React.useMemo(() => {
    const fv = filterValue.trim().toLowerCase();
    if (!fv) return users;
    return users.filter(u => {
      if (filterField === 'Username') return u.username.toLowerCase().includes(fv);
      return u.email.toLowerCase().includes(fv);
    });
  }, [users, filterField, filterValue]);

  // Pagination (simple client-side)
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const pageStart = (page - 1) * perPage;
  const pageEnd = pageStart + perPage;
  const pagedUsers = filteredUsers.slice(pageStart, pageEnd);

  const onSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
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

  // Per-row Org. Admin dropdown open state
  const [openAdminFor, setOpenAdminFor] = React.useState<string | null>(null);

  const onSelect = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ) => {
    setActiveKey(tabIndex);
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>IAM</BreadcrumbItem>
          <BreadcrumbItem isActive>Users and Groups</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div className="pf-m-align-self-center" style={{ minWidth: '40px' }}>
              <UsersIcon style={{ fontSize: '32px', color: '#0066cc' }} aria-label="page-header-icon" />
            </div>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
            <div style={{ borderLeft: '1px solid #d2d2d2', height: '100%', marginRight: '16px' }}></div>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Users and Groups</Title>
              <Content>
                <p style={{ margin: 0, color: '#6a6e73' }}>
                  Manage users, groups, and related permissions across your organization in one place.
                </p>
                <div style={{ marginTop: '12px' }}>
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
                    Learn more
                  </Button>
                </div>
              </Content>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Tabs activeKey={activeKey} onSelect={onSelect}>
          <Tab eventKey={0} title={<TabTitleText>Users</TabTitleText>}>
            <PageSection>
              <Card>
                <CardHeader>
                  <Title headingLevel="h2" size="lg">Users</Title>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarItem>
                        <Dropdown
                          isOpen={isFilterFieldOpen}
                          onSelect={(_, v) => { setFilterField(v as 'Username' | 'Email'); setIsFilterFieldOpen(false); }}
                          onOpenChange={setIsFilterFieldOpen}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle ref={toggleRef} onClick={() => setIsFilterFieldOpen(prev => !prev)}>
                              {filterField}
                            </MenuToggle>
                          )}
                          popperProps={{ position: 'right' }}
                        >
                          <DropdownList>
                            <DropdownItem key="Username" value="Username">Username</DropdownItem>
                            <DropdownItem key="Email" value="Email">Email</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </ToolbarItem>
                      <ToolbarItem>
                        <SearchInput
                          placeholder={`Filter by ${filterField.toLowerCase()}`}
                          value={filterValue}
                          onChange={(_, v) => { setFilterValue(v); setPage(1); }}
                          onClear={() => { setFilterValue(''); setPage(1); }}
                        />
                      </ToolbarItem>
                      <ToolbarItem>
                        <Button variant="primary">Invite users</Button>
                      </ToolbarItem>
                      <ToolbarItem align={{ default: 'alignEnd' }}>
                        <Pagination
                          isCompact
                          itemCount={filteredUsers.length}
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
                            isSelected: areAllSelected
                          }}
                        />
                        <Th>Org. Administrator</Th>
                        <Th>Username</Th>
                        <Th>Email</Th>
                        <Th>First name</Th>
                        <Th>Last name</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {pagedUsers.map(u => (
                        <Tr key={u.id}>
                          <Td
                            select={{
                              rowIndex: 0,
                              onSelect: (_e, isSelected) => onSelectRow(u.id, isSelected as boolean),
                              isSelected: selectedUserIds.has(u.id)
                            }}
                          />
                          <Td>
                            <Dropdown
                              isOpen={openAdminFor === u.id}
                              onOpenChange={(isOpen) => setOpenAdminFor(isOpen ? u.id : null)}
                              onSelect={(_e, value) => {
                                const v = (value as string) === 'yes';
                                onToggleAdmin(u.id, v);
                                setOpenAdminFor(null);
                              }}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle ref={toggleRef} onClick={() => setOpenAdminFor(openAdminFor === u.id ? null : u.id)}>
                                  {u.isAdmin ? 'Yes' : 'No'}
                                </MenuToggle>
                              )}
                              popperProps={{ position: 'right' }}
                            >
                              <DropdownList>
                                <DropdownItem value="yes">Yes</DropdownItem>
                                <DropdownItem value="no">No</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </Td>
                          <Td>
                            <Button variant="link" isInline>{u.username}</Button>
                          </Td>
                          <Td>{u.email}</Td>
                          <Td>{u.firstName}</Td>
                          <Td>{u.lastName}</Td>
                          <Td>
                            <Flex alignItems={{ default: 'alignItemsCenter' }}>
                              <FlexItem>
                                <Switch
                                  id={`user-active-${u.id}`}
                                  isChecked={u.active}
                                  onChange={(_e, checked) => onToggleActive(u.id, checked)}
                                />
                              </FlexItem>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <Pagination
                      itemCount={filteredUsers.length}
                      perPage={perPage}
                      page={page}
                      onSetPage={(_, p) => setPage(p)}
                      onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
                    />
                  </div>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Groups</TabTitleText>}>
            <PageSection>
              <Card>
                <CardHeader>
                  <Title headingLevel="h2" size="lg">Groups</Title>
                </CardHeader>
                <Divider />
                <CardBody>
                  {/* Groups state and UI */}
                  {/* Build state inside render for clarity (data defined above component return) */}
                  {
                    (() => {
                      type GroupRow = { id: string; name: string; roles: number; members: number; lastModified: string };
                      const initialGroups: GroupRow[] = [
                        { id: 'g1', name: 'Default admin access', roles: 21, members: 0, lastModified: '07 Apr 2022' },
                        { id: 'g2', name: 'Default access', roles: 20, members: 0, lastModified: '19 May 2021' },
                        { id: 'g3', name: 'AAAA SBR-Insights-PNQ', roles: 101, members: 13, lastModified: '07 Apr 2022' },
                        { id: 'g4', name: 'AA Admin', roles: 3, members: 4, lastModified: '23 Feb 2022' },
                        { id: 'g5', name: 'AA Apurva Email Test', roles: 1, members: 0, lastModified: '02 Mar 2022' },
                        { id: 'g6', name: 'AA Email Testing', roles: 2, members: 2, lastModified: '28 Feb 2022' },
                        { id: 'g7', name: 'AAP_alsouza_grouptest01', roles: 0, members: 1, lastModified: '15 Sep 2025' },
                        { id: 'g8', name: 'AAP–Amar', roles: 4, members: 0, lastModified: '11 Jul 2025' },
                        { id: 'g9', name: 'AAProdTest', roles: 2, members: 2, lastModified: '23 Mar 2023' },
                        { id: 'g10', name: 'admin-dev', roles: 17, members: 1, lastModified: '23 Feb 2022' }
                      ];

                      const [groups, setGroups] = React.useState<GroupRow[]>(initialGroups);
                      const [selectedGroupIds, setSelectedGroupIds] = React.useState<Set<string>>(new Set());
                      const [query, setQuery] = React.useState('');
                      const [pageG, setPageG] = React.useState(1);
                      const [perPageG, setPerPageG] = React.useState(20);
                      const [openKebabFor, setOpenKebabFor] = React.useState<string | null>(null);

                      const filtered = React.useMemo(() => {
                        const q = query.trim().toLowerCase();
                        if (!q) return groups;
                        return groups.filter(g => g.name.toLowerCase().includes(q));
                      }, [groups, query]);

                      const areAllSelectedG = filtered.length > 0 && selectedGroupIds.size === filtered.length;
                      const areSomeSelectedG = selectedGroupIds.size > 0 && selectedGroupIds.size < filtered.length;
                      const start = (pageG - 1) * perPageG;
                      const end = start + perPageG;
                      const pageRows = filtered.slice(start, end);

                      const onSelectAllG = (checked: boolean) => {
                        setSelectedGroupIds(checked ? new Set(filtered.map(g => g.id)) : new Set());
                      };

                      const onSelectRowG = (id: string, checked: boolean) => {
                        setSelectedGroupIds(prev => {
                          const next = new Set(prev);
                          if (checked) next.add(id); else next.delete(id);
                          return next;
                        });
                      };

                      return (
                        <>
                          <Toolbar>
                            <ToolbarContent>
                              <ToolbarItem>
                                <SearchInput
                                  placeholder="Filter by name"
                                  value={query}
                                  onChange={(_, v) => { setQuery(v); setPageG(1); }}
                                  onClear={() => { setQuery(''); setPageG(1); }}
                                />
                              </ToolbarItem>
                              <ToolbarItem>
                                <Button variant="primary">Create group</Button>
                              </ToolbarItem>
                              <ToolbarItem align={{ default: 'alignEnd' }}>
                                <Pagination
                                  isCompact
                                  itemCount={filtered.length}
                                  perPage={perPageG}
                                  page={pageG}
                                  onSetPage={(_, p) => setPageG(p)}
                                  onPerPageSelect={(_, n) => { setPerPageG(n); setPageG(1); }}
                                />
                              </ToolbarItem>
                            </ToolbarContent>
                          </Toolbar>

                          <Table aria-label="Groups table">
                            <Thead>
                              <Tr>
                                <Th
                                  select={{
                                    onSelect: (_e, isSelected) => onSelectAllG(isSelected as boolean),
                                    isSelected: areAllSelectedG
                                  }}
                                />
                                <Th width={40}>Name</Th>
                                <Th width={15}>Roles</Th>
                                <Th width={15}>Members</Th>
                                <Th width={20}>Last modified</Th>
                                <Th width={10}>
                                  <span style={{ visibility: 'hidden' }}>Actions</span>
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {pageRows.map(g => (
                                <Tr key={g.id}>
                                  <Td
                                    select={{
                                      rowIndex: 0,
                                      onSelect: (_e, isSelected) => onSelectRowG(g.id, isSelected as boolean),
                                      isSelected: selectedGroupIds.has(g.id)
                                    }}
                                  />
                                  <Td>
                                    <Button variant="link" isInline>{g.name}</Button>
                                  </Td>
                                  <Td>{g.roles}</Td>
                                  <Td>{g.members}</Td>
                                  <Td>{g.lastModified}</Td>
                                  <Td isActionCell>
                                    <Dropdown
                                      isOpen={openKebabFor === g.id}
                                      onOpenChange={(isOpen) => setOpenKebabFor(isOpen ? g.id : null)}
                                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                        <MenuToggle ref={toggleRef} variant="plain" aria-label="Actions" onClick={() => setOpenKebabFor(openKebabFor === g.id ? null : g.id)}>
                                          ⋮
                                        </MenuToggle>
                                      )}
                                      popperProps={{ position: 'bottom-end' }}
                                    >
                                      <DropdownList>
                                        <DropdownItem>Edit</DropdownItem>
                                        <DropdownItem>View</DropdownItem>
                                        <DropdownItem>Delete</DropdownItem>
                                      </DropdownList>
                                    </Dropdown>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>

                          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                            <Pagination
                              itemCount={filtered.length}
                              perPage={perPageG}
                              page={pageG}
                              onSetPage={(_, p) => setPageG(p)}
                              onPerPageSelect={(_, n) => { setPerPageG(n); setPageG(1); }}
                            />
                          </div>
                        </>
                      );
                    })()
                  }
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { UsersAndGroups };




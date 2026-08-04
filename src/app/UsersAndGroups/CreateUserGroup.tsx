import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Form,
  FormGroup,
  MenuToggle,
  MenuToggleCheckbox,
  MenuToggleElement,
  PageSection,
  Pagination,
  SearchInput,
  Tab,
  TabTitleText,
  Tabs,
  TextArea,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { FilterIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

type UserRow = {
  id: string;
  isAdmin: boolean;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
};

type ServiceAccountRow = {
  id: string;
  name: string;
  description: string;
  clientId: string;
  owner: string;
  created: string;
};

type AIAgentRow = {
  id: string;
  name: string;
  description: string;
  lastRelease: string;
};

const allUsers: UserRow[] = [
  { id: 'u1', isAdmin: false, username: 'doejoe', email: 'lpichler@redhat.com', firstName: 'Joe', lastName: 'Doe', status: 'Active' },
  { id: 'u2', isAdmin: true, username: 'iqe_rbac_v2_admin', email: 'platform-accessmanagement+iqe_rbac_v2_admin+stage@redhat.com', firstName: 'RBAC Admin', lastName: 'For V2', status: 'Active' },
  { id: 'u3', isAdmin: false, username: 'iqe_rbac_v2_normal', email: 'platform-accessmanagement+iqe_rbac_v2_normal+stage@redhat.com', firstName: 'RBAC Normal', lastName: 'For V2', status: 'Active' },
  { id: 'u4', isAdmin: false, username: 'iqe_rbac_v2_rbac', email: 'platform-accessmanagement+iqe_rbac_v2_rbac+stage@redhat.com', firstName: 'RBAC RBAC', lastName: 'For V2', status: 'Active' },
  { id: 'u5', isAdmin: false, username: 'iqe_rbac_v2_viewer', email: 'platform-accessmanagement+iqe_rbac_v2_viewer+stage@redhat.com', firstName: 'RBAC Viewer', lastName: 'For V2', status: 'Active' },
  { id: 'u6', isAdmin: false, username: 'iqe_rbac_v2_workspaces', email: 'platform-accessmanagement+iqe_rbac_v2_workspaces+stage@redhat.com', firstName: 'RBAC Workspaces', lastName: 'For V2', status: 'Active' },
];

const allServiceAccounts: ServiceAccountRow[] = [
  { id: 'sa1', name: 'iqe-rbac-on-rbac', description: 'RBAC on RBAC tests. DO NOT REMOVE!', clientId: '9e6729e3-2c31-4b45-90af-2e88ed654c0f', owner: 'iqe_rbac_v2_admin', created: '3 months ago' },
  { id: 'sa2', name: 'iqe-rbac-on-rbac-read', description: 'RBAC on RBAC tests. DO NOT REMOVE!', clientId: 'b43b9c00-0107-43be-afa7-4ce45006b51c', owner: 'iqe_rbac_v2_admin', created: '3 months ago' },
  { id: 'sa3', name: 'iqe-rbac-v2-e2e-service-account', description: 'DO NOT DELETE. This is an empty service account using during E2E testing', clientId: '6dfb7d72-cf19-40eb-9920-0e8de3d2bb40', owner: 'iqe_rbac_v2_admin', created: '4 months ago' },
  { id: 'sa4', name: 'iqe-rbac-v2-service-account', description: 'DO NOT REMOVE! SA for RBAC Tests', clientId: '7fb2272f-2844-4fd0-bab3-dbdb0d85a91f', owner: 'iqe_rbac_v2_admin', created: '3 months ago' },
  { id: 'sa5', name: 'libord', description: 'libord', clientId: 'f54cbb0-82e3-4f70-82be-a6f343746804', owner: 'iqe_rbac_v2_admin', created: '1 month ago' },
  { id: 'sa6', name: 'SA for RBAC', description: 'DO NOT REMOVE! SA for RBAC Tests', clientId: 'd807b762-31c3-45d0-bffe-7f498b709c66', owner: 'iqe_rbac_v2_admin', created: '3 months ago' },
  { id: 'sa7', name: 'SA Permissions for RBAC', description: 'DO NOT REMOVE! SA with Permissions for RBAC Tests', clientId: 'fe466d70-2aeb-4de7-6eb3-d48ff4729e62', owner: 'iqe_rbac_v2_admin', created: '2 months ago' },
  { id: 'sa8', name: 'test405', description: 'test405', clientId: 'ab434b20-2276-4846-afdd-b0c/4ecba2f0', owner: 'iqe_rbac_v2_admin', created: '1 month ago' },
  { id: 'sa9', name: 'testlibor', description: 'testlibor', clientId: 'cc9a0d3f-07dd-43a5-990b-d5a21d6d90a8', owner: 'iqe_rbac_v2_admin', created: '2 months ago' },
];

const allAIAgents: AIAgentRow[] = [
  { id: 'ai1', name: 'Red Hat Insights Assistant', description: 'AI agent for Insights', lastRelease: '3 months ago' },
  { id: 'ai2', name: 'HCC Virtual Assistant', description: 'Helper agent across Hybrid Cloud Console', lastRelease: '3 months ago' },
  { id: 'ai3', name: 'Red Hat Lightspeed Agent', description: 'AI agent for Red Hat Lightspeed', lastRelease: '4 months ago' },
];

const CreateUserGroup: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const [groupName, setGroupName] = React.useState('');
  const [groupDescription, setGroupDescription] = React.useState('');
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  // Users tab state
  const [selectedUsers, setSelectedUsers] = React.useState<Set<string>>(new Set());
  const [userQuery, setUserQuery] = React.useState('');
  const [userPage, setUserPage] = React.useState(1);
  const [userPerPage, setUserPerPage] = React.useState(20);
  const [isUserFilterOpen, setIsUserFilterOpen] = React.useState(false);
  const [isUserBulkOpen, setIsUserBulkOpen] = React.useState(false);
  const [userShowSelected, setUserShowSelected] = React.useState(false);

  // Service accounts tab state
  const [selectedSAs, setSelectedSAs] = React.useState<Set<string>>(new Set());
  const [saQuery, setSaQuery] = React.useState('');
  const [saPage, setSaPage] = React.useState(1);
  const [saPerPage, setSaPerPage] = React.useState(20);
  const [isSaFilterOpen, setIsSaFilterOpen] = React.useState(false);
  const [isSaBulkOpen, setIsSaBulkOpen] = React.useState(false);
  const [saShowSelected, setSaShowSelected] = React.useState(false);

  // AI agents tab state
  const [selectedAgents, setSelectedAgents] = React.useState<Set<string>>(new Set());
  const [agentQuery, setAgentQuery] = React.useState('');
  const [agentPage, setAgentPage] = React.useState(1);
  const [agentPerPage, setAgentPerPage] = React.useState(20);
  const [isAgentFilterOpen, setIsAgentFilterOpen] = React.useState(false);
  const [isAgentBulkOpen, setIsAgentBulkOpen] = React.useState(false);
  const [agentShowSelected, setAgentShowSelected] = React.useState(false);

  // Users filtering/pagination
  const filteredUsers = React.useMemo(() => {
    let list = allUsers;
    if (userQuery.trim()) list = list.filter(u => u.username.toLowerCase().includes(userQuery.trim().toLowerCase()));
    if (userShowSelected) list = list.filter(u => selectedUsers.has(u.id));
    return list;
  }, [userQuery, userShowSelected, selectedUsers]);
  const userPageRows = filteredUsers.slice((userPage - 1) * userPerPage, userPage * userPerPage);
  const allUsersOnPageSelected = userPageRows.length > 0 && userPageRows.every(u => selectedUsers.has(u.id));
  const someUsersOnPageSelected = userPageRows.some(u => selectedUsers.has(u.id)) && !allUsersOnPageSelected;

  // Service accounts filtering/pagination
  const filteredSAs = React.useMemo(() => {
    let list = allServiceAccounts;
    if (saQuery.trim()) list = list.filter(s => s.name.toLowerCase().includes(saQuery.trim().toLowerCase()));
    if (saShowSelected) list = list.filter(s => selectedSAs.has(s.id));
    return list;
  }, [saQuery, saShowSelected, selectedSAs]);
  const saPageRows = filteredSAs.slice((saPage - 1) * saPerPage, saPage * saPerPage);
  const allSAsOnPageSelected = saPageRows.length > 0 && saPageRows.every(s => selectedSAs.has(s.id));
  const someSAsOnPageSelected = saPageRows.some(s => selectedSAs.has(s.id)) && !allSAsOnPageSelected;

  // AI agents filtering/pagination
  const filteredAgents = React.useMemo(() => {
    let list = allAIAgents;
    if (agentQuery.trim()) list = list.filter(a => a.name.toLowerCase().includes(agentQuery.trim().toLowerCase()));
    if (agentShowSelected) list = list.filter(a => selectedAgents.has(a.id));
    return list;
  }, [agentQuery, agentShowSelected, selectedAgents]);
  const agentPageRows = filteredAgents.slice((agentPage - 1) * agentPerPage, agentPage * agentPerPage);
  const allAgentsOnPageSelected = agentPageRows.length > 0 && agentPageRows.every(a => selectedAgents.has(a.id));
  const someAgentsOnPageSelected = agentPageRows.some(a => selectedAgents.has(a.id)) && !allAgentsOnPageSelected;

  const toggleSet = (set: Set<string>, id: string): Set<string> => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  };

  return (
    <>
      <PageSection hasBodyWrapper={false} style={{ paddingBottom: 0 }}>
        <Breadcrumb>
          <BreadcrumbItem to="/iam/overview">Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem to="/user-access">Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Users and Groups</BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb style={{ marginTop: 8 }}>
          <BreadcrumbItem to="/users-and-groups">User groups</BreadcrumbItem>
          <BreadcrumbItem isActive>Create user group</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Create user group</Title>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Form>
          <FormGroup label="Name" isRequired fieldId="group-name">
            <TextInput
              isRequired
              id="group-name"
              value={groupName}
              onChange={(_e, val) => setGroupName(val)}
            />
          </FormGroup>
          <FormGroup label="Description" fieldId="group-description">
            <TextArea
              id="group-description"
              value={groupDescription}
              onChange={(_e, val) => setGroupDescription(val)}
            />
          </FormGroup>
        </Form>

        <Title headingLevel="h2" size="lg" style={{ marginTop: 32 }}>Select principals</Title>

        <Tabs activeKey={activeTabKey} onSelect={(_e, k) => setActiveTabKey(k)} style={{ marginTop: 16 }}>
          {/* Users tab */}
          <Tab eventKey={0} title={<TabTitleText>Users</TabTitleText>}>
            <Toolbar style={{ marginTop: 8 }}>
              <ToolbarContent>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isUserBulkOpen}
                    onOpenChange={setIsUserBulkOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsUserBulkOpen(!isUserBulkOpen)} splitButtonItems={[
                          <MenuToggleCheckbox
                            id="user-bulk-select"
                            key="user-bulk"
                            aria-label="Select all users"
                            isChecked={allUsersOnPageSelected ? true : someUsersOnPageSelected ? null : false}
                            onChange={(checked) => {
                              if (checked) {
                                setSelectedUsers(prev => { const next = new Set(prev); userPageRows.forEach(u => next.add(u.id)); return next; });
                              } else {
                                setSelectedUsers(prev => { const next = new Set(prev); userPageRows.forEach(u => next.delete(u.id)); return next; });
                              }
                            }}
                          >
                            {selectedUsers.size > 0 ? `${selectedUsers.size} selected` : ''}
                          </MenuToggleCheckbox>
                      ]} />
                    )}
                  >
                    <DropdownList>
                      <DropdownItem onClick={() => { setSelectedUsers(new Set()); setIsUserBulkOpen(false); }}>Select none (0)</DropdownItem>
                      <DropdownItem onClick={() => { setSelectedUsers(prev => { const next = new Set(prev); userPageRows.forEach(u => next.add(u.id)); return next; }); setIsUserBulkOpen(false); }}>Select page ({userPageRows.length})</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isUserFilterOpen}
                      onOpenChange={setIsUserFilterOpen}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle ref={toggleRef} onClick={() => setIsUserFilterOpen(!isUserFilterOpen)} icon={<FilterIcon />}>
                          Username
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem onClick={() => setIsUserFilterOpen(false)}>Username</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Filter by Username"
                      value={userQuery}
                      onChange={(_, v) => { setUserQuery(v); setUserPage(1); }}
                      onClear={() => { setUserQuery(''); setUserPage(1); }}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarItem>
                  <ToggleGroup>
                    <ToggleGroupItem text="All" isSelected={!userShowSelected} onChange={() => { setUserShowSelected(false); setUserPage(1); }} />
                    <ToggleGroupItem text={`Selected (${selectedUsers.size})`} isSelected={userShowSelected} onChange={() => { setUserShowSelected(true); setUserPage(1); }} />
                  </ToggleGroup>
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    isCompact
                    itemCount={filteredUsers.length}
                    perPage={userPerPage}
                    page={userPage}
                    onSetPage={(_, p) => setUserPage(p)}
                    onPerPageSelect={(_, n) => { setUserPerPage(n); setUserPage(1); }}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <Table aria-label="Users table" variant="compact">
              <Thead>
                <Tr>
                  <Th screenReaderText="Select" />
                  <Th>Org. Admin</Th>
                  <Th>Username</Th>
                  <Th>Email</Th>
                  <Th>First name</Th>
                  <Th>Last name</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userPageRows.map(u => (
                  <Tr key={u.id}>
                    <Td select={{ rowIndex: 0, onSelect: () => setSelectedUsers(toggleSet(selectedUsers, u.id)), isSelected: selectedUsers.has(u.id) }} />
                    <Td>{u.isAdmin ? 'Yes' : 'No'}</Td>
                    <Td>{u.username}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.firstName}</Td>
                    <Td>{u.lastName}</Td>
                    <Td>{u.status}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination
                itemCount={filteredUsers.length}
                perPage={userPerPage}
                page={userPage}
                onSetPage={(_, p) => setUserPage(p)}
                onPerPageSelect={(_, n) => { setUserPerPage(n); setUserPage(1); }}
              />
            </div>
          </Tab>

          {/* Service accounts tab */}
          <Tab eventKey={1} title={<TabTitleText>Service accounts</TabTitleText>}>
            <Toolbar style={{ marginTop: 8 }}>
              <ToolbarContent>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isSaBulkOpen}
                    onOpenChange={setIsSaBulkOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsSaBulkOpen(!isSaBulkOpen)} splitButtonItems={[
                          <MenuToggleCheckbox
                            id="sa-bulk-select"
                            key="sa-bulk"
                            aria-label="Select all service accounts"
                            isChecked={allSAsOnPageSelected ? true : someSAsOnPageSelected ? null : false}
                            onChange={(checked) => {
                              if (checked) {
                                setSelectedSAs(prev => { const next = new Set(prev); saPageRows.forEach(s => next.add(s.id)); return next; });
                              } else {
                                setSelectedSAs(prev => { const next = new Set(prev); saPageRows.forEach(s => next.delete(s.id)); return next; });
                              }
                            }}
                          >
                            {selectedSAs.size > 0 ? `${selectedSAs.size} selected` : ''}
                          </MenuToggleCheckbox>
                      ]} />
                    )}
                  >
                    <DropdownList>
                      <DropdownItem onClick={() => { setSelectedSAs(new Set()); setIsSaBulkOpen(false); }}>Select none (0)</DropdownItem>
                      <DropdownItem onClick={() => { setSelectedSAs(prev => { const next = new Set(prev); saPageRows.forEach(s => next.add(s.id)); return next; }); setIsSaBulkOpen(false); }}>Select page ({saPageRows.length})</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isSaFilterOpen}
                      onOpenChange={setIsSaFilterOpen}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle ref={toggleRef} onClick={() => setIsSaFilterOpen(!isSaFilterOpen)} icon={<FilterIcon />}>
                          Name
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem onClick={() => setIsSaFilterOpen(false)}>Name</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Filter by Name"
                      value={saQuery}
                      onChange={(_, v) => { setSaQuery(v); setSaPage(1); }}
                      onClear={() => { setSaQuery(''); setSaPage(1); }}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarItem>
                  <ToggleGroup>
                    <ToggleGroupItem text="All" isSelected={!saShowSelected} onChange={() => { setSaShowSelected(false); setSaPage(1); }} />
                    <ToggleGroupItem text={`Selected (${selectedSAs.size})`} isSelected={saShowSelected} onChange={() => { setSaShowSelected(true); setSaPage(1); }} />
                  </ToggleGroup>
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    isCompact
                    itemCount={filteredSAs.length}
                    perPage={saPerPage}
                    page={saPage}
                    onSetPage={(_, p) => setSaPage(p)}
                    onPerPageSelect={(_, n) => { setSaPerPage(n); setSaPage(1); }}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <Table aria-label="Service accounts table" variant="compact">
              <Thead>
                <Tr>
                  <Th screenReaderText="Select" />
                  <Th>Name</Th>
                  <Th>Description</Th>
                  <Th>Client ID</Th>
                  <Th>Owner</Th>
                  <Th>Time created</Th>
                </Tr>
              </Thead>
              <Tbody>
                {saPageRows.map(s => (
                  <Tr key={s.id}>
                    <Td select={{ rowIndex: 0, onSelect: () => setSelectedSAs(toggleSet(selectedSAs, s.id)), isSelected: selectedSAs.has(s.id) }} />
                    <Td>{s.name}</Td>
                    <Td>{s.description}</Td>
                    <Td>{s.clientId}</Td>
                    <Td>{s.owner}</Td>
                    <Td>{s.created}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination
                itemCount={filteredSAs.length}
                perPage={saPerPage}
                page={saPage}
                onSetPage={(_, p) => setSaPage(p)}
                onPerPageSelect={(_, n) => { setSaPerPage(n); setSaPage(1); }}
              />
            </div>
          </Tab>

          {/* AI agents tab */}
          <Tab eventKey={2} title={<TabTitleText>AI agents</TabTitleText>}>
            <Toolbar style={{ marginTop: 8 }}>
              <ToolbarContent>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isAgentBulkOpen}
                    onOpenChange={setIsAgentBulkOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsAgentBulkOpen(!isAgentBulkOpen)} splitButtonItems={[
                          <MenuToggleCheckbox
                            id="agent-bulk-select"
                            key="agent-bulk"
                            aria-label="Select all AI agents"
                            isChecked={allAgentsOnPageSelected ? true : someAgentsOnPageSelected ? null : false}
                            onChange={(checked) => {
                              if (checked) {
                                setSelectedAgents(prev => { const next = new Set(prev); agentPageRows.forEach(a => next.add(a.id)); return next; });
                              } else {
                                setSelectedAgents(prev => { const next = new Set(prev); agentPageRows.forEach(a => next.delete(a.id)); return next; });
                              }
                            }}
                          >
                            {selectedAgents.size > 0 ? `${selectedAgents.size} selected` : ''}
                          </MenuToggleCheckbox>
                      ]} />
                    )}
                  >
                    <DropdownList>
                      <DropdownItem onClick={() => { setSelectedAgents(new Set()); setIsAgentBulkOpen(false); }}>Select none (0)</DropdownItem>
                      <DropdownItem onClick={() => { setSelectedAgents(prev => { const next = new Set(prev); agentPageRows.forEach(a => next.add(a.id)); return next; }); setIsAgentBulkOpen(false); }}>Select page ({agentPageRows.length})</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isAgentFilterOpen}
                      onOpenChange={setIsAgentFilterOpen}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle ref={toggleRef} onClick={() => setIsAgentFilterOpen(!isAgentFilterOpen)} icon={<FilterIcon />}>
                          Name
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem onClick={() => setIsAgentFilterOpen(false)}>Name</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Filter by Name"
                      value={agentQuery}
                      onChange={(_, v) => { setAgentQuery(v); setAgentPage(1); }}
                      onClear={() => { setAgentQuery(''); setAgentPage(1); }}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarItem>
                  <ToggleGroup>
                    <ToggleGroupItem text="All" isSelected={!agentShowSelected} onChange={() => { setAgentShowSelected(false); setAgentPage(1); }} />
                    <ToggleGroupItem text={`Selected (${selectedAgents.size})`} isSelected={agentShowSelected} onChange={() => { setAgentShowSelected(true); setAgentPage(1); }} />
                  </ToggleGroup>
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    isCompact
                    itemCount={filteredAgents.length}
                    perPage={agentPerPage}
                    page={agentPage}
                    onSetPage={(_, p) => setAgentPage(p)}
                    onPerPageSelect={(_, n) => { setAgentPerPage(n); setAgentPage(1); }}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <Table aria-label="AI agents table" variant="compact">
              <Thead>
                <Tr>
                  <Th screenReaderText="Select" />
                  <Th>Name</Th>
                  <Th>Description</Th>
                  <Th>Last release</Th>
                </Tr>
              </Thead>
              <Tbody>
                {agentPageRows.map(a => (
                  <Tr key={a.id}>
                    <Td select={{ rowIndex: 0, onSelect: () => setSelectedAgents(toggleSet(selectedAgents, a.id)), isSelected: selectedAgents.has(a.id) }} />
                    <Td>{a.name}</Td>
                    <Td>{a.description}</Td>
                    <Td>{a.lastRelease}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination
                itemCount={filteredAgents.length}
                perPage={agentPerPage}
                page={agentPage}
                onSetPage={(_, p) => setAgentPage(p)}
                onPerPageSelect={(_, n) => { setAgentPerPage(n); setAgentPage(1); }}
              />
            </div>
          </Tab>
        </Tabs>

        <div style={{ marginTop: 32 }}>
          <Button
            variant="primary"
            isDisabled={!groupName.trim()}
            onClick={() => {
              const memberCount = selectedUsers.size + selectedSAs.size + selectedAgents.size;
              const selUsers = allUsers.filter(u => selectedUsers.has(u.id)).map(u => ({
                username: u.username, email: u.email, firstName: u.firstName, lastName: u.lastName,
              }));
              const selSAs = allServiceAccounts.filter(s => selectedSAs.has(s.id)).map(s => ({
                name: s.name, clientId: s.clientId, owner: s.owner,
              }));
              const selAgents = allAIAgents.filter(a => selectedAgents.has(a.id)).map(a => ({
                name: a.name, description: a.description,
              }));
              navigate('/users-and-groups', {
                state: {
                  newGroup: {
                    name: groupName.trim(),
                    description: groupDescription.trim(),
                    users: memberCount > 0 ? String(memberCount) : '0',
                    selectedUsers: selUsers,
                    selectedSAs: selSAs,
                    selectedAgents: selAgents,
                  },
                },
              });
            }}
          >
            Submit
          </Button>
          {' '}
          <Button variant="link" onClick={() => navigate('/users-and-groups')}>Cancel</Button>
        </div>
      </PageSection>
    </>
  );
};

export { CreateUserGroup };

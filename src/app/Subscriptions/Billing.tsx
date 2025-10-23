import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  Flex,
  FlexItem,
  PageSection,
  Tab,
  TabTitleText,
  Tabs,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Checkbox,
  Modal,
  Radio,
  TextInput,
  Pagination,
  Label,
  AlertGroup,
  Alert,
  AlertActionCloseButton
} from '@patternfly/react-core';
import { Wizard, WizardStep, WizardHeader } from '@patternfly/react-core';
import { EllipsisVIcon, ExternalLinkAltIcon, FilterIcon, SyncAltIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

const Billing: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isMasterOpen, setIsMasterOpen] = React.useState(false);
  // Selection state for table rows
  const groupNames = ['Golden girls', 'Powerpuff girls', 'Spice girls'];
  const [selectedRowIds, setSelectedRowIds] = React.useState<Set<number>>(new Set());
  const areAllSelected = selectedRowIds.size === groupNames.length;
  const areSomeSelected = selectedRowIds.size > 0 && selectedRowIds.size < groupNames.length;
  const onToggleAll = (checked: boolean) => {
    if (checked) setSelectedRowIds(new Set(groupNames.map((_, idx) => idx)));
    else setSelectedRowIds(new Set());
  };
  const onToggleRow = (idx: number, checked: boolean) => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(idx); else next.delete(idx);
      return next;
    });
  };

  const handleTabClick = (_e: any, tabIndex: string | number) => setActiveTabKey(tabIndex);
  // no secondary tabs on this page

  // Grant access wizard (reused from Workspaces)
  const [isGrantWizardOpen, setIsGrantWizardOpen] = React.useState(false);
  const myOrgName = 'UXD';
  const [grantWhere, setGrantWhere] = React.useState<'within' | 'outside' | null>(null);
  const [isTrustedOpen, setIsTrustedOpen] = React.useState(false);
  const [selectedTrustedOrg, setSelectedTrustedOrg] = React.useState<string | null>(null);
  // Toasts
  type ToastItem = { id: number; title: string; description?: React.ReactNode };
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const addToast = (title: string, description?: React.ReactNode) => {
    setToasts(prev => [...prev, { id: Date.now() + Math.floor(Math.random() * 1000), title, description }]);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));
  type UserEntry = { name: string; org: string };
  type GrantedRow = { groupName: string; description: string; users: number; roles: number; lastModified: string; rolesList?: string[]; usersList?: UserEntry[]; orgName?: string };
  type BillingRow = { org: string; group: string; roles: number; status: 'Granted' | 'Severed'; lastUpdated: string };
  const [billingRows, setBillingRows] = React.useState<BillingRow[]>([
    { org: 'Seattle Grace Hospital', group: 'Golden Girls', roles: 4, status: 'Granted', lastUpdated: '1 days ago' },
    { org: 'AWS', group: 'Spice Girls', roles: 3, status: 'Granted', lastUpdated: '2 days ago' },
    { org: 'Acme hospital', group: 'Powerfuff Girls', roles: 5, status: 'Severed', lastUpdated: '2 days ago' },
    { org: 'St. Elsewhere Hospital', group: 'St. Elsewhere admin', roles: 5, status: 'Granted', lastUpdated: '5 days ago' }
  ]);
  const openDetails = (_row: GrantedRow) => {};
  const trustedOrgNames = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent'];
  // Wizard step 2 selection
  const wizardUserGroups = ['All users','Administrators','Powerpuff Girls','Spice Girls','Golden Girls','Seattle Grace admins'];
  const wizardMembers = [11,3,5,7,2,1];
  const [selectedWizardGroups, setSelectedWizardGroups] = React.useState<Set<number>>(new Set([5]));
  const wizardAllSelected = selectedWizardGroups.size === wizardUserGroups.length;
  const wizardSomeSelected = selectedWizardGroups.size > 0 && selectedWizardGroups.size < wizardUserGroups.length;
  const onWizardSelectAll = (checked: boolean) => {
    if (checked) setSelectedWizardGroups(new Set(wizardUserGroups.map((_, idx) => idx)));
    else setSelectedWizardGroups(new Set());
  };
  // Wizard step 3: roles
  type RoleRow = { name: string; description: string; permissions: number };
  const allRoles: RoleRow[] = [
    { name: 'Procurement admin', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do', permissions: 4 },
    { name: 'Billing account admin', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do', permissions: 6 },
    { name: 'Billing account viewer', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do', permissions: 2 },
    { name: 'Subscription viewer', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do', permissions: 3 },
    { name: 'Subscription editor', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do', permissions: 5 }
  ];
  const [roleFilter, setRoleFilter] = React.useState('');
  const [selectedRoles, setSelectedRoles] = React.useState<Set<string>>(new Set(['RHEL Admin']));
  const [rolesPage, setRolesPage] = React.useState(1);
  const [rolesPerPage, setRolesPerPage] = React.useState(10);
  const filteredRoles = React.useMemo(
    () => allRoles.filter(r => r.name.toLowerCase().includes(roleFilter.trim().toLowerCase())),
    [roleFilter]
  );
  const rolesStart = (rolesPage - 1) * rolesPerPage;
  const rolesPageRows = filteredRoles.slice(rolesStart, rolesStart + rolesPerPage);
  const rolesAllSelected = filteredRoles.length > 0 && selectedRoles.size === filteredRoles.length;
  const rolesSomeSelected = selectedRoles.size > 0 && selectedRoles.size < filteredRoles.length;
  const onToggleAllRoles = (checked: boolean) => {
    if (checked) setSelectedRoles(new Set(filteredRoles.map(r => r.name)));
    else setSelectedRoles(new Set());
  };
  const onToggleRoleRow = (roleName: string, checked: boolean) => {
    setSelectedRoles(prev => {
      const next = new Set(prev);
      if (checked) next.add(roleName); else next.delete(roleName);
      return next;
    });
  };
  const onWizardToggleRow = (idx: number, checked: boolean) => {
    setSelectedWizardGroups(prev => {
      const next = new Set(prev);
      if (checked) next.add(idx); else next.delete(idx);
      return next;
    });
  };

  return (
    <>
      <AlertGroup isToast isLiveRegion>
        {toasts.map(t => (
          <Alert key={t.id} variant="success" title={t.title} actionClose={<AlertActionCloseButton onClose={() => removeToast(t.id)} />}>
            {t.description}
          </Alert>
        ))}
      </AlertGroup>

      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Subscription Services</BreadcrumbItem>
          <BreadcrumbItem>Subscription Inventory</BreadcrumbItem>
          <BreadcrumbItem isActive>Billing account details</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      {isGrantWizardOpen && (
        <Modal isOpen onClose={() => setIsGrantWizardOpen(false)} variant="large" aria-label="Grant access wizard" className="trusted-wizard-modal">
          <Wizard
            onClose={() => setIsGrantWizardOpen(false)}
            onSave={() => {
              const orgName = grantWhere === 'outside' ? (selectedTrustedOrg || 'Selected organization') : 'Pinnacle Corp';
              const newRows = Array.from(selectedWizardGroups).map(idx => ({
                org: orgName,
                group: wizardUserGroups[idx],
                roles: selectedRoles.size || 1,
                status: 'Granted' as const,
                lastUpdated: 'Just now'
              }));
              setBillingRows(prev => [...prev, ...newRows]);
              const firstGroupIdx = Array.from(selectedWizardGroups)[0];
              const firstGroupName = typeof firstGroupIdx === 'number' ? wizardUserGroups[firstGroupIdx] : 'Selected group';
              addToast('Billing account share has granted', (
                <span>
                  {firstGroupName} from {orgName} now has access to the billing account
                </span>
              ));
              setIsGrantWizardOpen(false);
            }}
            header={
              <WizardHeader
                title={`Grant billing account access`}
                description="Pinnacle Corp (1234567890)"
                onClose={() => setIsGrantWizardOpen(false)}
              />
            }
            startIndex={1}
          >
            <WizardStep id="grant-step-1" name="Where are you granting access?">
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Where are you granting access?</Title>
                <p style={{ marginTop: 8 }}>Select where you wish to grant access.</p>
                <div style={{ marginTop: 16 }}>
                  <Radio id="grant-where-within" name="grant-where" isChecked={grantWhere === 'within'} onChange={() => setGrantWhere('within')} label={`Within ${myOrgName} organization`} />
                  <Radio id="grant-where-outside" name="grant-where" isChecked={grantWhere === 'outside'} onChange={() => setGrantWhere('outside')} label={`Outside of this organization`} style={{ marginTop: 0 }} />
                </div>
                <div style={{ marginTop: 16 }}>
                  <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>Select a trusted organization</Title>
                  <div style={{ marginTop: 8 }}>
                    <Dropdown
                      isOpen={isTrustedOpen}
                      onOpenChange={setIsTrustedOpen}
                      onSelect={(_e, itemId) => {
                        const name = String(itemId ?? '');
                        if (name) setSelectedTrustedOrg(name);
                        setIsTrustedOpen(false);
                      }}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          isExpanded={isTrustedOpen}
                          isDisabled={grantWhere !== 'outside'}
                          style={{ width: '100%', justifyContent: 'space-between' }}
                          onClick={() => grantWhere === 'outside' && setIsTrustedOpen((prev) => !prev)}
                        >
                          {selectedTrustedOrg || 'Select a trusted organization'}
                        </MenuToggle>
                      )}
                      // append to body to avoid clipping under overlay
                      popperProps={{ appendTo: () => document.body }}
                    >
                      <DropdownList>
                        {['Acme Corp','Globex','Initech','Umbrella','Soylent'].map((name) => (
                          <DropdownItem key={name} itemId={name} isSelected={selectedTrustedOrg === name}>{name}</DropdownItem>
                        ))}
                      </DropdownList>
                    </Dropdown>
                  </div>
                  <p style={{ marginTop: 8, color: 'var(--pf-v6-global--palette--black-700)' }}>
                    Don’t see the trusted org you need? Establish a new trusted org connection
                  </p>
                </div>
              </div>
            </WizardStep>
            <WizardStep id="grant-step-2" name="Select user group(s)">
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Select user group(s) you want to grant access to</Title>
                <p style={{ marginTop: 8 }}>
                  Select the user group(s) you wish to grant access to. If you don’t see the group you wish to select, you must create a new group in
                  {' '}<a href="#">User and user groups</a>{' '}<ExternalLinkAltIcon style={{ verticalAlign: 'middle' }} />
                </p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Dropdown isOpen={false} onOpenChange={() => {}} toggle={(toggleRef) => (
                    <MenuToggle ref={toggleRef} isExpanded={false} icon={<FilterIcon />} style={{ minWidth: 160 }}>
                      User group name
                    </MenuToggle>
                  )}>
                    <DropdownList>
                      <DropdownItem>User group name</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                  <SearchInput aria-label="Find by name" placeholder="Find by name" value={''} onChange={() => {}} onClear={() => {}} />
                  <Button variant="primary" icon={<ExternalLinkAltIcon />} iconPosition="end">Add group</Button>
                  <Button variant="plain" aria-label="refresh"><SyncAltIcon /></Button>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Table aria-label="Select user groups table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox id="wizard-ug-select-all" aria-label="Select all user groups" isChecked={wizardAllSelected} onChange={(_e, checked) => onWizardSelectAll(!!checked)} />
                        </Th>
                        <Th>User group name</Th>
                        <Th>Members</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {wizardUserGroups.map((name, idx) => (
                        <Tr key={name}>
                          <Td>
                            <Checkbox id={`sel-ug-${idx}`} aria-label={`Select ${name}`} isChecked={selectedWizardGroups.has(idx)} onChange={(_e, checked) => onWizardToggleRow(idx, !!checked)} />
                          </Td>
                          <Td>{name}</Td>
                          <Td>{wizardMembers[idx]}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </WizardStep>
            <WizardStep id="grant-step-3" name="Select role(s)">
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Select role(s)</Title>
                <p style={{ marginTop: 8 }}>Select one or more roles to link to this group.</p>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <SearchInput style={{ width: 260 }} aria-label="Find by name" placeholder="Find by name" value={roleFilter} onChange={(_e, v) => setRoleFilter(v)} onClear={() => setRoleFilter('')} />
                  <div style={{ marginLeft: 'auto' }}>
                    
                    <Pagination itemCount={filteredRoles.length} perPage={rolesPerPage} page={rolesPage} onSetPage={(_e, p) => setRolesPage(p)} onPerPageSelect={(_e, pp) => { setRolesPerPage(pp); setRolesPage(1); }} variant="top" isCompact />
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Table aria-label="Select roles table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox id="roles-select-all" aria-label="Select all roles" isChecked={rolesAllSelected} onChange={(_e, checked) => onToggleAllRoles(!!checked)} />
                        </Th>
                        <Th>Name</Th>
                        <Th>Description</Th>
                        <Th>Permissions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {rolesPageRows.map((role) => (
                        <Tr key={role.name}>
                          <Td>
                            <Checkbox id={`role-${role.name}`} aria-label={`Select ${role.name}`} isChecked={selectedRoles.has(role.name)} onChange={(_e, checked) => onToggleRoleRow(role.name, !!checked)} />
                          </Td>
                          <Td>{role.name}</Td>
                          <Td>{role.description}</Td>
                          <Td>{role.permissions}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </WizardStep>
            <WizardStep id="grant-step-4" name="Review" footer={{ nextButtonText: 'Submit' }}>
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Review</Title>
                <p style={{ marginTop: 8 }}>
                  {`Review the billing account share granting ${grantWhere === 'outside' ? 'outside of this organization' : 'within this organization'}`}
                </p>
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', rowGap: 12 }}>
                    <div style={{ fontWeight: 700 }}>Trusted Org</div>
                    <div>{grantWhere === 'outside' ? (selectedTrustedOrg || '-') : myOrgName}</div>
                    <div style={{ fontWeight: 700 }}>Group(s)</div>
                    <div>{Array.from(selectedWizardGroups).sort((a,b)=>a-b).map(idx => wizardUserGroups[idx]).join(', ') || '-'}</div>
                    <div style={{ fontWeight: 700 }}>Role(s)</div>
                    <div>{Array.from(selectedRoles).join(', ') || '-'}</div>
                  </div>
                </div>
              </div>
            </WizardStep>
          </Wizard>
        </Modal>
      )}

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Billing account details</Title>
        <Content>
          <p style={{ margin: 0, color: '#6a6e73' }}>Billing account: Pinnacle Corp (1234567890)</p>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title={<TabTitleText>Grant sharing</TabTitleText>}>
            <PageSection style={{ paddingTop: 8, paddingBottom: 0 }}>
              <Toolbar style={{ marginTop: 16 }}>
                <ToolbarContent>
                  <ToolbarItem>
                    <Dropdown isOpen={false} onOpenChange={() => {}} toggle={(toggleRef) => (
                      <MenuToggle ref={toggleRef} isExpanded={false} icon={<FilterIcon />} style={{ minWidth: 180 }}>
                        Organization name
                      </MenuToggle>
                    )}>
                      <DropdownList>
                        <DropdownItem>Organization name</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  <ToolbarItem>
                    <SearchInput aria-label={'Search'} placeholder={'Search'} value={''} onChange={() => {}} onClear={() => {}} />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="primary" onClick={() => setIsGrantWizardOpen(true)}>Grant access</Button>
                  </ToolbarItem>
                  <ToolbarItem style={{ marginLeft: 'auto' }}>

                    <Pagination itemCount={billingRows.length} perPage={billingRows.length} page={1} isCompact />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            </PageSection>
            <PageSection style={{ paddingTop: 0 }}>
              <Table aria-label="Grant sharing groups table">
                <Thead>
                  <Tr>
                    <Th aria-label="Row select" />
                    <Th width={30}>Organization name</Th>
                    <Th width={25}>User group</Th>
                    <Th width={10}>Roles</Th>
                    <Th width={15}>Status</Th>
                    <Th width={20}>Last updated</Th>
                    <Th aria-label="Row actions"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {billingRows.map((row, idx) => (
                    <Tr key={`${row.org}-${idx}`}>
                      <Td>
                        <Checkbox id={`select-bill-${idx}`} aria-label={`Select ${row.org}`} isChecked={selectedRowIds.has(idx)} onChange={(_e, checked) => onToggleRow(idx, !!checked)} />
                      </Td>
                      <Td dataLabel="Organization name" style={{ paddingRight: '32px' }}>
                        <Button variant="link" isInline>{row.org}</Button>
                      </Td>
                      <Td dataLabel="User group">{row.group}</Td>
                      <Td dataLabel="Roles">{row.roles}</Td>
                      <Td dataLabel="Status">
                        {row.status === 'Granted' ? (
                          <Label color="green">Granted</Label>
                        ) : (
                          <Label color="orange">Severed</Label>
                        )}
                      </Td>
                      <Td dataLabel="Last updated">{row.lastUpdated}</Td>
                      <Td isActionCell>
                        <Dropdown isOpen={false} onOpenChange={() => {}} toggle={(toggleRef) => (
                          <MenuToggle ref={toggleRef} aria-label={`Row actions for ${row.org}`} variant="plain">
                            <EllipsisVIcon />
                          </MenuToggle>
                        )} popperProps={{ position: 'right' }}>
                          <DropdownList>
                            <DropdownItem>View</DropdownItem>
                            <DropdownItem>Edit</DropdownItem>
                            <DropdownItem>Remove</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Address list</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Address list</Title>
                    <p>Addresses associated with this billing account.</p>
                  </Content>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
          <Tab eventKey={2} title={<TabTitleText>Contact list</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <Content>
                    <Title headingLevel="h2" size="xl">Contact list</Title>
                    <p>Contacts associated with this billing account.</p>
                  </Content>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { Billing };

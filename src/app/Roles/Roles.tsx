import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
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
  PageSection,
  Pagination,
  SearchInput,
  Tab,
  TabTitleText,
  Tabs,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr, ThProps } from '@patternfly/react-table';
import { EllipsisVIcon, FilterIcon } from '@patternfly/react-icons';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import { allRoles, type RoleData } from '@app/utils/rolesData';

const Roles: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [searchValue, setSearchValue] = React.useState('');
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterField, setFilterField] = React.useState('Name');
  const [sortIndex, setSortIndex] = React.useState<number>(0);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<RoleData | null>(null);
  const [drawerTabKey, setDrawerTabKey] = React.useState<string | number>(0);
  const [permPage, setPermPage] = React.useState(1);
  const [permPerPage, setPermPerPage] = React.useState(4);

  const sortableColumns = ['name', 'description', 'permissions', 'lastModified'] as const;

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: { index: sortIndex, direction: sortDirection },
    onSort: (_event, index, direction) => {
      setSortIndex(index);
      setSortDirection(direction);
    },
    columnIndex,
  });

  const filteredRoles = React.useMemo(() => {
    if (!searchValue) return allRoles;
    const lower = searchValue.toLowerCase();
    return allRoles.filter((role) =>
      role.name.toLowerCase().includes(lower) ||
      role.description.toLowerCase().includes(lower)
    );
  }, [searchValue]);

  const sortedRoles = React.useMemo(() => {
    const sorted = [...filteredRoles];
    const key = sortableColumns[sortIndex];
    sorted.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [filteredRoles, sortIndex, sortDirection]);

  const paginatedRoles = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedRoles.slice(start, start + perPage);
  }, [sortedRoles, page, perPage]);

  const paginatedPermissions = React.useMemo(() => {
    if (!selectedRole) return [];
    const start = (permPage - 1) * permPerPage;
    return selectedRole.permissionDetails.slice(start, start + permPerPage);
  }, [selectedRole, permPage, permPerPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => setPage(newPage);
  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number, newPage: number) => { setPerPage(newPerPage); setPage(newPage); };

  const handleSearchChange = (value: string) => { setSearchValue(value); setPage(1); };

  const onRowClick = (role: RoleData) => {
    setSelectedRole(role);
    setDrawerTabKey(0);
    setPermPage(1);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRole(null);
  };

  const drawerPanel = (
    <DrawerPanelContent
      defaultSize="480px"
      style={{ height: 'calc(100vh - 180px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <DrawerHead>
        <Title headingLevel="h2" size="lg">{selectedRole?.name ?? 'Role'}</Title>
        <DrawerActions>
          <DrawerCloseButton onClick={closeDrawer} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody style={{ flex: '1 1 auto', overflow: 'auto' }}>
        <Tabs activeKey={drawerTabKey} onSelect={(_e, key) => setDrawerTabKey(key)}>
          <Tab eventKey={0} title={<TabTitleText>Permissions</TabTitleText>}>
            <div style={{ padding: '16px 0' }}>
              {selectedRole && selectedRole.permissionDetails.length > 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8, paddingRight: 4 }}>
                    <Pagination
                      itemCount={selectedRole.permissionDetails.length}
                      perPage={permPerPage}
                      page={permPage}
                      onSetPage={(_e, p) => setPermPage(p)}
                      onPerPageSelect={(_e, pp, p) => { setPermPerPage(pp); setPermPage(p); }}
                      isCompact
                    />
                  </div>
                  <Table aria-label="Permissions table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th>Application</Th>
                        <Th>Resource type</Th>
                        <Th>Operation</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedPermissions.map((perm, idx) => (
                        <Tr key={idx}>
                          <Td dataLabel="Application">{perm.application}</Td>
                          <Td dataLabel="Resource type">{perm.resourceType}</Td>
                          <Td dataLabel="Operation">{perm.operation}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </>
              ) : (
                <p style={{ color: '#6a6e73', padding: '0 16px' }}>No permissions defined for this role.</p>
              )}
            </div>
          </Tab>
          <Tab
            eventKey={1}
            title={
              <TabTitleText>
                Assigned user groups{' '}
                <OutlinedQuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', fontSize: '0.85em' }} />
              </TabTitleText>
            }
          >
            <div style={{ padding: '16px' }}>
              {selectedRole && selectedRole.assignedGroups.length > 0 ? (
                <Table aria-label="Assigned user groups table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th>User group</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedRole.assignedGroups.map((group, idx) => (
                      <Tr key={idx}>
                        <Td>{group}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <p style={{ color: '#6a6e73' }}>No user groups are assigned to this role.</p>
              )}
            </div>
          </Tab>
        </Tabs>
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity &amp; Access Management</BreadcrumbItem>
          <BreadcrumbItem>Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Roles</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Roles</Title>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Drawer isExpanded={isDrawerOpen} isInline={false} position="right">
          <DrawerContent panelContent={drawerPanel}>
            <DrawerContentBody>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isFilterOpen}
                        onSelect={(_e, value) => { setFilterField(value as string); setIsFilterOpen(false); }}
                        onOpenChange={setIsFilterOpen}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            isExpanded={isFilterOpen}
                            icon={<FilterIcon />}
                          >
                            {`Filter by ${filterField.toLowerCase()}`}
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem key="name" value="Name">Name</DropdownItem>
                          <DropdownItem key="description" value="Description">Description</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </ToolbarItem>
                    <ToolbarItem>
                      <SearchInput
                        placeholder={`Filter by ${filterField.toLowerCase()}`}
                        value={searchValue}
                        onChange={(_event, value) => handleSearchChange(value)}
                        onClear={() => handleSearchChange('')}
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarItem>
                    <Button variant="primary">Create role</Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isKebabOpen}
                      onOpenChange={setIsKebabOpen}
                      popperProps={{ position: 'right' }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          aria-label="Actions"
                          variant="plain"
                          onClick={() => setIsKebabOpen(!isKebabOpen)}
                          isExpanded={isKebabOpen}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem>Export roles</DropdownItem>
                        <DropdownItem>Import roles</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                    <Pagination
                      itemCount={sortedRoles.length}
                      widgetId="roles-pagination-top"
                      perPage={perPage}
                      page={page}
                      onSetPage={onSetPage}
                      onPerPageSelect={onPerPageSelect}
                      isCompact
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              <Table aria-label="Roles table">
                <Thead>
                  <Tr>
                    <Th sort={getSortParams(0)} width={20}>Name</Th>
                    <Th sort={getSortParams(1)} width={40}>Description</Th>
                    <Th sort={getSortParams(2)} width={15}>Permissions</Th>
                    <Th sort={getSortParams(3)} width={25}>Last modified</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedRoles.map((role) => (
                    <Tr
                      key={role.id}
                      isClickable
                      isRowSelected={selectedRole?.id === role.id}
                      onRowClick={() => onRowClick(role)}
                    >
                      <Td dataLabel="Name">{role.name}</Td>
                      <Td dataLabel="Description">{role.description}</Td>
                      <Td dataLabel="Permissions">{role.permissions}</Td>
                      <Td dataLabel="Last modified">{role.lastModified}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination
                  itemCount={sortedRoles.length}
                  widgetId="roles-pagination-bottom"
                  perPage={perPage}
                  page={page}
                  onSetPage={onSetPage}
                  onPerPageSelect={onPerPageSelect}
                />
              </div>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </>
  );
};

export { Roles };

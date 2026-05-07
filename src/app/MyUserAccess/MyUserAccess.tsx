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
  Flex,
  FlexItem,
  InputGroup,
  InputGroupItem,
  MenuToggle,
  PageSection,
  Pagination,
  SearchInput,
  Select,
  SelectOption,
  Tab,
  Tabs,
  TabTitleText,
  Title
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { FilterIcon } from '@patternfly/react-icons';

interface GroupData {
  name: string;
  description: string;
  roles: { name: string; workspace: string }[];
}

const groups: GroupData[] = [
  {
    name: 'All users',
    description: 'This group contains all users in your organization.',
    roles: [
      { name: 'RHEL Admin', workspace: 'UXD' },
      { name: 'OpenShift Admin', workspace: 'UXD' }
    ]
  },
  {
    name: 'Workspace administrators',
    description: 'This group contains blah blah blah some descriptive text here.',
    roles: [
      { name: 'Workspace Admin', workspace: 'UXD' }
    ]
  },
  {
    name: 'Subscriptions viewer',
    description: 'Perform read operations on any Subscriptions resource.',
    roles: [
      { name: 'RHEL Admin', workspace: 'UXD' },
      { name: 'OpenShift Admin', workspace: 'UXD' }
    ]
  }
];

const MyUserAccess: React.FunctionComponent = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedGroup, setSelectedGroup] = React.useState<GroupData | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('Group name');
  const [searchValue, setSearchValue] = React.useState('');

  const drawerPanelContent = selectedGroup ? (
    <DrawerPanelContent widths={{ default: 'width_33' }} minSize="320px">
      <DrawerHead>
        <Title headingLevel="h3" size="lg">{selectedGroup.name}</Title>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setSelectedGroup(null)} />
        </DrawerActions>
      </DrawerHead>
      <div style={{ padding: '0 24px 24px' }}>
        <Content component="p" style={{ marginBottom: 16 }}>
          {selectedGroup.description}
        </Content>

        <InputGroup style={{ marginBottom: 16 }}>
          <InputGroupItem>
            <SearchInput placeholder="Find by name" aria-label="Find by name" />
          </InputGroupItem>
        </InputGroup>

        <Pagination
          itemCount={selectedGroup.roles.length}
          perPage={10}
          page={1}
          variant="top"
          isCompact
          style={{ marginBottom: 8 }}
        />

        <Table variant="compact">
          <Thead>
            <Tr>
              <Th>Roles</Th>
              <Th>Workspace</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedGroup.roles.map((role) => (
              <Tr key={role.name}>
                <Td><Button variant="link" isInline>{role.name}</Button></Td>
                <Td><Button variant="link" isInline>{role.workspace}</Button></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </DrawerPanelContent>
  ) : undefined;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem to="#">Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>My Access</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">My Access</Title>
        <Content component="p" style={{ marginTop: 4 }}>
          View your permissions across all groups and workspaces within the Hybrid Cloud Console.
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Drawer isExpanded={!!selectedGroup} isInline position="right">
          <DrawerContent panelContent={drawerPanelContent}>
            <DrawerContentBody>
              <Tabs activeKey={activeTab} onSelect={(_e, idx) => setActiveTab(idx as number)}>
                <Tab eventKey={0} title={<TabTitleText>My groups</TabTitleText>}>
                  <div style={{ padding: '16px 0' }}>
                    <Flex>
                      <FlexItem>
                        <InputGroup>
                          <InputGroupItem>
                            <Select
                              toggle={(toggleRef) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                                  isExpanded={isFilterOpen}
                                  icon={<FilterIcon />}
                                >
                                  {filterValue}
                                </MenuToggle>
                              )}
                              isOpen={isFilterOpen}
                              onSelect={(_e, val) => { setFilterValue(val as string); setIsFilterOpen(false); }}
                              onOpenChange={setIsFilterOpen}
                              selected={filterValue}
                            >
                              <SelectOption value="Group name">Group name</SelectOption>
                              <SelectOption value="Description">Description</SelectOption>
                            </Select>
                          </InputGroupItem>
                          <InputGroupItem isFill>
                            <SearchInput
                              placeholder={`Filter by ${filterValue.toLowerCase()}`}
                              value={searchValue}
                              onChange={(_e, val) => setSearchValue(val)}
                              onClear={() => setSearchValue('')}
                              aria-label="Filter groups"
                            />
                          </InputGroupItem>
                        </InputGroup>
                      </FlexItem>
                    </Flex>
                  </div>

                  <Table variant="compact">
                    <Thead>
                      <Tr>
                        <Th sort={{ sortBy: { index: 0, direction: 'asc' }, onSort: () => {}, columnIndex: 0 }}>
                          Group name
                        </Th>
                        <Th>Description</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {groups
                        .filter(g => !searchValue || g.name.toLowerCase().includes(searchValue.toLowerCase()))
                        .map((group) => (
                        <Tr
                          key={group.name}
                          isClickable
                          isRowSelected={selectedGroup?.name === group.name}
                          onRowClick={() => setSelectedGroup(group)}
                        >
                          <Td>
                            <Button variant="link" isInline onClick={() => setSelectedGroup(group)}>
                              {group.name}
                            </Button>
                          </Td>
                          <Td>{group.description}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Tab>
                <Tab eventKey={1} title={<TabTitleText>My workspaces</TabTitleText>}>
                  <div style={{ padding: '24px 0' }}>
                    <Content component="p">Workspace access information will appear here.</Content>
                  </div>
                </Tab>
              </Tabs>
            </DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </>
  );
};

export { MyUserAccess };

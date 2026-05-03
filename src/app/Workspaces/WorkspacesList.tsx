import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  PageSection,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Pagination,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, TreeRowWrapper } from '@patternfly/react-table';
import { EllipsisVIcon, AngleRightIcon, AngleDownIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

type WorkspaceNode = {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentId?: string;
  level: number;
};

const allWorkspaces: WorkspaceNode[] = [
  { id: 'uxd', slug: 'uxd', name: 'UXD', description: 'This is the root workspace.', level: 0 },
  { id: 'ws-default', slug: 'workspace-default', name: 'Workspace default', description: 'This is a description of Workspace default.', parentId: 'uxd', level: 1 },
  { id: 'ws-ungrouped', slug: 'workspace-ungrouped-hosts', name: 'Workspace Ungrouped Hosts', description: 'Where ungrouped systems will go.', parentId: 'ws-default', level: 2 },
  { id: 'ws-a', slug: 'workspace-a', name: 'Workspace A', description: 'This is a description of Workspace A.', parentId: 'ws-default', level: 2 },
  { id: 'ws-b', slug: 'workspace-b', name: 'Workspace B', description: 'This is a description of Workspace B.', parentId: 'ws-default', level: 2 },
  { id: 'ws-c', slug: 'workspace-c', name: 'Workspace C', description: 'This is a description of Workspace C.', parentId: 'ws-default', level: 2 },
];

const WorkspacesList: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(['uxd', 'ws-default']));
  const [openKebab, setOpenKebab] = React.useState<string | null>(null);

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
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem>User Access</BreadcrumbItem>
          <BreadcrumbItem isActive>Workspaces</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Workspaces</Title>
        <Content>
          <p>
            Workspaces provide a flexible, hierarchical, approach to organizing your assets and streamlining access management. Configure workspaces to fit your organizational structure.
          </p>
          <p><a href="#">Learn more about workspaces <span style={{ fontSize: '0.75em' }}>↗</span></a></p>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} isFilled style={{ paddingTop: 0 }}>
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
    </>
  );
};

export { WorkspacesList };

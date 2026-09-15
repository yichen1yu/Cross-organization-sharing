import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  ClipboardCopy,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  Form,
  FormGroup,
  Label,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Pagination,
  SearchInput,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { EllipsisVIcon, ExternalLinkAltIcon, FilterIcon, HelpIcon, KeyIcon } from '@patternfly/react-icons';

const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

const generateSecret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const ServiceAccounts: React.FunctionComponent = () => {
  type ServiceAccountRow = {
    id: string;
    name: string;
    description: string;
    clientId: string;
    owner: string;
    created: string;
    type: 'Service account' | 'Service Access Token';
  };

  const initialRows: ServiceAccountRow[] = [
    { id: 'sa1', name: 'iqe-rbac-on-rbac', description: 'RBAC on RBAC tests. DO NOT REMOVE!', clientId: '9e6729e3-2c31-4b45-90af-2e88ed654c0f', owner: 'iqe_rbac_v2_admin', created: '3 months ago', type: 'Service account' },
    { id: 'sa2', name: 'iqe-rbac-on-rbac-read', description: 'RBAC on RBAC tests. DO NOT REMOVE!', clientId: 'b43b9c00-0107-43be-afa7-4ce45006b51c', owner: 'iqe_rbac_v2_admin', created: '3 months ago', type: 'Service Access Token' },
    { id: 'sa3', name: 'iqe-rbac-v2-e2e-service-account', description: 'DO NOT DELETE. This is an empty service account using during E2E testing', clientId: '6dfb7d72-cf19-40eb-9920-0e8de3d2bb40', owner: 'iqe_rbac_v2_admin', created: '4 months ago', type: 'Service account' },
    { id: 'sa4', name: 'iqe-rbac-v2-service-account', description: 'DO NOT REMOVE! SA for RBAC Tests', clientId: '7fb2272f-2844-4fd0-bab3-dbdb0d85a91f', owner: 'iqe_rbac_v2_admin', created: '3 months ago', type: 'Service Access Token' },
    { id: 'sa5', name: 'libord', description: 'libord', clientId: 'f54cbb0-82e3-4f70-82be-a6f343746804', owner: 'iqe_rbac_v2_admin', created: '1 month ago', type: 'Service account' },
    { id: 'sa6', name: 'SA for RBAC', description: 'DO NOT REMOVE! SA for RBAC Tests', clientId: 'd807b762-31c3-45d0-bffe-7f498b709c66', owner: 'iqe_rbac_v2_admin', created: '3 months ago', type: 'Service Access Token' },
    { id: 'sa7', name: 'SA Permissions for RBAC', description: 'DO NOT REMOVE! SA with Permissions for RBAC Tests', clientId: 'fe466d70-2aeb-4de7-6eb3-d48ff4729e62', owner: 'iqe_rbac_v2_admin', created: '2 months ago', type: 'Service account' },
    { id: 'sa8', name: 'test405', description: 'test405', clientId: 'ab434b20-2276-4846-afdd-b0c/4ecba2f0', owner: 'iqe_rbac_v2_admin', created: '1 month ago', type: 'Service Access Token' },
    { id: 'sa9', name: 'testlibor', description: 'testlibor', clientId: 'cc9a0d3f-07dd-43a5-990b-d5a21d6d90a8', owner: 'iqe_rbac_v2_admin', created: '2 months ago', type: 'Service account' },
  ];

  type FilterCategory = 'Name' | 'Description' | 'Client ID' | 'Owner' | 'Type';

  const [rows, setRows] = React.useState<ServiceAccountRow[]>(initialRows);
  const [filterCategory, setFilterCategory] = React.useState<FilterCategory>('Name');
  const [query, setQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [isTypeFilterOpen, setIsTypeFilterOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(50);
  const [openKebabFor, setOpenKebabFor] = React.useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isCreateSAModalOpen, setIsCreateSAModalOpen] = React.useState(false);
  const [newSAName, setNewSAName] = React.useState('');
  const [newSADescription, setNewSADescription] = React.useState('');
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = React.useState(false);
  const [generatedClientId, setGeneratedClientId] = React.useState('');
  const [generatedSecret, setGeneratedSecret] = React.useState('');
  const [hasCopiedCredentials, setHasCopiedCredentials] = React.useState(false);
  const [isCreateSATModalOpen, setIsCreateSATModalOpen] = React.useState(false);
  const [newSATName, setNewSATName] = React.useState('');
  const [newSATDescription, setNewSATDescription] = React.useState('');
  const [newSATExpiration, setNewSATExpiration] = React.useState('');
  const [isExpirationOpen, setIsExpirationOpen] = React.useState(false);
  const [credentialsSource, setCredentialsSource] = React.useState<'sa' | 'sat'>('sa');
  const [sortIndex, setSortIndex] = React.useState<number | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const filterPlaceholders: Record<FilterCategory, string> = {
    Name: 'Filter by name',
    Description: 'Filter by description',
    'Client ID': 'Filter by client ID',
    Owner: 'Filter by owner',
    Type: '',
  };

  const handleFilterCategoryChange = (category: FilterCategory) => {
    setFilterCategory(category);
    setQuery('');
    setTypeFilter('');
    setPage(1);
    setIsFilterOpen(false);
  };

  const filtered = React.useMemo(() => {
    if (filterCategory === 'Type') {
      if (!typeFilter) return rows;
      return rows.filter(r => r.type === typeFilter);
    }
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    const keyMap: Record<string, keyof ServiceAccountRow> = {
      Name: 'name',
      Description: 'description',
      'Client ID': 'clientId',
      Owner: 'owner',
    };
    const key = keyMap[filterCategory];
    return rows.filter(r => String(r[key]).toLowerCase().includes(q));
  }, [rows, query, filterCategory, typeFilter]);

  const sorted = React.useMemo(() => {
    if (sortIndex === null) return filtered;
    const keys: (keyof ServiceAccountRow)[] = ['name', 'description', 'clientId', 'owner', 'created'];
    const key = keys[sortIndex];
    if (!key) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[key]).toLowerCase();
      const bVal = String(b[key]).toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortIndex, sortDirection]);

  const start = (page - 1) * perPage;
  const pageRows = sorted.slice(start, start + perPage);

  const getSortParams = (idx: number) => ({
    sort: {
      sortBy: { index: sortIndex ?? undefined, direction: sortDirection },
      onSort: (_e: React.MouseEvent, index: number, dir: 'asc' | 'desc') => { setSortIndex(index); setSortDirection(dir); },
      columnIndex: idx,
    },
  });

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Service Accounts</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Service Accounts</Title>
        <Content>
          <p style={{ margin: 0, color: '#6a6e73' }}>Use service accounts to securely and automatically connect and authenticate services or applications without requiring an end user's credentials or direct interaction.</p>
          <div style={{ marginTop: '8px' }}>
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
              Watch a video to learn more
            </Button>
          </div>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} isFilled style={{ paddingTop: 0 }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <Dropdown
                  isOpen={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle ref={toggleRef} onClick={() => setIsFilterOpen(!isFilterOpen)} icon={<FilterIcon />}>
                      {filterCategory}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => handleFilterCategoryChange('Name')}>Name</DropdownItem>
                    <DropdownItem onClick={() => handleFilterCategoryChange('Client ID')}>Client ID</DropdownItem>
                    <DropdownItem onClick={() => handleFilterCategoryChange('Owner')}>Owner</DropdownItem>
                    <DropdownItem onClick={() => handleFilterCategoryChange('Type')}>Type</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                {filterCategory === 'Type' ? (
                  <Dropdown
                    isOpen={isTypeFilterOpen}
                    onOpenChange={setIsTypeFilterOpen}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                        style={{ minWidth: '200px' }}
                      >
                        {typeFilter || 'Filter by type'}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem onClick={() => { setTypeFilter('Service account'); setIsTypeFilterOpen(false); setPage(1); }}>
                        Service account
                      </DropdownItem>
                      <DropdownItem onClick={() => { setTypeFilter('Service Access Token'); setIsTypeFilterOpen(false); setPage(1); }}>
                        Service Access Token
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                ) : (
                  <SearchInput
                    placeholder={filterPlaceholders[filterCategory]}
                    value={query}
                    onChange={(_, v) => { setQuery(v); setPage(1); }}
                    onClear={() => { setQuery(''); setPage(1); }}
                  />
                )}
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarItem>
              <Dropdown
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsCreateOpen(!isCreateOpen)}
                    variant="primary"
                  >
                    Create new
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem onClick={() => { setIsCreateOpen(false); setNewSAName(''); setNewSADescription(''); setIsCreateSAModalOpen(true); }}>Service account</DropdownItem>
                  <DropdownItem onClick={() => { setIsCreateOpen(false); setNewSATName(''); setNewSATDescription(''); setNewSATExpiration(''); setIsCreateSATModalOpen(true); }}>Service Access Tokens</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Pagination
                isCompact
                itemCount={sorted.length}
                perPage={perPage}
                page={page}
                onSetPage={(_, p) => setPage(p)}
                onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Service accounts table">
          <Thead>
            <Tr>
              <Th width={20} {...getSortParams(0)}>Name</Th>
              <Th width={25} {...getSortParams(1)}>Description</Th>
              <Th width={20}>Client ID</Th>
              <Th width={15}>Owner</Th>
              <Th width={10} {...getSortParams(4)}>Time created</Th>
              <Th width={10}><span style={{ visibility: 'hidden' }}>Actions</span></Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageRows.map(r => (
              <Tr key={r.id}>
                <Td>
                  <Button variant="link" isInline>{r.name}</Button>
                  {r.type === 'Service Access Token' && (
                    <Label color="blue" isCompact style={{ marginLeft: '8px' }}>Service access token</Label>
                  )}
                </Td>
                <Td>{r.description || <span style={{ color: '#6a6e73' }}>&mdash;</span>}</Td>
                <Td>{r.clientId}</Td>
                <Td>{r.owner}</Td>
                <Td>{r.created}</Td>
                <Td isActionCell>
                  <Dropdown
                    isOpen={openKebabFor === r.id}
                    onOpenChange={(isOpen) => setOpenKebabFor(isOpen ? r.id : null)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle ref={toggleRef} variant="plain" aria-label="Actions" onClick={() => setOpenKebabFor(openKebabFor === r.id ? null : r.id)}>
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                    popperProps={{ position: 'right' }}
                  >
                    <DropdownList>
                      <DropdownItem>Reset credentials</DropdownItem>
                      {r.type === 'Service Access Token' && (
                        <DropdownItem>Revoke credentials</DropdownItem>
                      )}
                      <DropdownItem>{r.type === 'Service Access Token' ? 'Delete service access token' : 'Delete service account'}</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            itemCount={sorted.length}
            perPage={perPage}
            page={page}
            onSetPage={(_, p) => setPage(p)}
            onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
          />
        </div>
      </PageSection>

      <Modal
        isOpen={isCreateSAModalOpen}
        onClose={() => setIsCreateSAModalOpen(false)}
        variant="medium"
        aria-labelledby="create-sa-modal-title"
      >
        <ModalHeader title="Create a service account" titleIconVariant={undefined} labelId="create-sa-modal-title" />
        <ModalBody>
          <Form>
            <FormGroup
              label="Service account name"
              isRequired
              fieldId="sa-name"
              labelIcon={
                <Button variant="plain" aria-label="More info for service account name" style={{ padding: 0 }}>
                  <HelpIcon />
                </Button>
              }
            >
              <TextInput
                isRequired
                id="sa-name"
                value={newSAName}
                onChange={(_e, val) => setNewSAName(val)}
              />
            </FormGroup>
            <FormGroup label="Short description" isRequired fieldId="sa-description">
              <TextInput
                isRequired
                id="sa-description"
                value={newSADescription}
                onChange={(_e, val) => setNewSADescription(val)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            isDisabled={!newSAName.trim()}
            onClick={() => {
              setIsCreateSAModalOpen(false);
              setGeneratedClientId(generateUUID());
              setGeneratedSecret(generateSecret());
              setHasCopiedCredentials(false);
              setCredentialsSource('sa');
              setIsCredentialsModalOpen(true);
            }}
          >
            Create
          </Button>
          <Button variant="link" onClick={() => setIsCreateSAModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isCreateSATModalOpen}
        onClose={() => setIsCreateSATModalOpen(false)}
        variant="medium"
        aria-labelledby="create-sat-modal-title"
      >
        <ModalHeader title="Create a Service Access Token" titleIconVariant={undefined} labelId="create-sat-modal-title" />
        <ModalBody>
          <Form>
            <FormGroup
              label="Service Access Token name"
              isRequired
              fieldId="sat-name"
              labelIcon={
                <Button variant="plain" aria-label="More info for service access token name" style={{ padding: 0 }}>
                  <HelpIcon />
                </Button>
              }
            >
              <TextInput
                isRequired
                id="sat-name"
                value={newSATName}
                onChange={(_e, val) => setNewSATName(val)}
              />
            </FormGroup>
            <FormGroup label="Short description" isRequired fieldId="sat-description">
              <TextInput
                isRequired
                id="sat-description"
                value={newSATDescription}
                onChange={(_e, val) => setNewSATDescription(val)}
              />
            </FormGroup>
            <FormGroup label="Expiration" isRequired fieldId="sat-expiration">
              <Dropdown
                isOpen={isExpirationOpen}
                onOpenChange={setIsExpirationOpen}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsExpirationOpen(!isExpirationOpen)}
                    isFullWidth
                  >
                    {newSATExpiration || 'Select expiration'}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem onClick={() => { setNewSATExpiration('60 days'); setIsExpirationOpen(false); }}>60 days</DropdownItem>
                  <DropdownItem onClick={() => { setNewSATExpiration('180 days'); setIsExpirationOpen(false); }}>180 days</DropdownItem>
                  <DropdownItem onClick={() => { setNewSATExpiration('360 days'); setIsExpirationOpen(false); }}>360 days</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            isDisabled={!newSATName.trim() || !newSATExpiration}
            onClick={() => {
              setIsCreateSATModalOpen(false);
              setGeneratedClientId(generateUUID());
              setGeneratedSecret(generateSecret());
              setHasCopiedCredentials(false);
              setCredentialsSource('sat');
              setIsCredentialsModalOpen(true);
            }}
          >
            Create
          </Button>
          <Button variant="link" onClick={() => setIsCreateSATModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isCredentialsModalOpen}
        variant="medium"
        aria-labelledby="credentials-modal-title"
        onClose={() => {
          if (hasCopiedCredentials) setIsCredentialsModalOpen(false);
        }}
      >
        <ModalHeader labelId="credentials-modal-title" />
        <ModalBody style={{ padding: '24px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <KeyIcon style={{ fontSize: '60px', color: '#6a6e73' }} />
            <Title headingLevel="h2" size="xl" style={{ marginTop: '16px' }}>
              Credentials successfully generated
            </Title>
            <p style={{ color: '#6a6e73', marginTop: '8px' }}>
              Connect to Red Hat cloud services or APIs using this client ID and secret
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                backgroundColor: '#f0f0f0',
                padding: '6px 16px',
                minWidth: '120px',
                border: '1px solid #ededed',
                borderRadius: '3px',
              }}>
                Client ID
              </div>
              <ClipboardCopy
                isReadOnly
                hoverTip="Copy to clipboard"
                clickTip="Successfully copied to clipboard!"
                style={{ flex: 1, '--pf-v6-c-clipboard-copy__group--BorderColor': '#d2d2d2' } as React.CSSProperties}
              >
                {generatedClientId}
              </ClipboardCopy>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                backgroundColor: '#f0f0f0',
                padding: '6px 16px',
                minWidth: '120px',
                border: '1px solid #ededed',
                borderRadius: '3px',
              }}>
                Client secret
              </div>
              <ClipboardCopy
                isReadOnly
                hoverTip="Copy to clipboard"
                clickTip="Successfully copied to clipboard!"
                style={{ flex: 1, '--pf-v6-c-clipboard-copy__group--BorderColor': '#d2d2d2' } as React.CSSProperties}
              >
                {generatedSecret}
              </ClipboardCopy>
            </div>
          </div>

          <p style={{ color: '#6a6e73', marginTop: '16px', fontSize: '12px', textAlign: 'center' }}>
            Make a copy of the client ID and secret to store in a safe place. The client secret won&apos;t appear again after closing this screen.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Checkbox
              id="copied-credentials-check"
              label="I have copied the client ID and secret"
              isChecked={hasCopiedCredentials}
              onChange={(_e, checked) => setHasCopiedCredentials(checked)}
            />
          </div>
        </ModalBody>
        <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="secondary"
            isDisabled={!hasCopiedCredentials}
            onClick={() => {
              const name = credentialsSource === 'sa' ? newSAName : newSATName;
              const desc = credentialsSource === 'sa' ? newSADescription : newSATDescription;
              const rowType = credentialsSource === 'sa' ? 'Service account' : 'Service Access Token';
              setRows(prev => [{
                id: `sa-${Date.now()}`,
                name,
                description: desc,
                clientId: generatedClientId,
                owner: 'yichenyu',
                created: 'just now',
                type: rowType,
              }, ...prev]);
              setIsCredentialsModalOpen(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { ServiceAccounts };

import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, Flex, FlexItem, PageSection, Title, Card, CardHeader, CardBody, Toolbar, ToolbarContent, ToolbarItem, Pagination, MenuToggle, MenuToggleElement, Label, LabelGroup, SearchInput, Button } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { CheckCircleIcon, ExclamationCircleIcon, WrenchIcon } from '@patternfly/react-icons';
import { Link, useLocation } from 'react-router-dom';

const CloudAccounts: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(50);
  type FilterType = 'Cloud account' | 'Cloud provider' | 'Auto-registration' | 'Gold image access';
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterType, setFilterType] = React.useState<FilterType>('Cloud provider');
  const [isValueOpen, setIsValueOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  const onChooseFilterType = (type: FilterType) => {
    setFilterType(type);
    setSelectedValue(null);
    setIsValueOpen(false);
    setPage(1);
  };

  const setValue = (value: string | null) => {
    setSelectedValue(value);
    setPage(1);
  };
  const location = useLocation();
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prov = params.get('provider');
    const acct = params.get('account');
    if (prov) {
      setFilterType('Cloud provider');
      setValue(prov);
    } else if (acct) {
      setFilterType('Cloud account');
      setValue(acct);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const valueOptions: Record<Exclude<FilterType, 'Cloud account'>, string[]> = {
    'Cloud provider': ['AWS', 'Azure', 'Google Cloud'],
    'Auto-registration': ['Enabled', 'Disabled', 'In progress'],
    'Gold image access': ['Granted', 'Requested', 'Failed'],
  };

  const valuePlaceholder: Record<FilterType, string> = {
    'Cloud account': 'Filter by cloud account',
    'Cloud provider': 'Filter by cloud provider',
    'Auto-registration': 'Filter by auto-registration',
    'Gold image access': 'Filter by gold image access',
  };

  type Provider = 'AWS' | 'Azure' | 'Google Cloud';
  type AutoReg = 'Enabled' | 'Disabled' | 'In progress';
  type GoldAccess = 'Granted' | 'Requested' | 'Failed';
  type Row = {
    id: string;
    account: string;
    provider: Provider;
    autoReg: AutoReg;
    goldAccess: GoldAccess;
    dateAdded: string; // YYYY-MM-DD
  };

  const rows: Row[] = React.useMemo(() => ([
    { id: 'r1', account: '652039897783', provider: 'AWS',          autoReg: 'Enabled',      goldAccess: 'Granted',   dateAdded: '2024-05-02' },
    { id: 'r2', account: '10000000-0000-0000-0000-000000000000', provider: 'Azure',        autoReg: 'Enabled',      goldAccess: 'Granted',   dateAdded: '2024-04-08' },
    { id: 'r3', account: '114043319680', provider: 'AWS',          autoReg: 'Enabled',      goldAccess: 'Granted',   dateAdded: '2024-02-29' },
    { id: 'r4', account: '800000000000', provider: 'Google Cloud', autoReg: 'Enabled',      goldAccess: 'Granted',   dateAdded: '2024-01-02' },
    { id: 'r5', account: '073139184009', provider: 'AWS',          autoReg: 'Enabled',      goldAccess: 'Granted',   dateAdded: '2023-08-15' },
    { id: 'r6', account: '478921806121', provider: 'AWS',          autoReg: 'In progress',  goldAccess: 'Requested', dateAdded: '2023-07-15' },
    { id: 'r7', account: '386694712094', provider: 'AWS',          autoReg: 'Enabled',      goldAccess: 'Granted',   dateAdded: '2023-06-15' },
    { id: 'r8', account: '248235965872', provider: 'AWS',          autoReg: 'Enabled',      goldAccess: 'Failed',    dateAdded: '2023-05-15' },
    { id: 'r9', account: '811844678029', provider: 'AWS',          autoReg: 'Enabled',      goldAccess: 'Granted',   dateAdded: '2023-04-15' },
    { id: 'r10', account: '122226758409', provider: 'AWS',         autoReg: 'Enabled',      goldAccess: 'Granted',   dateAdded: '2023-03-15' },
  ]), []);

  const [sortBy, setSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 4, direction: 'desc' });

  const filteredRows = React.useMemo(() => {
    let r = rows;
    if (filterType === 'Cloud account') {
      const q = (selectedValue ?? '').trim().toLowerCase();
      if (q) {
        r = r.filter(row => row.account.toLowerCase().includes(q));
      }
    } else if (filterType === 'Cloud provider' && selectedValue) {
      r = r.filter(row => row.provider === selectedValue);
    } else if (filterType === 'Auto-registration' && selectedValue) {
      r = r.filter(row => row.autoReg === selectedValue);
    } else if (filterType === 'Gold image access' && selectedValue) {
      r = r.filter(row => row.goldAccess === selectedValue);
    }
    return r;
  }, [rows, filterType, selectedValue]);

  const sortedRows = React.useMemo(() => {
    const copy = [...filteredRows];
    const dir = sortBy.direction === 'asc' ? 1 : -1;
    copy.sort((a, b) => {
      switch (sortBy.index) {
        case 0: return dir * a.account.localeCompare(b.account);
        case 1: return dir * a.provider.localeCompare(b.provider);
        case 2: return dir * a.autoReg.localeCompare(b.autoReg);
        case 3: return dir * a.goldAccess.localeCompare(b.goldAccess);
        case 4: return dir * (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        default: return 0;
      }
    });
    return copy;
  }, [filteredRows, sortBy]);

  const pageRows = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedRows.slice(start, start + perPage);
  }, [sortedRows, page, perPage]);

  const StatusWithIcon: React.FC<{ status: AutoReg | GoldAccess }> = ({ status }) => {
    if (status === 'Enabled' || status === 'Granted') {
      return <span><CheckCircleIcon color="#3E8635" style={{ marginRight: 8 }} />{status}</span>;
    }
    if (status === 'In progress' || status === 'Requested') {
      return <span><WrenchIcon style={{ marginRight: 8 }} />{status}</span>;
    }
    // Disabled or Failed
    return <span><ExclamationCircleIcon color="#C9190B" style={{ marginRight: 8 }} />{status}</span>;
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Cloud Inventory</BreadcrumbItem>
          <BreadcrumbItem isActive>Cloud Accounts</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Cloud Accounts</Title>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0, marginTop: 16 }}>
        <Card>
          <CardHeader>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isFilterOpen}
                    onOpenChange={(open) => setIsFilterOpen(open)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        isExpanded={isFilterOpen}
                      >
                        {filterType}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem onClick={() => { onChooseFilterType('Cloud account'); setIsFilterOpen(false); }}>Cloud account</DropdownItem>
                      <DropdownItem onClick={() => { onChooseFilterType('Cloud provider'); setIsFilterOpen(false); }}>Cloud provider</DropdownItem>
                      <DropdownItem onClick={() => { onChooseFilterType('Auto-registration'); setIsFilterOpen(false); }}>Auto-registration</DropdownItem>
                      <DropdownItem onClick={() => { onChooseFilterType('Gold image access'); setIsFilterOpen(false); }}>Gold image access</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  {filterType === 'Cloud account' ? (
                    <SearchInput
                      placeholder={valuePlaceholder[filterType]}
                      value={selectedValue ?? ''}
                      onChange={(_e, v) => setValue(v)}
                      onClear={() => setValue('')}
                    />
                  ) : (
                    <Dropdown
                      isOpen={isValueOpen}
                      onOpenChange={(open) => setIsValueOpen(open)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsValueOpen(!isValueOpen)}
                          isExpanded={isValueOpen}
                        >
                          {selectedValue ?? <span style={{ color: '#6a6e73' }}>{valuePlaceholder[filterType]}</span>}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        {valueOptions[filterType as Exclude<FilterType, 'Cloud account'>].map((opt) => (
                          <DropdownItem key={opt} onClick={() => { setValue(opt); setIsValueOpen(false); }}>
                            {opt}
                          </DropdownItem>
                        ))}
                      </DropdownList>
                    </Dropdown>
                  )}
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    isCompact
                    itemCount={sortedRows.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_, p) => setPage(p)}
                    onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
                  />
                </ToolbarItem>
              </ToolbarContent>
              {(selectedValue && selectedValue.trim()) && (
                <ToolbarContent>
                  <ToolbarItem>
                    <LabelGroup>
                      <Label variant="filled" color="grey" onClose={() => setValue(null)}>
                        {filterType}: {selectedValue}
                      </Label>
                    </LabelGroup>
                  </ToolbarItem>
                </ToolbarContent>
              )}
            </Toolbar>
          </CardHeader>
          <CardBody>
            <Table aria-label="Cloud accounts table">
              <Thead>
                <Tr>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 0
                    }}
                  >
                    Cloud account
                  </Th>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 1
                    }}
                  >
                    Cloud provider
                  </Th>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 2
                    }}
                  >
                    Auto-registration
                  </Th>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 3
                    }}
                  >
                    Gold image access
                  </Th>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 4
                    }}
                  >
                    Date added
                  </Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {pageRows.map((r) => (
                  <Tr key={r.id}>
                    <Td dataLabel="Cloud account">
                      <Button variant="link" isInline>{r.account}</Button>
                    </Td>
                    <Td dataLabel="Cloud provider">
                      <Button
                        variant="link"
                        isInline
                        component={Link}
                        to={`/cloud-inventory/gold-images?provider=${encodeURIComponent(r.provider)}`}
                      >
                        {r.provider}
                      </Button>
                    </Td>
                    <Td dataLabel="Auto-registration">
                      <StatusWithIcon status={r.autoReg} />
                    </Td>
                    <Td dataLabel="Gold image access">
                      <StatusWithIcon status={r.goldAccess} />
                    </Td>
                    <Td dataLabel="Date added">{r.dateAdded}</Td>
                    <Td dataLabel="Actions" style={{ textAlign: 'right' }}>
                      <Button
                        variant="link"
                        isInline
                        component={Link}
                        to={`/cloud-inventory/marketplace-purchases?account=${encodeURIComponent(r.account)}`}
                      >
                        View purchases
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { CloudAccounts };


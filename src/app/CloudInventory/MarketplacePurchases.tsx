import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, Flex, FlexItem, PageSection, Title, Card, CardHeader, CardBody, Toolbar, ToolbarContent, ToolbarItem, Pagination, MenuToggle, MenuToggleElement, Label, LabelGroup, SearchInput, Button, Modal, ModalHeader, ModalBody, ModalFooter, AlertGroup, Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ExpandableRowContent } from '@patternfly/react-table';
import { CheckCircleIcon, ExclamationCircleIcon, SyncAltIcon, EllipsisVIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { subscriptionsData } from '@app/Subscriptions/subscriptionsData';

const MarketplacePurchases: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(50);
  type FilterType = 'Offering name' | 'Marketplace account' | 'Marketplace';
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterType, setFilterType] = React.useState<FilterType>('Offering name');
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

  const valueOptions: Record<Extract<FilterType, 'Marketplace'>, string[]> = {
    'Marketplace': ['AWS', 'Azure', 'Google Cloud', 'Red Hat Marketplace', 'IBM Cloud Paks'],
  };

  const valuePlaceholder: Record<FilterType, string> = {
    'Offering name': 'Filter by offering name',
    'Marketplace account': 'Filter by marketplace account',
    'Marketplace': 'Filter by marketplace',
  };

  type Market = 'AWS' | 'Azure' | 'Google Cloud' | 'Red Hat Marketplace' | 'IBM Cloud Paks';
  type Row = {
    id: string;
    offering: string;
    account: string;
    marketplace: Market;
    status: 'Good' | 'Alert';
    dateAdded: string; // YYYY-MM-DD
    skus: string[];
    renewalColor: 'blue' | 'grey';
  };

  const initialRows: Row[] = React.useMemo(() => ([
    {
      id: 'm1',
      offering: 'Red Hat Enterprise Linux for Third Party Linux Migration with ELS',
      account: '652039897783',
      marketplace: 'AWS',
      status: 'Good',
      dateAdded: '2024-05-02',
      skus: ['SER1200', 'SER1201', 'SER1202'],
      renewalColor: 'blue'
    },
    {
      id: 'm2',
      offering: 'Red Hat OpenShift Container Platform',
      account: '652039897783',
      marketplace: 'AWS',
      status: 'Good',
      dateAdded: '2024-05-02',
      skus: ['SER2100', 'SER2101'],
      renewalColor: 'blue'
    },
    {
      id: 'm3',
      offering: 'Red Hat Subscription Support Registration',
      account: '652039897783',
      marketplace: 'AWS',
      status: 'Good',
      dateAdded: '2024-05-02',
      skus: ['SER3100'],
      renewalColor: 'grey'
    },
    {
      id: 'm4',
      offering: 'Red Hat Enterprise Linux 9',
      account: '114043319680',
      marketplace: 'Red Hat Marketplace',
      status: 'Good',
      dateAdded: '2024-04-10',
      skus: ['SER1290', 'SER1295'],
      renewalColor: 'blue'
    },
    {
      id: 'm5',
      offering: 'Red Hat Enterprise Linux ( RHEL )',
      account: '10000000-0000-0000-0000-000000000000',
      marketplace: 'Azure',
      status: 'Good',
      dateAdded: '2024-04-08',
      skus: ['SER1400'],
      renewalColor: 'grey'
    },
    {
      id: 'm6',
      offering: 'Red Hat OpenShift Container Platform',
      account: '10000000-0000-0000-0000-000000000000',
      marketplace: 'Azure',
      status: 'Alert',
      dateAdded: '2024-04-08',
      skus: ['SER2102', 'MW0152001'],
      renewalColor: 'blue'
    },
    {
      id: 'm7',
      offering: 'Red Hat Enterprise Linux 9',
      account: '114043319680',
      marketplace: 'AWS',
      status: 'Good',
      dateAdded: '2024-02-29',
      skus: ['SER1280'],
      renewalColor: 'grey'
    },
    {
      id: 'm8',
      offering: 'Red Hat Enterprise Linux',
      account: '800000000000',
      marketplace: 'Google Cloud',
      status: 'Alert',
      dateAdded: '2024-01-02',
      skus: ['SER1410', 'SER5002'],
      renewalColor: 'blue'
    },
    {
      id: 'm9',
      offering: 'Red Hat Enterprise Linux 9',
      account: '006698442057473130',
      marketplace: 'IBM Cloud Paks',
      status: 'Good',
      dateAdded: '2023-10-31',
      skus: ['SER1420'],
      renewalColor: 'grey'
    },
    {
      id: 'm10',
      offering: 'Red Hat OpenShift Container Platform',
      account: '073139184009',
      marketplace: 'AWS',
      status: 'Good',
      dateAdded: '2023-10-28',
      skus: ['SER2103', 'SER2101'],
      renewalColor: 'blue'
    }
  ]), []);
  const [rowsData, setRowsData] = React.useState<Row[]>(initialRows);

  const [sortBy, setSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 5, direction: 'desc' });
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  const filteredRows = React.useMemo(() => {
    let r = rowsData;
    const q = (selectedValue ?? '').trim().toLowerCase();
    if (filterType === 'Offering name' && q) {
      r = r.filter(row => row.offering.toLowerCase().includes(q));
    } else if (filterType === 'Marketplace account' && q) {
      r = r.filter(row => row.account.toLowerCase().includes(q));
    } else if (filterType === 'Marketplace' && selectedValue) {
      r = r.filter(row => row.marketplace === selectedValue);
    }
    return r;
  }, [rowsData, filterType, selectedValue]);

  const sortedRows = React.useMemo(() => {
    const copy = [...filteredRows];
    const dir = sortBy.direction === 'asc' ? 1 : -1;
    copy.sort((a, b) => {
      switch (sortBy.index) {
        case 0: return dir * a.offering.localeCompare(b.offering);
        case 1: return dir * a.account.localeCompare(b.account);
        case 2: return dir * a.marketplace.localeCompare(b.marketplace);
        case 4: return dir * a.status.localeCompare(b.status);
        case 5: return dir * (new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        default: return 0;
      }
    });
    return copy;
  }, [filteredRows, sortBy]);

  const pageRows = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedRows.slice(start, start + perPage);
  }, [sortedRows, page, perPage]);

  const [openKebabFor, setOpenKebabFor] = React.useState<string | null>(null);
  const [unregisterFor, setUnregisterFor] = React.useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [toasts, setToasts] = React.useState<Array<{ key: number; title: string; description?: string }>>([]);

  const addToast = (title: string, description?: string) => {
    const key = Date.now();
    setToasts((prev) => [...prev, { key, title, description }]);
  };
  const closeToast = (key: number) => setToasts((prev) => prev.filter((t) => t.key !== key));

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const acct = params.get('account');
    if (acct) {
      setFilterType('Marketplace account');
      setSelectedValue(acct);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Build a unified lookup from the single subscriptions data source
  const subsBySku = React.useMemo(() => {
    const map = new Map<string, { id: string; sku: string; name: string }>();
    subscriptionsData.forEach((s) => map.set(s.sku, { id: s.id, sku: s.sku, name: s.name }));
    return map;
  }, []);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Cloud Inventory</BreadcrumbItem>
          <BreadcrumbItem isActive>Marketplace Purchases</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      {/* Toasts */}
      <AlertGroup isToast isLiveRegion style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
        {toasts.map((t) => (
          <Alert
            key={t.key}
            variant="success"
            title={t.title}
            actionClose={<AlertActionCloseButton onClose={() => closeToast(t.key)} />}
          >
            {t.description}
          </Alert>
        ))}
      </AlertGroup>

      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Marketplace Purchases</Title>
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
                      <DropdownItem onClick={() => { onChooseFilterType('Offering name'); setIsFilterOpen(false); }}>Offering name</DropdownItem>
                      <DropdownItem onClick={() => { onChooseFilterType('Marketplace account'); setIsFilterOpen(false); }}>Marketplace account</DropdownItem>
                      <DropdownItem onClick={() => { onChooseFilterType('Marketplace'); setIsFilterOpen(false); }}>Marketplace</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  {filterType === 'Marketplace' ? (
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
                        {valueOptions.Marketplace.map((opt) => (
                          <DropdownItem key={opt} onClick={() => { setValue(opt); setIsValueOpen(false); }}>
                            {opt}
                          </DropdownItem>
                        ))}
                      </DropdownList>
                    </Dropdown>
                  ) : (
                    <SearchInput
                      placeholder={valuePlaceholder[filterType]}
                      value={selectedValue ?? ''}
                      onChange={(_e, v) => setValue(v)}
                      onClear={() => setValue('')}
                    />
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
            <Table aria-label="Marketplace purchases table">
              <Thead>
                <Tr>
                  <Th />
                  <Th
                    width={35}
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 0
                    }}
                  >
                    Offering name
                  </Th>
                  <Th
                    width={20}
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 1
                    }}
                  >
                    Marketplace account
                  </Th>
                  <Th
                    width={15}
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 2
                    }}
                  >
                    Marketplace
                  </Th>
                  <Th
                    width={10}
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 4
                    }}
                  >
                    Status
                  </Th>
                  <Th
                    width={20}
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 5
                    }}
                  >
                    Date added
                  </Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {pageRows.map((r, rowIndex) => (
                  <React.Fragment key={r.id}>
                    <Tr>
                      <Td
                        expand={{
                          rowIndex,
                          isExpanded: expanded.has(r.id),
                          onToggle: () => {
                            const next = new Set(expanded);
                            if (next.has(r.id)) next.delete(r.id);
                            else next.add(r.id);
                            setExpanded(next);
                          }
                        }}
                      />
                      <Td dataLabel="Offering name">{r.offering}</Td>
                      <Td dataLabel="Marketplace account">
                        <Button
                          variant="link"
                          isInline
                          onClick={() => navigate(`/cloud-inventory/cloud-accounts?account=${encodeURIComponent(r.account)}`)}
                        >
                          {r.account}
                        </Button>
                      </Td>
                      <Td dataLabel="Marketplace">{r.marketplace}</Td>
                      <Td dataLabel="Status">
                        {r.status === 'Good' ? (
                          <span><CheckCircleIcon color="#3E8635" style={{ marginRight: 8 }} />Good</span>
                        ) : (
                          <span><ExclamationCircleIcon color="#C9190B" style={{ marginRight: 8 }} />Alert</span>
                        )}
                      </Td>
                      <Td dataLabel="Date added">{r.dateAdded}</Td>
                      <Td dataLabel="Actions" isActionCell>
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
                            <DropdownItem onClick={() => { setUnregisterFor(r.id); setOpenKebabFor(null); }}>
                              Unregister subscription
                            </DropdownItem>
                            <DropdownItem>Cost data</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </Td>
                    </Tr>
                    <Tr isExpanded={expanded.has(r.id)}>
                      <Td />
                      <Td colSpan={5}>
                        <ExpandableRowContent>
                          <div style={{ display: 'flex', gap: 48 }}>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: 8 }}>Subscription name</div>
                              {r.skus.length > 0 ? (
                                r.skus.map((skuAtIndex, i) => {
                                  const bySku = subsBySku.get(skuAtIndex);
                                  const displayName = bySku?.name ?? skuAtIndex;
                                  const targetId = bySku?.id;
                                  return (
                                    <div key={i} style={{ padding: '2px 0' }}>
                                      {targetId ? (
                                        <Button
                                          variant="link"
                                          isInline
                                          onClick={() => navigate(`/subscription-inventory/subscription/${targetId}`)}
                                        >
                                          {displayName}
                                        </Button>
                                      ) : (
                                        <Button variant="link" isInline>{displayName}</Button>
                                      )}
                                    </div>
                                  );
                                })
                              ) : (
                                <div style={{ color: '#6a6e73' }}>—</div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: 8 }}>SKU</div>
                              {r.skus.length > 0 ? (
                                r.skus.map((skuAtIndex, i) => {
                                  const bySku = subsBySku.get(skuAtIndex);
                                  const resolvedSku = bySku?.sku ?? skuAtIndex ?? '—';
                                  return (
                                    <div key={i} style={{ padding: '2px 0' }}>{resolvedSku}</div>
                                  );
                                })
                              ) : (
                                <div style={{ color: '#6a6e73' }}>—</div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: 8 }}>Status details</div>
                              <div style={{ padding: '2px 0' }}>
                                {r.status === 'Alert'
                                  ? <ExclamationCircleIcon color="#C9190B" style={{ marginRight: 8 }} />
                                  : <CheckCircleIcon color="#3E8635" style={{ marginRight: 8 }} />
                                }
                                Subscription
                              </div>
                              <div style={{ padding: '2px 0' }}>
                                {r.status === 'Alert'
                                  ? <CheckCircleIcon color="#3E8635" style={{ marginRight: 8 }} />
                                  : <CheckCircleIcon color="#3E8635" style={{ marginRight: 8 }} />
                                }
                                Integration
                              </div>
                              <div style={{ padding: '2px 0' }}>
                                {r.status === 'Alert'
                                  ? <CheckCircleIcon color="#3E8635" style={{ marginRight: 8 }} />
                                  : <CheckCircleIcon color="#3E8635" style={{ marginRight: 8 }} />
                                }
                                Usage metering
                              </div>
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: 8 }}>Renewal cadence</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>Monthly</span>
                                <SyncAltIcon style={{ color: r.renewalColor === 'blue' ? '#06c' : '#6a6e73' }} />
                              </div>
                            </div>
                          </div>
                        </ExpandableRowContent>
                      </Td>
                    </Tr>
                  </React.Fragment>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>

      <Modal isOpen={!!unregisterFor} onClose={() => setUnregisterFor(null)} variant="medium" appendTo={() => document.body}>
        <ModalHeader
          title={
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ExclamationTriangleIcon color="#F0AB00" />
              Are you sure unregistering this subscription?
            </span>
          }
        />
        <ModalBody>
          Unregistering this subscription will sever this subscription&apos;s linkage with this Red Hat account.
          Please have the new subscription owner re‑register the subscription from the cloud purchase page;
          otherwise, it might result in a remittance issue.
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              if (unregisterFor) {
                const row = rowsData.find((r) => r.id === unregisterFor);
                if (row) {
                  // Remove row
                  setRowsData((prev) => prev.filter((r) => r.id !== unregisterFor));
                  // Toast
                  addToast(
                    'Success',
                    `Offer "${row.offering}" has been unregistered with your Red Hat account. Please register this subscription to new Red Hat account as soon as possible.`
                  );
                }
              }
              setUnregisterFor(null);
            }}
          >
            Confirm
          </Button>
          <Button variant="link" onClick={() => setUnregisterFor(null)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { MarketplacePurchases };


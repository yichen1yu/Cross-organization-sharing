import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Content,
  PageSection,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  Card,
  CardBody,
  CardHeader,
  Divider
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { subscriptionsData } from './subscriptionsData';

const SubscriptionDetails: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const sub = subscriptionsData.find((s) => s.id === id);

  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [sortBy, setSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' }>({
    index: 0,
    direction: 'asc'
  });

  if (!sub) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Subscription not found</Title>
        <Content>
          <p><Link to="/subscription-inventory/subscription-list">Go back to Subscription list</Link></p>
        </Content>
      </PageSection>
    );
  }

  const filteredContracts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sub.contracts;
    return sub.contracts.filter((c) => c.contractNumber.toLowerCase().includes(q));
  }, [query, sub.contracts]);

  const sortedContracts = React.useMemo(() => {
    const copy = [...filteredContracts];
    const dir = sortBy.direction === 'asc' ? 1 : -1;
    copy.sort((a, b) => {
      switch (sortBy.index) {
        case 0:
          return dir * a.contractNumber.localeCompare(b.contractNumber);
        case 1:
          return dir * (a.quantity - b.quantity);
        case 2:
          return dir * a.startDate.localeCompare(b.startDate);
        case 3:
          return dir * a.endDate.localeCompare(b.endDate);
        default:
          return 0;
      }
    });
    return copy;
  }, [filteredContracts, sortBy]);

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageRows = sortedContracts.slice(start, end);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/subscriptions">Subscription Services</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/subscription-inventory/subscription-list">Subscriptions Inventory</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{sub.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">{sub.name}</Title>
        <Content style={{ marginTop: 16 }}>
          <p><strong>SKU:</strong> {sub.sku}</p>
          <p><strong>Quantity:</strong> {sub.quantity}</p>
          <p><strong>Support level:</strong> {sub.serviceLevel}</p>
          <p><strong>Support type:</strong> {sub.supportType}</p>
          <p><strong>Capacity:</strong> {sub.capacity ?? 'Not Available'}</p>
          <p><strong>Virtual Guest Limit:</strong> {sub.virtualGuestLimit ?? 'Not Available'}</p>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Card>
          <CardHeader>
            <Title headingLevel="h2" size="lg">Subscription details</Title>
          </CardHeader>
          <Divider />
          <CardBody>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <SearchInput
                    placeholder="Filter by contract number"
                    value={query}
                    onChange={(_e, v) => { setQuery(v); setPage(1); }}
                    onClear={() => { setQuery(''); setPage(1); }}
                  />
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    isCompact
                    itemCount={filteredContracts.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_, p) => setPage(p)}
                    onPerPageSelect={(_, n) => { setPerPage(n); setPage(1); }}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            <Table aria-label="Subscription details table">
              <Thead>
                <Tr>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 0
                    }}
                  >
                    Contract number
                  </Th>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 1
                    }}
                  >
                    Subscription quantity
                  </Th>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 2
                    }}
                  >
                    Start date
                  </Th>
                  <Th
                    sort={{
                      sortBy,
                      onSort: (_e, index, direction) => setSortBy({ index, direction }),
                      columnIndex: 3
                    }}
                  >
                    End date
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {pageRows.length === 0 ? (
                  <Tr>
                    <Td colSpan={4}><em>No contracts</em></Td>
                  </Tr>
                ) : (
                  pageRows.map((c) => (
                    <Tr key={c.contractNumber}>
                      <Td>{c.contractNumber}</Td>
                      <Td>{c.quantity}</Td>
                      <Td>{c.startDate}</Td>
                      <Td>{c.endDate}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { SubscriptionDetails };


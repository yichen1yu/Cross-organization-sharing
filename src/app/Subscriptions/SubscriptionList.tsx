import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  PageSection,
  Pagination,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

type SubscriptionRow = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  serviceLevel: 'Self-Support' | 'Standard' | 'Premium';
};

const initialRows: SubscriptionRow[] = [
  { id: '1', name: '1 Year Product Trial of Red Hat Insights for Red Hat Enterprise Linux, Self‑Supported', sku: 'SER0482', quantity: 10, serviceLevel: 'Self-Support' },
  { id: '2', name: '30 Day Product Trial Developer Sandbox for Red Hat OpenShift, Self‑Supported', sku: 'SER0772', quantity: 2, serviceLevel: 'Self-Support' },
  { id: '3', name: '30 Day Product Trial of Red Hat JBoss Enterprise Application Platform, Self‑Supported', sku: 'MW0150761', quantity: 100, serviceLevel: 'Self-Support' },
  { id: '4', name: '60 Day Product Trial of Red Hat AI Inference Server, Self‑Support', sku: 'SER0861', quantity: 6, serviceLevel: 'Self-Support' },
  { id: '5', name: '60 Day Product Trial of Red Hat Advanced Cluster Management for Kubernetes, Self‑Supported', sku: 'SER0599', quantity: 1, serviceLevel: 'Self-Support' },
  { id: '6', name: '60 Day Product Trial of Red Hat Advanced Cluster Security Cloud Service, Self‑Supported', sku: 'SER0798', quantity: 0, serviceLevel: 'Self-Support' },
  { id: '7', name: '60 Day Product Trial of Red Hat Advanced Cluster Security for Kubernetes, Self‑Support', sku: 'SER0720', quantity: 1, serviceLevel: 'Self-Support' },
  { id: '8', name: '60 Day Product Trial of Red Hat Ansible Automation Platform, Self‑Supported (100 Managed Nodes)', sku: 'SER0569', quantity: 3, serviceLevel: 'Self-Support' },
];

const SubscriptionList: React.FunctionComponent = () => {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialRows;
    return initialRows.filter(r => r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q));
  }, [query]);

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageRows = filtered.slice(start, end);

  // Fake status numbers
  const active = 12673;
  const expiringSoon = 198;
  const expired = 40;
  const futureDated = 0;

  return (
    <>
      {/* Heading and purchase button */}
      <PageSection hasBodyWrapper={false}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">Subscriptions Inventory</Title>
          </FlexItem>
          <FlexItem>
            <Button variant="primary">Purchase subscriptions</Button>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Getting started resources */}
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Card>
          <CardHeader>
            <Title headingLevel="h2" size="lg">Getting started resources</Title>
          </CardHeader>
          <Divider />
          <CardBody>
            <Grid hasGutter md={6} lg={6} xl={6}>
              <GridItem span={3}>
                <Title headingLevel="h3" size="md">Activate a subscription</Title>
                <Content>
                  <p style={{ marginTop: 6 }}>Activate a subscription purchased from a third party.</p>
                  <ul>
                    <li><Button variant="link" isInline>Subscription Activation</Button></li>
                    <li><Button variant="link" isInline>Activate a Dell Service Tag</Button></li>
                  </ul>
                </Content>
              </GridItem>
              <GridItem span={3}>
                <Title headingLevel="h3" size="md">Explore subscription benefits</Title>
                <Content>
                  <p style={{ marginTop: 6 }}>Explore the benefits of your Red Hat subscription.</p>
                  <ul>
                    <li><Button variant="link" isInline>Benefits of a Red Hat subscription</Button></li>
                    <li><Button variant="link" isInline>Red Hat subscription model FAQs</Button></li>
                  </ul>
                </Content>
              </GridItem>
              <GridItem span={3}>
                <Title headingLevel="h3" size="md">Manage users</Title>
                <Content>
                  <p style={{ marginTop: 6 }}>Grant and manage access permissions for individuals.</p>
                  <ul>
                    <li><Button variant="link" isInline>How To Create and Manage Users</Button></li>
                    <li><Button variant="link" isInline>Add a Single User</Button></li>
                    <li><Button variant="link" isInline>Add Multiple Users</Button></li>
                    <li><Button variant="link" isInline>View all Roles and Permissions</Button></li>
                  </ul>
                </Content>
              </GridItem>
              <GridItem span={3}>
                <Title headingLevel="h3" size="md">Learning Subscriptions</Title>
                <Content>
                  <p style={{ marginTop: 6 }}>Looking for learning content and subscriptions?</p>
                  <ul>
                    <li><Button variant="link" isInline>Go to your learning content</Button></li>
                    <li><Button variant="link" isInline>Contact Red Hat Training</Button></li>
                    <li><Button variant="link" isInline>View all Training & Certification</Button></li>
                  </ul>
                </Content>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </PageSection>

      {/* Status cards */}
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Grid hasGutter>
          <GridItem span={3}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="md">Active</Title>
                <div style={{ marginTop: 8 }}><Label color="green">{active.toLocaleString()}</Label></div>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={3}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="md">Expiring soon</Title>
                <div style={{ marginTop: 8 }}><Label color="orange">{expiringSoon.toLocaleString()}</Label></div>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={3}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="md">Expired</Title>
                <div style={{ marginTop: 8 }}><Label color="red">{expired.toLocaleString()}</Label></div>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={3}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="md">Future dated</Title>
                <div style={{ marginTop: 8 }}><Label color="grey">{futureDated.toLocaleString()}</Label></div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>

      {/* Filter and table */}
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem grow={{ default: 'grow' }}>
              <SearchInput
                placeholder="Filter by Name or SKU"
                value={query}
                onChange={(_e, v) => { setQuery(v); setPage(1); }}
                onClear={() => { setQuery(''); setPage(1); }}
              />
            </ToolbarItem>
            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Pagination
                isCompact
                itemCount={filtered.length}
                perPage={perPage}
                page={page}
                onSetPage={(_e, p) => setPage(p)}
                onPerPageSelect={(_e, n) => { setPerPage(n); setPage(1); }}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <Table aria-label="Subscriptions list table">
          <Thead>
            <Tr>
              <Th width={60}>Name</Th>
              <Th width={10}>SKU</Th>
              <Th width={10}>Quantity</Th>
              <Th width={20}>Service level</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageRows.map(r => (
              <Tr key={r.id}>
                <Td><Button variant="link" isInline>{r.name}</Button></Td>
                <Td>{r.sku}</Td>
                <Td>{r.quantity}</Td>
                <Td>{r.serviceLevel}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            itemCount={filtered.length}
            perPage={perPage}
            page={page}
            onSetPage={(_e, p) => setPage(p)}
            onPerPageSelect={(_e, n) => { setPerPage(n); setPage(1); }}
          />
        </div>
      </PageSection>
    </>
  );
};

export { SubscriptionList };




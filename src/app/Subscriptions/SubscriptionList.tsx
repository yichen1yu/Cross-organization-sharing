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
import { Link } from 'react-router-dom';
import { subscriptionsData } from './subscriptionsData';

// Source of truth for rows
const initialRows = subscriptionsData;

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
            <ToolbarItem>
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
                <Td>
                  <Button
                    variant="link"
                    isInline
                    component={Link}
                    to={`/subscription-inventory/subscription/${r.id}`}
                  >
                    {r.name}
                  </Button>
                </Td>
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




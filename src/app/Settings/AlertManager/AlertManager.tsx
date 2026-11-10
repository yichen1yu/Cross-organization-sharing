import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  Label,
  MenuToggle,
  PageSection,
  Pagination,
  SearchInput,
  Split,
  SplitItem,
  Tab,
  Tabs,
  TabTitleText,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import {
  BellIcon,
  EllipsisVIcon,
  EnvelopeIcon,
  ExternalLinkAltIcon,
  OpenDrawerRightIcon,
} from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

type NotifierKind = 'email' | 'drawer' | 'slack' | 'teams';

interface AlertEvent {
  id: string;
  eventType: string;
  service: string;
  notifiers: NotifierKind[];
}

const SlackMark: React.FunctionComponent = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#E01E5A" d="M6 15.5A2.5 2.5 0 1 1 3.5 13H6v2.5zM8.5 15.5a2.5 2.5 0 0 1 5 0V21a2.5 2.5 0 1 1-5 0v-5.5z" />
    <path fill="#36C5F0" d="M8.5 6A2.5 2.5 0 1 1 11 3.5V6H8.5zM8.5 8.5a2.5 2.5 0 0 1 0 5H3a2.5 2.5 0 1 1 0-5h5.5z" />
    <path fill="#2EB67D" d="M18 8.5A2.5 2.5 0 1 1 20.5 11H18V8.5zM15.5 8.5a2.5 2.5 0 0 1-5 0V3a2.5 2.5 0 1 1 5 0v5.5z" />
    <path fill="#ECB22E" d="M15.5 18a2.5 2.5 0 1 1-2.5 2.5V18h2.5zM15.5 15.5a2.5 2.5 0 0 1 0-5H21a2.5 2.5 0 1 1 0 5h-5.5z" />
  </svg>
);

const TeamsMark: React.FunctionComponent = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" aria-hidden="true">
    <rect width="16" height="16" rx="3" fill="#5059C9" />
    <path fill="#fff" d="M4.2 5.2h1.5v5.6H4.2V5.2Zm3.1 0h2.4c1.3 0 2.1.8 2.1 2v1.6c0 1.2-.8 2-2.1 2H7.3V5.2Zm1.5 1.2v3.2h.8c.5 0 .9-.3.9-.9V7.3c0-.6-.4-.9-.9-.9h-.8Z" />
  </svg>
);

const notifierMeta: Record<NotifierKind, { label: string; icon: React.ReactNode }> = {
  email: { label: 'Email', icon: <EnvelopeIcon /> },
  drawer: { label: 'Drawer', icon: <OpenDrawerRightIcon /> },
  slack: { label: 'Slack', icon: <SlackMark /> },
  teams: { label: 'Microsoft Teams', icon: <TeamsMark /> },
};

const featuredEvents: AlertEvent[] = [
  { id: 'vuln-exploit', eventType: 'Any vulnerability with known exploit', service: 'Vulnerability | RHEL', notifiers: ['email'] },
  { id: 'availability', eventType: 'Availability Status', service: 'Integrations | Settings', notifiers: ['email', 'drawer'] },
  { id: 'advisor-weekly', eventType: 'Advisor Weekly Report', service: 'Advisor | RHEL', notifiers: ['email', 'slack'] },
  { id: 'capacity', eventType: 'Capacity Management', service: 'Cluster Management | OpenShift', notifiers: ['drawer'] },
  { id: 'usage-threshold', eventType: 'Usage at custom threshold', service: 'Subscriptions Usage | Subscription Services', notifiers: ['drawer'] },
  { id: 'custom-role', eventType: 'Custom role created', service: 'User Access | IAM', notifiers: ['drawer', 'teams'] },
  { id: 'customer-support', eventType: 'Customer Support', service: 'Cluster Management | OpenShift', notifiers: [] },
  { id: 'deactivated', eventType: 'Deactivated recommendation', service: 'Advisor | RHEL', notifiers: ['email', 'drawer'] },
  { id: 'cluster-ownership', eventType: 'Cluster Ownership', service: 'Cluster Management | OpenShift', notifiers: ['drawer', 'teams'] },
  { id: 'cluster-security', eventType: 'Cluster Security', service: 'Cluster Management | OpenShift', notifiers: ['email', 'drawer', 'slack'] },
];

const additionalEventNames = [
  'Cluster Scaling',
  'Cluster Configuration',
  'Cluster Access',
  'Cluster Add-on',
  'Cluster Lifecycle',
  'Cluster Networking',
  'New recommendation',
  'Critical vulnerability',
  'Malware detected',
  'Policy violation',
  'System not reporting',
  'Patch available',
  'Drift detected',
  'Image build failed',
  'Image build completed',
  'Repository sync failed',
  'Integration disconnected',
  'Webhook delivery failed',
  'User invited',
  'User removed',
  'Group created',
  'Role assigned',
  'Role deleted',
  'Access request submitted',
  'Access request approved',
  'Service account created',
  'API token expiring',
  'Subscription expiring',
  'Subscription renewed',
  'Usage exceeded',
  'Credit balance low',
  'Cost anomaly',
  'Cluster upgrade available',
  'Node pressure',
  'Pod crash looping',
  'Certificate expiring',
  'Compliance failed',
  'Insights rule hit',
  'Advisor daily digest',
  'Inventory stale',
  'Cloud account disconnected',
  'Marketplace purchase',
  'Ansible job failed',
  'Playbook completed',
  'Automation hub sync',
  'OpenShift AI model failed',
  'Pipeline failed',
  'Backup failed',
  'Backup completed',
  'Log volume high',
  'Notification delivery failed',
  'Default notifier changed',
];

const serviceCycle = [
  'Advisor | RHEL',
  'Vulnerability | RHEL',
  'Cluster Management | OpenShift',
  'Integrations | Settings',
  'Subscriptions Usage | Subscription Services',
  'User Access | IAM',
];

const notifierCycle: NotifierKind[][] = [
  ['email'],
  ['drawer'],
  ['email', 'drawer'],
  ['email', 'slack'],
  ['drawer', 'teams'],
  ['email', 'drawer', 'slack'],
  [],
  ['slack'],
  ['teams'],
  ['email', 'teams'],
];

const events: AlertEvent[] = [
  ...featuredEvents,
  ...additionalEventNames.map((eventType, index) => ({
    id: `event-${index + 1}`,
    eventType,
    service: serviceCycle[index % serviceCycle.length],
    notifiers: notifierCycle[index % notifierCycle.length],
  })),
];

const AlertManagerSettings: React.FunctionComponent = () => {
  useDocumentTitle('Alert Manager | Settings');

  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [searchValue, setSearchValue] = React.useState('');
  const [filterField, setFilterField] = React.useState<'Event name' | 'Service'>('Event name');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [openActionId, setOpenActionId] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<{ index: number; direction: 'asc' | 'desc' }>({
    index: -1,
    direction: 'asc',
  });

  const filteredEvents = React.useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const matched = query
      ? events.filter((event) =>
          (filterField === 'Event name' ? event.eventType : event.service).toLowerCase().includes(query)
        )
      : events;

    if (sortBy.index < 0) {
      return matched;
    }

    const key = sortBy.index === 0 ? 'eventType' : 'service';
    return [...matched].sort((a, b) => {
      const result = a[key].localeCompare(b[key]);
      return sortBy.direction === 'asc' ? result : -result;
    });
  }, [filterField, searchValue, sortBy]);

  const pageStart = (page - 1) * perPage;
  const pageEvents = filteredEvents.slice(pageStart, pageStart + perPage);
  const pageIds = pageEvents.map((event) => event.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  const setPageSelected = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      pageIds.forEach((id) => {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      });
      return next;
    });
  };

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/settings/integrations">Settings</BreadcrumbItem>
          <BreadcrumbItem isActive>Alert Manager</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Split hasGutter>
          <SplitItem>
            <span className="settings-alert-manager__icon" aria-hidden="true">
              <BellIcon />
            </span>
          </SplitItem>
          <SplitItem isFilled>
            <Title headingLevel="h1" size="2xl">Alert Manager</Title>
            <Content component="p" className="settings-alert-manager__description">
              Manage your alert default settings for your Organization and configure how fired events should alert users and groups through various communication channels.
            </Content>
            <Content component="p" className="settings-alert-manager__learn-more">
              <Button
                variant="link"
                isInline
                component="a"
                href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/index"
                target="_blank"
                rel="noopener noreferrer"
                icon={<ExternalLinkAltIcon />}
                iconPosition="end"
              >
                Learn more
              </Button>
            </Content>
          </SplitItem>
        </Split>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Tabs activeKey={activeTabKey} onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}>
          <Tab eventKey={0} title={<TabTitleText>Events</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>Recurring notification set up</TabTitleText>} />
        </Tabs>
      </PageSection>

      {activeTabKey === 0 ? (
        <PageSection hasBodyWrapper={false}>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <Checkbox
                  id="alert-manager-select-page"
                  aria-label="Select all events on this page"
                  isChecked={allPageSelected ? true : somePageSelected ? null : false}
                  onChange={(_event, checked) => setPageSelected(checked)}
                />
              </ToolbarItem>
              <ToolbarGroup variant="filter-group">
                <ToolbarItem>
                  <Dropdown
                    isOpen={isFilterOpen}
                    onSelect={(_event, value) => {
                      setFilterField(value as 'Event name' | 'Service');
                      setIsFilterOpen(false);
                      setPage(1);
                    }}
                    onOpenChange={setIsFilterOpen}
                    toggle={(toggleRef: React.Ref<any>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsFilterOpen((open) => !open)}
                        isExpanded={isFilterOpen}
                      >
                        {filterField}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem value="Event name">Event name</DropdownItem>
                      <DropdownItem value="Service">Service</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem className="settings-alert-manager__search">
                  <SearchInput
                    placeholder="Filter by event type"
                    value={searchValue}
                    onChange={(_event, value) => onSearchChange(value)}
                    onClear={() => onSearchChange('')}
                    aria-label="Filter by event type"
                  />
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarItem>
                <MenuToggle isDisabled>Manage core platform notifiers</MenuToggle>
              </ToolbarItem>
              <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                <Pagination
                  isCompact
                  variant="top"
                  itemCount={filteredEvents.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={(_event, nextPage) => setPage(nextPage)}
                  onPerPageSelect={(_event, nextPerPage, nextPage) => {
                    setPerPage(nextPerPage);
                    setPage(nextPage);
                  }}
                  widgetId="alert-manager-top-pagination"
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Alert events" variant="compact">
            <Thead>
              <Tr>
                <Th
                  select={{
                    onSelect: (_event, isSelected) => setPageSelected(isSelected),
                    isSelected: allPageSelected,
                  }}
                  aria-label="Select all events on this page"
                />
                <Th
                  sort={{
                    sortBy,
                    onSort: (_event, index, direction) => setSortBy({ index, direction }),
                    columnIndex: 0,
                  }}
                >
                  Event type
                </Th>
                <Th
                  sort={{
                    sortBy,
                    onSort: (_event, index, direction) => setSortBy({ index, direction }),
                    columnIndex: 1,
                  }}
                >
                  Service
                </Th>
                <Th
                  info={{
                    tooltip: 'Notifiers that deliver this event to you.',
                    ariaLabel: 'More information about my notifiers',
                  }}
                >
                  My notifiers
                </Th>
                <Th screenReaderText="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {pageEvents.map((event, rowIndex) => (
                <Tr key={event.id}>
                  <Td
                    select={{
                      rowIndex,
                      onSelect: (_event, isSelected) => {
                        setSelectedIds((current) => {
                          const next = new Set(current);
                          if (isSelected) {
                            next.add(event.id);
                          } else {
                            next.delete(event.id);
                          }
                          return next;
                        });
                      },
                      isSelected: selectedIds.has(event.id),
                    }}
                  />
                  <Td dataLabel="Event type">
                    <Button variant="link" isInline>
                      {event.eventType}
                    </Button>
                  </Td>
                  <Td dataLabel="Service">{event.service}</Td>
                  <Td dataLabel="My notifiers">
                    {event.notifiers.length === 0 ? (
                      'No notifiers'
                    ) : (
                      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        {event.notifiers.map((kind) => (
                          <FlexItem key={kind}>
                            <Label variant="outline" color="grey" icon={notifierMeta[kind].icon}>
                              {notifierMeta[kind].label}
                            </Label>
                          </FlexItem>
                        ))}
                      </Flex>
                    )}
                  </Td>
                  <Td isActionCell>
                    <Dropdown
                      isOpen={openActionId === event.id}
                      onOpenChange={(isOpen) => setOpenActionId(isOpen ? event.id : null)}
                      onSelect={() => setOpenActionId(null)}
                      popperProps={{ position: 'right' }}
                      toggle={(toggleRef: React.Ref<any>) => (
                        <MenuToggle
                          ref={toggleRef}
                          variant="plain"
                          aria-label={`${event.eventType} actions`}
                          onClick={() => setOpenActionId(openActionId === event.id ? null : event.id)}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem>Edit notifiers</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} className="settings-alert-manager__bottom-pagination">
            <FlexItem>
              <Pagination
                variant="bottom"
                itemCount={filteredEvents.length}
                perPage={perPage}
                page={page}
                onSetPage={(_event, nextPage) => setPage(nextPage)}
                onPerPageSelect={(_event, nextPerPage, nextPage) => {
                  setPerPage(nextPerPage);
                  setPage(nextPage);
                }}
                widgetId="alert-manager-bottom-pagination"
              />
            </FlexItem>
          </Flex>
        </PageSection>
      ) : (
        <PageSection hasBodyWrapper={false}>
          <EmptyState titleText="No recurring notifications" headingLevel="h2">
            <EmptyStateBody>
              Recurring notifications send a digest on a schedule instead of alerting on every event.
            </EmptyStateBody>
          </EmptyState>
        </PageSection>
      )}
    </>
  );
};

export { AlertManagerSettings };

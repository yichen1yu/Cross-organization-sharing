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
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Pagination,
  Radio,
  SearchInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  AlertGroup,
  Alert,
  AlertActionCloseButton,
} from '@patternfly/react-core';
import { Wizard, WizardStep, WizardHeader } from '@patternfly/react-core';
import { EllipsisVIcon, AngleRightIcon, AngleDownIcon, FilterIcon, ExclamationTriangleIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

type WorkspaceNode = {
  id: string;
  name: string;
  sla: string;
  usage: string;
  availableFeatures: number;
  parentId?: string;
  level: number;
};

const allWorkspaces: WorkspaceNode[] = [
  { id: 'uxd', name: 'UXD', sla: 'Premium', usage: 'Disaster Recovery', availableFeatures: 2, level: 0 },
  { id: 'ws-default', name: 'Workspace default', sla: 'Premium', usage: 'Disaster Recovery', availableFeatures: 2, parentId: 'uxd', level: 1 },
  { id: 'ws-ungrouped', name: 'Workspace Ungrouped Hosts', sla: 'Premium', usage: 'Disaster Recovery', availableFeatures: 1, parentId: 'ws-default', level: 2 },
  { id: 'ws-a', name: 'Workspace A', sla: 'Premium', usage: 'Production', availableFeatures: 3, parentId: 'ws-default', level: 2 },
  { id: 'ws-b', name: 'Workspace B', sla: 'Standard', usage: 'Development', availableFeatures: 2, parentId: 'ws-default', level: 2 },
  { id: 'ws-c', name: 'Workspace C', sla: 'Standard', usage: 'Development', availableFeatures: 1, parentId: 'ws-default', level: 2 },
];

type FeatureRow = { name: string; description: string };
const allFeatures: FeatureRow[] = [
  { name: 'Advisor', description: 'Personalized recommendations for your infrastructure' },
  { name: 'Compliance', description: 'Assess and monitor regulatory compliance' },
  { name: 'Drift', description: 'Track configuration changes across systems' },
  { name: 'Insights', description: 'Proactive analytics and remediation' },
  { name: 'Patch', description: 'Manage patches across RHEL systems' },
  { name: 'Vulnerability', description: 'Detect and manage security vulnerabilities' },
];

const SubscriptionWorkspaces: React.FunctionComponent = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(['uxd', 'ws-default']));
  const [openKebab, setOpenKebab] = React.useState<string | null>(null);
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Subscription Composer wizard
  const [isComposerOpen, setIsComposerOpen] = React.useState(false);
  const [composerWorkspace, setComposerWorkspace] = React.useState<WorkspaceNode | null>(null);
  const [composerSla, setComposerSla] = React.useState<string>('Premium');
  const [composerUsage, setComposerUsage] = React.useState<string>('Development');
  const [selectedFeatures, setSelectedFeatures] = React.useState<Set<string>>(new Set());
  const featuresAllSelected = selectedFeatures.size === allFeatures.length;

  // Toasts
  type ToastItem = { id: number; title: string; description?: React.ReactNode };
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const addToast = (title: string, description?: React.ReactNode) => {
    setToasts(prev => [...prev, { id: Date.now() + Math.floor(Math.random() * 1000), title, description }]);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  // Change billing account modal
  const [isBillingModalOpen, setIsBillingModalOpen] = React.useState(false);
  const [billingModalWorkspace, setBillingModalWorkspace] = React.useState<WorkspaceNode | null>(null);
  const [selectedBillingAccount, setSelectedBillingAccount] = React.useState('Pinnacle Corp (1234567890)');
  const [isBillingDropdownOpen, setIsBillingDropdownOpen] = React.useState(false);
  const billingAccounts = ['Pinnacle Corp (1234567890)', 'Globex Inc (9876543210)', 'Initech LLC (5551234567)'];

  const openBillingModal = (ws: WorkspaceNode) => {
    setBillingModalWorkspace(ws);
    setSelectedBillingAccount('Pinnacle Corp (1234567890)');
    setIsBillingModalOpen(true);
  };

  const openComposer = (ws: WorkspaceNode, resetAll = false) => {
    setComposerWorkspace(ws);
    setComposerSla(resetAll ? '' : ws.sla);
    setComposerUsage(resetAll ? '' : ws.usage);
    setSelectedFeatures(new Set());
    setIsComposerOpen(true);
  };

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

  const getSortParams = (columnIndex: number) => ({
    sortBy: { index: activeSortIndex, direction: activeSortDirection },
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  return (
    <>
      <AlertGroup isToast isLiveRegion>
        {toasts.map(t => (
          <Alert key={t.id} variant="success" title={t.title} actionClose={<AlertActionCloseButton onClose={() => removeToast(t.id)} />}>
            {t.description}
          </Alert>
        ))}
      </AlertGroup>

      {isComposerOpen && composerWorkspace && (
        <Modal isOpen onClose={() => setIsComposerOpen(false)} variant="large" aria-label="Subscription Composer" className="trusted-wizard-modal">
          <Wizard
            onClose={() => setIsComposerOpen(false)}
            onSave={() => setIsComposerOpen(false)}
            header={
              <WizardHeader
                title="Subscription Composer"
                description={composerWorkspace.name}
                onClose={() => setIsComposerOpen(false)}
              />
            }
            startIndex={1}
          >
            <WizardStep id="composer-step-1" name="Support" footer={{ isBackHidden: true }}>
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Configure SLA level and usage</Title>
                <div style={{ marginTop: 16 }}>
                  <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>SLA</Title>
                  <div style={{ marginTop: 8 }}>
                    <Radio id="sla-premium" name="composer-sla" label="Premium" isChecked={composerSla === 'Premium'} onChange={() => setComposerSla('Premium')} />
                    <Radio id="sla-standard" name="composer-sla" label="Standard" isChecked={composerSla === 'Standard'} onChange={() => setComposerSla('Standard')} style={{ marginTop: 0 }} />
                    <Radio id="sla-self" name="composer-sla" label="Self-support" isChecked={composerSla === 'Self-support'} onChange={() => setComposerSla('Self-support')} style={{ marginTop: 0 }} />
                  </div>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>Usage</Title>
                  <div style={{ marginTop: 8 }}>
                    <Radio id="usage-production" name="composer-usage" label="Production" isChecked={composerUsage === 'Production'} onChange={() => setComposerUsage('Production')} />
                    <Radio id="usage-development" name="composer-usage" label="Development" isChecked={composerUsage === 'Development'} onChange={() => setComposerUsage('Development')} style={{ marginTop: 0 }} />
                    <Radio id="usage-dr" name="composer-usage" label="Disaster recovery" isChecked={composerUsage === 'Disaster Recovery'} onChange={() => setComposerUsage('Disaster Recovery')} style={{ marginTop: 0 }} />
                  </div>
                </div>
              </div>
            </WizardStep>
            <WizardStep id="composer-step-2" name="Features">
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Select features</Title>
                <p style={{ marginTop: 8 }}>Choose which features to enable for this workspace.</p>
                <div style={{ marginTop: 12 }}>
                  <Table aria-label="Select features table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox
                            id="feat-select-all"
                            aria-label="Select all features"
                            isChecked={featuresAllSelected}
                            onChange={(_e, checked) => {
                              if (checked) setSelectedFeatures(new Set(allFeatures.map(f => f.name)));
                              else setSelectedFeatures(new Set());
                            }}
                          />
                        </Th>
                        <Th>Feature</Th>
                        <Th>Description</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {allFeatures.map((feat) => (
                        <Tr key={feat.name}>
                          <Td>
                            <Checkbox
                              id={`feat-${feat.name}`}
                              aria-label={`Select ${feat.name}`}
                              isChecked={selectedFeatures.has(feat.name)}
                              onChange={(_e, checked) => {
                                setSelectedFeatures(prev => {
                                  const next = new Set(prev);
                                  if (checked) next.add(feat.name); else next.delete(feat.name);
                                  return next;
                                });
                              }}
                            />
                          </Td>
                          <Td>{feat.name}</Td>
                          <Td>{feat.description}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </WizardStep>
            <WizardStep id="composer-step-3" name="Review" footer={{ nextButtonText: 'Submit' }}>
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Review</Title>
                <p style={{ marginTop: 8 }}>Review the subscription configuration for {composerWorkspace.name}.</p>
                <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '200px 1fr', rowGap: 12 }}>
                  <div style={{ fontWeight: 700 }}>Workspace</div>
                  <div>{composerWorkspace.name}</div>
                  <div style={{ fontWeight: 700 }}>SLA</div>
                  <div>{composerSla}</div>
                  <div style={{ fontWeight: 700 }}>Usage</div>
                  <div>{composerUsage}</div>
                  <div style={{ fontWeight: 700 }}>Features</div>
                  <div>{Array.from(selectedFeatures).join(', ') || '-'}</div>
                </div>
              </div>
            </WizardStep>
          </Wizard>
        </Modal>
      )}

      {isBillingModalOpen && billingModalWorkspace && (
        <Modal
          isOpen
          onClose={() => setIsBillingModalOpen(false)}
          variant="medium"
          aria-label="Change billing account"
        >
          <ModalHeader
            title="Change billing account"
            titleIconVariant="warning"
          />
          <ModalBody>
            <p>
              The change of billing account will incur following changes in the access for current subscriptions. The changes will apply to the sub-workspace(s), if there&apos;s any.
            </p>
            <div style={{ marginTop: 16 }}>
              <span style={{ fontWeight: 700 }}>Select a billing account</span>{' '}
              <OutlinedQuestionCircleIcon style={{ color: '#6a6e73', cursor: 'pointer' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <Dropdown
                isOpen={isBillingDropdownOpen}
                onOpenChange={setIsBillingDropdownOpen}
                onSelect={(_e, itemId) => {
                  setSelectedBillingAccount(String(itemId ?? ''));
                  setIsBillingDropdownOpen(false);
                }}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    isExpanded={isBillingDropdownOpen}
                    onClick={() => setIsBillingDropdownOpen(prev => !prev)}
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    {selectedBillingAccount}
                  </MenuToggle>
                )}
                popperProps={{ appendTo: () => document.body }}
              >
                <DropdownList>
                  {billingAccounts.map((acct) => (
                    <DropdownItem key={acct} itemId={acct} isSelected={selectedBillingAccount === acct}>
                      {acct}
                    </DropdownItem>
                  ))}
                </DropdownList>
              </Dropdown>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={() => {
              addToast(`Billing account has change for ${billingModalWorkspace.name}`, (
                <span>Please re-configure the subscription composer for the workspace(s)</span>
              ));
              setIsBillingModalOpen(false);
              openComposer(billingModalWorkspace, true);
            }}>Save</Button>
            <Button variant="link" onClick={() => setIsBillingModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )}

      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Subscription Services</BreadcrumbItem>
          <BreadcrumbItem to="/subscription-inventory">Subscription Inventory</BreadcrumbItem>
          <BreadcrumbItem isActive>Workspaces</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Workspaces</Title>
        <Content>
          <p style={{ color: '#6a6e73' }}>Billing account: Pinnacle Corp (1234567890)</p>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} isFilled style={{ paddingTop: 0 }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Dropdown
                isOpen={false}
                onOpenChange={() => {}}
                toggle={(toggleRef) => (
                  <MenuToggle ref={toggleRef} isExpanded={false} icon={<FilterIcon />} style={{ minWidth: 120 }}>
                    Name
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem>Name</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                aria-label="Search"
                placeholder="Search"
                value={searchValue}
                onChange={(_e, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
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

        <Table aria-label="Subscription workspaces table">
          <Thead>
            <Tr>
              <Th width={30} sort={getSortParams(0)}>Workspace</Th>
              <Th width={15} sort={getSortParams(1)}>SLA</Th>
              <Th width={20} sort={getSortParams(2)}>Usage</Th>
              <Th width={20} sort={getSortParams(3)}>Available features</Th>
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
                  <Td dataLabel="Workspace" style={{ paddingLeft }}>
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
                      <Button variant="link" isInline>{ws.name}</Button>
                    </span>
                  </Td>
                  <Td dataLabel="SLA">{ws.sla}</Td>
                  <Td dataLabel="Usage">{ws.usage}</Td>
                  <Td dataLabel="Available features">
                    <Button variant="link" isInline>{ws.availableFeatures}</Button>
                  </Td>
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
                        <DropdownItem onClick={() => openComposer(ws)}>Subscription composer</DropdownItem>
                        <DropdownItem onClick={() => openBillingModal(ws)}>Change billing account</DropdownItem>
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

export { SubscriptionWorkspaces };

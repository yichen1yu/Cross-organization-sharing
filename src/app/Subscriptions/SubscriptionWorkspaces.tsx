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
import { EllipsisVIcon, AngleRightIcon, AngleDownIcon, FilterIcon, ExclamationTriangleIcon, OutlinedQuestionCircleIcon, MinusIcon, PlusIcon } from '@patternfly/react-icons';
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
  { id: 'uxd', name: 'Pinnacle Corp', sla: 'Premium', usage: 'Production', availableFeatures: 2, level: 0 },
  { id: 'ws-default', name: 'Workspace default', sla: 'Premium', usage: 'Production', availableFeatures: 2, parentId: 'uxd', level: 1 },
  { id: 'ws-ungrouped', name: 'Workspace Ungrouped Hosts', sla: 'Premium', usage: 'Development', availableFeatures: 1, parentId: 'ws-default', level: 2 },
  { id: 'ws-a', name: 'Workspace A', sla: 'Premium', usage: 'Production', availableFeatures: 3, parentId: 'ws-default', level: 2 },
  { id: 'ws-b', name: 'Workspace B', sla: 'Standard', usage: 'Development', availableFeatures: 2, parentId: 'ws-default', level: 2 },
  { id: 'ws-c', name: 'Workspace C', sla: 'Standard', usage: 'Disaster Recovery', availableFeatures: 1, parentId: 'ws-default', level: 2 },
];

type FeatureRow = { name: string };
const allFeatures: FeatureRow[] = [
  { name: 'RHEL Advanced Update Support Add-On, Annual' },
  { name: 'RHEL ARM' },
  { name: 'RHEL for IBM Power' },
  { name: 'RHEL for IBM z' },
  { name: 'RHEL for SAP x86' },
  { name: 'RHEL for x86' },
  { name: 'RHEL for x86 ELS Annual' },
  { name: 'RHEL for x86 ELS On-Demand' },
  { name: 'RHEL for x86 ELS On-Demand for Third Party Linux Migration' },
  { name: 'RHEL for x86 EUS' },
  { name: 'RHEL for x86 HA' },
  { name: 'RHEL for x86 Resilient Storage' },
  { name: 'Satellite Capsule' },
  { name: 'Satellite Server' },
  { name: 'Advanced Cluster Security' },
  { name: 'Container Platform (Annual)' },
  { name: 'Container Platform (On-Demand)' },
  { name: 'Dedicated (On-Demand)' },
  { name: 'Red Hat Advanced Cluster Management' },
  { name: 'Red Hat OpenShift AI' },
  { name: 'ROSA with Hosted Control Planes' },
];

type BillingAccountInfo = { name: string; id: string; totalSockets: Record<string, number> };
const billingAccountData: BillingAccountInfo[] = [
  {
    name: 'Pinnacle Corp', id: '1234567890',
    totalSockets: {
      'RHEL Advanced Update Support Add-On, Annual': 5000, 'RHEL ARM': 3000, 'RHEL for IBM Power': 2000,
      'RHEL for IBM z': 1500, 'RHEL for SAP x86': 4000, 'RHEL for x86': 10000,
      'RHEL for x86 ELS Annual': 6000, 'RHEL for x86 ELS On-Demand': 4000,
      'RHEL for x86 ELS On-Demand for Third Party Linux Migration': 2000, 'RHEL for x86 EUS': 5000,
      'RHEL for x86 HA': 3000, 'RHEL for x86 Resilient Storage': 2500,
      'Satellite Capsule': 1000, 'Satellite Server': 800,
      'Advanced Cluster Security': 5000, 'Container Platform (Annual)': 8000,
      'Container Platform (On-Demand)': 6000, 'Dedicated (On-Demand)': 4000,
      'Red Hat Advanced Cluster Management': 3000, 'Red Hat OpenShift AI': 2000,
      'ROSA with Hosted Control Planes': 7000,
    }
  },
  {
    name: 'Globell Inc', id: '9876543210',
    totalSockets: {
      'RHEL Advanced Update Support Add-On, Annual': 8000, 'RHEL ARM': 5000, 'RHEL for IBM Power': 3000,
      'RHEL for IBM z': 2500, 'RHEL for SAP x86': 6000, 'RHEL for x86': 15000,
      'RHEL for x86 ELS Annual': 9000, 'RHEL for x86 ELS On-Demand': 7000,
      'RHEL for x86 ELS On-Demand for Third Party Linux Migration': 3000, 'RHEL for x86 EUS': 8000,
      'RHEL for x86 HA': 5000, 'RHEL for x86 Resilient Storage': 4000,
      'Satellite Capsule': 2000, 'Satellite Server': 1500,
      'Advanced Cluster Security': 7000, 'Container Platform (Annual)': 12000,
      'Container Platform (On-Demand)': 9000, 'Dedicated (On-Demand)': 6000,
      'Red Hat Advanced Cluster Management': 5000, 'Red Hat OpenShift AI': 4000,
      'ROSA with Hosted Control Planes': 10000,
    }
  },
  {
    name: 'Initech LLC', id: '5551234567',
    totalSockets: {
      'RHEL Advanced Update Support Add-On, Annual': 3000, 'RHEL ARM': 2000, 'RHEL for IBM Power': 1000,
      'RHEL for IBM z': 800, 'RHEL for SAP x86': 2500, 'RHEL for x86': 6000,
      'RHEL for x86 ELS Annual': 4000, 'RHEL for x86 ELS On-Demand': 3000,
      'RHEL for x86 ELS On-Demand for Third Party Linux Migration': 1000, 'RHEL for x86 EUS': 3000,
      'RHEL for x86 HA': 2000, 'RHEL for x86 Resilient Storage': 1500,
      'Satellite Capsule': 500, 'Satellite Server': 400,
      'Advanced Cluster Security': 3000, 'Container Platform (Annual)': 5000,
      'Container Platform (On-Demand)': 4000, 'Dedicated (On-Demand)': 2000,
      'Red Hat Advanced Cluster Management': 2000, 'Red Hat OpenShift AI': 1500,
      'ROSA with Hosted Control Planes': 4000,
    }
  },
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
  type EarmarkConfig = { sockets: number; noEarmark: boolean };
  const [earmarks, setEarmarks] = React.useState<Record<string, EarmarkConfig>>({});
  const getEarmark = (feature: string): EarmarkConfig => earmarks[feature] || { sockets: 0, noEarmark: false };
  const setEarmarkField = (feature: string, field: Partial<EarmarkConfig>) => {
    setEarmarks(prev => ({ ...prev, [feature]: { ...getEarmark(feature), ...field } }));
  };
  const selectedFeatureNames = React.useMemo(() => {
    return allFeatures.filter(f => selectedFeatures.has(f.name)).map(f => f.name);
  }, [selectedFeatures]);
  const [workspaceBilling, setWorkspaceBilling] = React.useState<Record<string, string>>({});
  const [workspaceFeatures, setWorkspaceFeatures] = React.useState<Record<string, string[]>>({
    'uxd': ['RHEL for x86', 'RHEL for x86 HA', 'Container Platform (Annual)'],
    'ws-default': ['RHEL for x86', 'Container Platform (Annual)'],
    'ws-ungrouped': ['RHEL for x86'],
    'ws-a': ['RHEL for x86', 'RHEL for x86 HA', 'Container Platform (Annual)'],
    'ws-b': ['RHEL for x86', 'RHEL ARM'],
    'ws-c': ['RHEL for x86'],
  });
  const getWorkspaceFeatures = (wsId: string): string[] => workspaceFeatures[wsId] || [];
  const [workspaceEarmarks, setWorkspaceEarmarks] = React.useState<Record<string, Record<string, EarmarkConfig>>>({
    'uxd': { 'RHEL for x86': { sockets: 2000, noEarmark: false }, 'RHEL for x86 HA': { sockets: 500, noEarmark: false }, 'Container Platform (Annual)': { sockets: 0, noEarmark: true } },
    'ws-default': { 'RHEL for x86': { sockets: 1500, noEarmark: false }, 'Container Platform (Annual)': { sockets: 1000, noEarmark: false } },
    'ws-ungrouped': { 'RHEL for x86': { sockets: 0, noEarmark: true } },
    'ws-a': { 'RHEL for x86': { sockets: 3000, noEarmark: false }, 'RHEL for x86 HA': { sockets: 800, noEarmark: false }, 'Container Platform (Annual)': { sockets: 2000, noEarmark: false } },
    'ws-b': { 'RHEL for x86': { sockets: 1000, noEarmark: false }, 'RHEL ARM': { sockets: 0, noEarmark: true } },
    'ws-c': { 'RHEL for x86': { sockets: 500, noEarmark: false } },
  });
  const getWorkspaceBillingAccount = (wsId: string): BillingAccountInfo => {
    const acctLabel = workspaceBilling[wsId];
    if (acctLabel) {
      const found = billingAccountData.find(b => `${b.name} (${b.id})` === acctLabel);
      if (found) return found;
    }
    return billingAccountData[0];
  };
  const composerBilling = composerWorkspace ? getWorkspaceBillingAccount(composerWorkspace.id) : billingAccountData[0];
  const getTotalSocketsForFeature = (feature: string) => composerBilling.totalSockets[feature] || 5000;
  const getAvailableSocketsForFeature = (feature: string): number => {
    const total = getTotalSocketsForFeature(feature);
    const currentWsId = composerWorkspace?.id;
    let assignedElsewhere = 0;
    for (const [wsId, wsEarmarkMap] of Object.entries(workspaceEarmarks)) {
      if (wsId === currentWsId) continue;
      if (getWorkspaceBillingAccount(wsId).id !== composerBilling.id) continue;
      const cfg = wsEarmarkMap[feature];
      if (cfg && !cfg.noEarmark) assignedElsewhere += cfg.sockets;
    }
    return total - assignedElsewhere;
  };

  // Toasts
  type ToastItem = { id: number; title: string; description?: React.ReactNode };
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const addToast = (title: string, description?: React.ReactNode) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(prev => [...prev, { id, title, description }]);
    setTimeout(() => removeToast(id), 8000);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  // Change billing account modal
  const [isBillingModalOpen, setIsBillingModalOpen] = React.useState(false);
  const [billingModalWorkspace, setBillingModalWorkspace] = React.useState<WorkspaceNode | null>(null);
  const [selectedBillingAccount, setSelectedBillingAccount] = React.useState('Pinnacle Corp (1234567890)');
  const [isBillingDropdownOpen, setIsBillingDropdownOpen] = React.useState(false);
  const billingAccounts = ['Pinnacle Corp (1234567890)', 'Globell Inc (9876543210)', 'Initech LLC (5551234567)'];

  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = React.useState(false);
  const [featuresModalWorkspace, setFeaturesModalWorkspace] = React.useState<WorkspaceNode | null>(null);
  const openFeaturesModal = (ws: WorkspaceNode) => {
    setFeaturesModalWorkspace(ws);
    setIsFeaturesModalOpen(true);
  };

  const openBillingModal = (ws: WorkspaceNode) => {
    setBillingModalWorkspace(ws);
    setSelectedBillingAccount(workspaceBilling[ws.id] || 'Pinnacle Corp (1234567890)');
    setIsBillingModalOpen(true);
  };

  const openComposer = (ws: WorkspaceNode, resetAll = false) => {
    setComposerWorkspace(ws);
    setComposerSla(resetAll ? '' : ws.sla);
    setComposerUsage(resetAll ? '' : ws.usage);
    setSelectedFeatures(resetAll ? new Set<string>() : new Set(getWorkspaceFeatures(ws.id)));
    setEarmarks(resetAll ? {} : (workspaceEarmarks[ws.id] || {}));
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
            onSave={() => {
              if (composerWorkspace) {
                setWorkspaceFeatures(prev => ({ ...prev, [composerWorkspace.id]: Array.from(selectedFeatures) }));
                setWorkspaceEarmarks(prev => ({ ...prev, [composerWorkspace.id]: { ...earmarks } }));
                addToast(`Subscription composer updated for ${composerWorkspace.name}`);
              }
              setIsComposerOpen(false);
            }}
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
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </WizardStep>
            <WizardStep id="composer-step-3" name="Earmarks" isHidden={selectedFeatureNames.length === 0} isExpandable steps={
              selectedFeatureNames.map((featName) => {
                const cfg = getEarmark(featName);
                const featureTotal = getTotalSocketsForFeature(featName);
                const availableSockets = getAvailableSocketsForFeature(featName);
                const isNextDisabled = !cfg.noEarmark && cfg.sockets <= 0;
                return (
                  <WizardStep key={featName} id={`earmark-${featName}`} name={featName} footer={{ isNextDisabled }}>
                    <div style={{ padding: 16 }}>
                      <Title headingLevel="h3" size="lg">Set earmark: {featName}</Title>
                      <p style={{ marginTop: 4, color: 'var(--pf-t--global--text--color--subtle)' }}>
                        {composerBilling.name} - Billing account: {composerBilling.id}
                      </p>
                      <div style={{ marginTop: 20 }}>
                        <span style={{ fontWeight: 700 }}>Earmark</span>{' '}
                        <OutlinedQuestionCircleIcon style={{ color: '#6a6e73', cursor: 'pointer', verticalAlign: 'middle' }} />
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <Checkbox
                          id={`no-earmark-${featName}`}
                          label="No earmark"
                          isChecked={cfg.noEarmark}
                          onChange={(_e, checked) => setEarmarkField(featName, { noEarmark: checked })}
                        />
                      </div>
                      <div style={{ marginTop: 16, opacity: cfg.noEarmark ? 0.4 : 1, pointerEvents: cfg.noEarmark ? 'none' : 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Button
                            variant="control"
                            aria-label="Minus"
                            isDisabled={cfg.noEarmark || cfg.sockets <= 0}
                            onClick={() => {
                              if (cfg.sockets > 0) setEarmarkField(featName, { sockets: cfg.sockets - 100 });
                            }}
                          >
                            <MinusIcon />
                          </Button>
                          <input
                            type="number"
                            value={cfg.sockets}
                            disabled={cfg.noEarmark}
                            onChange={(e) => {
                              const val = Math.max(0, Math.min(availableSockets, parseInt(e.target.value) || 0));
                              setEarmarkField(featName, { sockets: val });
                            }}
                            style={{ width: 80, textAlign: 'center', padding: '6px 8px', border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}
                            aria-label="Sockets"
                          />
                          <Button
                            variant="control"
                            aria-label="Plus"
                            isDisabled={cfg.noEarmark || cfg.sockets >= availableSockets}
                            onClick={() => {
                              if (cfg.sockets < availableSockets) setEarmarkField(featName, { sockets: cfg.sockets + 100 });
                            }}
                          >
                            <PlusIcon />
                          </Button>
                          <span style={{ marginLeft: 4 }}>Sockets</span>
                        </div>
                        <p style={{ marginTop: 8, color: 'var(--pf-t--global--text--color--subtle)' }}>
                          {availableSockets} of {featureTotal} sockets available to assign
                        </p>
                      </div>
                    </div>
                  </WizardStep>
                );
              })
            } />
            <WizardStep id="composer-step-4" name="Review" footer={{ nextButtonText: 'Submit' }}>
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
                  {selectedFeatureNames.length > 0 && (
                    <>
                      <div style={{ fontWeight: 700 }}>Earmarks</div>
                      <div>
                        {selectedFeatureNames.map(name => {
                          const cfg = getEarmark(name);
                          return <div key={name}>{name}: {cfg.noEarmark ? 'No earmark' : `${cfg.sockets} sockets`}</div>;
                        })}
                      </div>
                    </>
                  )}
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
              setWorkspaceBilling(prev => ({ ...prev, [billingModalWorkspace.id]: selectedBillingAccount }));
              addToast(`Billing account has changed for ${billingModalWorkspace.name}`, (
                <span>Please re-configure the subscription composer for the workspace(s)</span>
              ));
              setIsBillingModalOpen(false);
              openComposer(billingModalWorkspace, true);
            }}>Save</Button>
            <Button variant="link" onClick={() => setIsBillingModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      )}

      {isFeaturesModalOpen && featuresModalWorkspace && (
        <Modal
          isOpen
          onClose={() => setIsFeaturesModalOpen(false)}
          variant="small"
          aria-label="Available features"
        >
          <ModalHeader
            title="Available features"
            description={featuresModalWorkspace.name}
          />
          <ModalBody>
            {getWorkspaceFeatures(featuresModalWorkspace.id).length > 0 ? (
              getWorkspaceFeatures(featuresModalWorkspace.id).map((feat, i) => (
                <div key={feat} style={{ padding: '12px 0', borderBottom: i < getWorkspaceFeatures(featuresModalWorkspace.id).length - 1 ? '1px solid var(--pf-t--global--border--color--default)' : undefined }}>
                  {feat}
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No features configured for this workspace.</p>
            )}
          </ModalBody>
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
                    <Button variant="link" isInline onClick={() => openFeaturesModal(ws)}>{getWorkspaceFeatures(ws.id).length}</Button>
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

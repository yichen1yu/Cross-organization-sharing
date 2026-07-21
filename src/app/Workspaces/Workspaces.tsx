import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  Flex,
  FlexItem,
  PageSection,
  Tab,
  TabTitleText,
  Tabs,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Checkbox,
  Modal,
  Radio,
  TextInput,
  Pagination,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton
} from '@patternfly/react-core';
import { AlertGroup, Alert, AlertActionCloseButton, Popover } from '@patternfly/react-core';
 
import { Wizard, WizardStep, WizardHeader } from '@patternfly/react-core';
import { EllipsisVIcon, ExternalLinkAltIcon, FilterIcon, SyncAltIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';

type WorkspaceMeta = {
  name: string;
  hierarchy: { name: string; path?: string }[];
};

const workspaceData: Record<string, WorkspaceMeta> = {
  'uxd': {
    name: 'Pinnacle Corp',
    hierarchy: [{ name: 'Pinnacle Corp' }],
  },
  'workspace-default': {
    name: 'Workspace default',
    hierarchy: [{ name: 'Pinnacle Corp', path: '/workspaces/uxd' }, { name: 'Workspace default' }],
  },
  'workspace-ungrouped-hosts': {
    name: 'Workspace Ungrouped Hosts',
    hierarchy: [{ name: 'Pinnacle Corp', path: '/workspaces/uxd' }, { name: 'Workspace default', path: '/workspaces/workspace-default' }, { name: 'Workspace Ungrouped Hosts' }],
  },
  'workspace-a': {
    name: 'Workspace A',
    hierarchy: [{ name: 'Pinnacle Corp', path: '/workspaces/uxd' }, { name: 'Workspace default', path: '/workspaces/workspace-default' }, { name: 'Workspace A' }],
  },
  'workspace-b': {
    name: 'Workspace B',
    hierarchy: [{ name: 'Pinnacle Corp', path: '/workspaces/uxd' }, { name: 'Workspace default', path: '/workspaces/workspace-default' }, { name: 'Workspace B' }],
  },
  'workspace-c': {
    name: 'Workspace C',
    hierarchy: [{ name: 'Pinnacle Corp', path: '/workspaces/uxd' }, { name: 'Workspace default', path: '/workspaces/workspace-default' }, { name: 'Workspace C' }],
  },
};

type UserEntry = { name: string; org: string };
type GrantedRow = { groupName: string; description: string; users: number; roles: number; lastModified: string; rolesList: string[]; usersList: UserEntry[]; orgName?: string };

const initialGrantedByWorkspace: Record<string, GrantedRow[]> = {
  'workspace-a': [
    { groupName: 'Golden girls', description: 'Workspace administrators handling access approvals and settings', users: 4, roles: 2, lastModified: '2 days ago', rolesList: ['Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
    { groupName: 'Seattle Grace admins', description: 'Clinical admins overseeing user lifecycle, roles, and audits', users: 3, roles: 2, lastModified: '2 days ago', rolesList: ['User manager', 'Audit viewer'], usersList: [{ name: 'Harry Potter', org: 'Seattle Grace' }, { name: 'Ron Weasley', org: 'Seattle Grace' }, { name: 'Hermine Granger', org: 'Seattle Grace' }] },
    { groupName: 'Spice girls', description: 'Project members with standard access to dashboards and reports', users: 5, roles: 2, lastModified: '2 days ago', rolesList: ['Dashboard viewer', 'Report reader'], usersList: [{ name: 'Scary Spice', org: 'Pinnacle Corp' }, { name: 'Sporty Spice', org: 'Pinnacle Corp' }, { name: 'Baby Spice', org: 'Pinnacle Corp' }, { name: 'Ginger Spice', org: 'Pinnacle Corp' }, { name: 'Posh Spice', org: 'Pinnacle Corp' }] },
  ],
  'uxd': [
    { groupName: 'Golden girls', description: 'Org-wide administrators with full access', users: 4, roles: 3, lastModified: '1 day ago', rolesList: ['Organization administrator', 'Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
    { groupName: 'Powerpuff girls', description: 'Security and compliance oversight across all workspaces', users: 3, roles: 2, lastModified: '3 days ago', rolesList: ['Security auditor', 'Compliance reviewer'], usersList: [{ name: 'Blossom Utonium', org: 'Pinnacle Corp' }, { name: 'Bubbles Utonium', org: 'Pinnacle Corp' }, { name: 'Buttercup Utonium', org: 'Pinnacle Corp' }] },
    { groupName: 'Bad Bunnies', description: 'Platform engineering team with infrastructure access', users: 4, roles: 2, lastModified: '5 days ago', rolesList: ['Infrastructure admin', 'Cost manager'], usersList: [{ name: 'Benito Martinez', org: 'Pinnacle Corp' }, { name: 'DJ Luian', org: 'Pinnacle Corp' }, { name: 'Tainy Ocasio', org: 'Pinnacle Corp' }, { name: 'Mora Vega', org: 'Pinnacle Corp' }] },
  ],
  'workspace-default': [
    { groupName: 'Golden girls', description: 'Default workspace administrators', users: 4, roles: 2, lastModified: '1 day ago', rolesList: ['Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
    { groupName: 'Spice girls', description: 'General access for standard workspace operations', users: 5, roles: 1, lastModified: '3 days ago', rolesList: ['Dashboard viewer'], usersList: [{ name: 'Scary Spice', org: 'Pinnacle Corp' }, { name: 'Sporty Spice', org: 'Pinnacle Corp' }, { name: 'Baby Spice', org: 'Pinnacle Corp' }, { name: 'Ginger Spice', org: 'Pinnacle Corp' }, { name: 'Posh Spice', org: 'Pinnacle Corp' }] },
  ],
  'workspace-ungrouped-hosts': [
    { groupName: 'Powerpuff girls', description: 'Monitoring ungrouped hosts and triaging assignments', users: 3, roles: 1, lastModified: '12 hours ago', rolesList: ['Host manager'], usersList: [{ name: 'Blossom Utonium', org: 'Pinnacle Corp' }, { name: 'Bubbles Utonium', org: 'Pinnacle Corp' }, { name: 'Buttercup Utonium', org: 'Pinnacle Corp' }] },
    { groupName: 'Seattle Grace admins', description: 'Clinical systems ungrouped host oversight', users: 3, roles: 1, lastModified: '1 day ago', rolesList: ['Host viewer'], usersList: [{ name: 'Harry Potter', org: 'Seattle Grace' }, { name: 'Ron Weasley', org: 'Seattle Grace' }, { name: 'Hermine Granger', org: 'Seattle Grace' }] },
  ],
  'workspace-b': [
    { groupName: 'Bad Bunnies', description: 'Infrastructure provisioning and deployment pipelines', users: 4, roles: 2, lastModified: '1 day ago', rolesList: ['Deploy manager', 'Pipeline operator'], usersList: [{ name: 'Benito Martinez', org: 'Pinnacle Corp' }, { name: 'DJ Luian', org: 'Pinnacle Corp' }, { name: 'Tainy Ocasio', org: 'Pinnacle Corp' }, { name: 'Mora Vega', org: 'Pinnacle Corp' }] },
    { groupName: 'Golden girls', description: 'Workspace administrators handling approvals', users: 4, roles: 1, lastModified: '4 days ago', rolesList: ['Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
    { groupName: 'Spice girls', description: 'QA and testing team with report access', users: 5, roles: 1, lastModified: '2 days ago', rolesList: ['Report reader'], usersList: [{ name: 'Scary Spice', org: 'Pinnacle Corp' }, { name: 'Sporty Spice', org: 'Pinnacle Corp' }, { name: 'Baby Spice', org: 'Pinnacle Corp' }, { name: 'Ginger Spice', org: 'Pinnacle Corp' }, { name: 'Posh Spice', org: 'Pinnacle Corp' }] },
    { groupName: 'Cardiology admins', description: 'Cross-workspace access for cardiac monitoring systems', users: 2, roles: 1, lastModified: '6 hours ago', rolesList: ['System viewer'], usersList: [{ name: 'Cristina Yang', org: 'Cardiology' }, { name: 'Preston Burke', org: 'Cardiology' }] },
  ],
  'workspace-c': [
    { groupName: 'Powerpuff girls', description: 'Dev environment access and sandbox management', users: 3, roles: 2, lastModified: '8 hours ago', rolesList: ['Sandbox admin', 'Developer'], usersList: [{ name: 'Blossom Utonium', org: 'Pinnacle Corp' }, { name: 'Bubbles Utonium', org: 'Pinnacle Corp' }, { name: 'Buttercup Utonium', org: 'Pinnacle Corp' }] },
    { groupName: 'Operating room ops', description: 'Operational monitoring and incident response', users: 6, roles: 2, lastModified: '3 days ago', rolesList: ['Incident responder', 'Monitor viewer'], usersList: [{ name: 'Mark Sloan', org: 'Surgery' }, { name: 'Callie Torres', org: 'Surgery' }, { name: 'Arizona Robbins', org: 'Surgery' }, { name: 'Owen Hunt', org: 'Surgery' }, { name: 'April Kepner', org: 'Surgery' }, { name: 'Jackson Avery', org: 'Surgery' }] },
    { groupName: 'Seattle Grace admins', description: 'Clinical admin access for integration testing', users: 3, roles: 1, lastModified: '5 days ago', rolesList: ['Integration tester'], usersList: [{ name: 'Harry Potter', org: 'Seattle Grace' }, { name: 'Ron Weasley', org: 'Seattle Grace' }, { name: 'Hermine Granger', org: 'Seattle Grace' }] },
  ],
};

const persistentGrantedStore: Record<string, GrantedRow[]> = {};

function getGrantedRows(wsKey: string): GrantedRow[] {
  if (!persistentGrantedStore[wsKey]) {
    persistentGrantedStore[wsKey] = [...(initialGrantedByWorkspace[wsKey] || [])];
  }
  return persistentGrantedStore[wsKey];
}

const Workspaces: React.FunctionComponent = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const wsNavigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const wsMeta = workspaceData[workspaceId || 'workspace-a'] || workspaceData['workspace-a'];
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [roleTabKey, setRoleTabKey] = React.useState<string | number>(0);
  const [isMasterOpen, setIsMasterOpen] = React.useState(false);

  const handleTabClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };
  const handleRoleTabClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setRoleTabKey(tabIndex);
  };

  // Grant access wizard
  const [isGrantWizardOpen, setIsGrantWizardOpen] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.get('grantAccess') === 'true') {
      setIsGrantWizardOpen(true);
      searchParams.delete('grantAccess');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [acceptChoice, setAcceptChoice] = React.useState<'accept' | 'reject' | null>(null);
  const [verifyEmail, setVerifyEmail] = React.useState<string>('');
  const myOrgName = 'Pinnacle Corp';
  const [grantWhere, setGrantWhere] = React.useState<'within' | 'outside' | null>(null);
  const [isTrustedOpen, setIsTrustedOpen] = React.useState(false);
  const [selectedTrustedOrg, setSelectedTrustedOrg] = React.useState<string | null>(null);
  // Main page: granted access rows — data moved to module scope for persistence

  const initialGrantedByWorkspace: Record<string, GrantedRow[]> = {
    'workspace-a': [
      { groupName: 'Golden girls', description: 'Workspace administrators handling access approvals and settings', users: 4, roles: 2, lastModified: '2 days ago', rolesList: ['Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
      { groupName: 'Seattle Grace admins', description: 'Clinical admins overseeing user lifecycle, roles, and audits', users: 3, roles: 2, lastModified: '2 days ago', rolesList: ['User manager', 'Audit viewer'], usersList: [{ name: 'Harry Potter', org: 'Seattle Grace' }, { name: 'Ron Weasley', org: 'Seattle Grace' }, { name: 'Hermine Granger', org: 'Seattle Grace' }] },
      { groupName: 'Spice girls', description: 'Project members with standard access to dashboards and reports', users: 5, roles: 2, lastModified: '2 days ago', rolesList: ['Dashboard viewer', 'Report reader'], usersList: [{ name: 'Scary Spice', org: 'Pinnacle Corp' }, { name: 'Sporty Spice', org: 'Pinnacle Corp' }, { name: 'Baby Spice', org: 'Pinnacle Corp' }, { name: 'Ginger Spice', org: 'Pinnacle Corp' }, { name: 'Posh Spice', org: 'Pinnacle Corp' }] },
    ],
    'uxd': [
      { groupName: 'Golden girls', description: 'Org-wide administrators with full access', users: 4, roles: 3, lastModified: '1 day ago', rolesList: ['Organization administrator', 'Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
      { groupName: 'Powerpuff girls', description: 'Security and compliance oversight across all workspaces', users: 3, roles: 2, lastModified: '3 days ago', rolesList: ['Security auditor', 'Compliance reviewer'], usersList: [{ name: 'Blossom Utonium', org: 'Pinnacle Corp' }, { name: 'Bubbles Utonium', org: 'Pinnacle Corp' }, { name: 'Buttercup Utonium', org: 'Pinnacle Corp' }] },
      { groupName: 'Bad Bunnies', description: 'Platform engineering team with infrastructure access', users: 4, roles: 2, lastModified: '5 days ago', rolesList: ['Infrastructure admin', 'Cost manager'], usersList: [{ name: 'Benito Martinez', org: 'Pinnacle Corp' }, { name: 'DJ Luian', org: 'Pinnacle Corp' }, { name: 'Tainy Ocasio', org: 'Pinnacle Corp' }, { name: 'Mora Vega', org: 'Pinnacle Corp' }] },
    ],
    'workspace-default': [
      { groupName: 'Golden girls', description: 'Default workspace administrators', users: 4, roles: 2, lastModified: '1 day ago', rolesList: ['Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
      { groupName: 'Spice girls', description: 'General access for standard workspace operations', users: 5, roles: 1, lastModified: '3 days ago', rolesList: ['Dashboard viewer'], usersList: [{ name: 'Scary Spice', org: 'Pinnacle Corp' }, { name: 'Sporty Spice', org: 'Pinnacle Corp' }, { name: 'Baby Spice', org: 'Pinnacle Corp' }, { name: 'Ginger Spice', org: 'Pinnacle Corp' }, { name: 'Posh Spice', org: 'Pinnacle Corp' }] },
    ],
    'workspace-ungrouped-hosts': [
      { groupName: 'Powerpuff girls', description: 'Monitoring ungrouped hosts and triaging assignments', users: 3, roles: 1, lastModified: '12 hours ago', rolesList: ['Host manager'], usersList: [{ name: 'Blossom Utonium', org: 'Pinnacle Corp' }, { name: 'Bubbles Utonium', org: 'Pinnacle Corp' }, { name: 'Buttercup Utonium', org: 'Pinnacle Corp' }] },
      { groupName: 'Seattle Grace admins', description: 'Clinical systems ungrouped host oversight', users: 3, roles: 1, lastModified: '1 day ago', rolesList: ['Host viewer'], usersList: [{ name: 'Harry Potter', org: 'Seattle Grace' }, { name: 'Ron Weasley', org: 'Seattle Grace' }, { name: 'Hermine Granger', org: 'Seattle Grace' }] },
    ],
    'workspace-b': [
      { groupName: 'Bad Bunnies', description: 'Infrastructure provisioning and deployment pipelines', users: 4, roles: 2, lastModified: '1 day ago', rolesList: ['Deploy manager', 'Pipeline operator'], usersList: [{ name: 'Benito Martinez', org: 'Pinnacle Corp' }, { name: 'DJ Luian', org: 'Pinnacle Corp' }, { name: 'Tainy Ocasio', org: 'Pinnacle Corp' }, { name: 'Mora Vega', org: 'Pinnacle Corp' }] },
      { groupName: 'Golden girls', description: 'Workspace administrators handling approvals', users: 4, roles: 1, lastModified: '4 days ago', rolesList: ['Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
      { groupName: 'Spice girls', description: 'QA and testing team with report access', users: 5, roles: 1, lastModified: '2 days ago', rolesList: ['Report reader'], usersList: [{ name: 'Scary Spice', org: 'Pinnacle Corp' }, { name: 'Sporty Spice', org: 'Pinnacle Corp' }, { name: 'Baby Spice', org: 'Pinnacle Corp' }, { name: 'Ginger Spice', org: 'Pinnacle Corp' }, { name: 'Posh Spice', org: 'Pinnacle Corp' }] },
      { groupName: 'Cardiology admins', description: 'Cross-workspace access for cardiac monitoring systems', users: 2, roles: 1, lastModified: '6 hours ago', rolesList: ['System viewer'], usersList: [{ name: 'Cristina Yang', org: 'Cardiology' }, { name: 'Preston Burke', org: 'Cardiology' }] },
    ],
    'workspace-c': [
      { groupName: 'Powerpuff girls', description: 'Dev environment access and sandbox management', users: 3, roles: 2, lastModified: '8 hours ago', rolesList: ['Sandbox admin', 'Developer'], usersList: [{ name: 'Blossom Utonium', org: 'Pinnacle Corp' }, { name: 'Bubbles Utonium', org: 'Pinnacle Corp' }, { name: 'Buttercup Utonium', org: 'Pinnacle Corp' }] },
      { groupName: 'Operating room ops', description: 'Operational monitoring and incident response', users: 6, roles: 2, lastModified: '3 days ago', rolesList: ['Incident responder', 'Monitor viewer'], usersList: [{ name: 'Mark Sloan', org: 'Surgery' }, { name: 'Callie Torres', org: 'Surgery' }, { name: 'Arizona Robbins', org: 'Surgery' }, { name: 'Owen Hunt', org: 'Surgery' }, { name: 'April Kepner', org: 'Surgery' }, { name: 'Jackson Avery', org: 'Surgery' }] },
      { groupName: 'Seattle Grace admins', description: 'Clinical admin access for integration testing', users: 3, roles: 1, lastModified: '5 days ago', rolesList: ['Integration tester'], usersList: [{ name: 'Harry Potter', org: 'Seattle Grace' }, { name: 'Ron Weasley', org: 'Seattle Grace' }, { name: 'Hermine Granger', org: 'Seattle Grace' }] },
    ],
  };

  const parentGrantedByWorkspace: Record<string, GrantedRow[]> = {
    'workspace-a': [
      { groupName: 'Cardiology admins', description: 'Manage cardiac imaging access, approvals, and workspace settings', users: 2, roles: 1, lastModified: '6 hours ago', rolesList: ['Workspace administrator'], usersList: [{ name: 'Cristina Yang', org: 'Cardiology' }, { name: 'Preston Burke', org: 'Cardiology' }] },
      { groupName: 'Radiology viewers', description: 'Read‑only access to imaging dashboards and reports', users: 8, roles: 1, lastModified: '1 day ago', rolesList: ['Report reader'], usersList: [{ name: 'Meredith Grey', org: 'Radiology' }, { name: 'Derek Shepherd', org: 'Radiology' }, { name: 'Alex Karev', org: 'Radiology' }, { name: 'Izzie Stevens', org: 'Radiology' }, { name: 'George O\'Malley', org: 'Radiology' }, { name: 'Miranda Bailey', org: 'Radiology' }, { name: 'Richard Webber', org: 'Radiology' }, { name: 'Addison Montgomery', org: 'Radiology' }] },
      { groupName: 'Operating room ops', description: 'Operational runbooks, device integrations, and audit oversight', users: 6, roles: 2, lastModified: '4 days ago', rolesList: ['Operations manager', 'Audit viewer'], usersList: [{ name: 'Mark Sloan', org: 'Surgery' }, { name: 'Callie Torres', org: 'Surgery' }, { name: 'Arizona Robbins', org: 'Surgery' }, { name: 'Owen Hunt', org: 'Surgery' }, { name: 'April Kepner', org: 'Surgery' }, { name: 'Jackson Avery', org: 'Surgery' }] },
    ],
    'uxd': [],
    'workspace-default': [
      { groupName: 'Golden girls', description: 'Org-wide administrators inherited from Pinnacle Corp root', users: 4, roles: 3, lastModified: '1 day ago', rolesList: ['Organization administrator', 'Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
      { groupName: 'Bad Bunnies', description: 'Platform engineering inherited from Pinnacle Corp root', users: 4, roles: 2, lastModified: '5 days ago', rolesList: ['Infrastructure admin', 'Cost manager'], usersList: [{ name: 'Benito Martinez', org: 'Pinnacle Corp' }, { name: 'DJ Luian', org: 'Pinnacle Corp' }, { name: 'Tainy Ocasio', org: 'Pinnacle Corp' }, { name: 'Mora Vega', org: 'Pinnacle Corp' }] },
    ],
    'workspace-ungrouped-hosts': [
      { groupName: 'Golden girls', description: 'Inherited default workspace administrators', users: 4, roles: 2, lastModified: '1 day ago', rolesList: ['Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
      { groupName: 'Spice girls', description: 'Inherited general access from parent workspace', users: 5, roles: 1, lastModified: '3 days ago', rolesList: ['Dashboard viewer'], usersList: [{ name: 'Scary Spice', org: 'Pinnacle Corp' }, { name: 'Sporty Spice', org: 'Pinnacle Corp' }, { name: 'Baby Spice', org: 'Pinnacle Corp' }, { name: 'Ginger Spice', org: 'Pinnacle Corp' }, { name: 'Posh Spice', org: 'Pinnacle Corp' }] },
    ],
    'workspace-b': [
      { groupName: 'Golden girls', description: 'Default workspace administrators inherited from parent', users: 4, roles: 2, lastModified: '1 day ago', rolesList: ['Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
      { groupName: 'Spice girls', description: 'Inherited general access from Workspace default', users: 5, roles: 1, lastModified: '3 days ago', rolesList: ['Dashboard viewer'], usersList: [{ name: 'Scary Spice', org: 'Pinnacle Corp' }, { name: 'Sporty Spice', org: 'Pinnacle Corp' }, { name: 'Baby Spice', org: 'Pinnacle Corp' }, { name: 'Ginger Spice', org: 'Pinnacle Corp' }, { name: 'Posh Spice', org: 'Pinnacle Corp' }] },
    ],
    'workspace-c': [
      { groupName: 'Golden girls', description: 'Default workspace administrators inherited from parent', users: 4, roles: 2, lastModified: '1 day ago', rolesList: ['Workspace administrator', 'Approver'], usersList: [{ name: 'Sophia Petrillo', org: 'Pinnacle Corp' }, { name: 'Dorothy Zbornak', org: 'Pinnacle Corp' }, { name: 'Rose Nylund', org: 'Pinnacle Corp' }, { name: 'Blanche Devereaux', org: 'Pinnacle Corp' }] },
    ],
  };

  const wsKey = workspaceId || 'workspace-a';
  const [grantedRows, setGrantedRowsLocal] = React.useState<GrantedRow[]>(() => getGrantedRows(wsKey));
  const setGrantedRows = React.useCallback((updater: GrantedRow[] | ((prev: GrantedRow[]) => GrantedRow[])) => {
    setGrantedRowsLocal((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persistentGrantedStore[wsKey] = next;
      return next;
    });
  }, [wsKey]);
  const [parentGrantedRows] = React.useState<GrantedRow[]>(parentGrantedByWorkspace[wsKey] || []);

  const groupNames = grantedRows.map((r) => r.groupName);
  const [selectedRowIds, setSelectedRowIds] = React.useState<Set<number>>(new Set());
  const areAllSelected = groupNames.length > 0 && selectedRowIds.size === groupNames.length;
  const areSomeSelected = selectedRowIds.size > 0 && selectedRowIds.size < groupNames.length;
  const onToggleAll = (checked: boolean) => {
    if (checked) setSelectedRowIds(new Set(groupNames.map((_, idx) => idx)));
    else setSelectedRowIds(new Set());
  };
  const onToggleRow = (idx: number, checked: boolean) => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(idx); else next.delete(idx);
      return next;
    });
  };

  const parentGroupNames = parentGrantedRows.map((r) => r.groupName);
  const [parentSelectedRowIds, setParentSelectedRowIds] = React.useState<Set<number>>(new Set());
  const areAllParentSelected = parentGroupNames.length > 0 && parentSelectedRowIds.size === parentGroupNames.length;
  const areSomeParentSelected = parentSelectedRowIds.size > 0 && parentSelectedRowIds.size < parentGroupNames.length;
  const [isParentMasterOpen, setIsParentMasterOpen] = React.useState(false);
  const onToggleAllParent = (checked: boolean) => {
    if (checked) setParentSelectedRowIds(new Set(parentGroupNames.map((_, idx) => idx)));
    else setParentSelectedRowIds(new Set());
  };
  const onToggleParentRow = (idx: number, checked: boolean) => {
    setParentSelectedRowIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(idx); else next.delete(idx);
      return next;
    });
  };

  // Side panel state for group details
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = React.useState(false);
  const [detailsPanelRow, setDetailsPanelRow] = React.useState<GrantedRow | null>(null);
  const [detailsPanelTab, setDetailsPanelTab] = React.useState<string | number>(0);
  const openDetails = (row: GrantedRow) => {
    setDetailsPanelRow(row);
    setDetailsPanelTab(0);
    setIsDetailsPanelOpen(true);
  };
  const closeDetails = () => {
    setIsDetailsPanelOpen(false);
  };
  const trustedOrgNames = ['Acme Corp', 'Globell', 'Initech', 'Umbrella', 'Soylent'];
  // Wizard step 2 selection (user groups table) — varies by selected trusted org
  const wizardGroupsByOrg: Record<string, { names: string[]; members: number[] }> = {
    'Globell': { names: ['Engineering leads', 'Product managers', 'Design ops', 'QA engineers', 'DevOps'], members: [8, 4, 3, 6, 5] },
    'Acme Corp': { names: ['Sales ops', 'Account managers', 'Support team', 'Logistics', 'Billing admins'], members: [6, 4, 8, 3, 2] },
    'Initech': { names: ['Platform team', 'Security ops', 'Data analysts', 'SRE team'], members: [6, 3, 9, 4] },
    'Umbrella': { names: ['Research leads', 'Lab techs', 'Field agents', 'Compliance'], members: [4, 8, 5, 2] },
    'Soylent': { names: ['Operations', 'Supply chain', 'Marketing', 'Customer success', 'Finance'], members: [7, 3, 5, 4, 2] },
  };
  const defaultGroups = { names: ['Administrators', 'Powerpuff Girls', 'Spice Girls', 'Golden Girls', 'Bad Bunnies'], members: [3, 5, 7, 2, 4] };
  const groupDescriptions: Record<string, string> = {
    'Engineering leads': 'Technical leadership overseeing engineering projects and architecture decisions',
    'Product managers': 'Product strategy, roadmap planning, and feature prioritization',
    'Design ops': 'Design system management and UX process coordination',
    'QA engineers': 'Quality assurance testing, automation, and release validation',
    'DevOps': 'CI/CD pipelines, infrastructure automation, and deployment management',
    'Sales ops': 'Sales process optimization and CRM administration',
    'Account managers': 'Client relationship management and account growth',
    'Support team': 'Customer support, ticket resolution, and escalation handling',
    'Logistics': 'Supply chain coordination and delivery management',
    'Billing admins': 'Invoice processing, payment management, and billing inquiries',
    'Platform team': 'Core platform infrastructure and shared services',
    'Security ops': 'Security monitoring, incident response, and compliance',
    'Data analysts': 'Data reporting, business intelligence, and analytics',
    'SRE team': 'Site reliability, uptime monitoring, and incident management',
    'Administrator': 'Full administrative access and organization settings',
    'Research leads': 'Research project oversight and experimental planning',
    'Lab techs': 'Laboratory operations and technical equipment management',
    'Field agents': 'On-site operations and field data collection',
    'Compliance': 'Regulatory compliance monitoring and audit preparation',
    'Operations': 'Day-to-day operational management and process oversight',
    'Supply chain': 'Vendor coordination and supply chain logistics',
    'Marketing': 'Marketing campaigns, content strategy, and brand management',
    'Customer success': 'Customer onboarding, retention, and satisfaction',
    'Finance': 'Financial planning, budgeting, and expense management',
    'Administrators': 'Organization-wide administrative access and settings',
    'Powerpuff Girls': 'Cross-functional team for special projects and initiatives',
    'Spice Girls': 'Collaboration group for inter-department coordination',
    'Golden Girls': 'Workspace administrators handling access approvals and settings',
    'Bad Bunnies': 'Experimental projects and innovation sandbox team',
  };
  const currentOrgGroups = wizardGroupsByOrg[selectedTrustedOrg || ''] || defaultGroups;
  const wizardUserGroups = currentOrgGroups.names;
  const wizardMembers = currentOrgGroups.members;
  const [selectedWizardGroups, setSelectedWizardGroups] = React.useState<Set<number>>(new Set());
  const wizardAllSelected = selectedWizardGroups.size === wizardUserGroups.length;
  const wizardSomeSelected = selectedWizardGroups.size > 0 && selectedWizardGroups.size < wizardUserGroups.length;
  const onWizardSelectAll = (checked: boolean) => {
    if (checked) setSelectedWizardGroups(new Set(wizardUserGroups.map((_, idx) => idx)));
    else setSelectedWizardGroups(new Set());
  };

  // Wizard step 3: roles table state
  type RoleRow = { name: string; description: string; permissions: number; permissionNames: string[] };
  const allRoles: RoleRow[] = [
    { name: 'RHEL Admin', description: 'Manage RHEL subscriptions, repositories, and system configurations', permissions: 3, permissionNames: ['rhel:subscriptions:write', 'rhel:repositories:write', 'rhel:configurations:write'] },
    { name: 'OpenShift Reviewer', description: 'View OpenShift cluster details, deployments, and usage reports', permissions: 4, permissionNames: ['openshift:clusters:read', 'openshift:deployments:read', 'openshift:usage:read', 'openshift:reports:read'] },
    { name: 'Ansible Reviewer', description: 'View Ansible automation jobs, inventories, and execution history', permissions: 3, permissionNames: ['ansible:jobs:read', 'ansible:inventories:read', 'ansible:history:read'] },
    { name: 'Automation Analytics Administrator', description: 'Full control over automation analytics settings, dashboards, and data exports', permissions: 1, permissionNames: ['automation-analytics:*:*'] },
    { name: 'Automation Analytics Editor', description: 'Create and modify automation analytics reports, charts, and saved queries', permissions: 6, permissionNames: ['automation-analytics:reports:write', 'automation-analytics:charts:write', 'automation-analytics:queries:write', 'automation-analytics:reports:read', 'automation-analytics:charts:read', 'automation-analytics:queries:read'] },
    { name: 'Automation Analytics Viewer', description: 'View automation analytics dashboards, reports, and usage trends', permissions: 7, permissionNames: ['automation-analytics:dashboards:read', 'automation-analytics:reports:read', 'automation-analytics:trends:read', 'automation-analytics:usage:read', 'automation-analytics:charts:read', 'automation-analytics:queries:read', 'automation-analytics:exports:read'] },
    { name: 'Automation Services Catalog administrator', description: 'Manage catalog items, approval workflows, and order fulfillment settings', permissions: 3, permissionNames: ['catalog:items:write', 'catalog:approvals:write', 'catalog:orders:write'] }
  ];
  const [roleFilter, setRoleFilter] = React.useState('');
  const [selectedRoles, setSelectedRoles] = React.useState<Set<string>>(new Set());
  const [rolesPage, setRolesPage] = React.useState(1);
  const [rolesPerPage, setRolesPerPage] = React.useState(10);
  const filteredRoles = React.useMemo(
    () => allRoles.filter(r => r.name.toLowerCase().includes(roleFilter.trim().toLowerCase())),
    [roleFilter]
  );
  const rolesStart = (rolesPage - 1) * rolesPerPage;
  const rolesPageRows = filteredRoles.slice(rolesStart, rolesStart + rolesPerPage);
  const rolesAllSelected = filteredRoles.length > 0 && selectedRoles.size === filteredRoles.length;
  const rolesSomeSelected = selectedRoles.size > 0 && selectedRoles.size < filteredRoles.length;
  const onToggleAllRoles = (checked: boolean) => {
    if (checked) setSelectedRoles(new Set(filteredRoles.map(r => r.name)));
    else setSelectedRoles(new Set());
  };
  const onToggleRoleRow = (roleName: string, checked: boolean) => {
    setSelectedRoles(prev => {
      const next = new Set(prev);
      if (checked) next.add(roleName); else next.delete(roleName);
      return next;
    });
  };
  const onWizardToggleRow = (idx: number, checked: boolean) => {
    setSelectedWizardGroups(prev => {
      const next = new Set(prev);
      if (checked) next.add(idx); else next.delete(idx);
      return next;
    });
  };

  // Toasts for success messages
  type ToastItem = { id: number; title: string; description?: React.ReactNode };
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const addToast = (title: string, description?: React.ReactNode) => {
    setToasts(prev => [
      ...prev,
      { id: Date.now() + Math.floor(Math.random() * 1000), title, description }
    ]);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <>
      {/* Toasts */}
      <AlertGroup isToast isLiveRegion>
        {toasts.map(t => (
          <Alert key={t.id} variant="success" title={t.title} actionClose={<AlertActionCloseButton onClose={() => removeToast(t.id)} />}>
            {t.description}
          </Alert>
        ))}
      </AlertGroup>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Identity & Access Management</BreadcrumbItem>
          <BreadcrumbItem>User Access</BreadcrumbItem>
          <BreadcrumbItem render={() => <Link to="/workspaces">Workspaces</Link>} />
          <BreadcrumbItem isActive>{wsMeta.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      
      {isGrantWizardOpen && (
        <Modal isOpen onClose={() => setIsGrantWizardOpen(false)} variant="large" aria-label="Grant access wizard" className="trusted-wizard-modal">
          <Wizard
            onClose={() => setIsGrantWizardOpen(false)}
            onSave={() => {
              // Create one row per selected group, using a simple mapping to Users/Roles counts
              const mockFirstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Jamie', 'Quinn', 'Sage', 'Dakota', 'Skyler'];
              const mockLastNames = ['Chen', 'Patel', 'Kim', 'Lopez', 'Singh', 'Nguyen', 'Müller', 'Tanaka', 'Costa', 'Johansson', 'Ali', 'Novak'];
              const orgName = grantWhere === 'outside' && selectedTrustedOrg ? selectedTrustedOrg : myOrgName;
              const newRows: GrantedRow[] = Array.from(selectedWizardGroups).map(idx => {
                const memberCount = wizardMembers[idx] ?? 1;
                const users: UserEntry[] = Array.from({ length: memberCount }).map((_, i) => ({
                  name: `${mockFirstNames[(idx * 3 + i) % mockFirstNames.length]} ${mockLastNames[(idx * 5 + i) % mockLastNames.length]}`,
                  org: orgName,
                }));
                return {
                  groupName: wizardUserGroups[idx],
                  description: groupDescriptions[wizardUserGroups[idx]] || 'User group for workspace access',
                  users: memberCount,
                  roles: selectedRoles.size || 1,
                  lastModified: 'Just now',
                  rolesList: Array.from(selectedRoles),
                  usersList: users,
                  orgName,
                };
              });
              setGrantedRows(prev => [...prev, ...newRows]);
              const firstGroupIdx = Array.from(selectedWizardGroups)[0];
              const groupName = typeof firstGroupIdx === 'number' ? wizardUserGroups[firstGroupIdx] : 'selected group';
              addToast(`You successfully granted access to ${groupName}.`);
              setIsGrantWizardOpen(false);
            }}
            header={
              <WizardHeader
                title={`Grant access to Workspace A`}
                description="Review and configure access."
                onClose={() => setIsGrantWizardOpen(false)}
              />
            }
            startIndex={1}
          >
            <WizardStep id="grant-step-1" name="Where are you granting access?" footer={{ isBackHidden: true, isNextDisabled: grantWhere === null || (grantWhere === 'outside' && !selectedTrustedOrg) }}>
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Where are you granting access?</Title>
                <p style={{ marginTop: 8 }}>Select where you wish to grant access.</p>
                <div style={{ marginTop: 16 }}>
                  <Radio
                    id="grant-where-within"
                    name="grant-where"
                    isChecked={grantWhere === 'within'}
                    onChange={() => setGrantWhere('within')}
                    label={`Within ${myOrgName} organization`}
                  />
                  <Radio
                    id="grant-where-outside"
                    name="grant-where"
                    isChecked={grantWhere === 'outside'}
                    onChange={() => setGrantWhere('outside')}
                    label={`Outside of this organization`}
                    style={{ marginTop: 0 }}
                  />
                </div>

                <div style={{ marginTop: 16 }}>
                  <Title headingLevel="h4" size="md" style={{ fontWeight: 700 }}>Select a trusted organization</Title>
                  <div style={{ marginTop: 8 }}>
                    <Dropdown
                      isOpen={isTrustedOpen}
                      onOpenChange={setIsTrustedOpen}
                      onSelect={(_e, itemId) => {
                        const name = String(itemId ?? '');
                        if (name) { setSelectedTrustedOrg(name); setSelectedWizardGroups(new Set()); }
                        setIsTrustedOpen(false);
                      }}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          isExpanded={isTrustedOpen}
                          isDisabled={grantWhere !== 'outside'}
                          style={{ width: '100%', justifyContent: 'space-between' }}
                          onClick={() => grantWhere === 'outside' && setIsTrustedOpen((prev) => !prev)}
                        >
                          {selectedTrustedOrg || 'Choose an organization'}
                        </MenuToggle>
                    )}
                    popperProps={{ appendTo: () => document.body }}
                    >
                      <DropdownList>
                        {trustedOrgNames.map((name) => (
                          <DropdownItem key={name} itemId={name} isSelected={selectedTrustedOrg === name}>
                            {name}
                          </DropdownItem>
                        ))}
                      </DropdownList>
                    </Dropdown>
                  </div>
                  <p style={{ marginTop: 8, color: 'var(--pf-v6-global--palette--black-700)' }}>
                    Don’t see the trusted org you need? 
                    <a href="/organization/trusted-organizations?tab=incoming">Check the incoming trusted organization connection requests.</a>
                  </p>
                </div>
            </div>
            </WizardStep>
            <WizardStep id="grant-step-2" name="Select user group(s)" isDisabled={grantWhere === null || (grantWhere === 'outside' && !selectedTrustedOrg)} footer={{ isNextDisabled: selectedWizardGroups.size === 0 }}>
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Select user group(s) you want to grant access to</Title>
                <p style={{ marginTop: 8 }}>
                  Select the user group(s) you wish to grant access to. If you don’t see the group you wish to select, you must create a new group in
                  {' '}<a href="#">User and user groups</a>{' '}<ExternalLinkAltIcon style={{ verticalAlign: 'middle' }} />
                </p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Dropdown
                    isOpen={false}
                    onOpenChange={() => {}}
                    toggle={(toggleRef) => (
                      <MenuToggle ref={toggleRef} isExpanded={false} icon={<FilterIcon />} style={{ minWidth: 160 }}>
                        User group name
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem>User group name</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                  <SearchInput aria-label="Filter by User group name" placeholder="Filter by User group name" value={''} onChange={() => {}} onClear={() => {}} />
                  <Button variant="primary" icon={<ExternalLinkAltIcon />} iconPosition="end">Add group</Button>
                  <Button variant="plain" aria-label="refresh"><SyncAltIcon /></Button>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Table aria-label="Select user groups table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox
                            id="wizard-ug-select-all"
                            aria-label="Select all user groups"
                            isChecked={wizardAllSelected}
                            onChange={(_e, checked) => onWizardSelectAll(!!checked)}
                          />
                        </Th>
                        <Th>User group name</Th>
                        <Th>Members</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {wizardUserGroups.map((name, idx) => (
                        <Tr key={name}>
                          <Td>
                            <Checkbox
                              id={`sel-ug-${idx}`}
                              aria-label={`Select ${name}`}
                              isChecked={selectedWizardGroups.has(idx)}
                              onChange={(_e, checked) => onWizardToggleRow(idx, !!checked)}
                            />
                          </Td>
                          <Td>{name}</Td>
                          <Td>{wizardMembers[idx]}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </WizardStep>
            <WizardStep id="grant-step-3" name="Select role(s)" isDisabled={grantWhere === null || (grantWhere === 'outside' && !selectedTrustedOrg) || selectedWizardGroups.size === 0} footer={{ isNextDisabled: selectedRoles.size === 0 }}>
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Select role(s)</Title>
                <p style={{ marginTop: 8 }}>Select one or more roles to link to this group.</p>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <SearchInput aria-label="Filter by role name" placeholder="Filter by role name" value={roleFilter} onChange={(_e, v) => setRoleFilter(v)} onClear={() => setRoleFilter('')} />
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{ marginRight: 8 }}> {rolesStart + 1} - {Math.min(rolesStart + rolesPerPage, filteredRoles.length)} of {filteredRoles.length} </span>
                    <Pagination
                      itemCount={filteredRoles.length}
                      perPage={rolesPerPage}
                      page={rolesPage}
                      onSetPage={(_e, p) => setRolesPage(p)}
                      onPerPageSelect={(_e, pp) => { setRolesPerPage(pp); setRolesPage(1); }}
                      variant="top"
                      isCompact
                    />
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Table aria-label="Select roles table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox
                            id="roles-select-all"
                            aria-label="Select all roles"
                            isChecked={rolesAllSelected}
                            onChange={(_e, checked) => onToggleAllRoles(!!checked)}
                          />
                        </Th>
                        <Th width={20}>Name</Th>
                        <Th width={50}>Description</Th>
                        <Th width={15}>Permissions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {rolesPageRows.map((role) => {
                        return (
                          <Tr key={role.name} style={{ verticalAlign: 'middle' }}>
                            <Td>
                              <Checkbox id={`role-${role.name}`} aria-label={`Select ${role.name}`} isChecked={selectedRoles.has(role.name)} onChange={(_e, checked) => onToggleRoleRow(role.name, !!checked)} />
                            </Td>
                            <Td>{role.name}</Td>
                            <Td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{role.description}</Td>
                            <Td>
                              <Popover
                                headerContent={`Permissions for ${role.name}`}
                                bodyContent={
                                  <div>
                                    {role.permissionNames.map((p, i) => (
                                      <div key={i} style={{ padding: '4px 0' }}>{p}</div>
                                    ))}
                                  </div>
                                }
                              >
                                <Button variant="link" isInline>{role.permissions}</Button>
                              </Popover>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </WizardStep>
            <WizardStep id="grant-step-4" name="Review" isDisabled={grantWhere === null || (grantWhere === 'outside' && !selectedTrustedOrg) || selectedWizardGroups.size === 0 || selectedRoles.size === 0} footer={{ nextButtonText: 'Submit' }}>
              <div style={{ padding: 16 }}>
                <Title headingLevel="h3" size="lg">Review</Title>
                <p style={{ marginTop: 8 }}>
                  Granting access {grantWhere === 'outside' ? 'outside of this organization' : 'within this organization'}
                </p>
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', rowGap: 12 }}>
                    <div style={{ fontWeight: 700 }}>Trusted Org</div>
                    <div>{grantWhere === 'outside' ? (selectedTrustedOrg || '-') : myOrgName}</div>
                    <div style={{ fontWeight: 700 }}>Group(s)</div>
                    <div>{Array.from(selectedWizardGroups).sort((a,b)=>a-b).map(idx => wizardUserGroups[idx]).join(', ') || '-'}</div>
                    <div style={{ fontWeight: 700 }}>Role(s)</div>
                    <div>{Array.from(selectedRoles).join(', ') || '-'}</div>
                  </div>
                </div>
              </div>
            </WizardStep>
          </Wizard>
        </Modal>
      )}

      {/* Details side panel removed by request */}

      <PageSection hasBodyWrapper={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title headingLevel="h1" size="2xl">{wsMeta.name}</Title>
            <Content>
              <p style={{ margin: 0, color: '#6a6e73' }}>Manage workspace details and settings.</p>
              <p style={{ marginTop: '4px', color: '#6a6e73' }}>
                <strong>Workspace Hierarchy:</strong>{' '}
                {wsMeta.hierarchy.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span>{' '}&gt;&nbsp;</span>}
                    {item.path ? (
                      <Button variant="link" isInline style={{ fontWeight: 700, padding: 0 }} onClick={() => wsNavigate(item.path!)}>{item.name}</Button>
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </Content>
          </div>
          <Button variant="primary" style={{ marginRight: 16 }} onClick={() => {
            setGrantWhere(null);
            setSelectedTrustedOrg(null);
            setSelectedWizardGroups(new Set());
            setSelectedRoles(new Set());
            setRoleFilter('');
            setRolesPage(1);
            setIsGrantWizardOpen(true);
          }}>Grant access</Button>
        </div>
      </PageSection>
      
      <PageSection hasBodyWrapper={false} isFilled style={{ paddingTop: 0 }}>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title={<TabTitleText>Role assignments</TabTitleText>}>
            <PageSection style={{ paddingTop: 8, paddingBottom: 0 }}>
              <Tabs activeKey={roleTabKey} onSelect={handleRoleTabClick}>
                <Tab eventKey={0} title={<TabTitleText>Roles assigned in this workspace</TabTitleText>}>
                 <Drawer isExpanded={isDetailsPanelOpen} isInline position="right" style={{ minHeight: 'calc(100vh - 220px)' }}>
                  <DrawerContent
                    panelContent={
                      <DrawerPanelContent defaultSize="400px" style={{ display: 'flex', flexDirection: 'column' }}>
                        <DrawerHead>
                          <Title headingLevel="h2" size="lg">{detailsPanelRow?.groupName}</Title>
                          <Content component="p" style={{ marginTop: 8 }}>This is a panel description. It is helpful.</Content>
                          <DrawerActions>
                            <Dropdown
                              isOpen={false}
                              onOpenChange={() => {}}
                              toggle={(toggleRef) => (
                                <MenuToggle ref={toggleRef} aria-label="Panel actions" variant="plain">
                                  <EllipsisVIcon />
                                </MenuToggle>
                              )}
                              popperProps={{ position: 'right' }}
                            >
                              <DropdownList>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem>Remove</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                            <DrawerCloseButton onClick={closeDetails} />
                          </DrawerActions>
                        </DrawerHead>
                        <DrawerContentBody>
                          <Tabs activeKey={detailsPanelTab} onSelect={(_e, key) => setDetailsPanelTab(key)}>
                            <Tab eventKey={0} title={<TabTitleText>Roles</TabTitleText>}>
                              <Table aria-label="Roles for group" variant="compact">
                                <Thead>
                                  <Tr>
                                    <Th>Roles</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {(detailsPanelRow?.rolesList || []).map((role, i) => (
                                    <Tr key={i}>
                                      <Td>{role}</Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </Tab>
                            <Tab eventKey={1} title={<TabTitleText>Users</TabTitleText>}>
                              <Table aria-label="Users in group" variant="compact">
                                <Thead>
                                  <Tr>
                                    <Th>Users</Th>
                                    <Th>Organization</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {(detailsPanelRow?.usersList || []).map((user, i) => (
                                    <Tr key={i}>
                                      <Td>{user.name}</Td>
                                      <Td>{user.org}</Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </Tab>
                          </Tabs>
                          <div style={{ padding: '16px' }}>
                            <Button variant="secondary">Edit access for this workspace</Button>
                          </div>
                        </DrawerContentBody>
                      </DrawerPanelContent>
                    }
                  >
                   <DrawerContentBody>
                  <PageSection style={{ paddingTop: 8, paddingBottom: 0 }}>
                    <Toolbar style={{ marginTop: 16 }}>
                      <ToolbarContent>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isMasterOpen}
                            onOpenChange={setIsMasterOpen}
                            toggle={(toggleRef) => (
                              <MenuToggle ref={toggleRef} isExpanded={isMasterOpen}>
                                <Checkbox
                                  id="toolbar-master-checkbox"
                                  aria-label="Select"
                                  isChecked={areAllSelected}
                                  onChange={(_e, checked) => onToggleAll(!!checked)}
                                />
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem onClick={() => { onToggleAll(true); setIsMasterOpen(false); }}>Select all</DropdownItem>
                              <DropdownItem onClick={() => { onToggleAll(false); setIsMasterOpen(false); }}>Deselect all</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Dropdown
                            isOpen={false}
                            onOpenChange={() => {}}
                            toggle={(toggleRef) => (
                              <MenuToggle ref={toggleRef} isExpanded={false} icon={null} style={{ minWidth: '220px' }}>
                                User name group
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem>User name group</DropdownItem>
                              <DropdownItem>Organization name</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                          <SearchInput aria-label={'Search'} placeholder={'Search'} value={''} onChange={() => {}} onClear={() => {}} />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>
                  </PageSection>
                  <PageSection style={{ paddingTop: 0 }}>
                    <Table aria-label="Role assignment groups table">
                      <Thead>
                        <Tr>
                          <Th aria-label="Row select" />
                          <Th width={35}>User group name</Th>
                          <Th width={25}>Description</Th>
                          <Th width={10}>Users</Th>
                          <Th width={10}>Roles</Th>
                          <Th width={20}>Last modified</Th>
                          <Th aria-label="Row actions"></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {grantedRows.map((row, idx) => (
                          <Tr key={`${row.groupName}-${idx}`}>
                            <Td>
                              <Checkbox
                                id={`select-group-${idx}`}
                                aria-label={`Select ${row.groupName}`}
                                isChecked={selectedRowIds.has(idx)}
                                onChange={(_e, checked) => onToggleRow(idx, !!checked)}
                              />
                            </Td>
                            <Td dataLabel="User group name" style={{ paddingRight: '32px' }}>
                              <Button variant="link" isInline onClick={() => openDetails(row)}>{row.groupName}</Button>
                            </Td>
                            <Td dataLabel="Description" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '520px' }}>
                              {row.description}
                            </Td>
                            <Td dataLabel="Users">{row.users}</Td>
                            <Td dataLabel="Roles">{row.roles}</Td>
                            <Td dataLabel="Last modified">{row.lastModified}</Td>
                            <Td isActionCell>
                              <Dropdown isOpen={false} onOpenChange={() => {}}
                                toggle={(toggleRef) => (
                                  <MenuToggle ref={toggleRef} aria-label={`Row actions for ${row.groupName}`} variant="plain">
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                                popperProps={{ position: 'right' }}
                              >
                                <DropdownList>
                                  <DropdownItem>View</DropdownItem>
                                  <DropdownItem>Edit</DropdownItem>
                                  <DropdownItem>Remove</DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </PageSection>
                   </DrawerContentBody>
                  </DrawerContent>
                 </Drawer>
                </Tab>
                <Tab eventKey={1} title={<TabTitleText>Roles assigned in parent workspaces</TabTitleText>}>
                  <PageSection style={{ paddingTop: 8, paddingBottom: 0 }}>
                    <Toolbar style={{ marginTop: 16 }}>
                      <ToolbarContent>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isParentMasterOpen}
                            onOpenChange={setIsParentMasterOpen}
                            toggle={(toggleRef) => (
                              <MenuToggle ref={toggleRef} isExpanded={isParentMasterOpen}>
                                <Checkbox
                                  id="parent-toolbar-master-checkbox"
                                  aria-label="Select"
                                  isChecked={areAllParentSelected}
                                  onChange={(_e, checked) => onToggleAllParent(!!checked)}
                                />
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem onClick={() => { onToggleAllParent(true); setIsParentMasterOpen(false); }}>Select all</DropdownItem>
                              <DropdownItem onClick={() => { onToggleAllParent(false); setIsParentMasterOpen(false); }}>Deselect all</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Dropdown
                            isOpen={false}
                            onOpenChange={() => {}}
                            toggle={(toggleRef) => (
                              <MenuToggle ref={toggleRef} isExpanded={false} icon={null} style={{ minWidth: '220px' }}>
                                User name group
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem>User name group</DropdownItem>
                              <DropdownItem>Organization name</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                          <SearchInput aria-label={'Search'} placeholder={'Search'} value={''} onChange={() => {}} onClear={() => {}} />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>
                  </PageSection>
                  <PageSection style={{ paddingTop: 0 }}>
                    <Table aria-label="Parent role assignment groups table">
                      <Thead>
                        <Tr>
                          <Th aria-label="Row select" />
                          <Th width={35}>User group name</Th>
                          <Th width={25}>Description</Th>
                          <Th width={10}>Users</Th>
                          <Th width={10}>Roles</Th>
                          <Th width={20}>Last modified</Th>
                          <Th aria-label="Row actions"></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {parentGrantedRows.map((row, idx) => (
                          <Tr key={`${row.groupName}-${idx}`}>
                            <Td>
                              <Checkbox
                                id={`select-parent-group-${idx}`}
                                aria-label={`Select ${row.groupName}`}
                                isChecked={parentSelectedRowIds.has(idx)}
                                onChange={(_e, checked) => onToggleParentRow(idx, !!checked)}
                              />
                            </Td>
                            <Td dataLabel="User group name" style={{ paddingRight: '32px' }}>
                              <Button variant="link" isInline onClick={() => openDetails(row)}>{row.groupName}</Button>
                            </Td>
                            <Td dataLabel="Description" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '520px' }}>
                              {row.description}
                            </Td>
                            <Td dataLabel="Users">{row.users}</Td>
                            <Td dataLabel="Roles">{row.roles}</Td>
                            <Td dataLabel="Last modified">{row.lastModified}</Td>
                            <Td isActionCell>
                              <Dropdown isOpen={false} onOpenChange={() => {}}
                                toggle={(toggleRef) => (
                                  <MenuToggle ref={toggleRef} aria-label={`Row actions for ${row.groupName}`} variant="plain">
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                                popperProps={{ position: 'right' }}
                              >
                                <DropdownList>
                                  <DropdownItem>View</DropdownItem>
                                  <DropdownItem>Edit</DropdownItem>
                                  <DropdownItem>Remove</DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </PageSection>
                </Tab>
              </Tabs>
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Assets</TabTitleText>}>
            <PageSection style={{ paddingTop: 8 }}>
              <Content>
                <p style={{ marginTop: 0, color: '#6a6e73' }}>Navigate to a service to manage your assets.</p>
              </Content>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Card style={{ width: 320, flex: '0 0 320px' }}>
                  <CardBody>
                    <div>
                      <Title headingLevel="h3" size="md" style={{ marginBottom: 6 }}>Red Hat Insights</Title>
                      <div style={{ color: '#6a6e73', marginBottom: 8 }}>Manage your RHEL systems</div>
                      <Button
                        variant="link"
                        isInline
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="end"
                        component="a"
                        href="https://console.redhat.com/insights"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Take me to Red Hat Insights
                      </Button>
                    </div>
                  </CardBody>
                </Card>
                <Card style={{ width: 320, flex: '0 0 320px' }}>
                  <CardBody>
                    <div>
                      <Title headingLevel="h3" size="md" style={{ marginBottom: 6 }}>Red Hat OpenShift</Title>
                      <div style={{ color: '#6a6e73', marginBottom: 8 }}>Manage your OpenShift clusters</div>
                      <Button
                        variant="link"
                        isInline
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="end"
                        component="a"
                        href="https://console.redhat.com/openshift"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Take me to Red Hat OpenShift
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { Workspaces };

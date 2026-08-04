export type GroupMemberUser = { username: string; email: string; firstName: string; lastName: string };
export type GroupMemberSA = { name: string; clientId: string; owner: string };
export type GroupMemberAgent = { name: string; description: string };

export type SharedGroup = {
  id: string;
  name: string;
  description: string;
  members: number;
};

const _initial: SharedGroup[] = [
  { id: 'g1', name: '405', description: 'HTTP error code reference group', members: 1 },
  { id: 'g2', name: 'abc', description: 'Alphabetical test group', members: 2 },
  { id: 'g3', name: 'Automation Something', description: 'Automated pipeline runners', members: 2 },
  { id: 'g4', name: 'Compliance Admins', description: 'Manages compliance policies and audit controls', members: 1 },
  { id: 'g5', name: 'Compliance Auditors', description: 'Reviews audit logs and compliance reports', members: 1 },
  { id: 'g6', name: 'Default access', description: 'This group contains all users in your organization', members: 6 },
  { id: 'g7', name: 'Default admin access', description: 'This group contains all org admin users', members: 1 },
  { id: 'g8', name: 'demo-local-v2__Child Group', description: 'Group for child workspace testing', members: 1 },
  { id: 'g9', name: 'demo-local-v2__E2E_Lifecycle_1775655748250', description: 'E2E lifecycle test group', members: 1 },
  { id: 'g10', name: 'demo-local-v2__Seeded Group', description: 'Controlled test group for search and filtering', members: 2 },
  { id: 'g11', name: 'Development Team Alpha', description: 'Front-end and back-end developers', members: 1 },
  { id: 'g12', name: 'Group For V2 Test - RBAC on RBAC - ADMIN', description: 'Group For V2 Test for RBAC on RBAC ADMIN', members: 1 },
  { id: 'g13', name: 'Group For V2 Test - RBAC on RBAC VIEWER', description: 'Group For V2 Test for RBAC on RBAC VIEWER', members: 1 },
  { id: 'g14', name: 'Engineering Leads', description: 'Technical leads across all squads', members: 3 },
  { id: 'g15', name: 'EnvironmentTesters', description: 'Staging and pre-prod environment testers', members: 5 },
  { id: 'g16', name: 'Global Admins', description: 'Admin group for global operations', members: 2 },
  { id: 'g17', name: 'IAM-Reviewers', description: 'Identity and access management reviewers', members: 4 },
  { id: 'g18', name: 'Insights-PNQ', description: 'Insights product team members in PNQ', members: 6 },
  { id: 'g19', name: 'OCM-Test-Group', description: 'Test group for OCM integration', members: 1 },
  { id: 'g20', name: 'Platform-SRE', description: 'Site reliability engineering team', members: 6 },
  { id: 'g21', name: 'QA-Automation', description: 'Automated quality assurance runners', members: 6 },
];

let _groups: SharedGroup[] = [..._initial];
let _version = 0;

const _u = {
  doejoe: { username: 'doejoe', email: 'lpichler@redhat.com', firstName: 'Joe', lastName: 'Doe' },
  admin: { username: 'iqe_rbac_v2_admin', email: 'platform-accessmanagement+iqe_rbac_v2_admin+stage@redhat.com', firstName: 'RBAC Admin', lastName: 'For V2' },
  normal: { username: 'iqe_rbac_v2_normal', email: 'platform-accessmanagement+iqe_rbac_v2_normal+stage@redhat.com', firstName: 'RBAC Normal', lastName: 'For V2' },
  rbac: { username: 'iqe_rbac_v2_rbac', email: 'platform-accessmanagement+iqe_rbac_v2_rbac+stage@redhat.com', firstName: 'RBAC RBAC', lastName: 'For V2' },
  viewer: { username: 'iqe_rbac_v2_viewer', email: 'platform-accessmanagement+iqe_rbac_v2_viewer+stage@redhat.com', firstName: 'RBAC Viewer', lastName: 'For V2' },
  ws: { username: 'iqe_rbac_v2_workspaces', email: 'platform-accessmanagement+iqe_rbac_v2_workspaces+stage@redhat.com', firstName: 'RBAC Workspaces', lastName: 'For V2' },
};

const _memberUsers: Record<string, GroupMemberUser[]> = {
  g1: [_u.rbac], g2: [_u.viewer, _u.normal], g3: [_u.doejoe, _u.admin],
  g4: [_u.rbac], g5: [_u.viewer],
  g6: [_u.doejoe, _u.admin, _u.normal, _u.rbac, _u.viewer, _u.ws],
  g7: [_u.admin], g8: [_u.ws], g9: [_u.normal], g10: [_u.viewer, _u.rbac],
  g11: [_u.doejoe], g12: [_u.admin], g13: [_u.viewer],
  g14: [_u.doejoe, _u.admin, _u.normal],
  g15: [_u.rbac, _u.viewer, _u.normal, _u.ws, _u.doejoe],
  g16: [_u.admin, _u.ws],
  g17: [_u.doejoe, _u.rbac, _u.viewer, _u.normal],
  g18: [_u.doejoe, _u.admin, _u.normal, _u.rbac, _u.viewer, _u.ws],
  g19: [_u.normal],
  g20: [_u.admin, _u.doejoe, _u.rbac, _u.viewer, _u.normal, _u.ws],
  g21: [_u.rbac, _u.viewer, _u.normal, _u.doejoe, _u.admin, _u.ws],
};
const _memberSAs: Record<string, GroupMemberSA[]> = {
  g1: [{ name: 'test405', clientId: 'ab434b20-2276-4846-afdd-b0c4ecba2f0', owner: 'iqe_rbac_v2_admin' }],
  g3: [{ name: 'iqe-rbac-v2-service-account', clientId: '7fb2272f-2844-4fd0-bab3-dbdb0d85a91f', owner: 'iqe_rbac_v2_admin' }],
  g6: [{ name: 'SA for RBAC', clientId: 'd807b762-31c3-45d0-bffe-7f498b709c66', owner: 'iqe_rbac_v2_admin' }],
  g8: [{ name: 'iqe-rbac-on-rbac-read', clientId: 'b43b9c00-0107-43be-afa7-4ce45006b51c', owner: 'iqe_rbac_v2_admin' }],
  g12: [{ name: 'iqe-rbac-on-rbac', clientId: '9e6729e3-2c31-4b45-90af-2e88ed654c0f', owner: 'iqe_rbac_v2_admin' }],
  g15: [{ name: 'iqe-rbac-v2-e2e-service-account', clientId: '6dfb7d72-cf19-40eb-9920-0e8de3d2bb40', owner: 'iqe_rbac_v2_admin' }],
  g16: [{ name: 'SA for RBAC', clientId: 'd807b762-31c3-45d0-bffe-7f498b709c66', owner: 'iqe_rbac_v2_admin' }],
  g18: [
    { name: 'libord', clientId: 'f54cbb0-82e3-4f70-82be-a6f343746804', owner: 'iqe_rbac_v2_admin' },
    { name: 'SA Permissions for RBAC', clientId: 'fe466d70-2aeb-4de7-6eb3-d48ff4729e62', owner: 'iqe_rbac_v2_admin' },
  ],
  g20: [{ name: 'testlibor', clientId: 'cc9a0d3f-07dd-43a5-990b-d5a21d6d90a8', owner: 'iqe_rbac_v2_admin' }],
  g21: [{ name: 'iqe-rbac-v2-service-account', clientId: '7fb2272f-2844-4fd0-bab3-dbdb0d85a91f', owner: 'iqe_rbac_v2_admin' }],
};
const _memberAgents: Record<string, GroupMemberAgent[]> = {
  g2: [{ name: 'HCC Virtual Assistant', description: 'Helper agent across Hybrid Cloud Console' }],
  g3: [{ name: 'Red Hat Insights Assistant', description: 'AI agent for Insights' }],
  g6: [{ name: 'Red Hat Insights Assistant', description: 'AI agent for Insights' }, { name: 'HCC Virtual Assistant', description: 'Helper agent across Hybrid Cloud Console' }],
  g9: [{ name: 'Red Hat Lightspeed Agent', description: 'AI agent for Red Hat Lightspeed' }],
  g10: [{ name: 'HCC Virtual Assistant', description: 'Helper agent across Hybrid Cloud Console' }],
  g14: [{ name: 'Red Hat Insights Assistant', description: 'AI agent for Insights' }],
  g17: [{ name: 'Red Hat Lightspeed Agent', description: 'AI agent for Red Hat Lightspeed' }],
  g20: [{ name: 'Red Hat Insights Assistant', description: 'AI agent for Insights' }, { name: 'Red Hat Lightspeed Agent', description: 'AI agent for Red Hat Lightspeed' }],
};

export function getGroups(): SharedGroup[] {
  return _groups;
}

export function getGroupsVersion(): number {
  return _version;
}

export function getGroupMembers(groupId: string) {
  return {
    users: _memberUsers[groupId] || [],
    serviceAccounts: _memberSAs[groupId] || [],
    agents: _memberAgents[groupId] || [],
  };
}

export function addGroup(
  name: string,
  description: string,
  members: number,
  users?: GroupMemberUser[],
  serviceAccounts?: GroupMemberSA[],
  agents?: GroupMemberAgent[],
): string {
  const id = `g-new-${Date.now()}`;
  _groups = [..._groups, { id, name, description, members }];
  if (users?.length) _memberUsers[id] = users;
  if (serviceAccounts?.length) _memberSAs[id] = serviceAccounts;
  if (agents?.length) _memberAgents[id] = agents;
  _version++;
  return id;
}

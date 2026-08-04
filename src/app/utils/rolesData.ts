export interface PermissionEntry {
  application: string;
  resourceType: string;
  operation: string;
}

export interface RoleData {
  id: string;
  name: string;
  description: string;
  permissions: number;
  lastModified: string;
  permissionDetails: PermissionEntry[];
  assignedGroups: string[];
}

export const allRoles: RoleData[] = [
  {
    id: 'ansible-lightspeed-admin', name: 'Ansible Lightspeed administrator',
    description: 'Perform read operations for Organization Administrators on all Lightspeed charts.',
    permissions: 4, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'ansible-wisdom-admin-dashboard', resourceType: 'chart-active-users', operation: 'read' },
      { application: 'ansible-wisdom-admin-dashboard', resourceType: 'chart-module-usage', operation: 'read' },
      { application: 'ansible-wisdom-admin-dashboard', resourceType: 'chart-recommendations', operation: 'read' },
      { application: 'ansible-wisdom-admin-dashboard', resourceType: 'chart-user-sentiment', operation: 'read' },
    ],
    assignedGroups: ['Default admin access'],
  },
  {
    id: 'compliance-administrator', name: 'Compliance administrator',
    description: 'Perform any available operation on Compliance resources.',
    permissions: 3, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'compliance', resourceType: 'policy', operation: '*' },
      { application: 'compliance', resourceType: 'system', operation: '*' },
      { application: 'compliance', resourceType: 'report', operation: '*' },
    ],
    assignedGroups: ['Compliance Admins'],
  },
  {
    id: 'compliance-editor', name: 'Compliance Editor',
    description: 'Grants write access to compliance policies',
    permissions: 1, lastModified: '2 months ago',
    permissionDetails: [
      { application: 'compliance', resourceType: 'policy', operation: 'write' },
    ],
    assignedGroups: [],
  },
  {
    id: 'compliance-viewer', name: 'Compliance viewer',
    description: 'Perform read operations on Compliance resources.',
    permissions: 4, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'compliance', resourceType: 'policy', operation: 'read' },
      { application: 'compliance', resourceType: 'system', operation: 'read' },
      { application: 'compliance', resourceType: 'report', operation: 'read' },
      { application: 'compliance', resourceType: 'profile', operation: 'read' },
    ],
    assignedGroups: ['Compliance Auditors', 'Default access'],
  },
  {
    id: 'content-template-admin', name: 'Content Template administrator',
    description: 'Perform any available operation on any Content Template resource.',
    permissions: 3, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'content-sources', resourceType: 'templates', operation: '*' },
      { application: 'content-sources', resourceType: 'repositories', operation: '*' },
      { application: 'content-sources', resourceType: 'snapshots', operation: '*' },
    ],
    assignedGroups: ['Default admin access'],
  },
  {
    id: 'content-template-viewer', name: 'Content Template viewer',
    description: 'Perform read-only operations on Content Template resources.',
    permissions: 2, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'content-sources', resourceType: 'templates', operation: 'read' },
      { application: 'content-sources', resourceType: 'repositories', operation: 'read' },
    ],
    assignedGroups: ['Default access'],
  },
  {
    id: 'demo-local-v2-child-role', name: 'demo-local-v2__Child Role',
    description: 'Role for child workspace testing',
    permissions: 1, lastModified: '08 Apr 2026',
    permissionDetails: [
      { application: 'rbac', resourceType: 'workspace', operation: 'read' },
    ],
    assignedGroups: [],
  },
  {
    id: 'demo-local-v2-seeded-role', name: 'demo-local-v2__Seeded Role',
    description: 'Controlled test role for search and view tests',
    permissions: 2, lastModified: '08 Apr 2026',
    permissionDetails: [
      { application: 'rbac', resourceType: 'role', operation: 'read' },
      { application: 'rbac', resourceType: 'group', operation: 'read' },
    ],
    assignedGroups: [],
  },
  {
    id: 'inventory-admin', name: 'Inventory administrator',
    description: 'Perform any available operation on any Inventory resource.',
    permissions: 1, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'inventory', resourceType: 'hosts', operation: '*' },
    ],
    assignedGroups: ['Default admin access'],
  },
  {
    id: 'inventory-hosts-admin', name: 'Inventory Hosts administrator',
    description: 'Perform read and update operations on Inventory-Hosts data.',
    permissions: 2, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'inventory', resourceType: 'hosts', operation: 'read' },
      { application: 'inventory', resourceType: 'hosts', operation: 'write' },
    ],
    assignedGroups: [],
  },
  {
    id: 'inventory-hosts-viewer', name: 'Inventory Hosts viewer',
    description: 'Perform read operations on Inventory-Hosts data.',
    permissions: 1, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'inventory', resourceType: 'hosts', operation: 'read' },
    ],
    assignedGroups: ['Default access'],
  },
  {
    id: 'inventory-reviewer', name: 'Inventory Reviewer',
    description: '\u2014',
    permissions: 2, lastModified: '2 months ago',
    permissionDetails: [
      { application: 'inventory', resourceType: 'hosts', operation: 'read' },
      { application: 'inventory', resourceType: 'groups', operation: 'read' },
    ],
    assignedGroups: [],
  },
  {
    id: 'malware-detection-admin', name: 'Malware detection administrator',
    description: 'Perform any available operation on any malware-detection resource.',
    permissions: 1, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'malware-detection', resourceType: 'scan', operation: '*' },
    ],
    assignedGroups: [],
  },
  {
    id: 'malware-detection-editor', name: 'Malware detection editor',
    description: 'Read any malware-detection resource as well as set malware acknowledgements.',
    permissions: 2, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'malware-detection', resourceType: 'scan', operation: 'read' },
      { application: 'malware-detection', resourceType: 'acknowledgement', operation: 'write' },
    ],
    assignedGroups: [],
  },
  {
    id: 'malware-detection-viewer', name: 'Malware detection viewer',
    description: 'Perform read operations on any malware-detection resource.',
    permissions: 1, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'malware-detection', resourceType: 'scan', operation: 'read' },
    ],
    assignedGroups: [],
  },
  {
    id: 'new-role-name', name: 'new_role_name',
    description: 'Test Role/trade audience piece season husband from this.',
    permissions: 1, lastModified: '3 months ago',
    permissionDetails: [
      { application: 'test-app', resourceType: 'resource', operation: 'read' },
    ],
    assignedGroups: [],
  },
  {
    id: 'notifications-admin', name: 'Notifications administrator',
    description: 'Perform any available operation against notifications and integrations resources.',
    permissions: 2, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'notifications', resourceType: 'notifications', operation: '*' },
      { application: 'integrations', resourceType: 'endpoints', operation: '*' },
    ],
    assignedGroups: ['Default admin access'],
  },
  {
    id: 'notifications-viewer', name: 'Notifications viewer',
    description: 'Perform read operations on notifications and integrations resources.',
    permissions: 2, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'notifications', resourceType: 'notifications', operation: 'read' },
      { application: 'integrations', resourceType: 'endpoints', operation: 'read' },
    ],
    assignedGroups: ['Default access'],
  },
  {
    id: 'ocm-cluster-autoscaler-editor', name: 'OCM cluster autoscaler editor',
    description: 'Perform update operations on the cluster autoscaler.',
    permissions: 0, lastModified: '04 Dec 2025',
    permissionDetails: [],
    assignedGroups: [],
  },
  {
    id: 'ocm-cluster-editor', name: 'OCM cluster editor',
    description: 'Perform update operations on clusters.',
    permissions: 0, lastModified: '04 Dec 2025',
    permissionDetails: [],
    assignedGroups: [],
  },
  {
    id: 'cost-administrator', name: 'Cost administrator',
    description: 'Perform any available operation on cost management resources.',
    permissions: 1, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'cost-management', resourceType: 'cost-model', operation: '*' },
    ],
    assignedGroups: ['Default admin access'],
  },
  {
    id: 'cost-cloud-viewer', name: 'Cost cloud viewer',
    description: 'Perform read operations on cost reports related to cloud sources.',
    permissions: 5, lastModified: '19 Jun 2025',
    permissionDetails: [
      { application: 'cost-management', resourceType: 'aws-report', operation: 'read' },
      { application: 'cost-management', resourceType: 'azure-report', operation: 'read' },
      { application: 'cost-management', resourceType: 'gcp-report', operation: 'read' },
      { application: 'cost-management', resourceType: 'oci-report', operation: 'read' },
      { application: 'cost-management', resourceType: 'cost-model', operation: 'read' },
    ],
    assignedGroups: [],
  },
  {
    id: 'cost-openshift-viewer', name: 'Cost OpenShift viewer',
    description: 'Perform read operations on cost reports related to OpenShift sources.',
    permissions: 1, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'cost-management', resourceType: 'openshift-report', operation: 'read' },
    ],
    assignedGroups: [],
  },
  {
    id: 'cost-price-list-admin', name: 'Cost Price List administrator',
    description: 'Perform read and write operations on cost models.',
    permissions: 2, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'cost-management', resourceType: 'cost-model', operation: 'read' },
      { application: 'cost-management', resourceType: 'cost-model', operation: 'write' },
    ],
    assignedGroups: [],
  },
  {
    id: 'cost-price-list-viewer', name: 'Cost Price List viewer',
    description: 'Perform read operations on cost models.',
    permissions: 2, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'cost-management', resourceType: 'cost-model', operation: 'read' },
      { application: 'cost-management', resourceType: 'rate', operation: 'read' },
    ],
    assignedGroups: [],
  },
  {
    id: 'alert-overrider', name: 'Alert overrider',
    description: 'Override workspace default alert settings for themselves in their personal alert preferences.',
    permissions: 2, lastModified: '4 Sep 2025',
    permissionDetails: [
      { application: 'notifications', resourceType: 'notification-preferences', operation: 'read' },
      { application: 'notifications', resourceType: 'notification-preferences', operation: 'write' },
    ],
    assignedGroups: ['Default access'],
  },
  {
    id: 'rbac-admin', name: 'User Access administrator',
    description: 'Perform any available operation on User Access resources.',
    permissions: 8, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'rbac', resourceType: 'group', operation: '*' },
      { application: 'rbac', resourceType: 'role', operation: '*' },
      { application: 'rbac', resourceType: 'policy', operation: '*' },
      { application: 'rbac', resourceType: 'principal', operation: '*' },
      { application: 'rbac', resourceType: 'permission', operation: '*' },
      { application: 'rbac', resourceType: 'workspace', operation: '*' },
      { application: 'rbac', resourceType: 'binding', operation: '*' },
      { application: 'rbac', resourceType: 'cross-account-request', operation: '*' },
    ],
    assignedGroups: ['Default admin access'],
  },
  {
    id: 'rbac-viewer', name: 'User Access viewer',
    description: 'Perform read operations on User Access resources.',
    permissions: 3, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'rbac', resourceType: 'group', operation: 'read' },
      { application: 'rbac', resourceType: 'role', operation: 'read' },
      { application: 'rbac', resourceType: 'principal', operation: 'read' },
    ],
    assignedGroups: ['Default access'],
  },
  {
    id: 'remediations-admin', name: 'Remediations administrator',
    description: 'Perform any available operation on Remediations resources.',
    permissions: 2, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'remediations', resourceType: 'remediation', operation: '*' },
      { application: 'remediations', resourceType: 'playbook', operation: '*' },
    ],
    assignedGroups: ['Default admin access'],
  },
  {
    id: 'remediations-viewer', name: 'Remediations viewer',
    description: 'Perform read operations on Remediations resources.',
    permissions: 1, lastModified: '04 Dec 2025',
    permissionDetails: [
      { application: 'remediations', resourceType: 'remediation', operation: 'read' },
    ],
    assignedGroups: ['Default access'],
  },
];

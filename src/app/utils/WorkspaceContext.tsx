import * as React from 'react';

export type WorkspaceNode = {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentId?: string;
  level: number;
  isTrustedOrg?: boolean;
};

export const allWorkspaces: WorkspaceNode[] = [
  // My organization
  { id: 'uxd', slug: 'uxd', name: 'Acme Corp', description: 'This is the root workspace.', level: 0 },
  { id: 'ws-default', slug: 'workspace-default', name: 'Workspace default', description: 'This is a description of Workspace default.', parentId: 'uxd', level: 1 },
  { id: 'ws-ungrouped', slug: 'workspace-ungrouped-hosts', name: 'Workspace Ungrouped Hosts', description: 'Where ungrouped systems will go.', parentId: 'ws-default', level: 2 },
  { id: 'ws-a', slug: 'workspace-a', name: 'Production', description: 'Workspace consisted of systems in the production environment.', parentId: 'ws-default', level: 2 },
  { id: 'ws-b', slug: 'workspace-b', name: 'Sandbox', description: 'Workspace consisted of systems in the sandbox environment.', parentId: 'ws-default', level: 2 },
  { id: 'ws-c', slug: 'workspace-c', name: 'Preview', description: 'Workspace consisted of systems in the preview environment.', parentId: 'ws-default', level: 2 },
  // Connected trusted organizations
  { id: 'org-acme', slug: 'org-acme', name: 'Acme Corp', description: 'Connected trusted organization.', level: 0, isTrustedOrg: true },
  { id: 'org-acme-staging', slug: 'org-acme-staging', name: 'Staging', description: 'Acme Corp staging environment.', parentId: 'org-acme', level: 1, isTrustedOrg: true },
  { id: 'org-acme-cicd', slug: 'org-acme-cicd', name: 'CI/CD Pipeline', description: 'Acme Corp CI/CD resources.', parentId: 'org-acme', level: 1, isTrustedOrg: true },
  { id: 'org-acme-sandbox', slug: 'org-acme-sandbox', name: 'Sandbox', description: 'Acme Corp sandbox environment.', parentId: 'org-acme', level: 1, isTrustedOrg: true },

  { id: 'org-initech', slug: 'org-initech', name: 'Initech', description: 'Connected trusted organization.', level: 0, isTrustedOrg: true },
  { id: 'org-initech-prod', slug: 'org-initech-prod', name: 'Production', description: 'Initech production workspace.', parentId: 'org-initech', level: 1, isTrustedOrg: true },
  { id: 'org-initech-qa', slug: 'org-initech-qa', name: 'QA Environment', description: 'Initech QA workspace.', parentId: 'org-initech', level: 1, isTrustedOrg: true },
  { id: 'org-initech-qa-auto', slug: 'org-initech-qa-auto', name: 'Automated Tests', description: 'Automated test infrastructure.', parentId: 'org-initech-qa', level: 2, isTrustedOrg: true },
  { id: 'org-initech-qa-manual', slug: 'org-initech-qa-manual', name: 'Manual Testing', description: 'Manual testing environment.', parentId: 'org-initech-qa', level: 2, isTrustedOrg: true },

  { id: 'org-soylent', slug: 'org-soylent', name: 'Soylent', description: 'Connected trusted organization.', level: 0, isTrustedOrg: true },
  { id: 'org-soylent-infra', slug: 'org-soylent-infra', name: 'Infrastructure', description: 'Soylent infrastructure workspace.', parentId: 'org-soylent', level: 1, isTrustedOrg: true },

  { id: 'org-stark', slug: 'org-stark', name: 'Stark Industries', description: 'Connected trusted organization.', level: 0, isTrustedOrg: true },
  { id: 'org-stark-default', slug: 'org-stark-default', name: 'Default Workspace', description: 'Stark Industries default workspace.', parentId: 'org-stark', level: 1, isTrustedOrg: true },
  { id: 'org-stark-lab', slug: 'org-stark-lab', name: 'R&D Lab', description: 'Research and development environment.', parentId: 'org-stark-default', level: 2, isTrustedOrg: true },
  { id: 'org-stark-deploy', slug: 'org-stark-deploy', name: 'Deployment', description: 'Production deployment workspace.', parentId: 'org-stark-default', level: 2, isTrustedOrg: true },
  { id: 'org-stark-deploy-us', slug: 'org-stark-deploy-us', name: 'US East', description: 'US East region.', parentId: 'org-stark-deploy', level: 3, isTrustedOrg: true },
  { id: 'org-stark-deploy-eu', slug: 'org-stark-deploy-eu', name: 'EU West', description: 'EU West region.', parentId: 'org-stark-deploy', level: 3, isTrustedOrg: true },

  { id: 'org-massive', slug: 'org-massive', name: 'Massive Dynamic', description: 'Connected trusted organization.', level: 0, isTrustedOrg: true },
  { id: 'org-massive-dev', slug: 'org-massive-dev', name: 'Development', description: 'Massive Dynamic dev workspace.', parentId: 'org-massive', level: 1, isTrustedOrg: true },
  { id: 'org-massive-prod', slug: 'org-massive-prod', name: 'Production', description: 'Massive Dynamic production workspace.', parentId: 'org-massive', level: 1, isTrustedOrg: true },

  { id: 'org-dunder', slug: 'org-dunder', name: 'Dunder Mifflin', description: 'Connected trusted organization.', level: 0, isTrustedOrg: true },
  { id: 'org-dunder-dev', slug: 'org-dunder-dev', name: 'Development', description: 'Dunder Mifflin dev workspace.', parentId: 'org-dunder', level: 1, isTrustedOrg: true },
  { id: 'org-dunder-demo', slug: 'org-dunder-demo', name: 'Demo', description: 'Dunder Mifflin demo workspace.', parentId: 'org-dunder', level: 1, isTrustedOrg: true },
  { id: 'org-dunder-demo-sales', slug: 'org-dunder-demo-sales', name: 'Sales Demo', description: 'Sales demo environment.', parentId: 'org-dunder-demo', level: 2, isTrustedOrg: true },
];

type WorkspaceContextType = {
  workspaces: WorkspaceNode[];
  selectedWorkspace: WorkspaceNode;
  setSelectedWorkspace: (ws: WorkspaceNode) => void;
};

const WorkspaceContext = React.createContext<WorkspaceContextType>({
  workspaces: allWorkspaces,
  selectedWorkspace: allWorkspaces[0],
  setSelectedWorkspace: () => {},
});

export const WorkspaceProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<WorkspaceNode>(allWorkspaces[0]);

  const value = React.useMemo(
    () => ({ workspaces: allWorkspaces, selectedWorkspace, setSelectedWorkspace }),
    [selectedWorkspace]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => React.useContext(WorkspaceContext);

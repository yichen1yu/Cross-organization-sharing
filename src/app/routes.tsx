import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Homepage } from '@app/Homepage/Homepage';
import { AllServices } from '@app/AllServices/AllServices';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { AlertManager } from '@app/AlertManager/AlertManager';
import { RoleDeleted } from '@app/AlertManager/RoleDeleted';
import { AuthenticationPolicy } from '@app/AuthenticationPolicy/AuthenticationPolicy';
import { DataIntegration } from '@app/DataIntegration/DataIntegration';
import { EventLog } from '@app/EventLog/EventLog';
import { LearningResources } from '@app/LearningResources/LearningResources';
import { LearningResourcesIAM } from '@app/LearningResourcesIAM/LearningResourcesIAM';
import { MyUserAccess } from '@app/MyUserAccess/MyUserAccess'; 
import { ServiceAccounts } from '@app/ServiceAccounts/ServiceAccounts';
import { UserAccess } from '@app/UserAccess/UserAccess';
import { Support } from '@app/Support/Support';
import { Users } from '@app/Users/Users';
import { Groups } from '@app/Groups/Groups';
import { UsersAndGroups } from '@app/UsersAndGroups/UsersAndGroups';
import { OrganizationWideAccess } from '@app/OrganizationManagement/OrganizationWideAccess';
import { TrustedOrganizations } from '@app/OrganizationManagement/TrustedOrganizations';
import { AuthenticationFactors } from '@app/OrganizationManagement/AuthenticationFactors';
import { IdentityProviderIntegration } from '@app/OrganizationManagement/IdentityProviderIntegration';
import { Subscriptions } from '@app/Subscriptions/Subscriptions';
import { Billing } from '@app/Subscriptions/Billing';
import { SubscriptionInventory } from '@app/Subscriptions/SubscriptionInventory';
import { Insights } from '@app/SubscriptionsSpend/Insights';
import { PatchManagement } from '@app/SubscriptionsSpend/PatchManagement';
import { OpenShiftClusters } from '@app/SubscriptionsSpend/OpenShiftClusters';
import { ContainerRegistry } from '@app/SubscriptionsSpend/ContainerRegistry';
import { AutomationHub } from '@app/SubscriptionsSpend/AutomationHub';
import { AutomationController } from '@app/SubscriptionsSpend/AutomationController';
import { Roles } from '@app/Roles/Roles';
import { AlertOverriderRole } from '@app/Roles/AlertOverriderRole';
import { Workspaces } from '@app/Workspaces/Workspaces';
import { RedHatAccessRequests } from '@app/RedHatAccessRequests/RedHatAccessRequests';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  element: React.ReactElement;
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Homepage />,
    exact: true,
    path: '/',
    title: 'Red Hat Hybrid Cloud Console',
  },
  // Subscription Inventory expandable with sub-pages
  {
    label: 'Subscription Inventory',
    routes: [
      {
        element: <SubscriptionInventory />,
        exact: true,
        path: '/subscription-inventory',
        title: 'Subscription Inventory | Red Hat Hybrid Cloud Console'
      },
      {
        element: <SubscriptionInventory />, // placeholder page
        exact: true,
        path: '/subscription-inventory/subscription-list',
        title: 'Subscription list | Red Hat Hybrid Cloud Console',
        label: 'Subscription list'
      },
      {
        element: <SubscriptionInventory />, // placeholder page
        exact: true,
        path: '/subscription-inventory/features',
        title: 'Features | Red Hat Hybrid Cloud Console',
        label: 'Features'
      },
      {
        element: <SubscriptionInventory />, // placeholder page
        exact: true,
        path: '/subscription-inventory/workspace',
        title: 'Workspace | Red Hat Hybrid Cloud Console',
        label: 'Workspace'
      },
      {
        element: <Billing />, // billing account page
        exact: true,
        path: '/subscription-inventory/billing-account',
        title: 'Billing account | Red Hat Hybrid Cloud Console',
        label: 'Billing account'
      }
    ]
  },
  {
    element: <Subscriptions />,
    exact: true,
    path: '/subscriptions',
    title: 'Subscriptions | Red Hat Hybrid Cloud Console',
  },
  {
    element: <Billing />,
    exact: true,
    path: '/billing',
    title: 'Billing | Red Hat Hybrid Cloud Console',
  },
  // Subscriptions & Spend section placeholder pages
  {
    element: <Insights />,
    exact: true,
    path: '/subscriptions/insights',
    title: 'Insights | Subscriptions & Spend',
  },
  {
    element: <PatchManagement />,
    exact: true,
    path: '/subscriptions/patch-management',
    title: 'Patch Management | Subscriptions & Spend',
  },
  {
    element: <OpenShiftClusters />,
    exact: true,
    path: '/subscriptions/openshift-clusters',
    title: 'OpenShift Clusters | Subscriptions & Spend',
  },
  {
    element: <ContainerRegistry />,
    exact: true,
    path: '/subscriptions/container-registry',
    title: 'Container Registry | Subscriptions & Spend',
  },
  {
    element: <AutomationHub />,
    exact: true,
    path: '/subscriptions/automation-hub',
    title: 'Automation Hub | Subscriptions & Spend',
  },
  {
    element: <AutomationController />,
    exact: true,
    path: '/subscriptions/automation-controller',
    title: 'Automation Controller | Subscriptions & Spend',
  },
  {
    element: <AllServices />,
    exact: true,
    path: '/all-services',
    title: 'All Services | Red Hat Hybrid Cloud Console',
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Overview',
    path: '/overview',
    title: 'Overview | Red Hat Hybrid Cloud Console',
  },
  {
    element: <AlertManager />,
    exact: true,
    label: 'Subscription Usage',
    path: '/alert-manager',
    title: 'Subscription Usage | Red Hat Hybrid Cloud Console',
  },
  {
    element: <RoleDeleted />,
    exact: true,
    path: '/alert-manager/role-deleted',
    title: 'Role deleted | Alert Manager | Red Hat Hybrid Cloud Console',
  },
  {
    element: <DataIntegration />,
    exact: true,
    label: 'Hybrid Committed Spend',
    path: '/data-integration',
    title: 'Hybrid Committed Spend | Red Hat Hybrid Cloud Console',
  },
  {
    element: <DataIntegration />,
    exact: true,
    path: '/data-integrations',
    title: 'Data Integration | Red Hat Hybrid Cloud Console',
  },
  {
    element: <EventLog />,
    exact: true,
    label: 'Manifest',
    path: '/event-log',
    title: 'Manifest | Red Hat Hybrid Cloud Console',
  },
  {
    element: <LearningResources />,
    exact: true,
    label: 'Learning Resources',
    path: '/learning-resources',
    title: 'Learning Resources | Red Hat Hybrid Cloud Console',
  },
  // Routes without labels (accessible via URL but not shown in navigation)
  {
    element: <MyUserAccess />,
    exact: true,
    path: '/my-user-access',
    title: 'My User Access | Red Hat Hybrid Cloud Console',
  },
  {
    element: <UserAccess />,
    exact: true,
    path: '/user-access',
    title: 'User Access | Red Hat Hybrid Cloud Console',
  },
  {
    element: <AuthenticationPolicy />,
    exact: true,
    path: '/authentication-policy',
    title: 'Authentication Policy | Red Hat Hybrid Cloud Console',
  },
  {
    element: <ServiceAccounts />,
    exact: true,
    path: '/service-accounts',
    title: 'Service Accounts | Red Hat Hybrid Cloud Console',
  },
  {
    element: <GeneralSettings />,
    exact: true,
    path: '/settings/general',
    title: 'General Settings | Red Hat Hybrid Cloud Console',
  },
  {
    element: <ProfileSettings />,
    exact: true,
    path: '/settings/profile',
    title: 'Profile Settings | Red Hat Hybrid Cloud Console',
  },
  {
    element: <Support />,
    exact: true,
    path: '/support',
    title: 'Support | Red Hat Hybrid Cloud Console',
  },
  {
    element: <LearningResourcesIAM />,
    exact: true,
    path: '/learning-resources-iam',
    title: 'IAM Learning Resources | Red Hat Hybrid Cloud Console',
  },
  {
    element: <UsersAndGroups />,
    exact: true,
    path: '/users-and-groups',
    title: 'Users and Groups | Red Hat Hybrid Cloud Console',
  },
  {
    element: <Users />,
    exact: true,
    path: '/users',
    title: 'Users | Red Hat Hybrid Cloud Console',
  },
  {
    element: <Groups />,
    exact: true,
    path: '/groups',
    title: 'Groups | Red Hat Hybrid Cloud Console',
  },
  {
    element: <Roles />,
    exact: true,
    path: '/roles',
    title: 'Roles | Red Hat Hybrid Cloud Console',
  },
  {
    element: <AlertOverriderRole />,
    exact: true,
    path: '/user-access/roles/alert-overrider',
    title: 'Alert overrider | Red Hat Hybrid Cloud Console',
  },
  {
    element: <Workspaces />,
    exact: true,
    path: '/workspaces',
    title: 'Workspaces | Red Hat Hybrid Cloud Console',
  },
  {
    element: <RedHatAccessRequests />,
    exact: true,
    path: '/red-hat-access-requests',
    title: 'Red Hat Access Requests | Red Hat Hybrid Cloud Console',
  },
  // Organization management routes
  {
    element: <OrganizationWideAccess />,
    exact: true,
    path: '/organization/organization-wide-access',
    title: 'Organization-wide Access | Red Hat Hybrid Cloud Console',
  },
  {
    element: <TrustedOrganizations />,
    exact: true,
    path: '/organization/trusted-organizations',
    title: 'Trusted Organizations | Red Hat Hybrid Cloud Console',
  },
  {
    element: <AuthenticationFactors />,
    exact: true,
    path: '/organization/authentication-factors',
    title: 'Authentication Factors | Red Hat Hybrid Cloud Console',
  },
  {
    element: <IdentityProviderIntegration />,
    exact: true,
    path: '/organization/identity-provider-integration',
    title: 'Identity Provider Integration | Red Hat Hybrid Cloud Console',
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };

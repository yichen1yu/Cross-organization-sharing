import * as React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { routes, IAppRoute, IAppRouteGroup } from '@app/routes';
import {
  Button,
  Masthead,
  MastheadBrand,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  MastheadContent,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  SkipToContent,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  TabAction,
  Content,
  Card,
  CardBody,
  SearchInput,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Avatar,
  Tooltip,
  Menu,
  MenuList,
  MenuItem,
  MenuItemAction,
  MenuGroup,
  NotificationDrawer,
  NotificationDrawerBody,
  NotificationDrawerHeader,
  NotificationDrawerList,
  NotificationDrawerListItem,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Split,
  SplitItem,
  Flex,
  FlexItem,
  NotificationDrawerListItemHeader,
  NotificationDrawerListItemBody,
  Divider,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription
} from '@patternfly/react-core';
import { 
  Chatbot, 
  ChatbotContent, 
  ChatbotHeader, 
  ChatbotHeaderMain,
  ChatbotHeaderTitle,
  ChatbotFooter, 
  MessageBox, 
  MessageBar 
} from '@patternfly/chatbot';
import {
  BarsIcon, 
  QuestionCircleIcon, 
  TimesIcon, 
  CommentsIcon, 
  InfoCircleIcon,
  BellIcon,
  CogIcon,
  UserIcon,
  HelpIcon,
  SignOutAltIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  ShieldAltIcon,
  UsersIcon,
  DatabaseIcon,
  ServerIcon,
  EllipsisVIcon,
  TachometerAltIcon,
  CubeIcon,
  CodeIcon,
  WrenchIcon,
  CloudIcon,
  ChartLineIcon,
  CreditCardIcon,
  ExternalLinkAltIcon,
  BrainIcon,
  RocketIcon,
  ListIcon,
  EyeIcon,
  PlayIcon,
  StarIcon
} from '@patternfly/react-icons';

interface IAppLayout {
  children: React.ReactNode;
}

interface TabContent {
  id: string;
  title: string;
  originalTitle: string;
  type: 'overview' | 'analytics' | 'settings' | 'custom';
  activeSubTab?: number;
  closable?: boolean;
  hasUserInteracted?: boolean;
  searchQuery?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  details: string;
  features: string[];
  icon: React.ReactElement;
  url?: string;
  isLink?: boolean;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isDrawerExpanded, setIsDrawerExpanded] = React.useState(false);
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [tabCounter, setTabCounter] = React.useState(2);
  
  // Sub-tab names mapping
  const subTabNames = [
    'Search',
    'Learn', 
    'Knowledgebase',
    'APIs',
    'Support',
    'Ask Red Hat'
  ];

  const [tabs, setTabs] = React.useState<TabContent[]>([
    { id: 'get-started', title: 'Get started', originalTitle: 'Get started', type: 'overview', activeSubTab: 0, closable: false, hasUserInteracted: false }
  ]);

  const [searchValue, setSearchValue] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<Array<{id: string, content: string, role: 'user' | 'bot', timestamp: Date}>>([
    {
      id: '1',
      content: 'Hello! I\'m your Red Hat assistant. How can I help you today?',
      role: 'bot',
      timestamp: new Date()
    }
  ]);

  // User dropdown state
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const [isUtilitiesDropdownOpen, setIsUtilitiesDropdownOpen] = React.useState(false);
  
  // Notification drawer state
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = React.useState(false);
  const [isNotificationActionsOpen, setIsNotificationActionsOpen] = React.useState(false);

  // Menu groups data for primary-detail view
  const menuGroupsData: Record<string, MenuItem[]> = {
    'Platforms': [
      {
        id: 'ansible',
        name: 'Red Hat Ansible Automation Platform',
        description: 'Enterprise automation platform',
        details: 'Red Hat Ansible Automation Platform is a comprehensive automation solution that enables organizations to automate IT processes, configure systems, deploy applications, and orchestrate complex workflows across hybrid cloud environments.',
        features: ['IT Automation', 'Configuration Management', 'Application Deployment', 'Workflow Orchestration'],
        icon: <WrenchIcon />,
        url: '/ansible-automation-platform',
        isLink: true
      },
      {
        id: 'rhel',
        name: 'Red Hat Enterprise Linux',
        description: 'Enterprise-grade Linux operating system',
        details: 'Red Hat Enterprise Linux (RHEL) is the world\'s leading enterprise Linux platform. Built for mission-critical workloads, RHEL provides enhanced security, reliability, and performance for physical, virtual, cloud, and containerized environments.',
        features: ['Security & Compliance', 'High Availability', 'Performance Optimization', 'Long-term Support'],
        icon: <ServerIcon />,
        url: '/red-hat-enterprise-linux',
        isLink: true
      },
      {
        id: 'openshift',
        name: 'Red Hat OpenShift',
        description: 'Enterprise Kubernetes platform',
        details: 'Red Hat OpenShift is a comprehensive Kubernetes platform that enables organizations to build, deploy, and manage containerized applications at scale. It provides developer-friendly tools and enterprise-grade security for modern application development.',
        features: ['Container Orchestration', 'Developer Tools', 'Multi-cloud Deployment', 'Built-in Security'],
        icon: <CubeIcon />,
        url: '/red-hat-openshift',
        isLink: true
      }
    ],
    'Services': [
      {
        id: 'my-favorite-services',
        name: 'My Favorite Services',
        description: 'Quick access to your most-used services',
        details: 'Access your frequently used and bookmarked services in one convenient location. Customize your dashboard with the services you use most often to improve your workflow efficiency.',
        features: ['Quick Access', 'Custom Dashboard', 'Service Bookmarks', 'Usage Analytics'],
        icon: <StarIcon style={{ color: 'var(--pf-v6-c-button--m-favorited--hover__icon--Color, #f39200)' }} />
      },
      {
        id: 'ai-ml',
        name: 'AI/ML',
        description: 'Artificial intelligence and machine learning services',
        details: 'Build, train, and deploy machine learning models with enterprise-grade AI/ML platforms. Access GPU-accelerated computing, automated model training, and MLOps pipelines.',
        features: ['Model Training', 'GPU Computing', 'MLOps Pipelines', 'Data Science Workbenches'],
        icon: <BrainIcon />
      },
      {
        id: 'alerting-data-integrations',
        name: 'Alerting & Data Integrations',
        description: 'Monitoring alerts and data pipeline management',
        details: 'Configure intelligent alerting systems and manage data integration workflows across your hybrid cloud infrastructure with real-time monitoring and automated responses.',
        features: ['Real-time Alerts', 'Data Pipelines', 'Integration Workflows', 'Event Processing'],
        icon: <BellIcon />
      },
      {
        id: 'automation',
        name: 'Automation',
        description: 'Infrastructure and application automation',
        details: 'Automate repetitive tasks, configuration management, and deployment processes with comprehensive automation tools and workflow orchestration.',
        features: ['Task Automation', 'Configuration Management', 'Workflow Orchestration', 'Process Optimization'],
        icon: <WrenchIcon />
      },
      {
        id: 'containers',
        name: 'Containers',
        description: 'Container management and orchestration',
        details: 'Deploy, manage, and scale containerized applications with enterprise Kubernetes platforms, container registries, and orchestration tools.',
        features: ['Container Orchestration', 'Registry Management', 'Application Scaling', 'Service Mesh'],
        icon: <CubeIcon />
      },
      {
        id: 'deploy',
        name: 'Deploy',
        description: 'Application deployment and delivery',
        details: 'Streamline application deployment with CI/CD pipelines, automated testing, and progressive delivery strategies across multiple environments.',
        features: ['CI/CD Pipelines', 'Automated Testing', 'Progressive Delivery', 'Environment Management'],
        icon: <RocketIcon />
      },
      {
        id: 'identity-access-mgmt',
        name: 'Identity & Access Management',
        description: 'User authentication and authorization',
        details: 'Secure your applications with comprehensive identity management, single sign-on, multi-factor authentication, and role-based access controls.',
        features: ['Single Sign-On', 'Multi-Factor Auth', 'Role-Based Access', 'Identity Federation'],
        icon: <UsersIcon />
      },
      {
        id: 'inventories',
        name: 'Inventories',
        description: 'Asset and resource inventory management',
        details: 'Track and manage your IT assets, infrastructure resources, and application inventories with automated discovery and real-time updates.',
        features: ['Asset Discovery', 'Resource Tracking', 'Inventory Updates', 'Compliance Reporting'],
        icon: <ListIcon />
      },
      {
        id: 'observability-monitoring',
        name: 'Observability & Monitoring',
        description: 'System monitoring and observability',
        details: 'Gain deep insights into your applications and infrastructure with comprehensive monitoring, logging, tracing, and performance analytics.',
        features: ['Application Monitoring', 'Infrastructure Metrics', 'Distributed Tracing', 'Log Analytics'],
        icon: <EyeIcon />
      },
      {
        id: 'operators',
        name: 'Operators',
        description: 'Kubernetes operators and lifecycle management',
        details: 'Deploy and manage complex applications on Kubernetes with operators that automate installation, updates, and day-2 operations.',
        features: ['Operator Lifecycle', 'Application Management', 'Automated Updates', 'Cluster Operations'],
        icon: <PlayIcon />
      },
      {
        id: 'security',
        name: 'Security',
        description: 'Security scanning and threat protection',
        details: 'Protect your infrastructure with advanced security scanning, vulnerability management, threat detection, and compliance monitoring.',
        features: ['Vulnerability Scanning', 'Threat Detection', 'Security Policies', 'Compliance Monitoring'],
        icon: <ShieldAltIcon />
      },
      {
        id: 'subscriptions-spend',
        name: 'Subscriptions & Spend',
        description: 'Subscription management and cost optimization',
        details: 'Manage subscriptions, track usage, optimize costs, and analyze spending patterns across your Red Hat services and cloud resources.',
        features: ['Subscription Tracking', 'Cost Analysis', 'Usage Optimization', 'Spend Management'],
        icon: <CreditCardIcon />
      },
      {
        id: 'system-configuration',
        name: 'System Configuration',
        description: 'System settings and configuration management',
        details: 'Configure and manage system settings, infrastructure parameters, and application configurations with centralized management tools.',
        features: ['Configuration Management', 'System Settings', 'Parameter Tuning', 'Change Tracking'],
        icon: <ServerIcon />
      }
    ]
  };
  
  // Get the first menu item ID from the first non-link group (Services)
  const getFirstMenuItemId = () => {
    // Default to "My Favorite Services" as the first selected item
    return 'my-favorite-services';
  };
  
  // Service dropdown primary-detail state
  const [selectedMenuItem, setSelectedMenuItem] = React.useState(getFirstMenuItemId());
  
  // Logo dropdown and expandable search state
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = React.useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [mastheadSearchValue, setMastheadSearchValue] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Array<{id: string, title: string, description: string, category: string, route: string | null}>>([]);
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  // Ref for services dropdown to handle outside clicks
  const servicesDropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Location and navigation
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on a page without navigation (homepage or all services)
  const isPageWithoutNav = location.pathname === '/' || location.pathname === '/all-services';

  // Mock search data
  const mockSearchData = [
    { id: '1', title: 'Alert Manager', description: 'Configure and manage system alerts and notifications', category: 'Settings', route: '/alert-manager' },
    { id: '2', title: 'Vulnerability', description: 'View and manage system vulnerabilities', category: 'RHEL', route: null },
    { id: '3', title: 'Policies', description: 'Configure and manage security policies', category: 'RHEL', route: null },
    { id: '4', title: 'My User Access', description: 'View and manage your personal access permissions', category: 'IAM', route: '/my-user-access' },
    { id: '5', title: 'Overview', description: 'View system overview and general information', category: 'Settings', route: '/overview' },
    { id: '6', title: 'Kubernetes Clusters', description: 'Manage and monitor your Kubernetes clusters', category: 'Infrastructure', route: null },
    { id: '7', title: 'Event Log Analytics', description: 'View and analyze application events', category: 'Monitoring', route: '/event-log' },
    { id: '8', title: 'Alert Configuration', description: 'Configure alerts for your applications', category: 'Alerts', route: '/alert-manager' },
    { id: '9', title: 'Data Integration Services', description: 'Connect and integrate external data sources', category: 'Integration', route: '/data-integration' },
    { id: '10', title: 'User Access Management', description: 'Manage user permissions and roles', category: 'Security', route: null },
    { id: '11', title: 'Application Performance', description: 'Monitor application performance metrics', category: 'Monitoring', route: null },
    { id: '12', title: 'Service Mesh Configuration', description: 'Configure service mesh settings', category: 'Infrastructure', route: null },
    { id: '13', title: 'Database Connections', description: 'Manage database connection strings', category: 'Integration', route: '/data-integration' },
    { id: '14', title: 'API Gateway Settings', description: 'Configure API gateway policies', category: 'Infrastructure', route: null },
    { id: '15', title: 'Backup and Recovery', description: 'Manage backup and recovery processes', category: 'Operations', route: null },
    { id: '16', title: 'User Access', description: 'Manage user accounts and access permissions', category: 'IAM', route: '/user-access' },
    { id: '17', title: 'Authentication Policy', description: 'Configure authentication policies and security settings', category: 'IAM', route: '/authentication-policy' },
    { id: '18', title: 'Service Accounts', description: 'Manage service accounts and API credentials', category: 'IAM', route: '/service-accounts' }
  ];

  // Top 5 results for empty state
  const topResults = [
    { id: '1', title: 'Alert Manager', description: 'Configure and manage system alerts and notifications', category: 'Settings', route: '/alert-manager' },
    { id: '2', title: 'Vulnerability', description: 'View and manage system vulnerabilities', category: 'RHEL', route: null },
    { id: '3', title: 'Policies', description: 'Configure and manage security policies', category: 'RHEL', route: null },
    { id: '4', title: 'My User Access', description: 'View and manage your personal access permissions', category: 'IAM', route: '/my-user-access' },
    { id: '5', title: 'Overview', description: 'View system overview and general information', category: 'Settings', route: '/overview' }
  ];

  // Hide search results when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector('.masthead-search-expanded');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Hide services dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        // Also check if click is on the masthead toggle button
        const mastheadToggle = document.querySelector('[aria-label="Red Hat Hybrid Cloud Console menu"]');
        if (mastheadToggle && mastheadToggle.contains(event.target as Node)) {
          return; // Don't close if clicking on the toggle button
        }
        setIsLogoDropdownOpen(false);
      }
    };

    if (isLogoDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLogoDropdownOpen]);

  // Reset to first menu item when dropdown opens
  React.useEffect(() => {
    if (isLogoDropdownOpen) {
      const firstItemId = getFirstMenuItemId();
      console.log('Setting selectedMenuItem to:', firstItemId);
      setSelectedMenuItem(firstItemId);
      // Force re-render with a small delay to ensure Menu component applies selection
      setTimeout(() => {
        setSelectedMenuItem(firstItemId);
        console.log('Re-setting selectedMenuItem to:', firstItemId);
      }, 10);
    }
  }, [isLogoDropdownOpen]);

  // Debug effect to log selectedMenuItem changes
  React.useEffect(() => {
    console.log('selectedMenuItem changed to:', selectedMenuItem);
  }, [selectedMenuItem]);

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const handleAddTab = () => {
    const newTab: TabContent = {
      id: `tab-${tabCounter}`,
      title: 'New tab',
      originalTitle: 'New tab',
      type: 'custom',
      closable: true,
      activeSubTab: 0,
      hasUserInteracted: false
    };
    setTabs([...tabs, newTab]);
    setActiveTabKey(tabs.length);
    setTabCounter(tabCounter + 1);
  };

  const handleCloseTab = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    event.stopPropagation();
    const tabIndexNum = typeof tabIndex === 'string' ? parseInt(tabIndex) : tabIndex;
    
    if (tabs[tabIndexNum] && tabs[tabIndexNum].closable === false) {
      return;
    }
    
    const newTabs = tabs.filter((_, index) => index !== tabIndexNum);
    setTabs(newTabs);
    
    if (activeTabKey === tabIndexNum) {
      setActiveTabKey(newTabs.length ? 0 : 0);
    } else if (typeof activeTabKey === 'number' && activeTabKey > tabIndexNum) {
      setActiveTabKey(activeTabKey - 1);
    }
  };

  const handleSubTabClick = (tabIndex: number, subTabIndex: number) => {
    const newTabs = [...tabs];
    newTabs[tabIndex].activeSubTab = subTabIndex;
    
    newTabs[tabIndex].hasUserInteracted = true;
    
    // Only update title with sub-tab name if there's no search query
    if ((newTabs[tabIndex].type === 'overview' || newTabs[tabIndex].type === 'custom') && !newTabs[tabIndex].searchQuery) {
      newTabs[tabIndex].title = subTabNames[subTabIndex];
    }
    
    setTabs(newTabs);
  };

  const handleContentInteraction = (tabIndex: number) => {
    const newTabs = [...tabs];
    if (!newTabs[tabIndex].hasUserInteracted) {
      newTabs[tabIndex].hasUserInteracted = true;
      
      // Only update title with sub-tab name if there's no search query
      if ((newTabs[tabIndex].type === 'overview' || newTabs[tabIndex].type === 'custom') && !newTabs[tabIndex].searchQuery) {
        newTabs[tabIndex].title = subTabNames[newTabs[tabIndex].activeSubTab || 0];
      }
      
      setTabs(newTabs);
    }
  };

  const onDrawerToggle = () => {
    const newDrawerState = !isDrawerExpanded;
    setIsDrawerExpanded(newDrawerState);
    
    // If opening the help drawer, close the notification drawer
    if (newDrawerState && isNotificationDrawerOpen) {
      setIsNotificationDrawerOpen(false);
    }
  };

  const onDrawerClose = () => {
    setIsDrawerExpanded(false);
  };

  const onNotificationDrawerToggle = () => {
    const newNotificationState = !isNotificationDrawerOpen;
    setIsNotificationDrawerOpen(newNotificationState);
    
    // If closing the notification drawer, also close the actions dropdown
    if (!newNotificationState) {
      setIsNotificationActionsOpen(false);
    }
    
    // If opening the notification drawer, close the help drawer
    if (newNotificationState && isDrawerExpanded) {
      setIsDrawerExpanded(false);
    }
  };

  const onNotificationDrawerClose = () => {
    setIsNotificationDrawerOpen(false);
    setIsNotificationActionsOpen(false); // Close actions dropdown when drawer closes
  };

  const onSearchChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setSearchValue(value);
  };

  const onSearchClear = () => {
    setSearchValue('');
  };

  const createSearchHandlers = (currentTabIndex: number) => {
    const onSearchSubmit = (value: string) => {
      console.log('onSearchSubmit called with:', value, 'for tab index:', currentTabIndex);
      if (value.trim()) {
        const newTabs = [...tabs];
        
        console.log('Before update - tabs:', newTabs.map(t => ({ id: t.id, title: t.title })));
        
        // Update the specific tab with the search query
        newTabs[currentTabIndex].searchQuery = value.trim();
        newTabs[currentTabIndex].title = value.trim();
        newTabs[currentTabIndex].hasUserInteracted = true;
        
        console.log('After update - tabs:', newTabs.map(t => ({ id: t.id, title: t.title })));
        
        setTabs(newTabs);
      }
    };

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      console.log('Key pressed:', event.key, 'Search value:', searchValue);
      if (event.key === 'Enter') {
        event.preventDefault();
        onSearchSubmit(searchValue);
      }
    };

    return { onSearchSubmit, handleSearchKeyDown };
  };

  const handleSendMessage = (message: string | number) => {
    const messageStr = typeof message === 'string' ? message : message.toString();
    if (messageStr.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content: messageStr.trim(),
        role: 'user' as const,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      
      // Simulate bot response after a short delay
      setTimeout(() => {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          content: `Thanks for your question: "${messageStr.trim()}". I'm here to help with Red Hat Hybrid Cloud solutions. How can I assist you further?`,
          role: 'bot' as const,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const onUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const onUserDropdownSelect = () => {
    setIsUserDropdownOpen(false);
  };

  const onUtilitiesDropdownToggle = () => {
    setIsUtilitiesDropdownOpen(!isUtilitiesDropdownOpen);
  };

  const onUtilitiesDropdownSelect = () => {
    setIsUtilitiesDropdownOpen(false);
  };

  const onLogoDropdownSelect = () => {
    setIsLogoDropdownOpen(false);
  };

  const onSearchToggle = (event: React.SyntheticEvent<HTMLButtonElement>, isExpanded: boolean) => {
    setIsSearchExpanded(!isSearchExpanded);
    // Hide search results when collapsing, show top results when expanding
    if (isSearchExpanded) {
      setShowSearchResults(false);
      setSearchResults([]);
    } else {
      // Show top results when expanding and search is empty
      if (mastheadSearchValue.trim().length === 0) {
        setSearchResults(topResults);
        setShowSearchResults(true);
      }
    }
  };

  const onMastheadSearchChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setMastheadSearchValue(value);
    
    // Show top results when search is empty, filtered results when typing
    if (value.trim().length === 0) {
      // Show top results when search is empty
      setSearchResults(topResults);
      setShowSearchResults(true);
    } else if (value.trim().length >= 2) {
      // Perform filtered search when user types (minimum 2 characters)
      const filteredResults = mockSearchData.filter(item =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6); // Limit to 6 results
      
      setSearchResults(filteredResults);
      setShowSearchResults(true);
    } else {
      // Hide results when typing 1 character (between empty and 2 chars)
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const onMastheadSearchClear = () => {
    setMastheadSearchValue('');
    // Show top results when clearing search (if expanded)
    if (isSearchExpanded) {
      setSearchResults(topResults);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const renderSubTabs = (tabIndex: number, tab: TabContent, ariaLabel: string) => {
    const { onSearchSubmit, handleSearchKeyDown } = createSearchHandlers(tabIndex);
    
    return (
    <Tabs
      isSubtab
      activeKey={tab.activeSubTab || 0}
      onSelect={(event, subTabIndex) => handleSubTabClick(tabIndex, subTabIndex as number)}
      aria-label={ariaLabel}
    >
      <Tab 
        eventKey={0} 
        title={<TabTitleText>Search</TabTitleText>}
        aria-label="Search sub tab"
      >
        <Card>
          <CardBody>
            <Content>
              <h3>Search</h3>
              <p>Find information quickly across all available resources and documentation.</p>
              
              <div style={{ marginBottom: '20px' }}>
                <SearchInput
                  placeholder="Search documentation, APIs, and resources..."
                  value={searchValue}
                  onChange={onSearchChange}
                  onClear={onSearchClear}
                  onKeyDown={handleSearchKeyDown}
                  aria-label="Search help resources"
                />
                <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                  Press Enter to search and update the tab title
                </div>
              </div>

              <h4>Search Categories:</h4>
              <ul>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Search across documentation, APIs, and knowledge articles</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Filter results by category and content type</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Access frequently searched topics</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Save and bookmark search results</li>
              </ul>
            </Content>
          </CardBody>
        </Card>
      </Tab>
      <Tab 
        eventKey={1} 
        title={<TabTitleText>Learn</TabTitleText>}
        aria-label="Learn sub tab"
      >
        <Card>
          <CardBody>
            <Content>
              <h3>Learn</h3>
              <p>Access educational resources, tutorials, and training materials to expand your knowledge.</p>
              <ul>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Interactive tutorials and walkthroughs</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Video training sessions</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Certification programs</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Best practices and implementation guides</li>
              </ul>
            </Content>
          </CardBody>
        </Card>
      </Tab>
      <Tab 
        eventKey={2} 
        title={<TabTitleText>Knowledgebase</TabTitleText>}
        aria-label="Knowledgebase sub tab"
      >
        <Card>
          <CardBody>
            <Content>
              <h3>Knowledgebase</h3>
              <p>Browse comprehensive knowledge articles, solutions, and technical documentation.</p>
              <ul>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Troubleshooting guides and solutions</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Technical articles and whitepapers</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>FAQ and common issues</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Product documentation and specifications</li>
              </ul>
            </Content>
          </CardBody>
        </Card>
      </Tab>
      <Tab 
        eventKey={3} 
        title={<TabTitleText>APIs</TabTitleText>}
        aria-label="APIs sub tab"
      >
        <Card>
          <CardBody>
            <Content>
              <h3>APIs</h3>
              <p>Explore API documentation, reference guides, and integration examples.</p>
              <ul>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>REST API documentation and endpoints</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Code examples and SDK references</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Authentication and authorization guides</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>API testing tools and sandbox environments</li>
              </ul>
            </Content>
          </CardBody>
        </Card>
      </Tab>
      <Tab 
        eventKey={4} 
        title={<TabTitleText>Support</TabTitleText>}
        aria-label="Support sub tab"
      >
        <Card>
          <CardBody>
            <Content>
              <h3>Support</h3>
              <p>Get help with technical issues, access support resources, and connect with support teams.</p>
              <ul>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Submit support tickets and track status</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Access support documentation</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Contact technical support specialists</li>
                <li onClick={() => handleContentInteraction(tabIndex)} style={{cursor: 'pointer'}}>Emergency support and escalation procedures</li>
              </ul>
            </Content>
          </CardBody>
        </Card>
      </Tab>
      <Tab 
        eventKey={5} 
        title={
          <TabTitleText>
            <CommentsIcon />
          </TabTitleText>
        }
        aria-label="Chat sub tab"
      >
        <div style={{ height: '500px', padding: '16px' }}>
          <Chatbot isVisible={true}>
            <ChatbotHeader>
              <ChatbotHeaderMain>
                <ChatbotHeaderTitle>Ask Red Hat Assistant</ChatbotHeaderTitle>
              </ChatbotHeaderMain>
            </ChatbotHeader>
            <ChatbotContent>
              <MessageBox>
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    style={{
                      margin: '8px 0',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: msg.role === 'user' ? '#0066cc' : '#f0f0f0',
                      color: msg.role === 'user' ? 'white' : 'black',
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      marginLeft: msg.role === 'user' ? 'auto' : '0',
                      marginRight: msg.role === 'user' ? '0' : 'auto'
                    }}
                  >
                    <div>{msg.content}</div>
                    <div style={{ 
                      fontSize: '12px', 
                      opacity: 0.7, 
                      marginTop: '4px' 
                    }}>
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </MessageBox>
            </ChatbotContent>
            <ChatbotFooter>
              <MessageBar 
                onSendMessage={handleSendMessage}
                placeholder="Ask me anything about Red Hat Hybrid Cloud..."
              />
            </ChatbotFooter>
          </Chatbot>
        </div>
      </Tab>
    </Tabs>
    );
  };

  const renderTabContent = (tab: TabContent, tabIndex: number) => {
    switch (tab.type) {
      case 'overview':
        return renderSubTabs(tabIndex, tab, "Get started sub tabs");
      
      case 'analytics':
        return (
          <Tabs
            isSubtab
            activeKey={tab.activeSubTab || 0}
            onSelect={(event, subTabIndex) => handleSubTabClick(tabIndex, subTabIndex as number)}
            aria-label="Analytics sub tabs"
          >
            <Tab 
              eventKey={0} 
              title={<TabTitleText>Performance Metrics</TabTitleText>}
              aria-label="Performance Metrics sub tab"
            >
              <Card>
                <CardBody>
                  <Content>
                    <h3>Performance Metrics</h3>
                    <p>Monitor key performance indicators and system metrics to ensure optimal operation.</p>
                    <ul>
                      <li>CPU Usage: 45%</li>
                      <li>Memory Usage: 68%</li>
                      <li>Disk I/O: 2.3 MB/s</li>
                      <li>Network Throughput: 150 Mbps</li>
                    </ul>
                  </Content>
                </CardBody>
              </Card>
            </Tab>
            <Tab 
              eventKey={1} 
              title={<TabTitleText>User Engagement</TabTitleText>}
              aria-label="User Engagement sub tab"
            >
              <Card>
                <CardBody>
                  <Content>
                    <h3>User Engagement</h3>
                    <p>Analyze user behavior patterns and engagement metrics across the platform.</p>
                    <ul>
                      <li>Active Users: 1,247</li>
                      <li>Session Duration: 8m 32s</li>
                      <li>Page Views: 15,892</li>
                      <li>Bounce Rate: 23%</li>
                    </ul>
                  </Content>
                </CardBody>
              </Card>
            </Tab>
            <Tab 
              eventKey={2} 
              title={<TabTitleText>Revenue Reports</TabTitleText>}
              aria-label="Revenue Reports sub tab"
            >
              <Card>
                <CardBody>
                  <Content>
                    <h3>Revenue Reports</h3>
                    <p>Track financial performance and revenue trends across different time periods.</p>
                    <ul>
                      <li>Monthly Revenue: $127,450</li>
                      <li>Growth Rate: +12.5%</li>
                      <li>Top Revenue Source: Premium Subscriptions</li>
                      <li>Conversion Rate: 3.2%</li>
                    </ul>
                  </Content>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        );
      
      case 'settings':
        return (
          <Card>
            <CardBody>
              <Content>
                <h3>Dashboard Settings</h3>
                <p>Configure dashboard preferences, notifications, and display options.</p>
                <ul>
                  <li>Theme: Light/Dark mode toggle</li>
                  <li>Refresh interval: 30 seconds</li>
                  <li>Email notifications: Enabled</li>
                  <li>Data retention: 90 days</li>
                </ul>
              </Content>
            </CardBody>
          </Card>
        );
      
      case 'custom':
        return renderSubTabs(tabIndex, tab, "New tab sub tabs");
      
      default:
        return (
          <Card>
            <CardBody>
              <Content>
                <h3>Default Content</h3>
                <p>Default tab content</p>
              </Content>
            </CardBody>
          </Card>
        );
    }
  };

  const masthead = (
    <Masthead>
      <MastheadMain>
        {!isPageWithoutNav && (
          <MastheadToggle>
            <Button
              icon={<BarsIcon />}
              variant="plain"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Global navigation"
            />
          </MastheadToggle>
        )}
        <MastheadBrand data-codemods>
          <MastheadLogo data-codemods onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Red_Hat_logo.svg/2560px-Red_Hat_logo.svg.png"
              alt="Red Hat Logo"
              style={{ height: '40px', width: 'auto' }}
            />
          </MastheadLogo>
        </MastheadBrand>
        {/* Application dropdown next to logo */}
        <div style={{ marginLeft: '4px', marginRight: '4px' }}>
          <Tooltip 
            content="Browse services" 
            position="bottom"
            {...(isLogoDropdownOpen ? { isVisible: false } : {})}
          >
            <MenuToggle
              onClick={() => setIsLogoDropdownOpen(!isLogoDropdownOpen)}
              isExpanded={isLogoDropdownOpen}
              aria-label="Red Hat Hybrid Cloud Console menu"
              style={{ 
                fontSize: '14px'
              }}
            >
              Red Hat Hybrid Cloud Console
            </MenuToggle>
          </Tooltip>
        </div>
        
        {/* Expandable Search Input */}
        <div 
          style={{ 
            marginRight: '4px',
            width: isSearchExpanded ? '552px' : 'auto',
            minWidth: isSearchExpanded ? '552px' : 'auto',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
        >
          <style>{`
            .pf-v6-c-masthead__logo {
              width: auto !important;
            }
            .masthead-search-expanded {
              --pf-v6-c-search-input--Width: 552px !important;
              --pf-v6-c-search-input__text-input--Width: 552px !important;
              --pf-v6-c-search-input--MinWidth: 552px !important;
            }
            .masthead-search-expanded .pf-v6-c-search-input,
            .masthead-search-expanded .pf-v6-c-search-input__text-input,
            .masthead-search-expanded .pf-v6-c-form-control {
              width: 552px !important;
              min-width: 552px !important;
            }
            .search-results-dropdown {
              position: absolute;
              top: calc(100% + 4px);
              left: 0;
              right: 0;
              z-index: 1000;
              background: var(--pf-v6-global--BackgroundColor--100);
              border: var(--pf-v6-global--BorderWidth--sm) solid var(--pf-v6-global--BorderColor--200);
              border-radius: var(--pf-v6-global--BorderRadius--md);
              box-shadow: var(--pf-v6-global--BoxShadow--lg);
              max-height: 400px;
              overflow-y: auto;
              padding: 24px;
            }
            .search-result-category-badge {
              font-size: var(--pf-v6-global--FontSize--xs);
              font-weight: var(--pf-v6-global--FontWeight--semi-bold);
              color: var(--pf-v6-global--primary-color--100);
              background-color: var(--pf-v6-global--primary-color--200);
              padding: var(--pf-v6-global--spacer--xs) var(--pf-v6-global--spacer--sm);
              border-radius: var(--pf-v6-global--BorderRadius--sm);
              text-transform: uppercase;
              letter-spacing: 0.025em;
              white-space: nowrap;
              margin-left: auto;
            }
          `}</style>
          <Tooltip 
            content="Search services" 
            position="bottom"
            {...(isSearchExpanded ? { isVisible: false } : {})}
          >
            <div className={isSearchExpanded ? 'masthead-search-expanded' : ''}>
              <SearchInput
                placeholder="Search across all services..."
                value={mastheadSearchValue}
                onChange={onMastheadSearchChange}
                onClear={onMastheadSearchClear}
                expandableInput={{
                  isExpanded: isSearchExpanded,
                  onToggleExpand: onSearchToggle,
                  toggleAriaLabel: "Expandable search input toggle",
                  hasAnimations: true
                }}
                aria-label="Global search"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && isSearchExpanded && (
                <div className="search-results-dropdown">
                                      <Menu 
                        onSelect={(event, itemId) => {
                          console.log('Selected search result:', itemId);
                          setShowSearchResults(false);
                          // Find the result and navigate if it has a route
                          const selectedResult = searchResults.find(result => result.id === itemId);
                          if (selectedResult && selectedResult.route) {
                            navigate(selectedResult.route);
                          }
                        }}
                      >
                      <MenuList>
                        <MenuGroup label="Top 5 results">
                          {searchResults.map((result) => (
                            <MenuItem 
                              key={result.id}
                              itemId={result.id}
                              description={result.description}
                              onClick={() => {
                                console.log('Selected search result:', result);
                                setShowSearchResults(false);
                                // Navigate to the route if it exists
                                if (result.route) {
                                  navigate(result.route);
                                }
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span>{result.title}</span>
                                <span className="search-result-category-badge">{result.category}</span>
                              </div>
                            </MenuItem>
                          ))}
                        </MenuGroup>
                      </MenuList>
                    </Menu>
                  </div>
                )}
              </div>
            </Tooltip>
        </div>
      </MastheadMain>
      <MastheadContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            {/* Settings */}
            <Tooltip 
              content="Settings" 
              position="bottom"
              {...(isUtilitiesDropdownOpen ? { isVisible: false } : {})}
            >
              <Dropdown
                isOpen={isUtilitiesDropdownOpen}
                onSelect={onUtilitiesDropdownSelect}
                onOpenChange={(isOpen: boolean) => setIsUtilitiesDropdownOpen(isOpen)}
                toggle={(toggleRef: React.Ref<any>) => (
                  <Button
                    ref={toggleRef}
                    onClick={onUtilitiesDropdownToggle}
                    variant="control"
                    aria-label="Settings"
                    aria-expanded={isUtilitiesDropdownOpen}
                    className={isUtilitiesDropdownOpen ? 'pf-m-clicked' : ''}
                  >
                    <CogIcon />
                  </Button>
                )}
                shouldFocusToggleOnSelect
              >
                <Menu>
                  <MenuList>
                    <MenuGroup label="Settings">
                      <MenuItem 
                        icon={<BellIcon />}
                        onClick={() => {
                          navigate('/alert-manager');
                          setIsUtilitiesDropdownOpen(false);
                        }}
                      >
                        Alert Manager
                      </MenuItem>
                      <MenuItem 
                        icon={<DatabaseIcon />}
                        onClick={() => {
                          navigate('/data-integration');
                          setIsUtilitiesDropdownOpen(false);
                        }}
                      >
                        Data Integration
                      </MenuItem>
                    </MenuGroup>
                    <MenuGroup label="Identity & Access Management">
                      <MenuItem 
                        icon={<UsersIcon />}
                        onClick={() => {
                          navigate('/user-access');
                          setIsUtilitiesDropdownOpen(false);
                        }}
                      >
                        User Access
                      </MenuItem>
                      <MenuItem 
                        icon={<ShieldAltIcon />}
                        onClick={() => {
                          navigate('/authentication-policy');
                          setIsUtilitiesDropdownOpen(false);
                        }}
                      >
                        Authentication Policy
                      </MenuItem>
                      <MenuItem 
                        icon={<ServerIcon />}
                        onClick={() => {
                          navigate('/service-accounts');
                          setIsUtilitiesDropdownOpen(false);
                        }}
                      >
                        Service Accounts
                      </MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>
              </Dropdown>
            </Tooltip>

            {/* Help Panel */}
            <Tooltip 
              content="Help" 
              position="bottom"
              {...(isDrawerExpanded ? { isVisible: false } : {})}
            >
              <Button
                variant="control"
                onClick={onDrawerToggle}
                aria-label="Help"
                aria-expanded={isDrawerExpanded}
                className={isDrawerExpanded ? 'pf-m-clicked' : ''}
              >
                <QuestionCircleIcon />
              </Button>
            </Tooltip>

            {/* Alerts */}
            <Tooltip 
              content="Alerts" 
              position="bottom"
              {...(isNotificationDrawerOpen ? { isVisible: false } : {})}
            >
              <Button
                variant="control"
                onClick={onNotificationDrawerToggle}
                aria-label="Alerts"
                aria-expanded={isNotificationDrawerOpen}
                className={isNotificationDrawerOpen ? 'pf-m-clicked' : ''}
              >
                <BellIcon />
              </Button>
            </Tooltip>

            {/* User dropdown */}
            <Tooltip 
              content="User menu" 
              position="bottom"
              {...(isUserDropdownOpen ? { isVisible: false } : {})}
            >
              <Dropdown
                isOpen={isUserDropdownOpen}
                onSelect={onUserDropdownSelect}
                onOpenChange={(isOpen: boolean) => setIsUserDropdownOpen(isOpen)}
                toggle={(toggleRef: React.Ref<any>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={onUserDropdownToggle}
                    isExpanded={isUserDropdownOpen}
                    aria-label="User menu"
                    icon={<UserIcon />}
                  >
                    Ned Username
                  </MenuToggle>
                )}
                shouldFocusToggleOnSelect
              >
              <DropdownList>
                <div style={{ padding: '16px' }}>
                  <DescriptionList isCompact>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Username:</DescriptionListTerm>
                      <DescriptionListDescription>Ned Username</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Account number:</DescriptionListTerm>
                      <DescriptionListDescription>12345678</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Org ID:</DescriptionListTerm>
                      <DescriptionListDescription>987654321</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </div>
                <div style={{ paddingBottom: '8px' }}>
                  <Divider />
                </div>
                <DropdownItem
                  component="a"
                  href="https://console.redhat.com/settings/profile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My profile
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    navigate('/my-user-access');
                    setIsUserDropdownOpen(false);
                  }}
                >
                  My User Access
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    navigate('/alert-manager');
                    setIsUserDropdownOpen(false);
                  }}
                >
                  My Alert Preferences
                </DropdownItem>
                <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                  <Divider />
                </div>
                <DropdownItem>
                  Logout
                </DropdownItem>
              </DropdownList>
              </Dropdown>
            </Tooltip>
        </div>
      </MastheadContent>
    </Masthead>
  );

  const renderNavItem = (route: IAppRoute, index: number) => (
    <NavItem key={`${route.label}-${index}`} id={`${route.label}-${index}`} isActive={route.path === location.pathname}>
      <NavLink
        to={route.path}
      >
        {route.label}
      </NavLink>
    </NavItem>
  );

  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => (
    <NavExpandable
      key={`${group.label}-${groupIndex}`}
      id={`${group.label}-${groupIndex}`}
      title={group.label}
      isActive={group.routes.some((route) => route.path === location.pathname)}
    >
      {group.routes.map((route, idx) => route.label && renderNavItem(route, idx))}
    </NavExpandable>
  );

  // Determine which navigation group to show based on current route
  const getCurrentRouteGroup = (): IAppRouteGroup | null => {
    const currentPath = location.pathname;
    
    for (const route of routes) {
      if (route.routes) {
        // This is a route group, check if current path belongs to it
        if (route.routes.some(r => r.path === currentPath)) {
          return route as IAppRouteGroup;
        }
      }
    }
    return null;
  };

  const currentRouteGroup = getCurrentRouteGroup();

  const Navigation = (
    <Nav id="nav-primary-simple">
      <NavList id="nav-list-simple">
        {currentRouteGroup ? (
          // Show navigation items for the current group
          currentRouteGroup.routes.map((route, idx) => route.label && renderNavItem(route, idx))
        ) : (
          // Fallback: show all routes if no group is matched (shouldn't happen with new structure)
          routes.map(
            (route, idx) => route.label && (!route.routes ? renderNavItem(route, idx) : renderNavGroup(route, idx)),
          )
        )}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer?.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );

  const drawerContent = (
    <DrawerPanelContent defaultSize="580px">
      <DrawerHead>
        <Title headingLevel="h2" size="lg">
          <QuestionCircleIcon style={{ marginRight: '8px' }} />
          Hybrid Cloud Help
        </Title>
        <DrawerActions>
          <DrawerCloseButton onClick={onDrawerClose} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody>
        <Tabs 
          isBox
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          onAdd={handleAddTab}
          aria-label="Dashboard tabs"
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={tab.id}
              eventKey={index} 
              title={<TabTitleText>{tab.title}</TabTitleText>}
              aria-label={`${tab.title} tab`}
              actions={
                tab.closable !== false ? (
                  <TabAction
                    aria-label={`Close ${tab.title}`}
                    onClick={(event) => handleCloseTab(event, index)}
                  >
                    <TimesIcon />
                  </TabAction>
                ) : null
              }
            >
              {renderTabContent(tab, index)}
            </Tab>
          ))}
        </Tabs>
      </DrawerContentBody>
    </DrawerPanelContent>
  );



  // Create notification drawer content
  const notificationDrawerContent = (
    <DrawerPanelContent defaultSize="580px">
      <DrawerHead>
        <span style={{ fontWeight: 'bold' }}>Notifications</span>
        <DrawerActions>
          <Dropdown
            isOpen={isNotificationActionsOpen}
            onOpenChange={(isOpen: boolean) => setIsNotificationActionsOpen(isOpen)}
            popperProps={{
              position: 'right'
            }}
            toggle={(toggleRef: React.Ref<any>) => (
              <MenuToggle
                ref={toggleRef}
                aria-label="Notification actions menu"
                variant="plain"
                onClick={() => setIsNotificationActionsOpen(!isNotificationActionsOpen)}
              >
                <EllipsisVIcon />
              </MenuToggle>
            )}
            shouldFocusToggleOnSelect
          >
            <DropdownList>
              <DropdownItem
                onClick={() => {
                  navigate('/event-log');
                  setIsNotificationActionsOpen(false);
                }}
              >
                Event log
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  navigate('/alert-manager');
                  setIsNotificationActionsOpen(false);
                }}
              >
                My alert preferences
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  navigate('/alert-manager');
                  setIsNotificationActionsOpen(false);
                }}
              >
                Organization defaults
              </DropdownItem>
            </DropdownList>
          </Dropdown>
          <DrawerCloseButton onClick={onNotificationDrawerClose} />
        </DrawerActions>
      </DrawerHead>
      <DrawerContentBody>
        <NotificationDrawer>
          <NotificationDrawerBody>
            <NotificationDrawerList>
              <NotificationDrawerListItem variant="info">
                <NotificationDrawerListItemHeader
                  variant="info"
                  title="System Update Available"
                  srTitle="Info notification:"
                />
                <NotificationDrawerListItemBody timestamp="5 minutes ago">
                  A new system update is available for installation. Click to view details.
                </NotificationDrawerListItemBody>
              </NotificationDrawerListItem>
              <NotificationDrawerListItem variant="warning">
                <NotificationDrawerListItemHeader
                  variant="warning"
                  title="Storage Space Low"
                  srTitle="Warning notification:"
                />
                <NotificationDrawerListItemBody timestamp="15 minutes ago">
                  Your storage space is running low. Consider removing unused files.
                </NotificationDrawerListItemBody>
              </NotificationDrawerListItem>
              <NotificationDrawerListItem variant="success">
                <NotificationDrawerListItemHeader
                  variant="success"
                  title="Backup Completed"
                  srTitle="Success notification:"
                />
                <NotificationDrawerListItemBody timestamp="1 hour ago">
                  Your scheduled backup has completed successfully.
                </NotificationDrawerListItemBody>
              </NotificationDrawerListItem>
            </NotificationDrawerList>
          </NotificationDrawerBody>
        </NotificationDrawer>
      </DrawerContentBody>
    </DrawerPanelContent>
  );

  return (
    <>
      <Page
        mainContainerId={pageId}
        masthead={masthead}
        sidebar={sidebarOpen && !isPageWithoutNav && Sidebar}
        skipToContent={PageSkipToContent}
      >
        {/* Notification Drawer (outer, right-side) */}
        <Drawer isExpanded={isNotificationDrawerOpen} isInline position="right">
          <DrawerContent panelContent={notificationDrawerContent}>
            {/* Help Drawer (inner, left-side) */}
            <Drawer isExpanded={isDrawerExpanded} isInline>
              <DrawerContent panelContent={drawerContent}>
                {children}
              </DrawerContent>
            </Drawer>
          </DrawerContent>
        </Drawer>
      </Page>
      
      {/* Full-width Services Drawer under Masthead */}
      {isLogoDropdownOpen && (
        <div
          ref={servicesDropdownRef}
          style={{
            position: 'fixed',
            top: '72px',
            left: '24px',
            right: '24px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            padding: '24px',
            borderRadius: '12px',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          {/* Close button */}
          <Button
            variant="plain"
            aria-label="Close services panel"
            onClick={() => setIsLogoDropdownOpen(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10000
            }}
          >
            <TimesIcon />
          </Button>
          <style>
            {`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .pf-v6-c-menu {
                box-shadow: none !important;
              }
              /* Custom selected state for primary-detail menu items */
              .pf-v6-c-menu__item.pf-m-selected,
              .pf-v6-c-menu__item[aria-selected="true"],
              .pf-v6-c-menu__item.pf-m-current {
                background-color: var(--pf-v6-global--BackgroundColor--200) !important;
                color: var(--pf-v6-global--Color--100) !important;
              }
              /* Hide the checkmark icon for selected menu items */
              .pf-v6-c-menu__item.pf-m-selected .pf-v6-c-menu__item-select-icon,
              .pf-v6-c-menu__item[aria-selected="true"] .pf-v6-c-menu__item-select-icon,
              .pf-v6-c-menu__item.pf-m-current .pf-v6-c-menu__item-select-icon {
                display: none !important;
              }
              /* Ensure hover state works correctly with selected state */
              .pf-v6-c-menu__item.pf-m-selected:hover,
              .pf-v6-c-menu__item[aria-selected="true"]:hover,
              .pf-v6-c-menu__item.pf-m-current:hover {
                background-color: var(--pf-v6-global--BackgroundColor--200) !important;
              }
              /* Force default selected styling for menu items by data attribute */
              .pf-v6-c-menu__item[data-selected="true"] {
                background-color: var(--pf-v6-global--BackgroundColor--200) !important;
                color: var(--pf-v6-global--Color--100) !important;
              }
              .pf-v6-c-menu__item[data-selected="true"] .pf-v6-c-menu__item-select-icon {
                display: none !important;
              }
              .pf-v6-c-menu__item[data-selected="true"]:hover {
                background-color: var(--pf-v6-global--BackgroundColor--200) !important;
              }
              /* Explicit styling for My Favorite Services when selected */
              .pf-v6-c-menu__item[data-item-id="my-favorite-services"][data-selected="true"],
              .pf-v6-c-menu__item[itemid="my-favorite-services"].pf-m-selected,
              .pf-v6-c-menu__item[itemid="my-favorite-services"][aria-selected="true"] {
                background-color: var(--pf-v6-global--BackgroundColor--200) !important;
                color: var(--pf-v6-global--Color--100) !important;
              }
              /* Force My Favorite Services to show default selected background - HIGHEST PRIORITY */
              .pf-v6-c-menu .pf-v6-c-menu__list .pf-v6-c-menu__item[data-item-id="my-favorite-services"] {
                background-color: #f0f0f0 !important;
                color: #151515 !important;
              }
              .pf-v6-c-menu .pf-v6-c-menu__list .pf-v6-c-menu__item[data-item-id="my-favorite-services"]:hover {
                background-color: #e7e7e7 !important;
                color: #151515 !important;
              }
              /* Override when other items are selected */
              .pf-v6-c-menu .pf-v6-c-menu__list .pf-v6-c-menu__item[data-item-id="my-favorite-services"][data-selected="false"] {
                background-color: transparent !important;
                color: var(--pf-v6-global--Color--100) !important;
              }
              /* Customize star icon color in My Favorite Services - Multiple targeting approaches */
              .pf-v6-c-menu .pf-v6-c-menu__list .pf-v6-c-menu__item[data-item-id="my-favorite-services"] .pf-v6-c-menu__item-icon svg,
              .pf-v6-c-menu__item[data-item-id="my-favorite-services"] .pf-v6-c-menu__item-icon svg,
              .pf-v6-c-menu__item[data-item-id="my-favorite-services"] svg,
              .pf-v6-c-menu__item[data-item-id="my-favorite-services"] .pf-v6-c-menu__item-icon,
              [data-item-id="my-favorite-services"] svg {
                color: #f39200 !important;
                fill: #f39200 !important;
              }
              /* Try with PatternFly variable as fallback */
              .pf-v6-c-menu__item[data-item-id="my-favorite-services"] svg {
                color: var(--pf-v6-c-button--m-favorited--hover__icon--Color, #f39200) !important;
                fill: var(--pf-v6-c-button--m-favorited--hover__icon--Color, #f39200) !important;
              }
              /* Style link items differently - increased specificity */
              .pf-v6-c-menu__item[data-is-link="true"] .pf-v6-c-menu__item-main {
                color: var(--pf-v6-global--link--Color) !important;
              }
              .pf-v6-c-menu__item[data-is-link="true"]:hover .pf-v6-c-menu__item-main {
                background-color: var(--pf-v6-global--BackgroundColor--100) !important;
                color: var(--pf-v6-global--link--Color--hover) !important;
                text-decoration: underline;
              }
              .pf-v6-c-menu__item[data-is-link="true"]:hover {
                background-color: var(--pf-v6-global--BackgroundColor--100) !important;
              }
              /* Maximum specificity targeting for link items */
              .pf-v6-c-menu .pf-v6-c-menu__list .pf-v6-c-menu__item[data-is-link="true"] {
                color: #0066cc !important;
              }
              .pf-v6-c-menu .pf-v6-c-menu__list .pf-v6-c-menu__item[data-is-link="true"]:hover {
                color: #004080 !important;
                background-color: #f0f0f0 !important;
              }
              /* Target all possible child elements and text content */
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"] *,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"] .pf-v6-c-menu__item-text,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"] .pf-v6-c-menu__item-main,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"] button,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"] a,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"] span,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"] div {
                color: #0066cc !important;
              }
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"]:hover *,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"]:hover .pf-v6-c-menu__item-text,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"]:hover .pf-v6-c-menu__item-main,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"]:hover button,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"]:hover a,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"]:hover span,
              .pf-v6-c-menu .pf-v6-c-menu__item[data-is-link="true"]:hover div {
                color: #004080 !important;
              }
              /* Nuclear option - override everything within link items */
              [data-is-link="true"] {
                color: #0066cc !important;
              }
              [data-is-link="true"]:hover {
                color: #004080 !important;
              }
              /* Ultimate specificity - target the exact component structure */
              .pf-v6-c-menu__list .pf-v6-c-menu__item[data-is-link="true"] {
                color: #0066cc !important;
              }
              .pf-v6-c-menu__list .pf-v6-c-menu__item[data-is-link="true"]:hover {
                color: #004080 !important;
              }
              /* Override PatternFly's CSS custom properties */
              .pf-v6-c-menu__item[data-is-link="true"] {
                --pf-v6-c-menu__item--Color: #0066cc !important;
                --pf-v6-c-menu__item--m-current--Color: #0066cc !important;
                --pf-v6-c-menu__item--hover--Color: #004080 !important;
              }
              /* CSS class targeting for link items */
              .custom-link-menu-item {
                color: #0066cc !important;
              }
              .custom-link-menu-item:hover {
                color: #004080 !important;
                background-color: #f0f0f0 !important;
              }
              .custom-link-menu-item * {
                color: #0066cc !important;
              }
              .custom-link-menu-item:hover * {
                color: #004080 !important;
              }
              /* Prevent link items from showing selected state */
              .pf-v6-c-menu__item[data-is-link="true"].pf-m-selected {
                background-color: transparent !important;
                color: #0066cc !important;
              }
              .pf-v6-c-menu__item[data-is-link="true"] .pf-v6-c-menu__item-select-icon {
                display: none !important;
              }

            `}
          </style>
          <div style={{ maxWidth: '1200px', margin: '0 auto', height: '800px' }}>
            <Card style={{ height: '100%' }}>
              <CardBody style={{ padding: 0, height: '100%' }}>
                <Split hasGutter style={{ height: '100%' }}>
                  {/* Primary (Menu) Side */}
                  <SplitItem style={{ 
                    width: '450px', 
                    minWidth: '450px', 
                    maxWidth: '450px', 
                    flexShrink: 0, 
                    flexGrow: 0, 
                    borderRight: '1px solid #d2d2d2' 
                  }}>
                    <div style={{ height: '100%' }}>
                      <Menu 
                        key={`menu-${isLogoDropdownOpen}-${selectedMenuItem}`}
                        aria-label="Services menu"
                        activeItemId={selectedMenuItem}
                        selected={selectedMenuItem}
                        onSelect={(event, itemId) => {
                          // Find the clicked item across all groups
                          let clickedItem: MenuItem | null = null;
                          for (const groupItems of Object.values(menuGroupsData)) {
                            const found = groupItems.find(item => item.id === itemId);
                            if (found) {
                              clickedItem = found;
                              break;
                            }
                          }
                          
                          if (clickedItem?.isLink && clickedItem?.url) {
                            // Navigate to URL for link items
                            window.location.href = clickedItem.url;
                          } else {
                            // Set selection for non-link items
                            setSelectedMenuItem(itemId as string);
                          }
                        }}
                      >
                        <MenuList>
                          {Object.entries(menuGroupsData).map(([groupTitle, groupItems], groupIndex, groupsArray) => (
                            <React.Fragment key={groupTitle}>
                              {groupTitle === 'Services' ? (
                                <MenuGroup>
                                  <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '8px 16px 8px 16px',
                                    fontSize: 'var(--pf-v6-global--FontSize--sm)',
                                    fontWeight: 'var(--pf-v6-global--FontWeight--bold)',
                                    color: 'var(--pf-v6-global--Color--200)'
                                  }}>
                                    <span>Services</span>
                                    <a 
                                      href="/all-services"
                                      style={{ 
                                        fontSize: 'var(--pf-v6-global--FontSize--xs)',
                                        fontWeight: 'var(--pf-v6-global--FontWeight--normal)',
                                        color: '#0066cc',
                                        textDecoration: 'none'
                                      }}
                                      onMouseEnter={(e) => (e.target as HTMLElement).style.textDecoration = 'underline'}
                                      onMouseLeave={(e) => (e.target as HTMLElement).style.textDecoration = 'none'}
                                    >
                                      View all services
                                    </a>
                                  </div>
                                  {groupItems.map((item) => (
                                    <MenuItem 
                                      key={item.id}
                                      itemId={item.id}
                                      icon={!item.isLink ? item.icon : undefined}
                                      isSelected={!item.isLink && selectedMenuItem === item.id}
                                      data-item-id={item.id}
                                      data-selected={!item.isLink && selectedMenuItem === item.id ? "true" : "false"}
                                      data-is-link={item.isLink ? "true" : "false"}
                                      className={`${item.isLink ? 'custom-link-menu-item' : ''} ${!item.isLink && selectedMenuItem === item.id ? 'pf-m-selected' : ''}`.trim()}
                                      style={item.isLink ? { 
                                        color: '#0066cc', 
                                        cursor: 'pointer',
                                        ['--pf-v6-c-menu__item--Color' as any]: '#0066cc',
                                        ['--pf-v6-c-menu__item--m-current--Color' as any]: '#0066cc',
                                        ['--pf-v6-c-menu__item--hover--Color' as any]: '#004080'
                                      } : (!item.isLink && selectedMenuItem === item.id ? {
                                        backgroundColor: 'var(--pf-v6-global--BackgroundColor--200)',
                                        color: 'var(--pf-v6-global--Color--100)'
                                      } : undefined)}
                                    >
                                      {item.name}
                                    </MenuItem>
                                  ))}
                                </MenuGroup>
                              ) : (
                                <MenuGroup label={groupTitle}>
                                  {groupItems.map((item) => (
                                    <MenuItem 
                                      key={item.id}
                                      itemId={item.id}
                                      icon={!item.isLink ? item.icon : undefined}
                                      isSelected={!item.isLink && selectedMenuItem === item.id}
                                      data-item-id={item.id}
                                      data-selected={!item.isLink && selectedMenuItem === item.id ? "true" : "false"}
                                      data-is-link={item.isLink ? "true" : "false"}
                                      className={`${item.isLink ? 'custom-link-menu-item' : ''} ${!item.isLink && selectedMenuItem === item.id ? 'pf-m-selected' : ''}`.trim()}
                                      style={item.isLink ? { 
                                        color: '#0066cc', 
                                        cursor: 'pointer',
                                        ['--pf-v6-c-menu__item--Color' as any]: '#0066cc',
                                        ['--pf-v6-c-menu__item--m-current--Color' as any]: '#0066cc',
                                        ['--pf-v6-c-menu__item--hover--Color' as any]: '#004080'
                                      } : (!item.isLink && selectedMenuItem === item.id ? {
                                        backgroundColor: 'var(--pf-v6-global--BackgroundColor--200)',
                                        color: 'var(--pf-v6-global--Color--100)'
                                      } : undefined)}
                                    >
                                      {item.name}
                                    </MenuItem>
                                  ))}
                                </MenuGroup>
                              )}
                              {groupIndex < groupsArray.length - 1 && (
                                <Divider component="li" />
                              )}
                            </React.Fragment>
                          ))}
                        </MenuList>
                      </Menu>
                    </div>
                  </SplitItem>

                  {/* Detail Side */}
                  <SplitItem isFilled>
                    <div style={{ padding: '24px', height: '100%', overflow: 'auto' }}>
                      {(() => {
                        // Find the selected menu item only among non-link items
                        let currentMenuItem: MenuItem | null = null;
                        for (const groupItems of Object.values(menuGroupsData)) {
                          const found = groupItems.find(item => item.id === selectedMenuItem && !item.isLink);
                          if (found) {
                            currentMenuItem = found;
                            break;
                          }
                        }
                        if (!currentMenuItem) return null;
                        
                        return (
                          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
                            <FlexItem>
                              <Title headingLevel="h3" size="xl">
                                {currentMenuItem.name}
                              </Title>
                            </FlexItem>

                            <FlexItem>
                              <Menu>
                                <MenuGroup label="Red Hat Enterprise Linux" labelHeadingLevel="h2">
                                  <Divider />
                                  <MenuList>
                                    <MenuItem 
                                      itemId="rhel-insights"
                                      onClick={() => console.log('Red Hat Insights clicked')}
                                      actions={
                                        <MenuItemAction
                                          icon={<StarIcon />}
                                          actionId="favorite"
                                          onClick={() => console.log('Favorite clicked')}
                                          aria-label="Favorite"
                                        />
                                      }
                                    >
                                      Red Hat Insights
                                    </MenuItem>
                                    <MenuItem 
                                      itemId="rhel-patch"
                                      onClick={() => console.log('Patch Management clicked')}
                                      actions={
                                        <MenuItemAction
                                          icon={<StarIcon />}
                                          actionId="favorite"
                                          onClick={() => console.log('Favorite clicked')}
                                          aria-label="Favorite"
                                        />
                                      }
                                    >
                                      Patch Management
                                    </MenuItem>
                                  </MenuList>
                                </MenuGroup>
                                
                                <div style={{ marginTop: '24px' }}>
                                  <MenuGroup label="Red Hat OpenShift" labelHeadingLevel="h2">
                                    <Divider />
                                    <MenuList>
                                      <MenuItem 
                                        itemId="openshift-clusters"
                                        onClick={() => console.log('OpenShift Clusters clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        OpenShift Clusters
                                      </MenuItem>
                                      <MenuItem 
                                        itemId="container-registry"
                                        onClick={() => console.log('Container Registry clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Container Registry
                                      </MenuItem>
                                    </MenuList>
                                  </MenuGroup>
                                </div>
                                
                                <div style={{ marginTop: '24px' }}>
                                  <MenuGroup label="Red Hat Ansible Automation Platform" labelHeadingLevel="h2">
                                    <Divider />
                                    <MenuList>
                                      <MenuItem 
                                        itemId="automation-hub"
                                        onClick={() => console.log('Automation Hub clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Automation Hub
                                      </MenuItem>
                                      <MenuItem 
                                        itemId="automation-controller"
                                        onClick={() => console.log('Automation Controller clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Automation Controller
                                      </MenuItem>
                                    </MenuList>
                                  </MenuGroup>
                                </div>
                                
                                <div style={{ marginTop: '24px' }}>
                                  <MenuGroup label="Identity & Access Management (IAM)" labelHeadingLevel="h2">
                                    <Divider />
                                    <MenuList>
                                      <MenuItem 
                                        itemId="user-access"
                                        onClick={() => console.log('User Access clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        User Access
                                      </MenuItem>
                                      <MenuItem 
                                        itemId="service-accounts"
                                        onClick={() => console.log('Service Accounts clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Service Accounts
                                      </MenuItem>
                                    </MenuList>
                                  </MenuGroup>
                                </div>
                                
                                <div style={{ marginTop: '24px' }}>
                                  <MenuGroup label="Console Settings" labelHeadingLevel="h2">
                                    <Divider />
                                    <MenuList>
                                      <MenuItem 
                                        itemId="preferences"
                                        onClick={() => console.log('Preferences clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Preferences
                                      </MenuItem>
                                      <MenuItem 
                                        itemId="notifications"
                                        onClick={() => console.log('Notifications clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Notifications
                                      </MenuItem>
                                    </MenuList>
                                  </MenuGroup>
                                </div>
                                
                                <div style={{ marginTop: '24px' }}>
                                  <MenuGroup label="Subscription Services" labelHeadingLevel="h2">
                                    <Divider />
                                    <MenuList>
                                      <MenuItem 
                                        itemId="subscriptions"
                                        onClick={() => console.log('Subscriptions clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Subscriptions
                                      </MenuItem>
                                      <MenuItem 
                                        itemId="billing"
                                        onClick={() => console.log('Billing clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Billing
                                      </MenuItem>
                                    </MenuList>
                                  </MenuGroup>
                                </div>
                                
                                <div style={{ marginTop: '24px' }}>
                                  <MenuGroup label="Other" labelHeadingLevel="h2">
                                    <Divider />
                                    <MenuList>
                                      <MenuItem 
                                        itemId="documentation"
                                        onClick={() => console.log('Documentation clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Documentation
                                      </MenuItem>
                                      <MenuItem 
                                        itemId="support"
                                        onClick={() => console.log('Support clicked')}
                                        actions={
                                          <MenuItemAction
                                            icon={<StarIcon />}
                                            actionId="favorite"
                                            onClick={() => console.log('Favorite clicked')}
                                            aria-label="Favorite"
                                          />
                                        }
                                      >
                                        Support
                                      </MenuItem>
                                    </MenuList>
                                  </MenuGroup>
                                </div>
                              </Menu>
                            </FlexItem>
                          </Flex>
                        );
                      })()}
                    </div>
                  </SplitItem>
                </Split>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
      

    </>
  );
};

export { AppLayout };

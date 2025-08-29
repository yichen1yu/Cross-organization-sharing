import * as React from 'react';
import {
  PageSection,
  Title,
  Content,
  Card,
  CardBody,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Button,
  Breadcrumb,
  BreadcrumbItem
} from '@patternfly/react-core';
import { 
  CogIcon, 
  ServerIcon, 
  LayerGroupIcon, 
  ShieldAltIcon, 
  ChartLineIcon, 
  QuestionCircleIcon,
  CloudIcon,
  DatabaseIcon,
  NetworkWiredIcon,
  MonitoringIcon,
  ExclamationTriangleIcon,
  UserIcon
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

const AllServices: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Settings',
      description: 'Configure and manage all settings related to eventing, alerting, and data sourcing.',
      icon: <CogIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--primary-color--100)' }} />,
      route: '/overview',
      category: 'Management'
    },
    {
      title: 'Infrastructure',
      description: 'Monitor and manage your cloud infrastructure, resources, and deployments.',
      icon: <ServerIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--success-color--100)' }} />,
      route: null,
      category: 'Infrastructure'
    },
    {
      title: 'Applications',
      description: 'Deploy, manage, and monitor your applications across hybrid cloud environments.',
      icon: <LayerGroupIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--info-color--100)' }} />,
      route: null,
      category: 'Platform'
    },
    {
      title: 'Security',
      description: 'Manage security policies, compliance, and access controls across your environment.',
      icon: <ShieldAltIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--warning-color--100)' }} />,
      route: null,
      category: 'Security'
    },
    {
      title: 'Analytics',
      description: 'Gain insights into your cloud usage, performance metrics, and operational data.',
      icon: <ChartLineIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--palette--purple-400)' }} />,
      route: null,
      category: 'Analytics'
    },
    {
      title: 'Support',
      description: 'Access documentation, support resources, and get help with your cloud journey.',
      icon: <QuestionCircleIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--Color--200)' }} />,
      route: null,
      category: 'Support'
    },
    {
      title: 'Cloud Management',
      description: 'Manage your multi-cloud environments and hybrid infrastructure.',
      icon: <CloudIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--primary-color--200)' }} />,
      route: null,
      category: 'Infrastructure'
    },
    {
      title: 'Database Services',
      description: 'Manage and monitor your database instances and connections.',
      icon: <DatabaseIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--success-color--200)' }} />,
      route: null,
      category: 'Data'
    },
    {
      title: 'Networking',
      description: 'Configure and monitor network connectivity and security.',
      icon: <NetworkWiredIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--info-color--200)' }} />,
      route: null,
      category: 'Infrastructure'
    },
    {
      title: 'Monitoring',
      description: 'Monitor system health, performance, and operational metrics.',
      icon: <MonitoringIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--palette--green-400)' }} />,
      route: null,
      category: 'Operations'
    },
    {
      title: 'Alerts & Events',
      description: 'Configure alerting rules and manage event notifications.',
      icon: <ExclamationTriangleIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--danger-color--100)' }} />,
      route: '/alert-manager',
      category: 'Operations'
    },
    {
      title: 'Identity & Access',
      description: 'Manage user identities, roles, and access permissions.',
      icon: <UserIcon style={{ fontSize: '24px', color: 'var(--pf-v6-global--palette--orange-400)' }} />,
      route: '/my-user-access',
      category: 'Security'
    }
  ];

  const categories = ['All', 'Management', 'Infrastructure', 'Platform', 'Security', 'Analytics', 'Data', 'Operations', 'Support'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</BreadcrumbItem>
          <BreadcrumbItem isActive>All Services</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
          <FlexItem>
            <Content>
              <Title headingLevel="h1" size="2xl">
                All Services
              </Title>
              <p>
                Explore all available services in your Red Hat Hybrid Cloud Console. 
                Find the tools and services you need to manage your hybrid cloud environment.
              </p>
            </Content>
          </FlexItem>

          <FlexItem>
            {/* Category Filter */}
            <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '24px' }}>
              {categories.map((category) => (
                <FlexItem key={category}>
                  <Button
                    variant={selectedCategory === category ? 'primary' : 'secondary'}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                </FlexItem>
              ))}
            </Flex>
          </FlexItem>
          
          <FlexItem>
            <Grid hasGutter>
              {filteredServices.map((service, index) => (
                <GridItem span={4} key={index}>
                  <Card 
                    isClickable={!!service.route} 
                    onClick={() => service.route && navigate(service.route)}
                    style={{ height: '100%' }}
                  >
                    <CardBody>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              {service.icon}
                            </FlexItem>
                            <FlexItem>
                              <span style={{ 
                                fontSize: '12px', 
                                color: 'var(--pf-v6-global--Color--200)',
                                fontWeight: 'var(--pf-v6-global--FontWeight--semi-bold)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                {service.category}
                              </span>
                            </FlexItem>
                          </Flex>
                        </FlexItem>
                        <FlexItem>
                          <Title headingLevel="h3" size="lg">{service.title}</Title>
                          <Content>
                            <p style={{ margin: '8px 0 0 0' }}>{service.description}</p>
                          </Content>
                          {!service.route && (
                            <div style={{ 
                              marginTop: '12px', 
                              fontSize: '12px', 
                              color: 'var(--pf-v6-global--Color--200)' 
                            }}>
                              Coming soon
                            </div>
                          )}
                        </FlexItem>
                      </Flex>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export { AllServices };

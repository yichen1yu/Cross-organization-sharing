import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Content,
  Divider,
  Flex,
  FlexItem,
  Gallery,
  List,
  ListItem,
  PageSection,
  Title
} from '@patternfly/react-core';
import { ServiceCard } from '@patternfly/react-component-groups';
import { 
  ArrowRightIcon, 
  BellIcon, 
  ChartLineIcon,
  ClockIcon,
  CloudIcon,
  CogIcon,
  CreditCardIcon,
  DesktopIcon,
  EllipsisVIcon,
  ExternalLinkAltIcon,
  GripVerticalIcon,
  SearchIcon,
  ServerIcon,
  ShieldAltIcon
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  
  // Get user name (currently hardcoded, matching the username dropdown)
  const userName = "Ned";

  // CSS styles for explore capability cards hover effects and column spans
  const cardHoverStyle = `
    .pf-v6-c-card.explore-capability-card {
      cursor: pointer !important;
      border: 1px solid var(--pf-v6-global--BorderColor--100) !important;
      transition: all 0.2s ease-in-out !important;
    }
    .pf-v6-c-card.explore-capability-card:hover {
      border: 1px solid var(--pf-v6-global--primary-color--100) !important;
      box-shadow: var(--pf-v6-global--BoxShadow--md) !important;
      background-color: var(--pf-v6-global--BackgroundColor--300) !important;
      transform: translateY(-2px) !important;
    }
    .pf-v6-c-card.explore-capability-card:active {
      transform: translateY(0px) !important;
    }
    /* Ensure proper wrapping behavior for all screen sizes */
    .pf-v6-l-gallery {
      flex-wrap: wrap !important;
      display: flex !important;
    }
    .pf-v6-l-gallery > * {
      flex-shrink: 1 !important;
      flex-grow: 1 !important;
      min-width: 280px !important;
    }
    
    /* Override PatternFly Gallery defaults for custom sized cards */
    .pf-v6-l-gallery > .settings-card-wide,
    .pf-v6-l-gallery > .explore-capabilities-wide,
    .pf-v6-l-gallery > .subscriptions-extra-wide {
      flex-grow: 0 !important;
    }
    
    /* Make first row cards (RHEL, OpenShift, Ansible, Recently Visited) same height */
    .pf-v6-c-card.first-row-card {
      height: 280px !important;
      display: flex !important;
      flex-direction: column !important;
      align-self: stretch !important;
    }
    
    /* Ensure card body grows to fill available space */
    .pf-v6-c-card.first-row-card .pf-v6-c-card__body {
      flex-grow: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
    }
    
    /* Ensure card header and footer have consistent sizing */
    .pf-v6-c-card.first-row-card .pf-v6-c-card__header,
    .pf-v6-c-card.first-row-card .pf-v6-c-card__footer {
      flex-shrink: 0 !important;
    }
    
    /* Create a more compact layout by reducing gap after first row */
    .pf-v6-l-gallery {
      gap: 16px !important;
    }
    
    /* Column spans for larger screens - PatternFly Gallery uses flexbox */
    @media (min-width: 1200px) {
      /* Specific adjustments for better visual alignment */
      .explore-capabilities-wide {
        margin-top: -8px !important;
      }
      
      /* Ensure first row cards have consistent height */
      .pf-v6-c-card.first-row-card {
        height: 280px !important;
      }
      
      /* Settings card - 2 columns out of 8 column grid = 25% */
      .settings-card-wide {
        flex: 0 0 calc(25% - 16px) !important;
        max-width: calc(25% - 16px) !important;
        min-width: calc(25% - 16px) !important;
      }
      
      /* Explore capabilities card - 6 columns out of 8 column grid = 75% */
      .explore-capabilities-wide {
        flex: 0 0 calc(75% - 16px) !important;
        max-width: calc(75% - 16px) !important;
        min-width: calc(75% - 16px) !important;
      }
      
      /* Subscriptions card - 8 columns out of 8 column grid = 100% */
      .subscriptions-extra-wide {
        flex: 0 0 calc(100% - 16px) !important;
        max-width: calc(100% - 16px) !important;
        min-width: calc(100% - 16px) !important;
      }
    }
    
    @media (min-width: 992px) and (max-width: 1199px) {
      /* Settings card - 33% on medium screens */
      .settings-card-wide {
        flex: 0 0 calc(33.333% - 16px) !important;
        max-width: calc(33.333% - 16px) !important;
        min-width: calc(33.333% - 16px) !important;
      }
      
      /* Explore capabilities card - 66% on medium screens */
      .explore-capabilities-wide {
        flex: 0 0 calc(66.666% - 16px) !important;
        max-width: calc(66.666% - 16px) !important;
        min-width: calc(66.666% - 16px) !important;
      }
      
      /* Subscriptions card - 100% on medium screens */
      .subscriptions-extra-wide {
        flex: 0 0 calc(100% - 16px) !important;
        max-width: calc(100% - 16px) !important;
        min-width: calc(100% - 16px) !important;
      }
    }
    
    /* On smaller screens, all cards take full width */
    @media (max-width: 991px) {
      .settings-card-wide,
      .explore-capabilities-wide,
      .subscriptions-extra-wide {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        min-width: 280px !important;
      }
    }
  `;

  return (
    <>
      <style>{cardHoverStyle}</style>
      <PageSection>
        {/* Header Section */}
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem>
            <div style={{ maxWidth: '1566px', margin: '0 auto', width: '100%' }}>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                <FlexItem flex={{ default: 'flex_1' }}>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>
                      <Title headingLevel="h1" size="2xl">
                        Hi, {userName}
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h2" size="lg">
                        Welcome to your Hybrid Cloud Console.
                      </Title>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <Button variant="link">
                        Reset to default
                      </Button>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="primary">
                        + Add widgets
                      </Button>
                    </FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </div>
          </FlexItem>
          
          {/* Divider */}
          <FlexItem>
            <div style={{ maxWidth: '1566px', margin: '0 auto', width: '100%' }}>
              <Divider />
            </div>
          </FlexItem>
          
          {/* Service Cards Section */}
          <FlexItem>
            <div style={{ maxWidth: '1566px', margin: '0 auto', width: '100%' }}>
              <Gallery 
                hasGutter 
                minWidths={{
                  default: '280px',
                  sm: '280px',
                  md: '280px',
                  lg: '280px',
                  xl: '280px'
                }}
                maxWidths={{
                  default: 'none'
                }}
              >
              <Card isFullHeight className="settings-card-wide first-row-card">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h4" className="pf-v6-c-card__title">
                        Red Hat Enterprise Linux
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Content>
                    Proactively assess, secure, and stabilize the business-critical services that you scale from your RHEL systems.
                  </Content>
                </CardBody>
                <CardFooter>
                  <Button variant="link" iconPosition="end" icon={<ArrowRightIcon />}>
                    Insights for RHEL
                  </Button>
                </CardFooter>
              </Card>
              
              <Card isFullHeight className="settings-card-wide first-row-card">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h4" className="pf-v6-c-card__title">
                        Red Hat OpenShift
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Content>
                    Build, run, and scale container-based applications - now with developer tools, CI/CD, and release management.
                  </Content>
                </CardBody>
                <CardFooter>
                  <Button variant="link" iconPosition="end" icon={<ArrowRightIcon />}>
                    OpenShift
                  </Button>
                </CardFooter>
              </Card>
              
              <Card isFullHeight className="settings-card-wide first-row-card">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h4" className="pf-v6-c-card__title">
                        Ansible Automation Platform
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Content>
                    Create, share, and manage automations - from development and operations, to security and network teams.
                  </Content>
                </CardBody>
                <CardFooter>
                  <Button variant="link" iconPosition="end" icon={<ArrowRightIcon />}>
                    Ansible
                  </Button>
                </CardFooter>
              </Card>
              
              <Card isFullHeight className="settings-card-wide first-row-card">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h4" className="pf-v6-c-card__title">
                        Recently Visited
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <Content>
                        Quick access to your most recently visited services and resources.
                      </Content>
                    </FlexItem>
                    <FlexItem flex={{ default: 'flex_1' }}>
                      <List isPlain>
                        <ListItem>
                          <Button variant="link" onClick={() => navigate('/dashboard')}>
                            Dashboard
                          </Button>
                        </ListItem>
                        <ListItem>
                          <Button variant="link" onClick={() => navigate('/alert-manager')}>
                            Alert Manager
                          </Button>
                        </ListItem>
                        <ListItem>
                          <Button variant="link" onClick={() => navigate('/data-integration')}>
                            Data Integration
                          </Button>
                        </ListItem>
                        <ListItem>
                          <Button variant="link" onClick={() => navigate('/my-user-access')}>
                            My User Access
                          </Button>
                        </ListItem>
                        <ListItem>
                          <Button variant="link" onClick={() => navigate('/event-log')}>
                            Event Log
                          </Button>
                        </ListItem>
                      </List>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
              
              <Card isFullHeight className="settings-card-wide">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsNone' }}>
                        <FlexItem>
                          <Title headingLevel="h4" className="pf-v6-c-card__title">
                            Settings
                          </Title>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="link" size="sm" onClick={() => navigate('/overview')}>
                            Manage settings
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                            <FlexItem>
                              <Content component="small" style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                                Recently fired events
                              </Content>
                            </FlexItem>
                            <FlexItem>
                              <Content component="p" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                7
                              </Content>
                            </FlexItem>
                          </Flex>
                        </FlexItem>
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                            <FlexItem>
                              <Content component="small" style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                                All data integrations
                              </Content>
                            </FlexItem>
                            <FlexItem>
                              <Content component="p" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                12
                              </Content>
                            </FlexItem>
                          </Flex>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
              
              <Card isFullHeight className="settings-card-wide">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h4" className="pf-v6-c-card__title">
                        Image Builder
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Content>
                    Create customized system images for disks, VMs, and cloud platforms. Image Builder automates configurations, saving you time and ensuring consistent, deployment-ready images every time.
                  </Content>
                </CardBody>
                <CardFooter>
                  <Button variant="link" iconPosition="end" icon={<ArrowRightIcon />}>
                    Images
                  </Button>
                </CardFooter>
              </Card>
              
              <Card isFullHeight className="explore-capabilities-wide">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h4" className="pf-v6-c-card__title">
                        Explore capabilities
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
                    {/* First row - 3 cards */}
                    <FlexItem>
                      <Flex direction={{ default: 'row' }} spaceItems={{ default: 'spaceItemsMd' }}>
                        <FlexItem flex={{ default: 'flex_1' }}>
                          <Card 
                            onClick={() => navigate('/tour')} 
                            className="explore-capability-card"
                            isCompact
                            variant="secondary"
                          >
                            <CardBody>
                              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Title headingLevel="h4" size="md">
                                    Get started with a tour
                                  </Title>
                                </FlexItem>
                                <FlexItem>
                                  <Content component="small">
                                    Take a quick guided tour to understand how the Red Hat Hybrid Cloud Console's capabilities will increase your efficiency
                                  </Content>
                                </FlexItem>
                              </Flex>
                            </CardBody>
                          </Card>
                        </FlexItem>
                        <FlexItem flex={{ default: 'flex_1' }}>
                          <Card 
                            onClick={() => navigate('/openshift-aws')} 
                            className="explore-capability-card"
                            isCompact
                            variant="secondary"
                          >
                            <CardBody>
                              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Title headingLevel="h4" size="md">
                                    Try OpenShift on AWS
                                  </Title>
                                </FlexItem>
                                <FlexItem>
                                  <Content component="small">
                                    Quickly build, deploy, and scale applications with Red Hat OpenShift Service on AWS (ROSA), our fully-managed turnkey application platform.
                                  </Content>
                                </FlexItem>
                              </Flex>
                            </CardBody>
                          </Card>
                        </FlexItem>
                        <FlexItem flex={{ default: 'flex_1' }}>
                          <Card 
                            onClick={() => navigate('/developer-sandbox')} 
                            className="explore-capability-card"
                            isCompact
                            variant="secondary"
                          >
                            <CardBody>
                              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Title headingLevel="h4" size="md">
                                    Try our products in the Developer Sandbox
                                  </Title>
                                </FlexItem>
                                <FlexItem>
                                  <Content component="small">
                                    The Developer Sandbox offers no-cost access to Red Hat products and technologies for trial use - no setup or configuration necessary.
                                  </Content>
                                </FlexItem>
                              </Flex>
                            </CardBody>
                          </Card>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    {/* Second row - 2 cards */}
                    <FlexItem>
                      <Flex direction={{ default: 'row' }} spaceItems={{ default: 'spaceItemsMd' }} justifyContent={{ default: 'justifyContentFlexStart' }}>
                        <FlexItem flex={{ default: 'flex_1' }} style={{ maxWidth: 'calc(33.333% - 8px)' }}>
                          <Card 
                            onClick={() => navigate('/rhel-analysis')} 
                            className="explore-capability-card"
                            isCompact
                            variant="secondary"
                          >
                            <CardBody>
                              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Title headingLevel="h4" size="md">
                                    Analyze RHEL environments
                                  </Title>
                                </FlexItem>
                                <FlexItem>
                                  <Content component="small">
                                    Analyze platforms and applications from the console to better manage your hybrid cloud environments.
                                  </Content>
                                </FlexItem>
                              </Flex>
                            </CardBody>
                          </Card>
                        </FlexItem>
                        <FlexItem flex={{ default: 'flex_1' }} style={{ maxWidth: 'calc(33.333% - 8px)' }}>
                          <Card 
                            onClick={() => navigate('/centos-rhel-conversion')} 
                            className="explore-capability-card"
                            isCompact
                            variant="secondary"
                          >
                            <CardBody>
                              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Title headingLevel="h4" size="md">
                                    Convert from CentOS to RHEL
                                  </Title>
                                </FlexItem>
                                <FlexItem>
                                  <Content component="small">
                                    Seamlessly migrate your CentOS systems to Red Hat Enterprise Linux with our conversion tools and guidance.
                                  </Content>
                                </FlexItem>
                              </Flex>
                            </CardBody>
                          </Card>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
              
              <Card isFullHeight className="settings-card-wide">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h4" className="pf-v6-c-card__title">
                        Advanced Cluster Security
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Content>
                    Fully hosted software as a service for protecting cloud-native applications and Kubernetes.
                  </Content>
                </CardBody>
                <CardFooter>
                  <Button variant="link" iconPosition="end" icon={<ArrowRightIcon />}>
                    RHACS Cloud Service
                  </Button>
                </CardFooter>
              </Card>
              
              <Card isFullHeight className="settings-card-wide">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h4" className="pf-v6-c-card__title">
                        Red Hat OpenShift AI
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Content>
                    Create, train, and serve artificial intelligence and machine learning (AI/ML) models.
                  </Content>
                </CardBody>
                <CardFooter>
                  <Button variant="link" iconPosition="end" icon={<ExternalLinkAltIcon />}>
                    OpenShift AI
                  </Button>
                </CardFooter>
              </Card>
              
              <Card isFullHeight className="subscriptions-extra-wide">
                <CardHeader>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h4" className="pf-v6-c-card__title">
                        Subscriptions
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                        <FlexItem>
                          <Button variant="plain" aria-label="More actions">
                            <EllipsisVIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Drag to reorder">
                            <GripVerticalIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Flex direction={{ default: 'row' }} spaceItems={{ default: 'spaceItemsMd' }}>
                    <FlexItem flex={{ default: 'flex_1' }}>
                      <Alert title="Active Subscriptions" variant="info" isInline>
                        15 active
                      </Alert>
                    </FlexItem>
                    <FlexItem flex={{ default: 'flex_1' }}>
                      <Alert title="Expiring Soon" variant="warning" isInline>
                        3 expiring
                      </Alert>
                    </FlexItem>
                    <FlexItem flex={{ default: 'flex_1' }}>
                      <Alert title="Usage Alerts" variant="danger" isInline>
                        2 alerts
                      </Alert>
                    </FlexItem>
                    <FlexItem flex={{ default: 'flex_1' }}>
                      <Alert title="Available Credits" variant="success" isInline>
                        $12,500
                      </Alert>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </Gallery>
            </div>
          </FlexItem>
          
          {/* Bottom Action Section */}
          <FlexItem>
            <div style={{ maxWidth: '1566px', margin: '0 auto', width: '100%' }}>
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Button variant="secondary" onClick={() => navigate('/all-services')} size="lg">
                  Explore All Services
                </Button>
              </div>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export { Homepage };
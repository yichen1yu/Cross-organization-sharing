import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Content,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  Label,
  LabelGroup,
  PageSection,
  Title
} from '@patternfly/react-core';
import { BookOpenIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { NavLink } from 'react-router-dom';

const LearningResourcesIAM: React.FunctionComponent = () => {
  const DocCard: React.FC<{ title: string; link?: string; description: string; badges: string[]; footerBadges?: string[] } > = ({ title, link, description, badges, footerBadges }) => (
    <Card isSelectable={false} isFlat>
      <CardHeader>
        <Title headingLevel="h3" size="md">
          {link ? (
            <Button variant="link" isInline component="a" href={link} target="_blank" rel="noopener noreferrer">{title}</Button>
          ) : (
            title
          )}
        </Title>
      </CardHeader>
      <CardBody>
        <LabelGroup numLabels={1} style={{ marginBottom: 8 }}>
          {badges.map(b => (<Label key={b} color="blue">{b}</Label>))}
        </LabelGroup>
        <Content>
          <p style={{ margin: 0 }}>{description}</p>
        </Content>
        {footerBadges && (
          <div style={{ marginTop: 12 }}>
            <LabelGroup>
              {footerBadges.map(b => (<Label key={b} color="grey">{b}</Label>))}
            </LabelGroup>
          </div>
        )}
      </CardBody>
    </Card>
  );

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>IAM</BreadcrumbItem>
          <BreadcrumbItem isActive>Learning Resources</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      
      <PageSection hasBodyWrapper={false}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <div className="pf-m-align-self-center" style={{ minWidth: '40px' }}>
              <BookOpenIcon style={{ fontSize: '32px', color: '#0066cc' }} aria-label="page-header-icon" />
            </div>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
            <div style={{ borderLeft: '1px solid #d2d2d2', height: '100%', marginRight: '16px' }}></div>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }}>
            <div>
              <Title headingLevel="h1" size="2xl">Learning Resources</Title>
              <Content>
                <p style={{ margin: 0, color: '#6a6e73' }}>Access training materials and resources for identity and access management best practices.</p>
                <div style={{ marginTop: '12px' }}>
                  <Button
                    variant="link"
                    isInline
                    icon={<ExternalLinkAltIcon />}
                    iconPosition="end"
                    component="a"
                    href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </Button>
                </div>
              </Content>
            </div>
          </FlexItem>
        </Flex>
      </PageSection>
      
      {/* Documentation section */}
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Title headingLevel="h2" size="lg" style={{ marginBottom: 12 }}>Documentation</Title>
        <Content><p style={{ marginTop: 0, color: '#6a6e73' }}>Technical information for using the service</p></Content>
        <Gallery hasGutter minWidths={{ default: '300px' }}>
          <GalleryItem>
            <DocCard
              title="Related console documentation"
              link="https://docs.redhat.com/"
              description="A complete list of documentation related to Hybrid Cloud Console settings."
              badges={["Documentation"]}
              footerBadges={["System configuration", "Identity and access"]}
            />
          </GalleryItem>
          <GalleryItem>
            <DocCard
              title="Setting up User Access"
              link="https://docs.redhat.com/"
              description="Configuring role‑based access control (RBAC) for services hosted on the Hybrid Cloud Console."
              badges={["Documentation"]}
              footerBadges={["Identity and access", "System configuration", "Security"]}
            />
          </GalleryItem>
          <GalleryItem>
            <DocCard
              title="Using two‑factor authentication"
              link="https://docs.redhat.com/"
              description="Configure organization‑wide two‑factor authentication."
              badges={["Documentation"]}
              footerBadges={["Identity and access", "Security"]}
            />
          </GalleryItem>
        </Gallery>
      </PageSection>

      {/* Quick starts section */}
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h2" size="lg" style={{ marginBottom: 12 }}>Quick starts</Title>
        <Content><p style={{ marginTop: 0, color: '#6a6e73' }}>Step‑by‑step instructions and tasks</p></Content>
        <Gallery hasGutter minWidths={{ default: '300px' }}>
          <GalleryItem>
            <DocCard
              title="Creating and executing remediation plans"
              link="https://docs.redhat.com/"
              description="Create and execute a remediation plan to resolve an issue detected by the Insights advisor service."
              badges={["Quick start"]}
              footerBadges={["Containers", "Infrastructure", "Automation", "Observability"]}
            />
          </GalleryItem>
          <GalleryItem>
            <DocCard
              title="Creating and managing workspaces"
              link="https://docs.redhat.com/"
              description="Learn how to create a workspace, add systems to it, and remove systems from it."
              badges={["Quick start"]}
              footerBadges={["Identity and access", "System configuration"]}
            />
          </GalleryItem>
          <GalleryItem>
            <DocCard
              title="Managing user access with workspaces"
              link="https://docs.redhat.com/"
              description="Learn how to manage access to your systems using workspaces."
              badges={["Quick start"]}
              footerBadges={["Identity and access", "Infrastructure", "System configuration"]}
            />
          </GalleryItem>
          <GalleryItem>
            <DocCard
              title="Restricting access to a service to a team"
              link="https://docs.redhat.com/"
              description="Grant administrative permissions for the vulnerability service to a select group of users."
              badges={["Quick start"]}
              footerBadges={["Identity and access", "Infrastructure", "System configuration", "Security"]}
            />
          </GalleryItem>
        </Gallery>
      </PageSection>
    </>
  );
};

export { LearningResourcesIAM };
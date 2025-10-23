import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Content, PageSection, Title } from '@patternfly/react-core';

const IdentityProviderIntegration: React.FunctionComponent = () => {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Organization management</BreadcrumbItem>
          <BreadcrumbItem isActive>Identity Provider Integration</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Card>
          <CardBody>
            <Content>
              <Title headingLevel="h1" size="2xl">Identity Provider Integration</Title>
              <p>Integrate and configure external identity providers for your organization.</p>
            </Content>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { IdentityProviderIntegration };




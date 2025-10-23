import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Content, PageSection, Title } from '@patternfly/react-core';

const AuthenticationFactors: React.FunctionComponent = () => {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Organization management</BreadcrumbItem>
          <BreadcrumbItem isActive>Authentication Factors</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Card>
          <CardBody>
            <Content>
              <Title headingLevel="h1" size="2xl">Authentication Factors</Title>
              <p>Set up and manage organization-wide authentication factors and MFA policies.</p>
            </Content>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { AuthenticationFactors };




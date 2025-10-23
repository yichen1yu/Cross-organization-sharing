import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Content, PageSection, Title } from '@patternfly/react-core';

const OrganizationWideAccess: React.FunctionComponent = () => {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Organization management</BreadcrumbItem>
          <BreadcrumbItem isActive>Organization-wide Access</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <Card>
          <CardBody>
            <Content>
              <Title headingLevel="h1" size="2xl">Organization-wide Access</Title>
              <p>Configure and review access policies that apply across the entire organization.</p>
            </Content>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { OrganizationWideAccess };




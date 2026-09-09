import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  Title,
  Content,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const Notifications: React.FunctionComponent = () => {
  useDocumentTitle('Notifications | Settings');
  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/">Red Hat Hybrid Cloud Console</BreadcrumbItem>
          <BreadcrumbItem component={Link} to="/settings/integrations">Settings</BreadcrumbItem>
          <BreadcrumbItem isActive>Notifications</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1" size="2xl">Notifications</Title>
        <Content component="p" style={{ marginTop: '8px' }}>
          Configure alert preferences and notification settings for your Hybrid Cloud Console.
        </Content>
      </PageSection>
    </>
  );
};

export { Notifications };

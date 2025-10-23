import * as React from 'react';
import { PageSection, Title, Content } from '@patternfly/react-core';

const Subscriptions: React.FunctionComponent = () => {
  return (
    <PageSection hasBodyWrapper={false} id="primary-app-container">
      <Title headingLevel="h1" size="2xl">Subscriptions</Title>
      <Content>
        <p style={{ marginTop: 8, color: '#6a6e73' }}>
          Manage your Red Hat product subscriptions and entitlements. This is a placeholder page.
        </p>
      </Content>
    </PageSection>
  );
};

export { Subscriptions };



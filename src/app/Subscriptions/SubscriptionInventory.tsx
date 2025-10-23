import * as React from 'react';
import { PageSection, Title, Content } from '@patternfly/react-core';

const SubscriptionInventory: React.FunctionComponent = () => {
  return (
    <PageSection hasBodyWrapper={false} id="primary-app-container">
      <Title headingLevel="h1" size="2xl">Subscription Inventory</Title>
      <Content>
        <p style={{ marginTop: 8, color: '#6a6e73' }}>
          Placeholder for Subscription Inventory. Replace with real content later.
        </p>
      </Content>
    </PageSection>
  );
};

export { SubscriptionInventory };



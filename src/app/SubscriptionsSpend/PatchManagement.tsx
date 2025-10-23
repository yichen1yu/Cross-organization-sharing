import * as React from 'react';
import { PageSection, Title, Content } from '@patternfly/react-core';

const PatchManagement: React.FunctionComponent = () => {
  return (
    <PageSection hasBodyWrapper={false} id="primary-app-container">
      <Title headingLevel="h1" size="2xl">Patch Management</Title>
      <Content>
        <p style={{ marginTop: 8, color: '#6a6e73' }}>
          Placeholder for Patch Management under Subscriptions & Spend.
        </p>
      </Content>
    </PageSection>
  );
};

export { PatchManagement };



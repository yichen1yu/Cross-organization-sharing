import * as React from 'react';
import { PageSection, Title, Content } from '@patternfly/react-core';

const Insights: React.FunctionComponent = () => {
  return (
    <PageSection hasBodyWrapper={false} id="primary-app-container">
      <Title headingLevel="h1" size="2xl">Red Hat Insights</Title>
      <Content>
        <p style={{ marginTop: 8, color: '#6a6e73' }}>
          Placeholder for Red Hat Insights under Subscriptions & Spend.
        </p>
      </Content>
    </PageSection>
  );
};

export { Insights };



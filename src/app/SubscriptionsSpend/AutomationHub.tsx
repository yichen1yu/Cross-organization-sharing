import * as React from 'react';
import { PageSection, Title, Content } from '@patternfly/react-core';

const AutomationHub: React.FunctionComponent = () => {
  return (
    <PageSection hasBodyWrapper={false} id="primary-app-container">
      <Title headingLevel="h1" size="2xl">Automation Hub</Title>
      <Content>
        <p style={{ marginTop: 8, color: '#6a6e73' }}>
          Placeholder for Automation Hub under Subscriptions & Spend.
        </p>
      </Content>
    </PageSection>
  );
};

export { AutomationHub };



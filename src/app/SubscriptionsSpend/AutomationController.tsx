import * as React from 'react';
import { PageSection, Title, Content } from '@patternfly/react-core';

const AutomationController: React.FunctionComponent = () => {
  return (
    <PageSection hasBodyWrapper={false} id="primary-app-container">
      <Title headingLevel="h1" size="2xl">Automation Controller</Title>
      <Content>
        <p style={{ marginTop: 8, color: '#6a6e73' }}>
          Placeholder for Automation Controller under Subscriptions & Spend.
        </p>
      </Content>
    </PageSection>
  );
};

export { AutomationController };



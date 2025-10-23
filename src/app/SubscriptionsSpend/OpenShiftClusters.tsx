import * as React from 'react';
import { PageSection, Title, Content } from '@patternfly/react-core';

const OpenShiftClusters: React.FunctionComponent = () => {
  return (
    <PageSection hasBodyWrapper={false} id="primary-app-container">
      <Title headingLevel="h1" size="2xl">OpenShift Clusters</Title>
      <Content>
        <p style={{ marginTop: 8, color: '#6a6e73' }}>
          Placeholder for OpenShift Clusters under Subscriptions & Spend.
        </p>
      </Content>
    </PageSection>
  );
};

export { OpenShiftClusters };



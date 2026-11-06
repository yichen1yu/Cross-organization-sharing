import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const UserPreferences: React.FunctionComponent = () => {
  useDocumentTitle('User Preferences | Settings');
  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        User Preferences
      </Title>
    </PageSection>
  );
};

export { UserPreferences };

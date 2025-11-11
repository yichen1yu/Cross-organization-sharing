import * as React from 'react';
import { Dashboard } from '@app/Dashboard/Dashboard';

// Wrapper to host the IAM Overview (reusing the Dashboard layout)
const OverviewIAM: React.FunctionComponent = () => {
  return <Dashboard />;
};

export { OverviewIAM };




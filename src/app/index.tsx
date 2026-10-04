import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import { WorkspaceProvider } from '@app/utils/WorkspaceContext';
import '@app/app.css';

const App: React.FunctionComponent = () => (
  <Router basename={process.env.NODE_ENV === 'production' ? '/Cross-organization-sharing' : ''}>
    <WorkspaceProvider>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </WorkspaceProvider>
  </Router>
);

export default App;

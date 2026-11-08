import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import { WorkspaceProvider } from '@app/utils/WorkspaceContext';
import { LocaleProvider } from '@app/utils/LocaleContext';
import '@app/app.css';

const App: React.FunctionComponent = () => (
  <Router basename={process.env.NODE_ENV === 'production' ? '/Cross-organization-sharing' : ''}>
    <LocaleProvider>
      <WorkspaceProvider>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </WorkspaceProvider>
    </LocaleProvider>
  </Router>
);

export default App;

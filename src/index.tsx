import React from "react";
import ReactDOM from "react-dom/client";
import App from '@app/index';

if (process.env.NODE_ENV !== "production") {
  try {
    const config = {
      rules: [
        {
          id: 'color-contrast',
          enabled: false
        }
      ]
    };
    const axe = require("react-axe");
    axe(React, ReactDOM, 1000, config);
  } catch (_e) {
    // axe is optional; don't block app render
  }
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 640 }}>
          <h1 style={{ color: '#c00' }}>Something went wrong</h1>
          <p>The application crashed. Try refreshing the page or navigating to another URL.</p>
          <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto', fontSize: 12 }}>
            {this.state.error.toString()}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);

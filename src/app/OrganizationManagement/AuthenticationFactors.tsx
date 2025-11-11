import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Content,
  Divider,
  PageSection,
  Popover,
  Title,
  Checkbox
} from '@patternfly/react-core';
import { ExternalLinkAltIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const AuthenticationFactors: React.FunctionComponent = () => {
  const [enabled, setEnabled] = React.useState(false);
  const [savedValue, setSavedValue] = React.useState(false);
  const isDirty = enabled !== savedValue;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem>Organization management</BreadcrumbItem>
          <BreadcrumbItem isActive>Authentication Factors</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Title headingLevel="h1" size="2xl">Authentication Factors</Title>
          <p style={{ marginBottom: 0 }}>Manage authentication factors for your organization.</p>
        </Content>
      </PageSection>

      <Divider />

      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <Content>
              <Title headingLevel="h2" size="xl">Organizational two-factor authentication</Title>
              <p style={{ maxWidth: 760 }}>
                Enable organizational two–factor authentication to require all users to use a password and a
                one–time code to log in. When enabled, each user in your organization must install an authenticator
                application on a compatible mobile device in order to log in.{' '}
                <Button
                  variant="link"
                  isInline
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="end"
                  component="a"
                  href="https://access.redhat.com/documentation/en-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more about two–factor authentication
                </Button>
              </p>
              <div style={{ marginTop: 16 }}>
                <Checkbox
                  id="enable-org-2fa"
                  isChecked={enabled}
                  onChange={(_e, checked) => setEnabled(checked)}
                  label={
                    <span>
                      Enable two–factor authentication for your organization{' '}
                      <Popover
                        headerContent={<div>Two–factor authentication</div>}
                        bodyContent={<div>Require users to log in with a password and a one–time code.</div>}
                      >
                        <Button variant="plain" aria-label="More info" style={{ padding: 0, verticalAlign: 'middle' }}>
                          <OutlinedQuestionCircleIcon />
                        </Button>
                      </Popover>
                    </span>
                  }
                />
              </div>

              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                <Button isDisabled={!isDirty} onClick={() => setSavedValue(enabled)}>Save</Button>
                <Button variant="link" onClick={() => setEnabled(savedValue)}>Cancel</Button>
              </div>
            </Content>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { AuthenticationFactors };




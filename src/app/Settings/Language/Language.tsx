import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Form,
  FormGroup,
  MenuToggle,
  PageSection,
  Select,
  SelectList,
  SelectOption,
  Title,
} from '@patternfly/react-core';
import type { MenuToggleElement } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文 (中国)' },
];

const regionalFormatOptions = [
  { value: 'default', label: 'Language default' },
  ...languageOptions,
];

const Language: React.FunctionComponent = () => {
  useDocumentTitle('Language | Settings');

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const [language, setLanguage] = React.useState('en');
  const [regionalFormat, setRegionalFormat] = React.useState('default');
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [isRegionalOpen, setIsRegionalOpen] = React.useState(false);

  const [savedLanguage, setSavedLanguage] = React.useState('en');
  const [savedRegionalFormat, setSavedRegionalFormat] = React.useState('default');

  const hasChanges = language !== savedLanguage || regionalFormat !== savedRegionalFormat;

  const onSave = () => {
    setSavedLanguage(language);
    setSavedRegionalFormat(regionalFormat);
  };

  const onCancel = () => {
    setLanguage(savedLanguage);
    setRegionalFormat(savedRegionalFormat);
  };

  const getLangLabel = (value: string) =>
    languageOptions.find((o) => o.value === value)?.label ?? value;

  const getRegionalLabel = (value: string) =>
    regionalFormatOptions.find((o) => o.value === value)?.label ?? value;

  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (parent) {
      parent.style.display = 'flex';
      parent.style.flexDirection = 'column';
      parent.style.height = '100%';
    }
    return () => {
      if (parent) {
        parent.style.display = '';
        parent.style.flexDirection = '';
        parent.style.height = '';
      }
    };
  }, []);

  const langToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsLangOpen(!isLangOpen)}
      isExpanded={isLangOpen}
      isFullWidth
    >
      {getLangLabel(language)}
    </MenuToggle>
  );

  const regionalToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsRegionalOpen(!isRegionalOpen)}
      isExpanded={isRegionalOpen}
      isFullWidth
    >
      {getRegionalLabel(regionalFormat)}
    </MenuToggle>
  );

  return (
    <div ref={wrapperRef} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/">Red Hat Hybrid Cloud Console</BreadcrumbItem>
          <BreadcrumbItem component={Link} to="/settings/integrations">Settings</BreadcrumbItem>
          <BreadcrumbItem isActive>Language</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBottom: 0 }}>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 0 }}>Language</Title>
        <Content component="p" style={{ marginTop: 0 }}>
          Choose your language and the regional format that will influence how your date/time and currency will appear.
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: '32px' }}>
        <Form isHorizontal style={{ maxWidth: '500px', '--pf-v6-c-form--m-horizontal__group-label--md--GridColumnWidth': '120px', '--pf-v6-c-form--m-horizontal--Gap': '8px 8px' } as React.CSSProperties}>
          <FormGroup label="Language" fieldId="language-select">
            <Select
              id="language-select"
              isOpen={isLangOpen}
              selected={language}
              onSelect={(_event, value) => {
                setLanguage(value as string);
                setIsLangOpen(false);
              }}
              onOpenChange={setIsLangOpen}
              toggle={langToggle}
              shouldFocusToggleOnSelect
            >
              <SelectList>
                {languageOptions.map((option) => (
                  <SelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </FormGroup>

          <FormGroup label="Regional format" fieldId="regional-format-select">
            <Select
              id="regional-format-select"
              isOpen={isRegionalOpen}
              selected={regionalFormat}
              onSelect={(_event, value) => {
                setRegionalFormat(value as string);
                setIsRegionalOpen(false);
              }}
              onOpenChange={setIsRegionalOpen}
              toggle={regionalToggle}
              shouldFocusToggleOnSelect
            >
              <SelectList>
                {regionalFormatOptions.map((option) => (
                  <SelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </FormGroup>
        </Form>
      </PageSection>

      <div style={{ flexGrow: 1 }} />

      <PageSection
        hasBodyWrapper={false}
        isFilled={false}
        style={{
          backgroundColor: 'var(--pf-v6-global--BackgroundColor--100)',
          borderTop: '1px solid var(--pf-v6-global--BorderColor--100)',
          paddingTop: '16px',
          paddingBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" isDisabled={!hasChanges} onClick={onSave}>Save</Button>
          <Button variant="secondary" isDisabled={!hasChanges} onClick={onCancel}>Cancel</Button>
        </div>
      </PageSection>
    </div>
  );
};

export { Language };

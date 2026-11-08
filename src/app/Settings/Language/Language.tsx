import * as React from 'react';
import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Content,
  Form,
  FormGroup,
  FormGroupLabelHelp,
  MenuToggle,
  PageSection,
  Select,
  SelectList,
  SelectOption,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import type { MenuToggleElement } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useLocale } from '@app/utils/LocaleContext';
import type { TranslationKey } from '@app/utils/LocaleContext';

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
  useDocumentTitle('Language | User Preferences | Settings');
  const { locale, setLocale, t } = useLocale();

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const [language, setLanguage] = React.useState<string>(locale);
  const [regionalFormat, setRegionalFormat] = React.useState('default');
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [isRegionalOpen, setIsRegionalOpen] = React.useState(false);

  const [savedLanguage, setSavedLanguage] = React.useState<string>(locale);
  const [savedRegionalFormat, setSavedRegionalFormat] = React.useState('default');
  const [toast, setToast] = React.useState<{ id: number; titleKey: TranslationKey; descriptionKey: TranslationKey } | null>(null);

  const hasChanges = language !== savedLanguage || regionalFormat !== savedRegionalFormat;

  const onSave = () => {
    const nextLocale = language === 'zh' ? 'zh' : 'en';
    setSavedLanguage(language);
    setSavedRegionalFormat(regionalFormat);
    setLocale(nextLocale);
    setToast({
      id: Date.now(),
      titleKey: 'Language and regional format preferences saved',
      descriptionKey: 'Your preferences have been saved to your Red Hat account and will apply to other Red Hat properties where this language is supported.',
    });
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
      {t(getLangLabel(language))}
    </MenuToggle>
  );

  const regionalToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsRegionalOpen(!isRegionalOpen)}
      isExpanded={isRegionalOpen}
      isFullWidth
    >
      {t(getRegionalLabel(regionalFormat))}
    </MenuToggle>
  );

  return (
    <div ref={wrapperRef} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <AlertGroup
        isToast
        isLiveRegion
        aria-live="assertive"
        style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}
      >
        {toast && (
          <Alert
            variant="success"
            title={t(toast.titleKey)}
            timeout={6000}
            onTimeout={() => setToast(null)}
            actionClose={<AlertActionCloseButton onClose={() => setToast(null)} />}
          >
            {t(toast.descriptionKey)}
          </Alert>
        )}
      </AlertGroup>
      <PageSection hasBodyWrapper={false}>
        <Breadcrumb>
          <BreadcrumbItem component={Link} to="/">{t('Red Hat Hybrid Cloud Console')}</BreadcrumbItem>
          <BreadcrumbItem component={Link} to="/settings/user-preferences">{t('Settings')}</BreadcrumbItem>
          <BreadcrumbItem isActive>{t('Language')}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingBottom: 0 }}>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 0 }}>{t('Language')}</Title>
        <Content component="p" style={{ marginTop: 0 }}>
          {t('Choose your language and the regional format that will influence how your date/time and currency will appear.')}
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: '32px' }}>
        <Form isHorizontal style={{ maxWidth: '500px', '--pf-v6-c-form--m-horizontal__group-label--md--GridColumnWidth': '120px', '--pf-v6-c-form--m-horizontal--Gap': '8px 8px' } as React.CSSProperties}>
          <FormGroup
            label={t('Language')}
            labelHelp={
              <Tooltip
                content={t('The language options listed here are supported by Red Hat Hybrid Cloud Console. Your selected language will be applied across Red Hat properties where it is supported; otherwise, the property will fall back to English.')}
                position="top"
              >
                <FormGroupLabelHelp aria-label="Language availability information" />
              </Tooltip>
            }
            fieldId="language-select"
          >
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
                    {t(option.label)}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </FormGroup>

          <FormGroup label={t('Regional format')} fieldId="regional-format-select">
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
                    {t(option.label)}
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
          <Button variant="primary" isDisabled={!hasChanges} onClick={onSave}>{t('Save')}</Button>
          <Button variant="secondary" isDisabled={!hasChanges} onClick={onCancel}>{t('Cancel')}</Button>
        </div>
      </PageSection>
    </div>
  );
};

export { Language };

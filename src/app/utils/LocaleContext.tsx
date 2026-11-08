import * as React from 'react';

export type Locale = 'en' | 'zh';

export type TranslationKey =
  | 'Red Hat Hybrid Cloud Console'
  | 'Settings'
  | 'Console Settings'
  | 'User Preferences'
  | 'Language'
  | 'Regional format'
  | 'Language default'
  | 'Save'
  | 'Cancel'
  | 'English'
  | 'Français'
  | '한국어'
  | '日本語'
  | '中文 (中国)'
  | 'Notifications'
  | 'Integrations'
  | 'Learning Resources'
  | 'Account details'
  | 'Internal'
  | 'Log out'
  | 'Username:'
  | 'Account number:'
  | 'Org ID:'
  | 'Org. Administrator'
  | 'Internal user'
  | 'Language and regional format preferences saved'
  | 'Your preferences have been saved to your Red Hat account and will apply to other Red Hat properties where this language is supported.'
  | 'The language options listed here are supported by Red Hat Hybrid Cloud Console. Your selected language will be applied across Red Hat properties where it is supported; otherwise, the property will fall back to English.'
  | 'Choose your language and the regional format that will influence how your date/time and currency will appear.'
  | 'Hi, Alex Admin'
  | 'Reset to default'
  | '+ Add widgets'
  | 'Quick access to your most recently visited services and resources.'
  | 'Dashboard'
  | 'Event Log'
  | 'Manage settings'
  | 'Alert Manager'
  | 'Data Integration'
  | 'Scheduler'
  | 'Identity & Access Management'
  | 'User Access'
  | 'Authentication Policy'
  | 'Service Accounts'
  | 'Hi'
  | 'Welcome to your Hybrid Cloud Console.';

const chineseTranslations: Partial<Record<TranslationKey, string>> = {
  'Red Hat Hybrid Cloud Console': '红帽混合云控制台',
  Settings: '设置',
  'Console Settings': '控制台设置',
  'User Preferences': '用户偏好设置',
  Language: '语言',
  'Regional format': '区域格式',
  'Language default': '语言默认值',
  Save: '保存',
  Cancel: '取消',
  English: '英语',
  Français: '法语',
  한국어: '韩语',
  日本語: '日语',
  '中文 (中国)': '中文（中国）',
  Notifications: '通知',
  Integrations: '集成',
  'Learning Resources': '学习资源',
  'Account details': '账户详情',
  Internal: '内部',
  'Log out': '退出登录',
  'Username:': '用户名：',
  'Account number:': '账户编号：',
  'Org ID:': '组织 ID：',
  'Org. Administrator': '组织管理员',
  'Internal user': '内部用户',
  'Language and regional format preferences saved': '语言和区域格式偏好设置已保存',
  'Your preferences have been saved to your Red Hat account and will apply to other Red Hat properties where this language is supported.': '您的偏好设置已保存到红帽账户，并将在支持此语言的其他红帽产品中应用。',
  'The language options listed here are supported by Red Hat Hybrid Cloud Console. Your selected language will be applied across Red Hat properties where it is supported; otherwise, the property will fall back to English.': '此处列出的语言选项受红帽混合云控制台支持。您选择的语言将在支持该语言的红帽产品中应用；如果某个产品不支持该语言，则会回退为英语。',
  'Choose your language and the regional format that will influence how your date/time and currency will appear.': '选择语言和区域格式，以决定日期、时间和货币的显示方式。',
  'Hi, Alex Admin': '您好，Alex Admin',
  'Reset to default': '恢复默认设置',
  '+ Add widgets': '+ 添加小组件',
  'Quick access to your most recently visited services and resources.': '快速访问最近使用的服务和资源。',
  Dashboard: '仪表板',
  'Event Log': '事件日志',
  'Manage settings': '管理设置',
  'Alert Manager': '警报管理器',
  'Data Integration': '数据集成',
  Scheduler: '计划任务',
  'Identity & Access Management': '身份与访问管理',
  'User Access': '用户访问',
  'Authentication Policy': '身份验证策略',
  'Service Accounts': '服务账户',
  Hi: '您好',
  'Welcome to your Hybrid Cloud Console.': '欢迎使用混合云控制台。',
};

export const translate = (key: TranslationKey | string, locale: Locale): string =>
  locale === 'zh' ? chineseTranslations[key as TranslationKey] ?? key : key;

export const formatDate = (value: Date | string | number, locale: Locale): string => {
  const raw = typeof value === 'string' ? value : undefined;
  const dateOnly = raw?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const textDate = raw?.match(/^(\d{1,2}) ([A-Za-z]{3}) (\d{4})(?: (.+))?$/);
  const date = dateOnly
    ? new Date(`${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T00:00:00`)
    : textDate
      ? new Date(`${textDate[2]} ${textDate[1]}, ${textDate[3]}${textDate[4] ? ` ${textDate[4]}` : ''}`)
      : new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  if (locale === 'zh') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if (dateOnly) return `${year}-${month}-${day}`;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatNumber = (value: number, locale: Locale): string =>
  new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US').format(value);

export const formatCurrency = (value: number, currency: string, locale: Locale): string =>
  new Intl.NumberFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'currency',
    currency,
  }).format(value);

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey | string) => string;
  formatDate: (value: Date | string | number) => string;
  formatNumber: (value: number) => string;
  formatCurrency: (value: number, currency?: string) => string;
}

const LocaleContext = React.createContext<LocaleContextValue | undefined>(undefined);

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en';
  return window.localStorage.getItem('hcc-locale') === 'zh' ? 'zh' : 'en';
};

export const LocaleProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = React.useState<Locale>(getInitialLocale);

  React.useEffect(() => {
    window.localStorage.setItem('hcc-locale', locale);
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => translate(key, locale),
      formatDate: (value) => formatDate(value, locale),
      formatNumber: (value) => formatNumber(value, locale),
      formatCurrency: (value, currency = 'USD') => formatCurrency(value, currency, locale),
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextValue => {
  const context = React.useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within a LocaleProvider');
  return context;
};

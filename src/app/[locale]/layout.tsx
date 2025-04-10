import type { NavigationConfig } from '@/components/zrx/layout/layout';
import type { UserMenuItem } from '@/components/zrx/layout/usermenu';
import type { Metadata } from 'next';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import ZrxLayoutWithProviders from '@/components/zrx/layout/layout';
import { routing } from '@/libs/i18nNavigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import '@/styles/global.css';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const navigationConfig: NavigationConfig[] = [
    {
      path: '/components',
      label: 'Components',
      iconName: 'dashboard',
      section: 'main',
    },
    {
      path: '/blog/1',
      label: 'Blog 1',
      iconName: 'bookmark',
      section: 'main',
    },

    {
      path: '/blog/2',
      label: 'Blog 2',
      iconName: 'star',
      section: 'main',
    },

    {
      path: '/blog/3',
      label: 'Blog 3',
      iconName: 'flag',
      section: 'main',
    },

    {
      path: '/settings/1',
      label: 'Settings 1',
      iconName: 'settings',
      section: 'settings',
    },
    {
      path: '/settings/2',
      label: 'Settings 2',
      iconName: 'stack',
      section: 'settings',
    },
  ];

  const userMenuItems: UserMenuItem[] = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'notification',
      path: '/notifications',
      count: 3,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      path: '/settings',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: 'logout',
    },
  ];

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={['light', 'dark']}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <PostHogProvider>
              <ZrxLayoutWithProviders
                navigationConfig={navigationConfig}
                userMenuItems={userMenuItems}
              >
                {props.children}
              </ZrxLayoutWithProviders>
            </PostHogProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import { Label } from '@evaluate/react/components/label';
import { Switch } from '@evaluate/react/components/switch';
import { useCallback, useEffect, useState } from 'react';
import { TooltipWrapper } from '~components/tooltip-wrapper';
import { AnalyticsProvider, analytics } from '~contexts/analytics';
import { EnabledProvider, useEnabled } from '~contexts/enabled';
import { ThemeProvider } from '~contexts/theme';
import { TranslateProvider, useTranslate } from '~contexts/translate';
import { getDomain, getMetaTagContent } from '~utilities/active-tab';
import { HeaderBar } from './_components/header-bar';

import '../styles/tailwind.css';

export default function PopupWrapper() {
  return (
    <ThemeProvider getTargets={() => [document.documentElement]}>
      <div className="w-96 flex flex-col p-4 pt-0">
        <AnalyticsProvider>
          <TranslateProvider>
            <HeaderBar />

            <EnabledProvider>
              <main className="flex flex-col">
                <Popup />
              </main>
            </EnabledProvider>
          </TranslateProvider>
        </AnalyticsProvider>
      </div>
    </ThemeProvider>
  );
}

function Popup() {
  const t = useTranslate();

  useEffect(() => {
    void analytics.capture('popup opened', { platform: 'browser extension' });
  }, []);

  const { isEnabled, isEnabledFor, setEnabled, setEnabledFor } = useEnabled();
  const [domain, setDomain] = useState<string>();
  const [hasDisabledTag, setHasDisabledTag] = useState<boolean>();
  useEffect(() => {
    getDomain().then(setDomain);
    getMetaTagContent().then((c) => setHasDisabledTag(c === 'disabled'));
  }, []);

  const setGloballyEnabled = useCallback(
    (checked: boolean) => {
      analytics.capture('toggle globally enabled', {
        'old value': !checked,
        'new value': checked,
        platform: 'browser extension',
      });
      setEnabled(checked);
    },
    [setEnabled],
  );
  const setCurrentSiteEnabled = useCallback(
    (checked: boolean) => {
      analytics.capture('toggle current site enabled', {
        domain: domain,
        'old value': !checked,
        'new value': checked,
        platform: 'browser extension',
      });
      setEnabledFor(domain!, checked);
    },
    [domain, setEnabledFor],
  );

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex">
        <div>
          <Label htmlFor="enabled">
            {t.toggle.browser_extension.globally()}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t.toggle.browser_extension.globally.description()}
          </p>
        </div>

        <Switch
          name="enabled"
          checked={isEnabled}
          onCheckedChange={setGloballyEnabled}
          className="ml-auto my-auto"
        />
      </div>

      <div className="flex">
        <div>
          <Label htmlFor="current-enabled">
            {t.toggle.browser_extension.current_site()}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t.toggle.browser_extension.current_site.description()} (
            <code className="inline">{domain}</code>).
          </p>
        </div>

        <TooltipWrapper
          content={
            hasDisabledTag &&
            t.toggle.browser_extension.current_site.disabled_by_meta_tag()
          }
        >
          <div className="ml-auto my-auto">
            <Switch
              name="current-enabled"
              checked={isEnabledFor(domain!) && !hasDisabledTag}
              disabled={!isEnabled || hasDisabledTag}
              onCheckedChange={setCurrentSiteEnabled}
            />
          </div>
        </TooltipWrapper>
      </div>
    </div>
  );
}

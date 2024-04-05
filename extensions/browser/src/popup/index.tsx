import { Label } from '@evaluate/react/components/label';
import { Switch } from '@evaluate/react/components/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@evaluate/react/components/tooltip';
import { useCallback, useEffect, useState } from 'react';
import { EnabledProvider, useEnabled } from '~contexts/enabled';
import { ThemeProvider } from '~contexts/theme';
import analytics from '~services/analytics';
import { getCurrentDomain } from '~utilities/active-tab';
import { HeaderBar } from './_components/header-bar/header-bar';

import { wrapCapture } from '~utilities/wrap-capture';
import '../style.css';

export default function PopupWrapper() {
  return (
    <ThemeProvider getTargets={() => [document.documentElement]}>
      <div className="w-96 flex flex-col p-4 pt-0">
        <HeaderBar />

        <main className="flex flex-col">
          <EnabledProvider>
            <Popup />
          </EnabledProvider>
        </main>
      </div>
    </ThemeProvider>
  );
}

function Popup() {
  useEffect(() => {
    analytics?.capture('popup opened', { platform: 'browser extension' });
  }, []);

  const {
    isEnabled,
    isRequestedDisabled,
    setEnabled,
    isEnabledFor,
    setEnabledFor,
  } = useEnabled();
  const [domain, setDomain] = useState<string>();
  useEffect(() => void getCurrentDomain().then(setDomain), []);

  const setGloballyEnabled = useCallback(
    (checked: boolean) => {
      analytics?.capture('toggle globally enabled', {
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
      analytics?.capture('toggle current site enabled', {
        domain: domain!,
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
          <Label htmlFor="enabled">Is Globally Enabled</Label>
          <p className="text-xs text-muted-foreground">
            Toggle this switch to enable/disable the extension globally.
          </p>
        </div>

        <Switch
          name="enabled"
          checked={isEnabled}
          onClick={wrapCapture(() => {})}
          onCheckedChange={setGloballyEnabled}
          className="ml-auto my-auto"
        >
          <span className="sr-only">Toggle Globally Enabled</span>
        </Switch>
      </div>

      <div className="flex">
        <div>
          <Label htmlFor="current-enabled">Is Current Site Enabled</Label>
          <p className="text-xs text-muted-foreground">
            Toggle this switch to enable/disable the extension on the current
            website. (<code className="inline">{domain}</code>).
          </p>
        </div>

        <TooltipWrapper isRequestedDisabled={isRequestedDisabled}>
          <div className="ml-auto my-auto">
            <Switch
              name="current-enabled"
              checked={isEnabledFor(domain!) && !isRequestedDisabled}
              disabled={!isEnabled || isRequestedDisabled}
              onClick={wrapCapture(() => {})}
              onCheckedChange={setCurrentSiteEnabled}
            >
              <span className="sr-only">Toggle Current Site Enabled</span>
            </Switch>
          </div>
        </TooltipWrapper>
      </div>
    </div>
  );
}

function TooltipWrapper(
  p: React.PropsWithChildren<{ isRequestedDisabled: boolean }>,
) {
  if (!p.isRequestedDisabled) return <>{p.children}</>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{p.children}</TooltipTrigger>
        <TooltipContent>
          This website instructs the Evaluate extension to not run on this page.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
